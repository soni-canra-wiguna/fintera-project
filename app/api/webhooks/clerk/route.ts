import { WebhookEvent } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { Webhook } from "svix"
import { errorResponse } from "@/lib/error-utils"
import { UserServicesAPI } from "@/utils/api/user"
import { limitRequestAPI } from "@/lib/rate-limit"

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``

async function validateRequest(request: NextRequest) {
  const payloadString = await request.text()
  const headerPayload = headers()

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  }
  const wh = new Webhook(webhookSecret)
  return wh.verify(payloadString, svixHeaders) as WebhookEvent
}

export async function POST(req: NextRequest) {
  try {
    // Parse the Clerk Webhook event
    const payload = await validateRequest(req)
    /*     
    example return value of payload
    {
      "event": "user.created",
      "data": {
        "id": "user_id",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "createdAt": "2024-10-02T12:34:56Z",
        "updatedAt": "2024-10-02T12:34:56Z"
      },
      "apiVersion": "v1"
    } 
    */
    const { id: userId } = payload.data
    if (!userId) return NextResponse.json({ message: "No user ID provided" }, { status: 400 })

    const limitError = await limitRequestAPI({ limitRequest: 20, userId })
    if (limitError) return limitError

    // Create or delete a user in the database based on the Clerk Webhook event
    switch (payload.type) {
      case "user.created": {
        await UserServicesAPI.upsert(userId)
        break
      }
      case "user.deleted": {
        await UserServicesAPI.delete(userId)
        break
      }
      default:
        errorResponse("Event type not handled", 500)
    }

    return NextResponse.json({ message: "" })
  } catch (error) {
    console.log("[ERROR POST USER(WEBHOOK USER)] : ", error)
    return errorResponse(error, 500)
  }
}

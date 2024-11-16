import { NextResponse } from "next/server"

export const errorResponse = <T>(message: T, statusCode?: number) => {
  return NextResponse.json({ message }, { status: statusCode })
}

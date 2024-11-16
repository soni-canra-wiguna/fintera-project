import prisma from "@/lib/prisma"
import { User } from "@prisma/client"

export class UserServicesAPI {
  static async upsert(userId: string): Promise<void> {
    await prisma.user.upsert({
      where: { user_id: userId },
      create: { user_id: userId },
      update: { user_id: userId },
    })
  }

  static async get(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        products: true,
        sales_records: true,
      },
    })

    return user
  }

  static async delete(userId: string): Promise<void> {
    await prisma.user.delete({
      where: {
        user_id: userId,
      },
    })
  }
}

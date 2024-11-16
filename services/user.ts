import axios from "axios"
import { useClerk } from "@clerk/nextjs"

import { WithTokenAndUserId } from "@/types"

export class UserServices {
  static async deleteUser({ token, userId }: WithTokenAndUserId): Promise<void> {
    const { signOut } = useClerk()

    await axios.delete(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        userId: userId,
      },
    })

    await signOut()
  }
}

import { createAsyncThunk } from '@reduxjs/toolkit'

export const getUserByUid = createAsyncThunk(
    'user/getUser',
    async (uid) => {
      const result = await (await client()).get(`/user/f/${uid}`)
      const { id, phone, name, thumbnail, image, email, notification_token } =
        result.data
      return { id, phone, name, thumbnail, image, email, notification_token }
    }
  )
  
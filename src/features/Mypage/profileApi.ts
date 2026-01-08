// src/features/Mypage/profileApi.ts
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabaseClient'

export type ProfileRow = {
  user_id: string
  nickname: string
  avatar_url: string | null
  bio: string | null
  tos_accepted_at: string | null
  created_at: string
  updated_at: string
}

export const profileApi = createApi({
  reducerPath: 'profileApi', // ✅ 충돌 방지
  baseQuery: fakeBaseQuery<PostgrestError>(),
  tagTypes: ['Profile'],
  endpoints: (build) => ({
    getMyProfile: build.query<ProfileRow | null, string>({
      async queryFn(userId) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()

        if (error) return { error }
        return { data }
      },
      providesTags: (_res, _err, userId) => [{ type: 'Profile', id: userId }],
    }),
  }),
})

export const { useGetMyProfileQuery } = profileApi

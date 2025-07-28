import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check if profile exists, if not create one
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (!existingProfile) {
        // Create profile for Google user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              first_name: data.user.user_metadata?.full_name?.split(' ')[0] || '',
              last_name: data.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
              user_type: 'renter', // Default to renter
              verification_status: 'pending'
            }
          ])

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }
    }
  }

  // Redirect to dashboard or home page
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
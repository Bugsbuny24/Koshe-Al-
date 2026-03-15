import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const piUid = body?.user?.uid
    const username = body?.user?.username

    if (!piUid) {
      return NextResponse.json({ error: "Pi UID yok" }, { status: 400 })
    }

    const email = `${piUid}@pi.local`
    const password = `pi_${piUid}`

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // kullanıcı var mı kontrol et
    const { data: users } = await supabase.auth.admin.listUsers()

    const exists = users.users.find(u => u.email === email)

    if (!exists) {

      const { error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          provider: "pi",
          pi_uid: piUid,
          username
        }
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      email,
      password
    })

  } catch (e: any) {

    return NextResponse.json({
      error: e.message
    }, { status: 500 })

  }
}

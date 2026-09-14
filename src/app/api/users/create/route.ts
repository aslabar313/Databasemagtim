import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { username, fullName, password, role } = await request.json();

    if (!username || !password || !fullName) {
      return NextResponse.json({ error: 'Username, Nama Lengkap, dan Password wajib diisi.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const cleanUsername = username.trim().toLowerCase();
    const internalEmail = `${cleanUsername}@magetantimur.internal`;

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: internalEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        username: cleanUsername,
        full_name: fullName,
        role: role || 'VIEWER',
      },
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: newUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

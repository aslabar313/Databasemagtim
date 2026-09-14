-- ==============================================================================
-- DATABASEMAGTIM - PART 1 DATABASE MIGRATION SCRIPT
-- Copy dan Jalankan Script Ini di SQL Editor Supabase Anda
-- ==============================================================================

-- 1. Create Enums
CREATE TYPE user_role_type AS ENUM ('SUPERADMIN', 'ADMIN', 'OPERATOR', 'VIEWER');
CREATE TYPE gender_type AS ENUM ('LAKILAKI', 'PEREMPUAN');
CREATE TYPE marital_status_type AS ENUM ('BELUM_MENIKAH', 'MENIKAH', 'DUDAMANJANDA');

-- 2. Create Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name user_role_type UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Roles
INSERT INTO public.roles (name, description) VALUES
    ('SUPERADMIN', 'Akses penuh ke seluruh sistem dan manajemen user'),
    ('ADMIN', 'Dapat mengelola data jamaah, keluarga, dan user operator/viewer'),
    ('OPERATOR', 'Dapat menginput dan memperbarui data jamaah & keluarga'),
    ('VIEWER', 'Hanya dapat melihat data jamaah dan laporan')
ON CONFLICT (name) DO NOTHING;

-- 3. Create Permissions Table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Core Permissions
INSERT INTO public.permissions (code, description) VALUES
    ('users.create', 'Membuat user baru'),
    ('users.read', 'Melihat daftar user'),
    ('users.update', 'Mengedit data user'),
    ('users.delete', 'Menghapus/Menonaktifkan user'),
    ('jamaah.create', 'Membuat data jamaah'),
    ('jamaah.read', 'Melihat data jamaah'),
    ('jamaah.update', 'Mengedit data jamaah'),
    ('jamaah.delete', 'Menghapus data jamaah'),
    ('logs.read', 'Melihat activity log')
ON CONFLICT (code) DO NOTHING;

-- 4. Create Role Permissions Junction Table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 5. Create Profiles Table (Terhubung dengan auth.users Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role_type NOT NULL DEFAULT 'VIEWER',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Families Table (Data Kelompok / Keluarga Jamaah)
CREATE TABLE IF NOT EXISTS public.families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_code VARCHAR(20) UNIQUE NOT NULL,
    head_name TEXT NOT NULL,
    address TEXT NOT NULL,
    kelompok TEXT DEFAULT 'Magetan Timur',
    rt_rw VARCHAR(20),
    phone TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Members Table (Data Jamaah)
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES public.families(id) ON DELETE SET NULL,
    nik VARCHAR(16) UNIQUE,
    full_name TEXT NOT NULL,
    gender gender_type NOT NULL,
    birth_place TEXT,
    birth_date DATE,
    marital_status marital_status_type DEFAULT 'BELUM_MENIKAH',
    occupation TEXT,
    phone TEXT,
    address TEXT,
    status_jamaah TEXT DEFAULT 'AKTIF',
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Trigger untuk Otomatis Sinkronisasi New Auth User ke Profiles Table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, is_active)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::user_role_type, 'VIEWER'),
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profile read for authenticated users" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Superadmin update profile" ON public.profiles
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPERADMIN'
        ) OR id = auth.uid()
    );

CREATE POLICY "Authenticated users read families" ON public.families
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Operator+ create families" ON public.families
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPERADMIN', 'ADMIN', 'OPERATOR')
        )
    );

CREATE POLICY "Authenticated users read members" ON public.members
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Operator+ modify members" ON public.members
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPERADMIN', 'ADMIN', 'OPERATOR')
        )
    );

CREATE POLICY "Authenticated users read activity logs" ON public.activity_logs
    FOR SELECT TO authenticated USING (true);

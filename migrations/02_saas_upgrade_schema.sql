-- Migration 02: SaaS Upgrade Schema
-- This script extends the AutoTracker database to support organizations, VAT, trips, and legal compliance.

-- 1. ORGANIZATIONS (Multi-tenancy)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    trn TEXT, -- Tax Registration Number (UAE)
    address TEXT,
    logo_url TEXT,
    owner_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ORGANIZATION MEMBERS & ROLES
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'driver');

CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'driver',
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(organization_id, user_id)
);

-- 3. TRIPS (Movement Tracking)
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    start_location_name TEXT,
    end_location_name TEXT,
    start_lat NUMERIC(10, 7),
    start_lng NUMERIC(10, 7),
    end_lat NUMERIC(10, 7),
    end_lng NUMERIC(10, 7),
    distance NUMERIC(10, 2) DEFAULT 0, -- in KM
    duration_minutes INT DEFAULT 0,
    classification TEXT DEFAULT 'business', -- 'business', 'personal'
    route_geometry JSONB, -- For storing path segments
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. VAT / TAX EXTENSIONS FOR EXPENSES
ALTER TABLE public.expenses 
    ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id),
    ADD COLUMN IF NOT EXISTS base_amount NUMERIC(15, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5, 4) DEFAULT 0.05, -- Default 5% UAE VAT
    ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(15, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total_amount NUMERIC(15, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS tax_inclusive BOOLEAN DEFAULT TRUE;

-- 5. LEGAL COMPLIANCE
CREATE TABLE IF NOT EXISTS public.legal_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL, -- 'terms_and_conditions', 'privacy_policy'
    version TEXT NOT NULL,
    accepted_at TIMESTAMPTZ DEFAULT now(),
    ip_address TEXT
);

-- 6. NOTIFICATIONS (Persistent)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'alert', 'maintenance', 'document', 'info'
    is_read BOOLEAN DEFAULT FALSE,
    linked_entity_type TEXT, -- 'vehicle', 'expense', 'document'
    linked_entity_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. INDEXING
CREATE INDEX IF NOT EXISTS idx_trips_vehicle ON public.trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_expenses_org ON public.expenses(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id) WHERE is_read = FALSE;

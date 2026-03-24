create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.site_content (
  id text primary key default 'main',
  hero jsonb not null default '{}'::jsonb,
  services_section jsonb not null default '{}'::jsonb,
  gallery_section jsonb not null default '{}'::jsonb,
  testimonials_section jsonb not null default '{}'::jsonb,
  closing_cta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_settings (
  id text primary key default 'main',
  whatsapp text not null default '',
  email text not null default '',
  address text not null default '',
  service_area text not null default '',
  business_hours text not null default '',
  instagram text not null default '',
  facebook text not null default '',
  contact_note text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  benefit text not null default '',
  icon text not null default 'wash',
  active boolean not null default true,
  sort_order integer not null default 99,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vehicle text not null default '',
  feedback text not null,
  sort_order integer not null default 99,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  description text not null default '',
  alt_text text not null default '',
  image_url text not null,
  featured boolean not null default false,
  sort_order integer not null default 99,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria text not null default '',
  unidad text not null,
  stock_actual numeric(12, 2) not null default 0,
  stock_minimo numeric(12, 2) not null default 0,
  costo_unitario numeric(12, 2) not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.service_product_usage (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  cantidad_estimada numeric(12, 2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (service_id, product_id)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  rut_cliente text not null,
  nombre_cliente text not null,
  telefono text not null,
  email text not null default '',
  tipo_cliente text not null default 'particular' check (tipo_cliente in ('particular', 'empresa')),
  nombre_empresa text,
  contacto_empresa text,
  contacto_adicional text,
  telefono_contacto_adicional text,
  vehiculo_marca text not null,
  vehiculo_modelo text not null,
  vehiculo_ano integer not null,
  vehiculo_tipo text not null,
  vehiculo_uso text,
  patente text,
  servicio text not null,
  modo_reserva text not null default 'custom' check (modo_reserva in ('pack', 'individual', 'custom')),
  pack text,
  servicios_individuales text[] not null default '{}',
  extras text[] not null default '{}',
  fecha date not null,
  hora text not null check (hora in ('am', 'pm')),
  logistica text not null default 'same_day' check (logistica in ('same_day', 'previous_day', 'pickup_delivery')),
  direccion_retiro text,
  zona_retiro text,
  notas text not null default '',
  notas_internas text not null default '',
  estado text not null default 'pending'
    check (estado in ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  token_consulta text not null unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.booking_history (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  event_type text not null,
  note text not null default '',
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists bookings_unique_active_slot_idx
  on public.bookings (fecha, hora)
  where estado in ('pending', 'confirmed', 'rescheduled');

create index if not exists bookings_rut_idx on public.bookings (rut_cliente);
create index if not exists bookings_phone_idx on public.bookings (telefono);
create index if not exists bookings_status_idx on public.bookings (estado);
create index if not exists gallery_items_featured_idx on public.gallery_items (featured, sort_order);
create index if not exists products_active_idx on public.products (activo);

drop trigger if exists set_site_content_updated_at on public.site_content;
create trigger set_site_content_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_testimonials_updated_at on public.testimonials;
create trigger set_testimonials_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

drop trigger if exists set_gallery_items_updated_at on public.gallery_items;
create trigger set_gallery_items_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_service_product_usage_updated_at on public.service_product_usage;
create trigger set_service_product_usage_updated_at
before update on public.service_product_usage
for each row execute function public.set_updated_at();

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

insert into public.site_content (id)
values ('main')
on conflict (id) do nothing;

insert into public.site_settings (id)
values ('main')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('garage-zona-cero', 'garage-zona-cero', true)
on conflict (id) do nothing;

comment on table public.bookings is
'Reservas operativas del sitio. El flujo publico de /agendar y /mi-reserva debe leer y escribir aqui via server actions.';

comment on table public.booking_history is
'Historial de estado y reagendamientos asociado a cada booking.';

comment on table public.site_content is
'Contenido estructurado editable de la landing principal.';

comment on table public.products is
'Inventario simple para control de insumos y costo estimado por servicio.';

-- Paso recomendado para produccion:
-- 1. Activar RLS en tablas internas.
-- 2. Mantener lectura publica solo para contenido y galeria.
-- 3. Usar server actions con SUPABASE_SERVICE_ROLE_KEY para operaciones administrativas.
-- 4. Proteger /admin con Supabase Auth y middleware.

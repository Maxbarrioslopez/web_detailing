import type { Metadata } from 'next'
import Link from 'next/link'
import AdminSidebar from '@/components/Admin/AdminSidebar'
import { getAdminAccessState } from '@/lib/admin-auth'

export const metadata: Metadata = {
  title: 'Admin Demo | Zona Cero Garage',
  description: 'Panel demo de administracion para reservas, galeria y contenido web.',
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const access = await getAdminAccessState()

  if (!access.canAccess) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <section className="section-shell px-5 py-8 sm:px-8">
            <div className="relative z-10 space-y-5">
              <p className="eyebrow text-xs font-semibold text-accent">Admin protegido</p>
              <h1 className="display-font text-4xl leading-tight text-ink sm:text-5xl">
                El panel quedo listo para autenticacion futura.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted">
                DEMO_MODE esta desactivado. El siguiente paso es conectar un proveedor de sesion y
                validar acceso admin antes de habilitar esta ruta en produccion.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="cta-secondary inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold">
                  Volver al sitio
                </Link>
                <Link
                  href="/agendar"
                  className="cta-primary inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold">
                  Ver agenda publica
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 xl:grid-cols-[270px_minmax(0,1fr)]">
          <AdminSidebar demoMode={access.demoMode} />
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </main>
  )
}

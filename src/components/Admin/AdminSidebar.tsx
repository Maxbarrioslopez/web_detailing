'use client'

import { brand } from '@/appData/garage'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  { href: '/admin', label: 'Dashboard', hint: 'Resumen' },
  { href: '/admin/reservas', label: 'Reservas', hint: 'Agenda' },
  { href: '/admin/clientes', label: 'Clientes', hint: 'CRM' },
  { href: '/admin/galeria', label: 'Galeria', hint: 'Imagenes' },
  { href: '/admin/contenido', label: 'Contenido web', hint: 'Landing' },
  { href: '/admin/productos', label: 'Productos', hint: 'Stock' },
  { href: '/admin/configuracion', label: 'Configuracion', hint: 'Contacto' },
]

type AdminSidebarProps = {
  demoMode: boolean
}

const AdminSidebar = ({ demoMode }: AdminSidebarProps) => {
  const pathname = usePathname()

  return (
    <aside className="glass-panel rounded-[28px] p-4 sm:p-5">
      <div className="flex items-center gap-3 border-b border-white/8 pb-4">
        <span className="relative size-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#0b0d10]">
          <Image
            src={brand.logo}
            alt="Logo Garage Zona Cero"
            fill
            className="object-contain p-1.5"
            sizes="48px"
          />
        </span>
        <div className="min-w-0">
          <p className="display-font text-base tracking-[0.14em] text-ink sm:text-lg">
            Garage Zona Cero
          </p>
          <p className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-muted">
            Admin demo
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-[22px] border border-[rgba(197,154,90,0.18)] bg-[rgba(197,154,90,0.08)] p-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-accent">
          Modo
        </p>
        <p className="mt-2 text-sm leading-7 text-[rgba(244,239,232,0.9)]">
          {demoMode
            ? 'DEMO_MODE activo. El panel esta disponible sin login para demostracion.'
            : 'DEMO_MODE desactivado. La ruta queda lista para autenticacion futura.'}
        </p>
      </div>

      <nav className="mt-5 space-y-2">
        {navigationItems.map((item) => {
          const active = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'flex items-center justify-between rounded-[20px] border px-4 py-3 transition',
                active
                  ? 'border-[rgba(197,154,90,0.32)] bg-[rgba(197,154,90,0.1)] text-ink'
                  : 'border-white/8 bg-[rgba(255,255,255,0.03)] text-muted hover:border-white/14 hover:text-ink',
              ].join(' ')}>
              <span className="text-sm font-semibold">{item.label}</span>
              <span className="text-[0.68rem] uppercase tracking-[0.22em] text-accent">
                {item.hint}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default AdminSidebar

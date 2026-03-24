import Link from 'next/link'
import AdminNotice from '@/components/Admin/AdminNotice'
import AdminStatCard from '@/components/Admin/AdminStatCard'
import {
  getBookingMetrics,
  getCustomers,
  getGalleryItems,
  getSiteContent,
  getUpcomingBookings,
} from '@/lib/site-store'

type AdminDashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = searchParams ? await searchParams : undefined
  const [metrics, galleryItems, siteContent, upcomingBookings, customers] = await Promise.all([
    getBookingMetrics(),
    getGalleryItems(),
    getSiteContent(),
    getUpcomingBookings(6),
    getCustomers(),
  ])

  const pendingBookings = metrics.byStatus.pending || 0
  const confirmedBookings = metrics.byStatus.confirmed || 0
  const completedBookings = metrics.byStatus.completed || 0
  const cancelledBookings = metrics.byStatus.cancelled || 0
  const rescheduledBookings = metrics.byStatus.rescheduled || 0
  const activeCustomers = customers.filter((customer) => customer.activeBookings > 0).length
  const frequentCustomers = [...customers]
    .sort((left, right) => right.totalBookings - left.totalBookings)
    .slice(0, 4)

  return (
    <>
      <section className="section-shell px-5 py-6 sm:px-6 sm:py-7">
        <div className="relative z-10 space-y-5">
          <div className="space-y-3">
            <p className="eyebrow text-xs font-semibold text-accent">Dashboard</p>
            <h1 className="display-font text-4xl leading-tight text-ink sm:text-5xl">
              Resumen operativo de Garage Zona Cero.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted">
              El panel ya opera como demo funcional: bookings persistentes, clientes derivados del
              historial, contenido editable, galeria administrable y una base simple para stock.
            </p>
          </div>

          <AdminNotice
            message={getSingleValue(params?.notice)}
            type={getSingleValue(params?.noticeType)}
          />

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <AdminStatCard
              label="Reservas totales"
              value={metrics.total}
              detail="Persistidas en la capa demo local."
            />
            <AdminStatCard
              label="Pendientes"
              value={pendingBookings}
              detail="Solicitudes que esperan validacion manual."
            />
            <AdminStatCard
              label="Confirmadas"
              value={confirmedBookings}
              detail="Reservas activas bloqueando agenda publica."
            />
            <AdminStatCard
              label="Completadas"
              value={completedBookings}
              detail="Trabajos cerrados con registro historico."
            />
            <AdminStatCard
              label="Canceladas"
              value={cancelledBookings}
              detail={`${metrics.cancellationRate.toFixed(1)}% de cancelacion acumulada.`}
            />
            <AdminStatCard
              label="Reagendadas"
              value={rescheduledBookings}
              detail="Cambios de fecha u horario ya registrados."
            />
            <AdminStatCard
              label="Clientes"
              value={customers.length}
              detail={`${activeCustomers} con reservas activas.`}
            />
            <AdminStatCard
              label="Galeria"
              value={galleryItems.length}
              detail="Imagenes listas para home, trabajos y marca."
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.12fr_0.88fr]">
        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
                Proximas reservas
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Agenda inmediata</h2>
            </div>
            <Link href="/admin/reservas" className="text-sm font-semibold text-accent">
              Gestionar agenda
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-ink">{booking.name}</p>
                      <p className="text-sm leading-7 text-muted">
                        {booking.vehicleBrand} {booking.vehicleModel} - {booking.appointmentDate} -{' '}
                        {booking.appointmentWindow === 'am' ? 'Recepcion AM' : 'Recepcion PM'}
                      </p>
                      <p className="text-sm leading-7 text-muted">{booking.serviceLabel}</p>
                    </div>
                    <span className="rounded-full border border-[rgba(197,154,90,0.18)] bg-[rgba(197,154,90,0.08)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent">
                      {booking.status}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-white/10 bg-black/20 p-5 text-sm leading-7 text-muted">
                Aun no hay reservas activas cargadas en la demo.
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
                Demanda y estado
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Lectura rapida del negocio</h2>
            </div>
            <Link href="/admin/clientes" className="text-sm font-semibold text-accent">
              Ver clientes
            </Link>
          </div>

          <div className="mt-4 grid gap-4">
            <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                Servicios mas solicitados
              </p>
              <div className="mt-3 space-y-3">
                {metrics.mostRequestedServices.length > 0 ? (
                  metrics.mostRequestedServices.map((item) => (
                    <div key={item.service} className="flex items-center justify-between gap-4">
                      <p className="text-sm leading-7 text-ink">{item.service}</p>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.14em] text-accent">
                        {item.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-muted">
                    Aun no hay datos suficientes para medir demanda.
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                  Confirmadas
                </p>
                <p className="mt-2 text-2xl font-semibold text-ink">{confirmedBookings}</p>
              </div>
              <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                  Pendientes
                </p>
                <p className="mt-2 text-2xl font-semibold text-ink">{pendingBookings}</p>
              </div>
              <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                  Cancelacion
                </p>
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {metrics.cancellationRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[0.95fr_0.95fr_1.1fr]">
        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <div className="flex items-end justify-between gap-3 border-b border-white/8 pb-4">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
                Clientes frecuentes
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Relacion comercial</h2>
            </div>
            <Link href="/admin/clientes" className="text-sm font-semibold text-accent">
              CRM demo
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {frequentCustomers.length > 0 ? (
              frequentCustomers.map((customer) => (
                <article
                  key={customer.rut}
                  className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-ink">{customer.name}</p>
                      <p className="text-sm leading-7 text-muted">{customer.rut}</p>
                      <p className="text-sm leading-7 text-muted">
                        {customer.totalBookings} reservas · {customer.completedBookings}{' '}
                        completadas
                      </p>
                    </div>
                    <Link
                      href={`/admin/reservas/${customer.lastBookingId}`}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent transition hover:border-[rgba(197,154,90,0.28)]">
                      Ver
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-white/10 bg-black/20 p-5 text-sm leading-7 text-muted">
                Los clientes apareceran aqui a medida que se acumulen reservas.
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <div className="flex items-end justify-between gap-3 border-b border-white/8 pb-4">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
                Distribucion de estados
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Salud de la agenda</h2>
            </div>
            <Link href="/admin/reservas" className="text-sm font-semibold text-accent">
              Ver reservas
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { label: 'Pendientes', value: pendingBookings },
              { label: 'Confirmadas', value: confirmedBookings },
              { label: 'Reagendadas', value: rescheduledBookings },
              { label: 'Completadas', value: completedBookings },
              { label: 'Canceladas', value: cancelledBookings },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] px-4 py-3">
                <p className="text-sm leading-7 text-ink">{item.label}</p>
                <span className="text-lg font-semibold text-accent">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <div className="flex items-end justify-between gap-3 border-b border-white/8 pb-4">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
                Contenido editable
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Estado del sitio</h2>
            </div>
            <Link href="/admin/contenido" className="text-sm font-semibold text-accent">
              Editar landing
            </Link>
          </div>

          <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
            <p>
              <span className="text-ink">Hero:</span> {siteContent.hero.title}
            </p>
            <p>
              <span className="text-ink">Servicios:</span> {siteContent.services.length} bloques
              editables
            </p>
            <p>
              <span className="text-ink">Testimonios:</span> {siteContent.testimonials.length}{' '}
              opiniones cargadas
            </p>
            <p>
              <span className="text-ink">CTA final:</span> {siteContent.closingCta.primaryLabel}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href="/admin/galeria"
              className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm font-semibold text-ink transition hover:border-[rgba(197,154,90,0.28)]">
              Gestionar galeria
            </Link>
            <Link
              href="/admin/productos"
              className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm font-semibold text-ink transition hover:border-[rgba(197,154,90,0.28)]">
              Revisar stock
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

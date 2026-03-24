import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminNotice from '@/components/Admin/AdminNotice'
import { deleteBookingAction, updateBookingDetailAction } from '@/actions/admin'
import { BOOKING_STATUS_OPTIONS } from '@/lib/site-schema'
import { getBookingById } from '@/lib/site-store'

type BookingDetailPageProps = {
  params: Promise<{ id: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export default async function BookingDetailPage({
  params,
  searchParams,
}: BookingDetailPageProps) {
  const { id } = await params
  const booking = await getBookingById(id)
  const currentSearchParams = searchParams ? await searchParams : undefined

  if (!booking) {
    notFound()
  }

  const detailAction = updateBookingDetailAction.bind(null, booking.id)
  const removeAction = deleteBookingAction.bind(null, booking.id)

  return (
    <>
      <section className="section-shell px-5 py-6 sm:px-6 sm:py-7">
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-3">
              <p className="eyebrow text-xs font-semibold text-accent">Detalle de reserva</p>
              <h1 className="display-font text-4xl leading-tight text-ink sm:text-5xl">
                {booking.name}
              </h1>
              <p className="text-base leading-7 text-muted">
                {booking.vehicleBrand} {booking.vehicleModel} - {booking.appointmentDate} -{' '}
                {booking.appointmentWindow === 'am' ? 'Recepcion AM' : 'Recepcion PM'}
              </p>
            </div>
            <Link
              href="/admin/reservas"
              className="cta-secondary rounded-full px-5 py-3 text-sm font-semibold">
              Volver al listado
            </Link>
          </div>

          <AdminNotice
            message={getSingleValue(currentSearchParams?.notice)}
            type={getSingleValue(currentSearchParams?.noticeType)}
          />
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.04fr_0.96fr]">
        <div className="space-y-6">
          <div className="glass-panel rounded-[28px] p-5 sm:p-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
              Ficha de cliente y vehiculo
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">Titular</p>
                <p className="mt-2 text-lg font-semibold text-ink">{booking.name}</p>
                <p className="mt-2 text-sm leading-7 text-muted">RUT: {booking.rut}</p>
                <p className="text-sm leading-7 text-muted">Telefono: {booking.phone}</p>
                <p className="text-sm leading-7 text-muted">
                  Email: {booking.email || 'Sin email'}
                </p>
                <p className="text-sm leading-7 text-muted">
                  Tipo cliente: {booking.clientType}
                </p>
              </div>

              <div className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                  Contacto adicional
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Empresa: {booking.companyName || 'No aplica'}
                </p>
                <p className="text-sm leading-7 text-muted">
                  Responsable: {booking.companyContact || 'Sin dato'}
                </p>
                <p className="text-sm leading-7 text-muted">
                  Contacto extra: {booking.secondaryContactName || 'Sin dato'}
                </p>
                <p className="text-sm leading-7 text-muted">
                  Telefono extra: {booking.secondaryContactPhone || 'Sin dato'}
                </p>
              </div>

              <div className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">Vehiculo</p>
                <p className="mt-2 text-lg font-semibold text-ink">
                  {booking.vehicleBrand} {booking.vehicleModel}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {booking.vehicleYear} - {booking.vehicleType}
                </p>
                <p className="text-sm leading-7 text-muted">
                  Patente: {booking.vehiclePlate || 'Sin dato'}
                </p>
                <p className="text-sm leading-7 text-muted">
                  Uso: {booking.vehicleUse || 'Sin dato'}
                </p>
              </div>

              <div className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">Servicio</p>
                <p className="mt-2 text-lg font-semibold text-ink">{booking.serviceLabel}</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Modalidad: {booking.bookingMode}
                </p>
                <p className="text-sm leading-7 text-muted">
                  Pack: {booking.selectedPack || 'No aplica'}
                </p>
                <p className="text-sm leading-7 text-muted">
                  Individuales:{' '}
                  {booking.individualServices.length > 0
                    ? booking.individualServices.join(', ')
                    : 'No aplica'}
                </p>
                <p className="text-sm leading-7 text-muted">
                  Extras: {booking.addOns.length > 0 ? booking.addOns.join(', ') : 'Sin extras'}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                  Logistica
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Recepcion:{' '}
                  {booking.appointmentWindow === 'am' ? 'Recepcion AM' : 'Recepcion PM'}
                </p>
                <p className="text-sm leading-7 text-muted">
                  Ingreso: {booking.handoffOption}
                </p>
                <p className="text-sm leading-7 text-muted">
                  Direccion: {booking.pickupAddress || 'No aplica'}
                </p>
                <p className="text-sm leading-7 text-muted">
                  Zona: {booking.pickupZone || 'No aplica'}
                </p>
              </div>

              <div className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                  Acceso cliente
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Codigo de consulta: <span className="text-ink">{booking.lookupToken}</span>
                </p>
                <p className="text-sm leading-7 text-muted">
                  Ruta publica: /mi-reserva
                </p>
                <p className="text-sm leading-7 text-muted">
                  Estado actual: {booking.status}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                Observacion del cliente
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">{booking.message}</p>
            </div>
          </div>

          <div className="glass-panel rounded-[28px] p-5 sm:p-6">
            <div className="flex items-end justify-between gap-3 border-b border-white/8 pb-4">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
                  Historial
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">Trazabilidad de cambios</h2>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {booking.history.length > 0 ? (
                [...booking.history].reverse().map((entry) => (
                  <article
                    key={entry.id}
                    className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                          {entry.type}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-muted">{entry.note}</p>
                      </div>
                      <p className="text-xs uppercase tracking-[0.16em] text-muted">
                        {new Date(entry.createdAt).toLocaleString('es-CL')}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[20px] border border-dashed border-white/10 bg-black/20 p-5 text-sm leading-7 text-muted">
                  Aun no hay eventos registrados para esta reserva.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
            Gestion interna
          </p>
          <form action={detailAction} className="mt-4 grid gap-4">
            <input type="hidden" name="redirectTo" value={`/admin/reservas/${booking.id}`} />
            <label className="text-sm text-muted">
              Estado
              <select
                name="status"
                defaultValue={booking.status}
                className="mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none">
                {BOOKING_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-muted">
                Fecha
                <input
                  type="date"
                  name="appointmentDate"
                  defaultValue={booking.appointmentDate}
                  className="mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none"
                />
              </label>
              <label className="text-sm text-muted">
                Ventana
                <select
                  name="appointmentWindow"
                  defaultValue={booking.appointmentWindow}
                  className="mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none">
                  <option value="am">Recepcion AM</option>
                  <option value="pm">Recepcion PM</option>
                </select>
              </label>
            </div>

            <label className="text-sm text-muted">
              Notas internas
              <textarea
                name="internalNotes"
                rows={8}
                defaultValue={booking.internalNotes}
                className="mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                  Creada
                </p>
                <p className="mt-2 text-sm leading-7 text-ink">
                  {new Date(booking.createdAt).toLocaleString('es-CL')}
                </p>
              </div>
              <div className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                  Ultima actualizacion
                </p>
                <p className="mt-2 text-sm leading-7 text-ink">
                  {new Date(booking.updatedAt).toLocaleString('es-CL')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="cta-primary rounded-2xl px-5 py-4 text-sm font-semibold">
                Guardar cambios
              </button>
              <button
                type="submit"
                formAction={removeAction}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-[#f7d0aa] transition hover:border-[rgba(241,184,127,0.3)]">
                Eliminar reserva
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

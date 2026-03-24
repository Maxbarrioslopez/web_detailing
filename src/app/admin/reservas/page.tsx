import Link from 'next/link'
import AdminNotice from '@/components/Admin/AdminNotice'
import {
  createManualBookingAction,
  deleteBookingAction,
  updateBookingStatusAction,
} from '@/actions/admin'
import { BOOKING_STATUS_OPTIONS } from '@/lib/site-schema'
import { getBookings } from '@/lib/site-store'

type ReservationsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export default async function AdminReservationsPage({ searchParams }: ReservationsPageProps) {
  const params = searchParams ? await searchParams : undefined
  const statusFilter = getSingleValue(params?.status) || ''
  const dateFilter = getSingleValue(params?.date) || ''
  const query = (getSingleValue(params?.q) || '').toLowerCase()
  const bookings = await getBookings()

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter && booking.status !== statusFilter) {
      return false
    }

    if (dateFilter && booking.appointmentDate !== dateFilter) {
      return false
    }

    if (query) {
      const searchableText = [
        booking.name,
        booking.rut,
        booking.phone,
        booking.email,
        booking.vehiclePlate,
        booking.vehicleBrand,
        booking.vehicleModel,
        booking.serviceLabel,
      ]
        .join(' ')
        .toLowerCase()

      if (!searchableText.includes(query)) {
        return false
      }
    }

    return true
  })

  return (
    <>
      <section className="section-shell px-5 py-6 sm:px-6 sm:py-7">
        <div className="relative z-10 space-y-5">
          <div className="space-y-3">
            <p className="eyebrow text-xs font-semibold text-accent">Reservas</p>
            <h1 className="display-font text-4xl leading-tight text-ink sm:text-5xl">
              Gestion operativa de agenda.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted">
              Desde aqui puedes revisar solicitudes del sitio, buscar por cliente o vehiculo,
              cambiar estado y crear reservas demo sin tocar codigo.
            </p>
          </div>

          <AdminNotice
            message={getSingleValue(params?.notice)}
            type={getSingleValue(params?.noticeType)}
          />

          <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
            <div className="glass-panel rounded-[26px] p-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
                Filtros
              </p>
              <form className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.25fr)_220px_220px_auto]">
                <label className="text-sm text-muted">
                  Buscar
                  <input
                    name="q"
                    defaultValue={query}
                    placeholder="Nombre, RUT, telefono, patente o servicio"
                    className="mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-[0.94rem] text-ink outline-none"
                  />
                </label>
                <label className="text-sm text-muted">
                  Fecha
                  <input
                    type="date"
                    name="date"
                    defaultValue={dateFilter}
                    className="mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-[0.94rem] text-ink outline-none"
                  />
                </label>
                <label className="text-sm text-muted">
                  Estado
                  <select
                    name="status"
                    defaultValue={statusFilter}
                    className="mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-[0.94rem] text-ink outline-none">
                    <option value="">Todos</option>
                    {BOOKING_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex items-end gap-3">
                  <button
                    type="submit"
                    className="cta-secondary rounded-full px-5 py-3 text-sm font-semibold">
                    Filtrar
                  </button>
                  <Link
                    href="/admin/reservas"
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-muted transition hover:text-ink">
                    Limpiar
                  </Link>
                </div>
              </form>
            </div>

            <div className="glass-panel rounded-[26px] p-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
                Crear reserva demo
              </p>
              <form action={createManualBookingAction} className="mt-4 grid gap-4">
                <input type="hidden" name="redirectTo" value="/admin/reservas" />
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    name="name"
                    placeholder="Nombre titular"
                    className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none"
                  />
                  <input
                    name="rut"
                    placeholder="RUT"
                    className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    name="phone"
                    placeholder="Telefono"
                    className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none"
                  />
                  <input
                    name="vehiclePlate"
                    placeholder="Patente"
                    className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <input
                    name="vehicleBrand"
                    placeholder="Marca"
                    className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none"
                  />
                  <input
                    name="vehicleModel"
                    placeholder="Modelo"
                    className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none"
                  />
                  <input
                    type="number"
                    name="vehicleYear"
                    placeholder="Ano"
                    className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <input
                    type="date"
                    name="appointmentDate"
                    className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none"
                  />
                  <select
                    name="appointmentWindow"
                    defaultValue="am"
                    className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none">
                    <option value="am">Recepcion AM</option>
                    <option value="pm">Recepcion PM</option>
                  </select>
                  <select
                    name="status"
                    defaultValue="pending"
                    className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none">
                    {BOOKING_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Notas rapidas de la reserva"
                  className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none"
                />
                <button
                  type="submit"
                  className="cta-primary inline-flex justify-center rounded-2xl px-5 py-4 text-sm font-semibold">
                  Crear reserva
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[28px] p-5 sm:p-6">
        <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
              Listado
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              {filteredBookings.length} reservas encontradas
            </h2>
          </div>
          <p className="text-sm leading-7 text-muted">
            Los estados pendientes, confirmados y reagendados bloquean la agenda publica.
          </p>
        </div>

        <div className="mt-5 grid gap-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => {
              const statusAction = updateBookingStatusAction.bind(null, booking.id)
              const removeAction = deleteBookingAction.bind(null, booking.id)

              return (
                <article
                  key={booking.id}
                  className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                  <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-start">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-lg font-semibold text-ink">{booking.name}</p>
                        <span className="rounded-full border border-[rgba(197,154,90,0.18)] bg-[rgba(197,154,90,0.08)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-accent">
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm leading-7 text-muted">
                        {booking.vehicleBrand} {booking.vehicleModel} - {booking.appointmentDate} -{' '}
                        {booking.appointmentWindow === 'am' ? 'Recepcion AM' : 'Recepcion PM'}
                      </p>
                      <p className="text-sm leading-7 text-muted">
                        {booking.phone}
                        {booking.email ? ` - ${booking.email}` : ''}
                      </p>
                      <p className="text-sm leading-7 text-muted">
                        RUT: {booking.rut}
                        {booking.vehiclePlate ? ` - Patente: ${booking.vehiclePlate}` : ''}
                        {booking.serviceLabel ? ` - ${booking.serviceLabel}` : ''}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <form action={statusAction} className="flex flex-wrap gap-2">
                        <input type="hidden" name="redirectTo" value="/admin/reservas" />
                        <select
                          name="status"
                          defaultValue={booking.status}
                          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-ink outline-none">
                          {BOOKING_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-ink transition hover:border-[rgba(197,154,90,0.3)]">
                          Actualizar
                        </button>
                      </form>

                      <Link
                        href={`/admin/reservas/${booking.id}`}
                        className="cta-secondary rounded-full px-4 py-2 text-sm font-semibold">
                        Ver detalle
                      </Link>

                      <form action={removeAction}>
                        <input type="hidden" name="redirectTo" value="/admin/reservas" />
                        <button
                          type="submit"
                          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#f7d0aa] transition hover:border-[rgba(241,184,127,0.3)]">
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              )
            })
          ) : (
            <div className="rounded-[22px] border border-dashed border-white/10 bg-black/20 p-6 text-sm leading-7 text-muted">
              No hay reservas para los filtros seleccionados.
            </div>
          )}
        </div>
      </section>
    </>
  )
}

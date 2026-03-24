import Link from 'next/link'
import AdminNotice from '@/components/Admin/AdminNotice'
import { getCustomers } from '@/lib/site-store'

type ClientsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export default async function AdminClientsPage({ searchParams }: ClientsPageProps) {
  const params = searchParams ? await searchParams : undefined
  const query = (getSingleValue(params?.q) || '').toLowerCase()
  const customers = await getCustomers()

  const filteredCustomers = customers.filter((customer) => {
    if (!query) {
      return true
    }

    return [customer.name, customer.rut, customer.phone, customer.email, customer.vehicles.join(' ')]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })

  return (
    <>
      <section className="section-shell px-5 py-6 sm:px-6 sm:py-7">
        <div className="relative z-10 space-y-5">
          <div className="space-y-3">
            <p className="eyebrow text-xs font-semibold text-accent">Clientes</p>
            <h1 className="display-font text-4xl leading-tight text-ink sm:text-5xl">
              Base simple de clientes desde reservas.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted">
              Esta vista deriva clientes desde el historial real de bookings para mostrar ultimo
              contacto, frecuencia y servicios realizados.
            </p>
          </div>

          <AdminNotice
            message={getSingleValue(params?.notice)}
            type={getSingleValue(params?.noticeType)}
          />

          <form className="glass-panel rounded-[24px] p-4">
            <label className="text-sm text-muted">
              Buscar por nombre, RUT, telefono, email o vehiculo
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  name="q"
                  defaultValue={query}
                  className="w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none"
                />
                <button
                  type="submit"
                  className="cta-secondary rounded-full px-5 py-3 text-sm font-semibold">
                  Buscar
                </button>
              </div>
            </label>
          </form>
        </div>
      </section>

      <section className="grid gap-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <article key={customer.rut} className="glass-panel rounded-[24px] p-5 sm:p-6">
              <div className="grid gap-5 xl:grid-cols-[1fr_auto]">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-ink">{customer.name}</h2>
                    <p className="text-sm leading-7 text-muted">{customer.rut}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">Contacto</p>
                      <p className="mt-2 text-sm leading-7 text-ink">{customer.phone}</p>
                      <p className="text-sm leading-7 text-muted">{customer.email || 'Sin email'}</p>
                    </div>
                    <div className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">Servicios</p>
                      <p className="mt-2 text-2xl font-semibold text-ink">{customer.totalBookings}</p>
                      <p className="text-sm leading-7 text-muted">Reservas registradas</p>
                    </div>
                    <div className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">Ultima reserva</p>
                      <p className="mt-2 text-sm leading-7 text-ink">{customer.lastBookingAt}</p>
                      <p className="text-sm leading-7 text-muted">{customer.completedBookings} completadas</p>
                    </div>
                    <div className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">Vehiculos</p>
                      <p className="mt-2 text-sm leading-7 text-muted">{customer.vehicles.join(', ')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 xl:flex-col">
                  <Link
                    href={`/admin/reservas/${customer.lastBookingId}`}
                    className="cta-secondary rounded-full px-4 py-3 text-sm font-semibold">
                    Ver ultima reserva
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="glass-panel rounded-[28px] p-6 text-sm leading-7 text-muted">
            No hay clientes que coincidan con esa busqueda.
          </div>
        )}
      </section>
    </>
  )
}

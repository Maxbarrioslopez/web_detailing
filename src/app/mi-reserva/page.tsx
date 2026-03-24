import type { Metadata } from 'next'
import ClientReservationManager from '@/components/Booking/ClientReservationManager'
import { getSiteSettings } from '@/lib/site-store'

export const metadata: Metadata = {
  title: 'Mi Reserva | Zona Cero Garage',
  description:
    'Consulta, cancela o reagenda tu reserva de Zona Cero Garage con un flujo simple y profesional.',
}

const buildWhatsAppUrl = (rawValue: string) => {
  const digits = rawValue.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : 'https://wa.me/'
}

export default async function ClientReservationPage() {
  const settings = await getSiteSettings()

  return (
    <main className="px-4 pb-8 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="section-shell px-5 py-6 sm:px-6 sm:py-7">
          <div className="relative z-10 space-y-4">
            <p className="eyebrow text-xs font-semibold text-accent">Mi reserva</p>
            <h1 className="display-font text-4xl leading-tight text-ink sm:text-5xl">
              Consulta, cancela o reagenda con un flujo simple.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted">
              Esta ruta publica permite al cliente revisar su reserva sin entrar al panel interno.
              Para mayor seguridad, la consulta exige RUT y un segundo dato de validacion.
            </p>
          </div>
        </section>

        <ClientReservationManager whatsappUrl={buildWhatsAppUrl(settings.whatsapp)} />
      </div>
    </main>
  )
}

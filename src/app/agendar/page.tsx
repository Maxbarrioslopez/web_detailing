import type { Metadata } from 'next'
import {
  bookingJourney,
  bookingPersonalization,
  brand,
  contactHighlights,
} from '@/appData/garage'
import ContactSection from '@/components/Contact/ContactSection'
import { ChevronRightIcon } from '@/utils/icons'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Agendar Servicio | Garage Zona Cero',
  description:
    'Reserva tu servicio de detailing con un flujo dedicado: datos del cliente, vehiculo, agenda, logistica y seleccion del tratamiento.',
}

export default function BookingPage() {
  return (
    <main>
      <section className="px-4 pb-6 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-8 lg:pt-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(197,154,90,0.22)] bg-[rgba(197,154,90,0.1)] px-4 py-2">
                <span className="size-2 rounded-full bg-accent" />
                <span className="eyebrow text-[0.65rem] font-semibold text-accent">
                  Agenda dedicada
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="display-font text-[2.9rem] leading-none text-ink sm:text-5xl xl:text-6xl">
                  Una agenda dedicada para una experiencia de reserva mas precisa.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[rgba(244,239,232,0.92)] sm:text-[1.35rem]">
                  La agenda ahora vive en una pagina propia, mas ordenada, personalizada y pensada
                  para convertir mejor.
                </p>
                <p className="max-w-2xl text-base leading-7 text-muted">
                  Aqui el cliente encuentra contexto, cronologia, criterios de reserva y un flujo
                  completo de ingreso del vehiculo sin competir con el contenido comercial de la
                  home.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="#contacto"
                  className="cta-primary inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-semibold sm:text-base">
                  Completar reserva
                  <ChevronRightIcon className="size-5" />
                </Link>
                <Link
                  href="/#servicios"
                  className="cta-secondary inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-semibold sm:text-base">
                  Ver servicios primero
                </Link>
                <Link
                  href="/mi-reserva"
                  className="cta-secondary inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-semibold sm:text-base">
                  Consultar o reagendar
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {bookingPersonalization.map((item) => (
                  <div key={item} className="metal-card rounded-[22px] p-4">
                    <p className="text-sm leading-7 text-muted">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-shell relative overflow-hidden p-3 sm:p-4">
              <div className="relative min-h-[320px] overflow-hidden rounded-[26px] sm:min-h-[420px] lg:min-h-[460px]">
                <Image
                  src={brand.showcaseImage}
                  alt="Garage Zona Cero preparando un vehiculo para entrega"
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1280px) 42rem, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-black/20" />
                <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent backdrop-blur-md">
                  Reserva personalizada
                </div>
                <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/10 bg-[rgba(5,6,8,0.82)] p-4 backdrop-blur-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                    Lo que resuelve esta pagina
                  </p>
                  <div className="mt-2.5 space-y-2.5">
                    {contactHighlights.map((item) => (
                      <p key={item} className="text-sm leading-7 text-[rgba(244,239,232,0.9)]">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <div className="section-shell mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7">
          <div className="relative z-10">
            <div className="space-y-3">
              <p className="eyebrow text-xs font-semibold text-accent">Cronologia de reserva</p>
              <h2 className="display-font text-3xl leading-tight text-ink sm:text-4xl">
                Un flujo mas claro desde la solicitud hasta la confirmacion final.
              </h2>
              <p className="max-w-3xl text-base leading-7 text-muted">
                La pagina dedicada organiza mejor la experiencia. Primero orienta, luego recoge la
                informacion precisa y finalmente te prepara para una confirmacion profesional.
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {bookingJourney.map((item, index) => (
                <article
                  key={item.step}
                  className={`metal-card rounded-[24px] p-5 ${index > 0 ? 'fade-up-delay-1' : ''}`}>
                  <p className="display-font text-3xl text-accent">{item.step}</p>
                  <h3 className="mt-4 text-xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-3 pb-6 sm:px-6 lg:px-8 lg:py-4 lg:pb-8">
        <div className="mx-auto max-w-7xl">
          <ContactSection />
        </div>
      </section>
    </main>
  )
}

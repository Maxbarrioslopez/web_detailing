import { getBookingAvailability, getSiteSettings } from '@/lib/site-store'
import { contactHighlights } from '@/appData/garage'
import { CheckIcon } from '@/utils/icons'
import ContactForm from './ContactForm'

const ContactSection = async () => {
  const [availability, settings] = await Promise.all([
    getBookingAvailability(),
    getSiteSettings(),
  ])

  return (
    <section id="contacto" className="section-shell px-4 py-5 sm:px-6 sm:py-7 lg:px-7">
      <div className="relative z-10 grid gap-6 2xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="fade-up space-y-3">
            <p className="eyebrow text-xs font-semibold text-accent">Contacto y agendamiento</p>
            <h2 className="display-font text-3xl leading-tight text-ink sm:text-4xl">
              Una reserva mas clara, compacta y enfocada en conversion.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-muted sm:text-base">
              La agenda recoge los datos importantes sin romper el ritmo visual de la pagina ni
              hacer pesado el proceso.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-1">
            {contactHighlights.map((item, index) => (
              <div
                key={item}
                className={`metal-card fade-up rounded-[22px] p-4 ${index === 1 ? 'fade-up-delay-1' : index === 2 ? 'fade-up-delay-2' : ''}`}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-full border border-[rgba(197,154,90,0.28)] bg-[rgba(197,154,90,0.12)] p-1.5 text-accent">
                    <CheckIcon />
                  </span>
                  <p className="text-sm leading-7 text-ink">{item}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel fade-up fade-up-delay-2 rounded-[24px] p-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
              Flujo de reserva
            </p>
            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <span className="display-font text-xl text-accent">01</span>
                <p className="text-sm leading-7 text-muted">
                  Comparte el servicio que te interesa y el estado general del vehiculo.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="display-font text-xl text-accent">02</span>
                <p className="text-sm leading-7 text-muted">
                  Revisamos alcance, terminacion esperada y propuesta recomendada.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="display-font text-xl text-accent">03</span>
                <p className="text-sm leading-7 text-muted">
                  Confirmamos la agenda y definimos la intervencion adecuada para tu auto.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel fade-up fade-up-delay-2 rounded-[24px] p-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
              Contacto operativo
            </p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
              <p>
                <span className="text-ink">WhatsApp:</span> {settings.whatsapp}
              </p>
              <p>
                <span className="text-ink">Email:</span> {settings.email}
              </p>
              <p>
                <span className="text-ink">Cobertura:</span> {settings.serviceArea}
              </p>
              <p>
                <span className="text-ink">Horario:</span> {settings.businessHours}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel fade-up fade-up-delay-1 rounded-[28px] p-4 sm:p-5 lg:p-6">
          <ContactForm availability={availability} />
        </div>
      </div>
    </section>
  )
}

export default ContactSection

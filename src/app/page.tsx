import {
  brand,
  heroPillars,
  processSteps,
  reasons,
  servicePlans,
} from '@/appData/garage'
import { getFeaturedGalleryItems, getSiteContent, getSiteSettings } from '@/lib/site-store'
import type { ServiceIconKey } from '@/appData/garage'
import { CheckIcon, ChevronRightIcon, StarIcon } from '@/utils/icons'
import Image from 'next/image'
import Link from 'next/link'

const SectionHeader = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) => (
  <div className="space-y-3">
    <p className="eyebrow text-xs font-semibold text-accent">{eyebrow}</p>
    <h2 className="display-font text-3xl leading-tight text-ink sm:text-4xl">{title}</h2>
    <p className="max-w-2xl text-base leading-7 text-muted">{description}</p>
  </div>
)

const ServiceIcon = ({ icon }: { icon: ServiceIconKey }) => {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
  }

  switch (icon) {
    case 'wash':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...commonProps}>
          <path d="M12 3C9.4 7 7 9.5 7 13a5 5 0 0 0 10 0c0-3.5-2.4-6-5-10Z" />
          <path d="M9 18.2c.8.5 1.8.8 3 .8s2.2-.3 3-.8" />
        </svg>
      )
    case 'interior':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...commonProps}>
          <path d="M7 20v-4.5c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3V20" />
          <path d="M9 12.5V9a3 3 0 0 1 6 0v3.5" />
          <path d="M6 20h12" />
        </svg>
      )
    case 'polish':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...commonProps}>
          <path d="m12 3 1.7 3.9L18 8.6l-3.2 2.7 1 4.2-3.8-2.3-3.8 2.3 1-4.2L6 8.6l4.3-1.7L12 3Z" />
          <path d="M18.5 15.5 20 19l3.5 1.5L20 22l-1.5 3.5L17 22l-3.5-1.5L17 19l1.5-3.5Z" />
        </svg>
      )
    case 'shield':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...commonProps}>
          <path d="M12 3 6.5 5.5v5.4c0 4.2 2.3 7.9 5.5 10.1 3.2-2.2 5.5-5.9 5.5-10.1V5.5L12 3Z" />
          <path d="m9.5 12 1.8 1.8 3.2-3.4" />
        </svg>
      )
    case 'ceramic':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...commonProps}>
          <path d="M5 8.5h14" />
          <path d="M7.5 8.5a4.5 4.5 0 1 1 9 0" />
          <path d="M6 8.5V15a6 6 0 1 0 12 0V8.5" />
          <path d="M9 12.5h6" />
        </svg>
      )
    case 'restore':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...commonProps}>
          <path d="M7 15.5 15.5 7l1.8 1.8L8.8 17.3H7v-1.8Z" />
          <path d="M13.5 5.2 15.3 3.5a1.8 1.8 0 0 1 2.5 0l2.2 2.2a1.8 1.8 0 0 1 0 2.5l-1.7 1.8" />
          <path d="M5 19h14" />
        </svg>
      )
  }
}

export default async function Home() {
  const [siteContent, featuredGalleryItems, settings] = await Promise.all([
    getSiteContent(),
    getFeaturedGalleryItems(3),
    getSiteSettings(),
  ])

  const heroContent = siteContent.hero
  const servicesContent = siteContent.services
  const testimonialsContent = siteContent.testimonials
  const [mainGalleryItem, sideGalleryItem, detailGalleryItem] = featuredGalleryItems

  return (
    <main>
      <section id="inicio" className="px-4 pb-8 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-12 lg:pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center xl:gap-10">
            <div className="space-y-6">
              <div className="fade-up inline-flex items-center gap-3 rounded-full border border-[rgba(197,154,90,0.22)] bg-[rgba(197,154,90,0.1)] px-4 py-2">
                <span className="size-2 rounded-full bg-accent" />
                <span className="eyebrow text-[0.65rem] font-semibold text-accent">
                  {heroContent.eyebrow}
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="display-font fade-up fade-up-delay-1 text-[2.95rem] leading-none text-ink sm:text-5xl xl:text-6xl">
                  {heroContent.title}
                </h1>
                <p className="fade-up fade-up-delay-1 max-w-2xl text-lg leading-8 text-[rgba(244,239,232,0.92)] sm:text-[1.35rem]">
                  {heroContent.subtitle}
                </p>
                <p className="fade-up fade-up-delay-2 max-w-2xl text-base leading-7 text-muted">
                  {heroContent.description}
                </p>
              </div>

              <div className="fade-up fade-up-delay-2 flex flex-wrap gap-4">
                <Link
                  href={heroContent.primaryCtaHref}
                  className="cta-primary inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-semibold sm:text-base">
                  {heroContent.primaryCtaLabel}
                  <ChevronRightIcon className="size-5" />
                </Link>
                <Link
                  href={heroContent.secondaryCtaHref}
                  className="cta-secondary inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-semibold sm:text-base">
                  {heroContent.secondaryCtaLabel}
                </Link>
              </div>

              <div className="grid gap-3 pt-1 sm:grid-cols-2 xl:grid-cols-3">
                {heroPillars.map((pillar, index) => (
                  <div
                    key={pillar.title}
                    className={`metal-card fade-up rounded-[24px] p-4 ${index === 1 ? 'fade-up-delay-1' : index === 2 ? 'fade-up-delay-2' : ''}`}>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                      {pillar.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-muted">{pillar.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="fade-up fade-up-delay-2 relative">
              <div className="section-shell relative p-3">
                <div className="relative min-h-[360px] overflow-hidden rounded-[26px] sm:min-h-[480px] xl:min-h-[540px]">
                  <Image
                    src={brand.heroImage}
                    alt="Zona Cero Garage trabajando un coupe negro de alto brillo"
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 42rem, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-black/20" />
                  <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-ink backdrop-blur-md">
                    Pulido / Proteccion / Presencia
                  </div>
                  <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/10 bg-[rgba(5,6,8,0.78)] p-4 backdrop-blur-xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                      Acabado premium
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-7 text-[rgba(244,239,232,0.9)] sm:text-base">
                      Tratamientos pensados para elevar la lectura visual del auto con brillo
                      profundo, limpieza controlada y terminacion sobria.
                    </p>
                  </div>
                </div>

                <div className="glass-panel float-card absolute -left-2 bottom-16 hidden w-48 rounded-[24px] p-3.5 xl:block">
                  <div className="relative mb-3 h-24 overflow-hidden rounded-[18px]">
                    <Image
                      src={brand.showcaseImage}
                      alt="Vista del taller Zona Cero Garage"
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                    Taller y entrega
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Espacio visual alineado con una experiencia seria y cuidada.
                  </p>
                </div>

                <div className="glass-panel absolute -right-2 top-8 hidden w-52 rounded-[24px] p-3.5 lg:block">
                  <div className="flex items-center gap-3">
                    <span className="relative size-14 overflow-hidden rounded-full border border-white/10 bg-[#0b0d10]">
                      <Image
                        src={brand.logo}
                        alt="Logo Zona Cero Garage"
                        fill
                        className="object-contain p-1.5"
                        sizes="56px"
                      />
                    </span>
                    <div>
                      <p className="display-font text-base tracking-[0.12em] text-ink">
                        Zona Cero
                      </p>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted">
                        Detailing premium
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <div className="section-shell mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7">
          <div className="relative z-10">
            <SectionHeader
              eyebrow={siteContent.servicesSection.eyebrow}
              title={siteContent.servicesSection.title}
              description={siteContent.servicesSection.description}
            />

            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {servicesContent.map((service, index) => (
                <article
                  key={service.name}
                  className={`metal-card rounded-[24px] p-5 ${index > 0 ? 'fade-up-delay-1' : ''}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-2xl border border-[rgba(197,154,90,0.24)] bg-[rgba(197,154,90,0.1)] p-3 text-accent">
                      <ServiceIcon icon={service.icon} />
                    </span>
                    <span className="text-xs uppercase tracking-[0.24em] text-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-ink">{service.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                    {service.description}
                  </p>
                  <div className="mt-5 rounded-[20px] border border-white/10 bg-black/20 p-4">
                    <p className="text-sm leading-7 text-[rgba(244,239,232,0.9)]">
                      {service.benefit}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {servicePlans.map((plan) => (
                <div key={plan.name} className="glass-panel rounded-[22px] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                    {plan.name}
                  </p>
                  <p className="mt-2.5 text-sm leading-7 text-muted sm:text-base">
                    {plan.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="resultados" className="px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <div className="section-shell mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7">
          <div className="relative z-10">
            <SectionHeader
              eyebrow={siteContent.gallerySection.eyebrow}
              title={siteContent.gallerySection.title}
              description={siteContent.gallerySection.description}
            />

            <div className="mt-7 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
              <article className="metal-card overflow-hidden rounded-[28px]">
                <div className="relative min-h-[380px]">
                  <Image
                    src={mainGalleryItem?.imageUrl || brand.heroImage}
                    alt={mainGalleryItem?.alt || 'Trabajo destacado Zona Cero Garage'}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 40rem, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-black/15" />
                  <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent backdrop-blur-md">
                    {mainGalleryItem?.category || 'Destacado'}
                  </div>
                  <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/10 bg-[rgba(5,6,8,0.82)] p-4 backdrop-blur-xl">
                    <h3 className="text-2xl font-semibold text-ink">
                      {mainGalleryItem?.title || 'Trabajo destacado'}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-muted sm:text-base">
                      {mainGalleryItem?.description || 'Imagen destacada de la galeria.'}
                    </p>
                  </div>
                </div>
              </article>

              <div className="grid gap-4">
                <article className="metal-card overflow-hidden rounded-[28px]">
                  <div className="relative min-h-[230px]">
                    <Image
                      src={sideGalleryItem?.imageUrl || brand.showcaseImage}
                      alt={sideGalleryItem?.alt || 'Detalle de trabajo Zona Cero Garage'}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 28rem, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-black/15" />
                    <div className="absolute inset-x-5 bottom-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                        {sideGalleryItem?.category || 'Galeria'}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-ink">
                        {sideGalleryItem?.title || 'Trabajo destacado'}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-muted sm:text-base">
                        {sideGalleryItem?.description || 'Detalle visual del trabajo realizado.'}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="glass-panel rounded-[28px] p-5 sm:p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                    Resultado visible
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-ink">
                    {detailGalleryItem?.title || 'Entrega con identidad de marca'}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                    {detailGalleryItem?.description ||
                      'Cada trabajo se presenta con una puesta visual sobria, cuidada y alineada con una experiencia premium.'}
                  </p>

                  <div className="mt-5 flex items-center gap-4 rounded-[20px] border border-white/10 bg-black/20 p-4">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#0b0d10]">
                      <Image
                        src={brand.logo}
                        alt="Logo Zona Cero Garage"
                        fill
                        className="object-contain p-2"
                        sizes="56px"
                      />
                    </div>
                    <p className="text-sm leading-7 text-[rgba(244,239,232,0.9)]">
                      Detalle de marca, brillo controlado y una presentacion final que acompana el
                      nivel del servicio.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="nosotros" className="px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <div className="section-shell mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7">
          <div className="relative z-10 grid gap-7 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-6">
              <SectionHeader
                eyebrow="Por que elegirnos"
                title="Una marca pensada para clientes que valoran detalle real."
                description="Zona Cero Garage se plantea como un servicio serio, sobrio y orientado a precision visual, limpieza de superficies y criterio tecnico en cada entrega."
              />

              <div className="grid gap-3 sm:grid-cols-2">
                {reasons.map((reason) => (
                  <div key={reason} className="glass-panel rounded-[22px] p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 rounded-full border border-[rgba(197,154,90,0.28)] bg-[rgba(197,154,90,0.12)] p-2 text-accent">
                        <CheckIcon />
                      </span>
                      <p className="text-sm leading-7 text-[rgba(244,239,232,0.92)]">{reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {processSteps.map((step) => (
                <article key={step.step} className="metal-card rounded-[24px] p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="display-font text-3xl text-accent">{step.step}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-ink">{step.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{step.text}</p>
                    </div>
                  </div>
                </article>
              ))}

              <div className="glass-panel rounded-[24px] p-5 sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                  Mensaje central
                </p>
                <p className="mt-4 text-lg leading-8 text-ink">
                  Cuidado estetico profesional para vehiculos con una direccion de marca sobria,
                  moderna y enfocada en la satisfaccion visual del cliente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonios" className="px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <div className="section-shell mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7">
          <div className="relative z-10">
            <SectionHeader
              eyebrow={siteContent.testimonialsSection.eyebrow}
              title={siteContent.testimonialsSection.title}
              description={siteContent.testimonialsSection.description}
            />

            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {testimonialsContent.map((testimonial) => (
                <article key={testimonial.name} className="metal-card rounded-[24px] p-5">
                  <div className="flex items-center gap-1 text-accent">
                    {Array.from({ length: 5 }, (_, index) => (
                      <StarIcon key={`${testimonial.name}-${index}`} className="size-5" />
                    ))}
                  </div>
                  <p className="mt-5 text-base leading-8 text-[rgba(244,239,232,0.92)]">
                    {testimonial.feedback}
                  </p>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="text-lg font-semibold text-ink">{testimonial.name}</p>
                    <p className="text-sm uppercase tracking-[0.22em] text-muted">
                      {testimonial.vehicle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <div className="mx-auto max-w-7xl">
          <div className="section-shell px-4 py-6 sm:px-6 sm:py-8">
            <div className="relative z-10 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-center">
              <div className="max-w-3xl space-y-4">
                <p className="eyebrow text-xs font-semibold text-accent">
                  {siteContent.closingCta.eyebrow}
                </p>
                <h2 className="display-font text-3xl leading-tight text-ink sm:text-4xl">
                  {siteContent.closingCta.title}
                </h2>
                <p className="text-base leading-7 text-muted">
                  {siteContent.closingCta.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-1">
                  <Link
                    href={siteContent.closingCta.primaryHref}
                    className="cta-primary inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-semibold sm:text-base">
                    {siteContent.closingCta.primaryLabel}
                    <ChevronRightIcon className="size-5" />
                  </Link>
                  <Link
                    href={siteContent.closingCta.secondaryHref}
                    className="cta-secondary inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-semibold sm:text-base">
                    {siteContent.closingCta.secondaryLabel}
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <article className="metal-card rounded-[22px] p-4">
                  <p className="display-font text-2xl text-accent">01</p>
                  <h3 className="mt-3 text-lg font-semibold text-ink">WhatsApp</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{settings.whatsapp}</p>
                </article>
                <article className="metal-card rounded-[22px] p-4">
                  <p className="display-font text-2xl text-accent">02</p>
                  <h3 className="mt-3 text-lg font-semibold text-ink">Cobertura</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{settings.serviceArea}</p>
                </article>
                <article className="metal-card rounded-[22px] p-4">
                  <p className="display-font text-2xl text-accent">03</p>
                  <h3 className="mt-3 text-lg font-semibold text-ink">Horario</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{settings.businessHours}</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

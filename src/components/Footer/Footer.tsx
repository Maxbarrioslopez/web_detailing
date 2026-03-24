import { brand, navLinks } from '@/appData/garage'
import { getSiteContent, getSiteSettings } from '@/lib/site-store'
import Image from 'next/image'
import Link from 'next/link'

const Footer = async () => {
  const [siteContent, settings] = await Promise.all([getSiteContent(), getSiteSettings()])

  return (
    <footer className="px-4 pb-6 pt-10 sm:px-6 lg:px-8">
      <div className="section-shell mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#0b0d10] sm:size-14">
                <Image
                  src={brand.logo}
                  alt="Logo Zona Cero Garage"
                  fill
                  className="object-contain p-2"
                  sizes="(min-width: 640px) 56px, 48px"
                />
              </span>
              <div className="min-w-0">
                <p className="display-font text-base tracking-[0.12em] text-ink sm:text-xl sm:tracking-[0.16em]">
                  {brand.name}
                </p>
                <p className="eyebrow mt-1 text-[0.62rem] text-muted">{brand.eyebrow}</p>
              </div>
            </div>

            <p className="max-w-xl text-sm leading-7 text-muted sm:text-base">
              {brand.description} Una experiencia visual sobria, tecnica y orientada a clientes
              que valoran la presentacion final de su vehiculo.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={siteContent.hero.primaryCtaHref}
                className="cta-primary rounded-full px-5 py-3 text-sm font-semibold">
                {siteContent.hero.primaryCtaLabel}
              </Link>
              <Link
                href={siteContent.hero.secondaryCtaHref}
                className="cta-secondary rounded-full px-5 py-3 text-sm font-semibold">
                {siteContent.hero.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-accent">
                Navegacion
              </p>
              <div className="flex flex-col gap-3">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-muted transition-colors duration-300 hover:text-ink">
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/mi-reserva"
                  className="text-sm text-muted transition-colors duration-300 hover:text-ink">
                  Mi reserva
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-accent">
                Contacto
              </p>
              <div className="space-y-3 text-sm text-muted">
                <p>WhatsApp: {settings.whatsapp}</p>
                <p>Email: {settings.email}</p>
                <p>Zona: {settings.serviceArea}</p>
                <p>Horario: {settings.businessHours}</p>
                <p>Instagram: {settings.instagram}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.2em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Zona Cero Garage</p>
          <p>Cuidado estetico profesional para vehiculos</p>
          <p>Copyright {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

'use client'
import Image from 'next/image'

const Hero = () => {
  // Branding Zona Cero Garage
  return (
    <section className="bg-primary bg-gradient-to-br from-black via-gray-900 to-gray-800 min-h-[calc(100vh-4rem)] bg-no-repeat">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-4 px-4 pt-16 pb-10 md:grid-cols-2 lg:p-4">
        <div className="flex min-h-48 flex-col justify-between lg:min-h-56 lg:max-w-[33.75rem]">
          <h1>
            <span className="text-accent mb-2 block text-4xl font-extrabold tracking-tight">Zona Cero Garage</span>
            <span className="text-neutral block text-2xl font-semibold">Detailing Automotriz Premium</span>
          </h1>
          <h2 className="text-neutral mt-4 text-lg font-light">
            Eleva tu auto a su máximo nivel: restauración, protección y estética profesional para apasionados del detalle.
          </h2>
          <div className="mt-8 flex flex-wrap gap-6">
            <a
              href="#contact"
              aria-label="Solicitar presupuesto"
              className="bg-accent min-w-40 cursor-pointer rounded-lg px-6 py-3 text-center text-base font-bold text-[#00071E] shadow-lg hover:scale-105 transition-transform">
              Solicitar presupuesto
            </a>
            <a
              href="#services"
              aria-label="Ver servicios"
              className="text-neutral bg-secondary cursor-pointer rounded-lg px-6 py-3 text-base font-semibold border border-accent hover:bg-accent/10 transition-colors">
              Ver servicios
            </a>
          </div>
        </div>
        <div className="flex min-h-[18.75rem] items-center justify-center lg:min-h-[35rem]">
          <div className="relative size-56 sm:size-60 md:size-[20rem] lg:size-[25.75rem] rounded-full overflow-hidden shadow-2xl border-4 border-accent">
            <Image
              src="/images/gallery/vertical-1.jpg"
              fill={true}
              priority={true}
              sizes="(min-width: 1024px) 25.75rem, (min-width: 768px) 20rem, (min-width: 640px) 15rem, 14rem"
              alt="Zona Cero Garage - Detailing Automotriz Premium"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

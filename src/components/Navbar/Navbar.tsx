'use client'

import { brand, navLinks } from '@/appData/garage'
import { BurgerIcon, CloseIcon } from '@/utils/icons'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050608]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/#inicio"
          className="flex min-w-0 items-center gap-3 sm:gap-4"
          onClick={() => setIsOpen(false)}>
          <span className="relative size-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#0b0d10] shadow-[0_14px_40px_rgba(0,0,0,0.28)] sm:size-11 lg:size-12">
            <Image
              src={brand.logo}
              alt="Logo Garage Zona Cero"
              fill
              className="object-contain p-1.5"
              sizes="(min-width: 1024px) 48px, 40px"
            />
          </span>
          <div className="min-w-0">
            <p className="display-font truncate text-sm leading-none tracking-[0.1em] text-ink sm:text-lg sm:tracking-[0.14em] lg:text-xl lg:tracking-[0.16em]">
              {brand.name}
            </p>
            <p className="eyebrow mt-1 hidden text-[0.62rem] text-muted sm:block">
              Detailing premium
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 xl:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors duration-300 hover:text-ink">
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-muted transition hover:border-[rgba(197,154,90,0.28)] hover:text-ink">
            Panel
          </Link>
          <Link
            href={brand.primaryCta.href}
            className="cta-primary rounded-full px-5 py-3 text-sm font-semibold">
            Agendar
          </Link>
        </div>

        <button
          type="button"
          aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink sm:size-11 xl:hidden"
          onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? <CloseIcon /> : <BurgerIcon />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-[#07090c]/98 xl:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="section-shell px-3 py-3 sm:px-4">
              <div className="relative z-10 flex flex-col gap-3">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-base font-medium text-ink transition-colors duration-300 hover:border-[rgba(197,154,90,0.28)] hover:bg-white/10"
                    onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={brand.primaryCta.href}
                  className="cta-primary mt-1 rounded-2xl px-4 py-4 text-center text-base font-semibold"
                  onClick={() => setIsOpen(false)}>
                  {brand.primaryCta.label}
                </Link>
                <Link
                  href="/admin"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-base font-semibold text-muted transition-colors duration-300 hover:border-[rgba(197,154,90,0.28)] hover:bg-white/10 hover:text-ink"
                  onClick={() => setIsOpen(false)}>
                  Ingresar al panel
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

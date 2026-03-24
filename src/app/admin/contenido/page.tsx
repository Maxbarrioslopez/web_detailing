import AdminNotice from '@/components/Admin/AdminNotice'
import {
  createServiceAction,
  createTestimonialAction,
  deleteServiceAction,
  deleteTestimonialAction,
  updateClosingCtaAction,
  updateHeroContentAction,
  updateSectionIntrosAction,
  updateServiceAction,
  updateTestimonialAction,
} from '@/actions/admin'
import { SERVICE_ICON_OPTIONS } from '@/lib/site-schema'
import { getSiteContent } from '@/lib/site-store'

type ContentPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const fieldClassName =
  'mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none'

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export default async function AdminContentPage({ searchParams }: ContentPageProps) {
  const params = searchParams ? await searchParams : undefined
  const siteContent = await getSiteContent()

  return (
    <>
      <section className="section-shell px-5 py-6 sm:px-6 sm:py-7">
        <div className="relative z-10 space-y-5">
          <div className="space-y-3">
            <p className="eyebrow text-xs font-semibold text-accent">Contenido web</p>
            <h1 className="display-font text-4xl leading-tight text-ink sm:text-5xl">
              Editar la landing sin tocar archivos.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted">
              El contenido visible del sitio ahora sale de una capa editable: hero, servicios,
              testimonios, textos de seccion y CTA de cierre.
            </p>
          </div>

          <AdminNotice
            message={getSingleValue(params?.notice)}
            type={getSingleValue(params?.noticeType)}
          />
        </div>
      </section>

      <section className="grid gap-6">
        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
            Hero principal
          </p>
          <form action={updateHeroContentAction} className="mt-5 grid gap-4">
            <input type="hidden" name="redirectTo" value="/admin/contenido" />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-muted">
                Eyebrow
                <input name="eyebrow" defaultValue={siteContent.hero.eyebrow} className={fieldClassName} />
              </label>
              <label className="text-sm text-muted">
                Titulo
                <input name="title" defaultValue={siteContent.hero.title} className={fieldClassName} />
              </label>
            </div>
            <label className="text-sm text-muted">
              Subtitulo
              <input name="subtitle" defaultValue={siteContent.hero.subtitle} className={fieldClassName} />
            </label>
            <label className="text-sm text-muted">
              Descripcion
              <textarea
                name="description"
                rows={4}
                defaultValue={siteContent.hero.description}
                className={`${fieldClassName} resize-none`}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="text-sm text-muted">
                CTA principal
                <input
                  name="primaryCtaLabel"
                  defaultValue={siteContent.hero.primaryCtaLabel}
                  className={fieldClassName}
                />
              </label>
              <label className="text-sm text-muted">
                Href principal
                <input
                  name="primaryCtaHref"
                  defaultValue={siteContent.hero.primaryCtaHref}
                  className={fieldClassName}
                />
              </label>
              <label className="text-sm text-muted">
                CTA secundario
                <input
                  name="secondaryCtaLabel"
                  defaultValue={siteContent.hero.secondaryCtaLabel}
                  className={fieldClassName}
                />
              </label>
              <label className="text-sm text-muted">
                Href secundario
                <input
                  name="secondaryCtaHref"
                  defaultValue={siteContent.hero.secondaryCtaHref}
                  className={fieldClassName}
                />
              </label>
            </div>
            <button type="submit" className="cta-primary rounded-2xl px-5 py-4 text-sm font-semibold">
              Guardar hero
            </button>
          </form>
        </div>

        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
            Textos de seccion
          </p>
          <form action={updateSectionIntrosAction} className="mt-5 grid gap-4">
            <input type="hidden" name="redirectTo" value="/admin/contenido" />
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-sm font-semibold text-ink">Servicios</p>
                <input name="servicesEyebrow" defaultValue={siteContent.servicesSection.eyebrow} className={fieldClassName} />
                <input name="servicesTitle" defaultValue={siteContent.servicesSection.title} className={fieldClassName} />
                <textarea
                  name="servicesDescription"
                  rows={4}
                  defaultValue={siteContent.servicesSection.description}
                  className={`${fieldClassName} resize-none`}
                />
              </div>
              <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-sm font-semibold text-ink">Galeria</p>
                <input name="galleryEyebrow" defaultValue={siteContent.gallerySection.eyebrow} className={fieldClassName} />
                <input name="galleryTitle" defaultValue={siteContent.gallerySection.title} className={fieldClassName} />
                <textarea
                  name="galleryDescription"
                  rows={4}
                  defaultValue={siteContent.gallerySection.description}
                  className={`${fieldClassName} resize-none`}
                />
              </div>
              <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-sm font-semibold text-ink">Testimonios</p>
                <input
                  name="testimonialsEyebrow"
                  defaultValue={siteContent.testimonialsSection.eyebrow}
                  className={fieldClassName}
                />
                <input
                  name="testimonialsTitle"
                  defaultValue={siteContent.testimonialsSection.title}
                  className={fieldClassName}
                />
                <textarea
                  name="testimonialsDescription"
                  rows={4}
                  defaultValue={siteContent.testimonialsSection.description}
                  className={`${fieldClassName} resize-none`}
                />
              </div>
            </div>
            <button type="submit" className="cta-primary rounded-2xl px-5 py-4 text-sm font-semibold">
              Guardar textos de seccion
            </button>
          </form>
        </div>

        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
            CTA final
          </p>
          <form action={updateClosingCtaAction} className="mt-5 grid gap-4">
            <input type="hidden" name="redirectTo" value="/admin/contenido" />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-muted">
                Eyebrow
                <input name="eyebrow" defaultValue={siteContent.closingCta.eyebrow} className={fieldClassName} />
              </label>
              <label className="text-sm text-muted">
                Titulo
                <input name="title" defaultValue={siteContent.closingCta.title} className={fieldClassName} />
              </label>
            </div>
            <label className="text-sm text-muted">
              Descripcion
              <textarea
                name="description"
                rows={4}
                defaultValue={siteContent.closingCta.description}
                className={`${fieldClassName} resize-none`}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="text-sm text-muted">
                CTA principal
                <input name="primaryLabel" defaultValue={siteContent.closingCta.primaryLabel} className={fieldClassName} />
              </label>
              <label className="text-sm text-muted">
                Href principal
                <input name="primaryHref" defaultValue={siteContent.closingCta.primaryHref} className={fieldClassName} />
              </label>
              <label className="text-sm text-muted">
                CTA secundario
                <input name="secondaryLabel" defaultValue={siteContent.closingCta.secondaryLabel} className={fieldClassName} />
              </label>
              <label className="text-sm text-muted">
                Href secundario
                <input name="secondaryHref" defaultValue={siteContent.closingCta.secondaryHref} className={fieldClassName} />
              </label>
            </div>
            <button type="submit" className="cta-primary rounded-2xl px-5 py-4 text-sm font-semibold">
              Guardar CTA final
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-4">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
                Servicios
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Bloques editables</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {siteContent.services.map((service) => {
              const updateAction = updateServiceAction.bind(null, service.id)
              const removeAction = deleteServiceAction.bind(null, service.id)

              return (
                <form
                  key={service.id}
                  action={updateAction}
                  className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                  <input type="hidden" name="redirectTo" value="/admin/contenido" />
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_220px]">
                      <label className="text-sm text-muted">
                        Nombre
                        <input name="name" defaultValue={service.name} className={fieldClassName} />
                      </label>
                      <label className="text-sm text-muted">
                        Icono
                        <select name="icon" defaultValue={service.icon} className={fieldClassName}>
                          {SERVICE_ICON_OPTIONS.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="text-sm text-muted">
                      Descripcion
                      <textarea
                        name="description"
                        rows={3}
                        defaultValue={service.description}
                        className={`${fieldClassName} resize-none`}
                      />
                    </label>
                    <label className="text-sm text-muted">
                      Beneficio
                      <textarea
                        name="benefit"
                        rows={3}
                        defaultValue={service.benefit}
                        className={`${fieldClassName} resize-none`}
                      />
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button type="submit" className="cta-secondary rounded-2xl px-4 py-3 text-sm font-semibold">
                        Guardar servicio
                      </button>
                      <button
                        type="submit"
                        formAction={removeAction}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#f7d0aa] transition hover:border-[rgba(241,184,127,0.3)]">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </form>
              )
            })}
          </div>

          <form action={createServiceAction} className="mt-5 rounded-[22px] border border-dashed border-white/10 bg-black/20 p-4">
            <input type="hidden" name="redirectTo" value="/admin/contenido" />
            <p className="text-sm font-semibold text-ink">Agregar servicio</p>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_220px]">
                <input name="name" placeholder="Nombre del servicio" className={fieldClassName} />
                <select name="icon" defaultValue="wash" className={fieldClassName}>
                  {SERVICE_ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                name="description"
                rows={3}
                placeholder="Descripcion breve"
                className={`${fieldClassName} resize-none`}
              />
              <textarea
                name="benefit"
                rows={3}
                placeholder="Beneficio principal para el cliente"
                className={`${fieldClassName} resize-none`}
              />
              <button type="submit" className="cta-primary rounded-2xl px-5 py-4 text-sm font-semibold">
                Agregar servicio
              </button>
            </div>
          </form>
        </div>

        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <div className="border-b border-white/8 pb-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
              Testimonios
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Opiniones editables</h2>
          </div>

          <div className="mt-5 grid gap-4">
            {siteContent.testimonials.map((testimonial) => {
              const updateAction = updateTestimonialAction.bind(null, testimonial.id)
              const removeAction = deleteTestimonialAction.bind(null, testimonial.id)

              return (
                <form
                  key={testimonial.id}
                  action={updateAction}
                  className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                  <input type="hidden" name="redirectTo" value="/admin/contenido" />
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <input name="name" defaultValue={testimonial.name} className={fieldClassName} />
                      <input name="vehicle" defaultValue={testimonial.vehicle} className={fieldClassName} />
                    </div>
                    <textarea
                      name="feedback"
                      rows={4}
                      defaultValue={testimonial.feedback}
                      className={`${fieldClassName} resize-none`}
                    />
                    <div className="flex flex-wrap gap-3">
                      <button type="submit" className="cta-secondary rounded-2xl px-4 py-3 text-sm font-semibold">
                        Guardar testimonio
                      </button>
                      <button
                        type="submit"
                        formAction={removeAction}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#f7d0aa] transition hover:border-[rgba(241,184,127,0.3)]">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </form>
              )
            })}
          </div>

          <form
            action={createTestimonialAction}
            className="mt-5 rounded-[22px] border border-dashed border-white/10 bg-black/20 p-4">
            <input type="hidden" name="redirectTo" value="/admin/contenido" />
            <p className="text-sm font-semibold text-ink">Agregar testimonio</p>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input name="name" placeholder="Nombre del cliente" className={fieldClassName} />
                <input name="vehicle" placeholder="Vehiculo" className={fieldClassName} />
              </div>
              <textarea
                name="feedback"
                rows={4}
                placeholder="Opinion o experiencia"
                className={`${fieldClassName} resize-none`}
              />
              <button type="submit" className="cta-primary rounded-2xl px-5 py-4 text-sm font-semibold">
                Agregar testimonio
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

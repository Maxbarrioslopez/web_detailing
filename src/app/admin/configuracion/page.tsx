import AdminNotice from '@/components/Admin/AdminNotice'
import { updateSettingsAction } from '@/actions/admin'
import { getRuntimeFeatureState } from '@/lib/runtime-config'
import { getSiteSettings } from '@/lib/site-store'

type ConfigPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const fieldClassName =
  'mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none'

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export default async function AdminConfigPage({ searchParams }: ConfigPageProps) {
  const params = searchParams ? await searchParams : undefined
  const settings = await getSiteSettings()
  const runtime = getRuntimeFeatureState()

  return (
    <>
      <section className="section-shell px-5 py-6 sm:px-6 sm:py-7">
        <div className="relative z-10 space-y-5">
          <div className="space-y-3">
            <p className="eyebrow text-xs font-semibold text-accent">Configuracion</p>
            <h1 className="display-font text-4xl leading-tight text-ink sm:text-5xl">
              Datos de contacto y operacion.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted">
              Estos datos se reflejan en el footer, el flujo de reserva y la demo de contacto del
              sitio publico.
            </p>
          </div>

          <AdminNotice
            message={getSingleValue(params?.notice)}
            type={getSingleValue(params?.noticeType)}
          />
        </div>
      </section>

      <section className="glass-panel rounded-[28px] p-5 sm:p-6">
        <form action={updateSettingsAction} className="grid gap-4">
          <input type="hidden" name="redirectTo" value="/admin/configuracion" />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-muted">
              WhatsApp
              <input name="whatsapp" defaultValue={settings.whatsapp} className={fieldClassName} />
            </label>
            <label className="text-sm text-muted">
              Email
              <input name="email" defaultValue={settings.email} className={fieldClassName} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-muted">
              Direccion o punto de atencion
              <input name="address" defaultValue={settings.address} className={fieldClassName} />
            </label>
            <label className="text-sm text-muted">
              Zona de cobertura
              <input
                name="serviceArea"
                defaultValue={settings.serviceArea}
                className={fieldClassName}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-muted">
              Horarios
              <input
                name="businessHours"
                defaultValue={settings.businessHours}
                className={fieldClassName}
              />
            </label>
            <label className="text-sm text-muted">
              Instagram
              <input
                name="instagram"
                defaultValue={settings.instagram}
                className={fieldClassName}
              />
            </label>
          </div>

          <label className="text-sm text-muted">
            Facebook u otra red
            <input name="facebook" defaultValue={settings.facebook} className={fieldClassName} />
          </label>

          <label className="text-sm text-muted">
            Texto breve de contacto
            <textarea
              name="contactNote"
              rows={5}
              defaultValue={settings.contactNote}
              className={`${fieldClassName} resize-none`}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            <div className="metal-card rounded-[22px] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-accent">WhatsApp</p>
              <p className="mt-3 text-sm leading-7 text-muted">{settings.whatsapp}</p>
            </div>
            <div className="metal-card rounded-[22px] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-accent">Cobertura</p>
              <p className="mt-3 text-sm leading-7 text-muted">{settings.serviceArea}</p>
            </div>
            <div className="metal-card rounded-[22px] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-accent">Horario</p>
              <p className="mt-3 text-sm leading-7 text-muted">{settings.businessHours}</p>
            </div>
            <div className="metal-card rounded-[22px] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-accent">Modo</p>
              <p className="mt-3 text-sm leading-7 text-muted">
                {runtime.demoMode ? 'DEMO_MODE activo' : 'Modo protegido'}
              </p>
            </div>
            <div className="metal-card rounded-[22px] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-accent">
                Persistencia
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">{runtime.dataProvider}</p>
            </div>
            <div className="metal-card rounded-[22px] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-accent">
                Supabase
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                {runtime.supabaseReady
                  ? `Listo para usar bucket ${runtime.storageBucket}`
                  : 'Pendiente de credenciales'}
              </p>
            </div>
          </div>

          <button type="submit" className="cta-primary rounded-2xl px-5 py-4 text-sm font-semibold">
            Guardar configuracion
          </button>
        </form>
      </section>
    </>
  )
}

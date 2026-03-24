import AdminNotice from '@/components/Admin/AdminNotice'
import GalleryItemEditor from '@/components/Admin/GalleryItemEditor'
import GalleryUploadForm from '@/components/Admin/GalleryUploadForm'
import { getGalleryItems } from '@/lib/site-store'

type GalleryPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export default async function AdminGalleryPage({ searchParams }: GalleryPageProps) {
  const params = searchParams ? await searchParams : undefined
  const galleryItems = await getGalleryItems()
  const featuredItems = galleryItems.filter((item) => item.featured)

  return (
    <>
      <section className="section-shell px-5 py-6 sm:px-6 sm:py-7">
        <div className="relative z-10 space-y-5">
          <div className="space-y-3">
            <p className="eyebrow text-xs font-semibold text-accent">Galeria</p>
            <h1 className="display-font text-4xl leading-tight text-ink sm:text-5xl">
              Gestion realista de imagenes.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted">
              Sube, reemplaza, ordena y marca imagenes destacadas. El flujo queda listo para
              cambiar luego a storage externo sin rehacer la interfaz.
            </p>
          </div>

          <AdminNotice
            message={getSingleValue(params?.notice)}
            type={getSingleValue(params?.noticeType)}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="metal-card rounded-[22px] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-accent">Total</p>
              <p className="display-font mt-3 text-3xl text-ink">{galleryItems.length}</p>
            </div>
            <div className="metal-card rounded-[22px] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-accent">Destacadas</p>
              <p className="display-font mt-3 text-3xl text-ink">{featuredItems.length}</p>
            </div>
            <div className="metal-card rounded-[22px] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-accent">Storage</p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Demo local en `public/uploads/gallery`, listo para intercambiar por S3 o Supabase.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[28px] p-5 sm:p-6">
        <div className="border-b border-white/8 pb-4">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
            Subir imagen
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Nueva carga</h2>
        </div>
        <div className="mt-5">
          <GalleryUploadForm />
        </div>
      </section>

      <section className="space-y-4">
        {galleryItems.length > 0 ? (
          galleryItems.map((item) => <GalleryItemEditor key={item.id} item={item} />)
        ) : (
          <div className="glass-panel rounded-[28px] p-6 text-sm leading-7 text-muted">
            Aun no hay imagenes cargadas en la galeria demo.
          </div>
        )}
      </section>
    </>
  )
}

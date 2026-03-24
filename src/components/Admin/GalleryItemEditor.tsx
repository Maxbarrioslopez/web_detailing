'use client'

import { deleteGalleryItemAction, updateGalleryItemAction } from '@/actions/admin'
import type { GalleryItem } from '@/lib/site-schema'
import { useState } from 'react'

const fieldClassName =
  'mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-[0.94rem] text-ink outline-none transition focus:border-[rgba(197,154,90,0.42)] focus:bg-[rgba(255,255,255,0.06)]'

type GalleryItemEditorProps = {
  item: GalleryItem
}

const GalleryItemEditor = ({ item }: GalleryItemEditorProps) => {
  const [previewUrl, setPreviewUrl] = useState('')
  const action = updateGalleryItemAction.bind(null, item.id)
  const deleteAction = deleteGalleryItemAction.bind(null, item.id)

  return (
    <article className="glass-panel rounded-[24px] p-4 sm:p-5">
      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-[20px] border border-white/8 bg-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl || item.imageUrl}
              alt={item.alt}
              className="h-[220px] w-full object-cover"
            />
          </div>
          <div className="grid gap-2 text-xs uppercase tracking-[0.18em] text-muted sm:grid-cols-2 xl:grid-cols-1">
            <span>Orden {item.sortOrder}</span>
            <span>{item.featured ? 'Destacada' : 'Galeria'}</span>
          </div>
        </div>

        <div className="space-y-4">
          <form action={action} className="grid gap-4">
            <input type="hidden" name="redirectTo" value="/admin/galeria" />

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-muted">
                Titulo
                <input name="title" defaultValue={item.title} className={fieldClassName} />
              </label>
              <label className="text-sm text-muted">
                Categoria
                <input name="category" defaultValue={item.category} className={fieldClassName} />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-muted">
                Texto alternativo
                <input name="alt" defaultValue={item.alt} className={fieldClassName} />
              </label>
              <label className="text-sm text-muted">
                Orden
                <input
                  type="number"
                  min="1"
                  step="1"
                  name="sortOrder"
                  defaultValue={item.sortOrder}
                  className={fieldClassName}
                />
              </label>
            </div>

            <label className="text-sm text-muted">
              Descripcion
              <textarea
                name="description"
                rows={4}
                defaultValue={item.description}
                className={`${fieldClassName} resize-none`}
              />
            </label>

            <label className="text-sm text-muted">
              Reemplazar imagen
              <input
                type="file"
                name="image"
                accept="image/*"
                className={fieldClassName}
                onChange={(event) => {
                  const nextFile = event.target.files?.[0]
                  setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : '')
                }}
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-3 text-sm text-ink">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={item.featured}
                  className="size-4 rounded border-white/10"
                />
                Mostrar como destacada
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="cta-primary rounded-2xl px-5 py-3 text-sm font-semibold">
                  Guardar cambios
                </button>
                <button
                  type="submit"
                  formAction={deleteAction}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[#f7d0aa] transition hover:border-[rgba(241,184,127,0.3)] hover:bg-[rgba(241,184,127,0.08)]">
                  Eliminar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </article>
  )
}

export default GalleryItemEditor

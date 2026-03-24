'use client'

import { createGalleryItemAction } from '@/actions/admin'
import { useState } from 'react'

const fieldClassName =
  'mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-[0.94rem] text-ink outline-none transition focus:border-[rgba(197,154,90,0.42)] focus:bg-[rgba(255,255,255,0.06)]'

const GalleryUploadForm = () => {
  const [previewUrl, setPreviewUrl] = useState('')

  return (
    <form action={createGalleryItemAction} className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <input type="hidden" name="redirectTo" value="/admin/galeria" />

      <div className="rounded-[22px] border border-dashed border-white/12 bg-black/20 p-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent">
          Preview
        </p>
        <div className="mt-4 flex min-h-[220px] items-center justify-center overflow-hidden rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)]">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Preview de nueva imagen"
              className="h-full w-full object-cover"
            />
          ) : (
            <p className="px-6 text-center text-sm leading-7 text-muted">
              Selecciona una imagen y veras aqui la vista previa antes de guardarla.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        <label className="text-sm text-muted">
          Imagen
          <input
            type="file"
            name="image"
            accept="image/*"
            className={fieldClassName}
            onChange={(event) => {
              const nextFile = event.target.files?.[0]
              setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : '')
            }}
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-muted">
            Titulo
            <input name="title" className={fieldClassName} placeholder="Titulo interno o visible" />
          </label>
          <label className="text-sm text-muted">
            Categoria
            <input name="category" className={fieldClassName} placeholder="Exterior, interior..." />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-muted">
            Texto alternativo
            <input name="alt" className={fieldClassName} placeholder="Descripcion SEO/alt" />
          </label>
          <label className="text-sm text-muted">
            Orden
            <input
              type="number"
              min="1"
              step="1"
              name="sortOrder"
              className={fieldClassName}
              defaultValue="10"
            />
          </label>
        </div>

        <label className="text-sm text-muted">
          Descripcion
          <textarea
            name="description"
            rows={4}
            className={`${fieldClassName} resize-none`}
            placeholder="Contexto breve del trabajo o imagen"
          />
        </label>

        <label className="inline-flex items-center gap-3 text-sm text-ink">
          <input type="checkbox" name="featured" className="size-4 rounded border-white/10" />
          Marcar como destacada en la landing
        </label>

        <button
          type="submit"
          className="cta-primary inline-flex items-center justify-center rounded-2xl px-5 py-4 text-sm font-semibold">
          Guardar imagen
        </button>
      </div>
    </form>
  )
}

export default GalleryUploadForm

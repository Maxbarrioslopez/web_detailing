'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { withAdminNotice } from '@/lib/admin-notice'
import { deleteStoredImage, replaceStoredImage, saveUploadedImage } from '@/lib/media-storage'
import {
  SERVICE_ICON_OPTIONS,
  type BookingStatus,
  type SiteContent,
  type SiteSettings,
} from '@/lib/site-schema'
import {
  createBooking,
  createGalleryItem,
  createProduct,
  deleteBooking,
  deleteGalleryItem,
  deleteProduct,
  deleteServiceProductUsage,
  getGalleryItemById,
  getSiteContent,
  saveSiteContent,
  getSiteSettings,
  saveSiteSettings,
  updateProduct,
  updateBooking,
  updateGalleryItem,
  upsertServiceProductUsage,
} from '@/lib/site-store'

const getValue = (formData: FormData, key: string) => formData.get(key)?.toString().trim() || ''
const getCheckboxValue = (formData: FormData, key: string) => formData.get(key)?.toString() === 'on'
const getFileValue = (formData: FormData, key: string) => formData.get(key)
const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const redirectWithNotice = (path: string, type: 'success' | 'error', message: string) => {
  redirect(withAdminNotice(path, type, message))
}

const revalidateAdminAndSite = () => {
  revalidatePath('/')
  revalidatePath('/agendar')
  revalidatePath('/mi-reserva')
  revalidatePath('/admin')
  revalidatePath('/admin/reservas')
  revalidatePath('/admin/clientes')
  revalidatePath('/admin/galeria')
  revalidatePath('/admin/contenido')
  revalidatePath('/admin/productos')
  revalidatePath('/admin/configuracion')
}

export const createManualBookingAction = async (formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/reservas'

  try {
    const name = getValue(formData, 'name')
    const rut = getValue(formData, 'rut')
    const phone = getValue(formData, 'phone')
    const vehicleBrand = getValue(formData, 'vehicleBrand')
    const vehicleModel = getValue(formData, 'vehicleModel')
    const vehicleYear = Number(getValue(formData, 'vehicleYear') || new Date().getFullYear())
    const appointmentDate = getValue(formData, 'appointmentDate')
    const appointmentWindow = getValue(formData, 'appointmentWindow') || 'am'
    const status = (getValue(formData, 'status') || 'pending') as BookingStatus

    if (!name || !rut || !phone || !vehicleBrand || !vehicleModel || !appointmentDate) {
      throw new Error('Completa los campos principales para crear la reserva.')
    }

    await createBooking({
      status,
      clientType: 'particular',
      name,
      rut,
      phone,
      email: '',
      companyName: '',
      companyContact: '',
      secondaryContactName: '',
      secondaryContactPhone: '',
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      vehicleType: getValue(formData, 'vehicleType') || 'Sedan',
      vehiclePlate: getValue(formData, 'vehiclePlate'),
      vehicleUse: getValue(formData, 'vehicleUse') || 'Particular',
      bookingMode: 'custom',
      selectedPack: '',
      individualServices: [],
      addOns: [],
      appointmentDate,
      appointmentWindow: appointmentWindow as 'am' | 'pm',
      handoffOption: 'same_day',
      pickupAddress: '',
      pickupZone: '',
      message: getValue(formData, 'message') || 'Reserva creada manualmente desde el panel admin.',
      internalNotes: getValue(formData, 'internalNotes'),
    })

    revalidateAdminAndSite()
  } catch (error) {
    return redirectWithNotice(
      redirectTo,
      'error',
      error instanceof Error ? error.message : 'No pudimos crear la reserva.',
    )
  }

  redirectWithNotice(redirectTo, 'success', 'Reserva manual creada correctamente.')
}

export const updateBookingStatusAction = async (id: string, formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/reservas'

  try {
    await updateBooking(id, {
      status: getValue(formData, 'status') as BookingStatus,
    })

    revalidateAdminAndSite()
  } catch (error) {
    return redirectWithNotice(
      redirectTo,
      'error',
      error instanceof Error ? error.message : 'No pudimos actualizar el estado.',
    )
  }

  redirectWithNotice(redirectTo, 'success', 'Estado de reserva actualizado.')
}

export const updateBookingDetailAction = async (id: string, formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || `/admin/reservas/${id}`

  try {
    await updateBooking(id, {
      status: getValue(formData, 'status') as BookingStatus,
      appointmentDate: getValue(formData, 'appointmentDate'),
      appointmentWindow: (getValue(formData, 'appointmentWindow') || 'am') as 'am' | 'pm',
      internalNotes: getValue(formData, 'internalNotes'),
    })

    revalidateAdminAndSite()
  } catch (error) {
    return redirectWithNotice(
      redirectTo,
      'error',
      error instanceof Error ? error.message : 'No pudimos guardar los cambios.',
    )
  }

  redirectWithNotice(redirectTo, 'success', 'Detalle de reserva actualizado.')
}

export const deleteBookingAction = async (id: string, formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/reservas'

  try {
    await deleteBooking(id)
    revalidateAdminAndSite()
  } catch {
    return redirectWithNotice(redirectTo, 'error', 'No pudimos eliminar la reserva.')
  }

  redirectWithNotice(redirectTo, 'success', 'Reserva eliminada del panel.')
}

export const createGalleryItemAction = async (formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/galeria'

  try {
    const file = getFileValue(formData, 'image')

    if (!(file instanceof File) || file.size === 0) {
      throw new Error('Selecciona una imagen para subir.')
    }

    const imageUrl = await saveUploadedImage(file)

    await createGalleryItem({
      title: getValue(formData, 'title') || 'Nueva imagen',
      category: getValue(formData, 'category') || 'Galeria',
      description: getValue(formData, 'description') || 'Imagen agregada desde el panel admin.',
      alt: getValue(formData, 'alt') || 'Imagen de galeria Garage Zona Cero',
      imageUrl,
      featured: getCheckboxValue(formData, 'featured'),
      sortOrder: Number(getValue(formData, 'sortOrder') || 99),
    })

    revalidateAdminAndSite()
  } catch (error) {
    return redirectWithNotice(
      redirectTo,
      'error',
      error instanceof Error ? error.message : 'No pudimos subir la imagen.',
    )
  }

  redirectWithNotice(redirectTo, 'success', 'Imagen agregada a la galeria.')
}

export const updateGalleryItemAction = async (id: string, formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/galeria'

  try {
    const currentItem = await getGalleryItemById(id)

    if (!currentItem) {
      throw new Error('La imagen solicitada no existe.')
    }

    const file = getFileValue(formData, 'image')
    let imageUrl = currentItem.imageUrl

    if (file instanceof File && file.size > 0) {
      imageUrl = await replaceStoredImage(currentItem.imageUrl, file)
    }

    await updateGalleryItem(id, {
      title: getValue(formData, 'title'),
      category: getValue(formData, 'category'),
      description: getValue(formData, 'description'),
      alt: getValue(formData, 'alt'),
      imageUrl,
      featured: getCheckboxValue(formData, 'featured'),
      sortOrder: Number(getValue(formData, 'sortOrder') || currentItem.sortOrder),
    })

    revalidateAdminAndSite()
  } catch (error) {
    return redirectWithNotice(
      redirectTo,
      'error',
      error instanceof Error ? error.message : 'No pudimos actualizar la imagen.',
    )
  }

  redirectWithNotice(redirectTo, 'success', 'Imagen actualizada.')
}

export const deleteGalleryItemAction = async (id: string, formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/galeria'

  try {
    const removedItem = await deleteGalleryItem(id)

    if (removedItem) {
      await deleteStoredImage(removedItem.imageUrl)
    }

    revalidateAdminAndSite()
  } catch {
    return redirectWithNotice(redirectTo, 'error', 'No pudimos eliminar la imagen.')
  }

  redirectWithNotice(redirectTo, 'success', 'Imagen eliminada de la galeria.')
}

const updateSiteContent = async (
  updater: (currentContent: SiteContent) => SiteContent,
  redirectTo: string,
  successMessage: string,
) => {
  try {
    const currentContent = await getSiteContent()
    const nextContent = updater(currentContent)

    await saveSiteContent(nextContent)
    revalidateAdminAndSite()
  } catch (error) {
    return redirectWithNotice(
      redirectTo,
      'error',
      error instanceof Error ? error.message : 'No pudimos guardar el contenido.',
    )
  }

  redirectWithNotice(redirectTo, 'success', successMessage)
}

export const updateHeroContentAction = async (formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/contenido'

  await updateSiteContent(
    (currentContent) => ({
      ...currentContent,
      hero: {
        eyebrow: getValue(formData, 'eyebrow'),
        title: getValue(formData, 'title'),
        subtitle: getValue(formData, 'subtitle'),
        description: getValue(formData, 'description'),
        primaryCtaLabel: getValue(formData, 'primaryCtaLabel'),
        primaryCtaHref: getValue(formData, 'primaryCtaHref'),
        secondaryCtaLabel: getValue(formData, 'secondaryCtaLabel'),
        secondaryCtaHref: getValue(formData, 'secondaryCtaHref'),
      },
    }),
    redirectTo,
    'Hero principal actualizado.',
  )
}

export const updateSectionIntrosAction = async (formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/contenido'

  await updateSiteContent(
    (currentContent) => ({
      ...currentContent,
      servicesSection: {
        eyebrow: getValue(formData, 'servicesEyebrow'),
        title: getValue(formData, 'servicesTitle'),
        description: getValue(formData, 'servicesDescription'),
      },
      gallerySection: {
        eyebrow: getValue(formData, 'galleryEyebrow'),
        title: getValue(formData, 'galleryTitle'),
        description: getValue(formData, 'galleryDescription'),
      },
      testimonialsSection: {
        eyebrow: getValue(formData, 'testimonialsEyebrow'),
        title: getValue(formData, 'testimonialsTitle'),
        description: getValue(formData, 'testimonialsDescription'),
      },
    }),
    redirectTo,
    'Textos de secciones actualizados.',
  )
}

export const updateClosingCtaAction = async (formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/contenido'

  await updateSiteContent(
    (currentContent) => ({
      ...currentContent,
      closingCta: {
        eyebrow: getValue(formData, 'eyebrow'),
        title: getValue(formData, 'title'),
        description: getValue(formData, 'description'),
        primaryLabel: getValue(formData, 'primaryLabel'),
        primaryHref: getValue(formData, 'primaryHref'),
        secondaryLabel: getValue(formData, 'secondaryLabel'),
        secondaryHref: getValue(formData, 'secondaryHref'),
      },
    }),
    redirectTo,
    'CTA final actualizado.',
  )
}

export const createServiceAction = async (formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/contenido'
  const selectedIcon = getValue(formData, 'icon')

  await updateSiteContent(
    (currentContent) => ({
      ...currentContent,
      services: [
        ...currentContent.services,
        {
          id: createId('service'),
          name: getValue(formData, 'name'),
          description: getValue(formData, 'description'),
          benefit: getValue(formData, 'benefit'),
          icon: SERVICE_ICON_OPTIONS.includes(selectedIcon as (typeof SERVICE_ICON_OPTIONS)[number])
            ? (selectedIcon as (typeof SERVICE_ICON_OPTIONS)[number])
            : 'wash',
        },
      ],
    }),
    redirectTo,
    'Servicio agregado al sitio.',
  )
}

export const updateServiceAction = async (id: string, formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/contenido'
  const selectedIcon = getValue(formData, 'icon')

  await updateSiteContent(
    (currentContent) => ({
      ...currentContent,
      services: currentContent.services.map((service) =>
        service.id === id
          ? {
              ...service,
              name: getValue(formData, 'name'),
              description: getValue(formData, 'description'),
              benefit: getValue(formData, 'benefit'),
              icon: SERVICE_ICON_OPTIONS.includes(
                selectedIcon as (typeof SERVICE_ICON_OPTIONS)[number],
              )
                ? (selectedIcon as (typeof SERVICE_ICON_OPTIONS)[number])
                : service.icon,
            }
          : service,
      ),
    }),
    redirectTo,
    'Servicio actualizado.',
  )
}

export const deleteServiceAction = async (id: string, formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/contenido'

  await updateSiteContent(
    (currentContent) => ({
      ...currentContent,
      services: currentContent.services.filter((service) => service.id !== id),
    }),
    redirectTo,
    'Servicio eliminado.',
  )
}

export const createTestimonialAction = async (formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/contenido'

  await updateSiteContent(
    (currentContent) => ({
      ...currentContent,
      testimonials: [
        ...currentContent.testimonials,
        {
          id: createId('testimonial'),
          name: getValue(formData, 'name'),
          vehicle: getValue(formData, 'vehicle'),
          feedback: getValue(formData, 'feedback'),
        },
      ],
    }),
    redirectTo,
    'Testimonio agregado.',
  )
}

export const updateTestimonialAction = async (id: string, formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/contenido'

  await updateSiteContent(
    (currentContent) => ({
      ...currentContent,
      testimonials: currentContent.testimonials.map((testimonial) =>
        testimonial.id === id
          ? {
              ...testimonial,
              name: getValue(formData, 'name'),
              vehicle: getValue(formData, 'vehicle'),
              feedback: getValue(formData, 'feedback'),
            }
          : testimonial,
      ),
    }),
    redirectTo,
    'Testimonio actualizado.',
  )
}

export const deleteTestimonialAction = async (id: string, formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/contenido'

  await updateSiteContent(
    (currentContent) => ({
      ...currentContent,
      testimonials: currentContent.testimonials.filter((testimonial) => testimonial.id !== id),
    }),
    redirectTo,
    'Testimonio eliminado.',
  )
}

export const updateSettingsAction = async (formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/configuracion'

  try {
    const currentSettings = await getSiteSettings()
    const nextSettings: SiteSettings = {
      ...currentSettings,
      whatsapp: getValue(formData, 'whatsapp'),
      email: getValue(formData, 'email'),
      address: getValue(formData, 'address'),
      serviceArea: getValue(formData, 'serviceArea'),
      businessHours: getValue(formData, 'businessHours'),
      instagram: getValue(formData, 'instagram'),
      facebook: getValue(formData, 'facebook'),
      contactNote: getValue(formData, 'contactNote'),
    }

    await saveSiteSettings(nextSettings)
    revalidateAdminAndSite()
  } catch {
    return redirectWithNotice(redirectTo, 'error', 'No pudimos actualizar la configuracion.')
  }

  redirectWithNotice(redirectTo, 'success', 'Configuracion actualizada.')
}

export const createProductAction = async (formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/productos'

  try {
    await createProduct({
      name: getValue(formData, 'name'),
      category: getValue(formData, 'category'),
      unit: getValue(formData, 'unit'),
      stockCurrent: Number(getValue(formData, 'stockCurrent') || 0),
      stockMinimum: Number(getValue(formData, 'stockMinimum') || 0),
      unitCost: Number(getValue(formData, 'unitCost') || 0),
      active: getCheckboxValue(formData, 'active'),
    })

    revalidateAdminAndSite()
  } catch (error) {
    return redirectWithNotice(
      redirectTo,
      'error',
      error instanceof Error ? error.message : 'No pudimos crear el producto.',
    )
  }

  redirectWithNotice(redirectTo, 'success', 'Producto creado.')
}

export const updateProductAction = async (id: string, formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/productos'

  try {
    await updateProduct(id, {
      name: getValue(formData, 'name'),
      category: getValue(formData, 'category'),
      unit: getValue(formData, 'unit'),
      stockCurrent: Number(getValue(formData, 'stockCurrent') || 0),
      stockMinimum: Number(getValue(formData, 'stockMinimum') || 0),
      unitCost: Number(getValue(formData, 'unitCost') || 0),
      active: getCheckboxValue(formData, 'active'),
    })

    revalidateAdminAndSite()
  } catch (error) {
    return redirectWithNotice(
      redirectTo,
      'error',
      error instanceof Error ? error.message : 'No pudimos actualizar el producto.',
    )
  }

  redirectWithNotice(redirectTo, 'success', 'Producto actualizado.')
}

export const deleteProductAction = async (id: string, formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/productos'

  try {
    await deleteProduct(id)
    revalidateAdminAndSite()
  } catch {
    return redirectWithNotice(redirectTo, 'error', 'No pudimos eliminar el producto.')
  }

  redirectWithNotice(redirectTo, 'success', 'Producto eliminado.')
}

export const upsertServiceProductUsageAction = async (formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/productos'

  try {
    await upsertServiceProductUsage({
      id: getValue(formData, 'id') || undefined,
      serviceId: getValue(formData, 'serviceId'),
      productId: getValue(formData, 'productId'),
      estimatedQuantity: Number(getValue(formData, 'estimatedQuantity') || 0),
    })

    revalidateAdminAndSite()
  } catch {
    return redirectWithNotice(
      redirectTo,
      'error',
      'No pudimos guardar la asociacion entre servicio y producto.',
    )
  }

  redirectWithNotice(redirectTo, 'success', 'Consumo estimado actualizado.')
}

export const deleteServiceProductUsageAction = async (id: string, formData: FormData) => {
  const redirectTo = getValue(formData, 'redirectTo') || '/admin/productos'

  try {
    await deleteServiceProductUsage(id)
    revalidateAdminAndSite()
  } catch {
    return redirectWithNotice(redirectTo, 'error', 'No pudimos eliminar la asociacion.')
  }

  redirectWithNotice(redirectTo, 'success', 'Asociacion eliminada.')
}

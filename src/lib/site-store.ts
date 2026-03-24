import { readStoreFile, writeStoreFile } from '@/lib/file-store'
import {
  BOOKING_ACTIVE_STATUSES,
  type BookingHistoryEntry,
  type BookingRecord,
  type BookingStatus,
  type GalleryItem,
  type ProductRecord,
  type ServiceProductUsageRecord,
  type SiteContent,
  type SiteSettings,
  getDefaultGalleryItems,
  getDefaultProducts,
  getDefaultServiceProductUsage,
  getDefaultSiteContent,
  getDefaultSiteSettings,
} from '@/lib/site-schema'
import { createBookingAvailabilitySnapshot } from '@/utils/booking'
import {
  formatDateKey,
  getAvailableBookingWindows,
  getFormattedBookingDateLabel,
} from '@/utils/booking'

const BOOKINGS_FILE = 'bookings.json'
const GALLERY_FILE = 'gallery.json'
const SITE_CONTENT_FILE = 'site-content.json'
const SETTINGS_FILE = 'settings.json'
const PRODUCTS_FILE = 'products.json'
const SERVICE_USAGE_FILE = 'service-product-usage.json'

const isBlockingBookingStatus = (status: BookingStatus) =>
  BOOKING_ACTIVE_STATUSES.includes(status as (typeof BOOKING_ACTIVE_STATUSES)[number])

const sortBookings = (bookings: BookingRecord[]) =>
  [...bookings].sort((left, right) => {
    const leftDate = `${left.appointmentDate}-${left.appointmentWindow}`
    const rightDate = `${right.appointmentDate}-${right.appointmentWindow}`

    if (leftDate === rightDate) {
      return right.createdAt.localeCompare(left.createdAt)
    }

    return leftDate.localeCompare(rightDate)
  })

const sortGalleryItems = (items: GalleryItem[]) =>
  [...items].sort((left, right) => {
    if (left.sortOrder === right.sortOrder) {
      return left.createdAt.localeCompare(right.createdAt)
    }

    return left.sortOrder - right.sortOrder
  })

const sortProducts = (items: ProductRecord[]) =>
  [...items].sort((left, right) => left.name.localeCompare(right.name))

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const createLookupToken = () => Math.random().toString(36).slice(2, 10).toUpperCase()

const createHistoryEntry = (
  type: BookingHistoryEntry['type'],
  note: string,
): BookingHistoryEntry => ({
  id: createId('history'),
  createdAt: new Date().toISOString(),
  type,
  note,
})

const buildServiceLabel = (
  bookingMode: BookingRecord['bookingMode'],
  selectedPack: string,
  individualServices: string[],
) => {
  if (bookingMode === 'pack') {
    return selectedPack || 'Pack sin definir'
  }

  if (bookingMode === 'individual') {
    return individualServices.join(', ') || 'Servicios individuales'
  }

  return 'Evaluacion personalizada'
}

const normalizeBooking = (booking: Partial<BookingRecord> & { id: string }) => {
  const serviceLabel =
    booking.serviceLabel ||
    buildServiceLabel(
      booking.bookingMode || 'custom',
      booking.selectedPack || '',
      booking.individualServices || [],
    )

  return {
    ...booking,
    lookupToken: booking.lookupToken || createLookupToken(),
    serviceLabel,
    history: booking.history || [createHistoryEntry('created', 'Reserva sembrada en modo demo.')],
    internalNotes: booking.internalNotes || '',
    addOns: booking.addOns || [],
    individualServices: booking.individualServices || [],
    companyName: booking.companyName || '',
    companyContact: booking.companyContact || '',
    secondaryContactName: booking.secondaryContactName || '',
    secondaryContactPhone: booking.secondaryContactPhone || '',
    vehiclePlate: booking.vehiclePlate || '',
    vehicleUse: booking.vehicleUse || '',
    email: booking.email || '',
    pickupAddress: booking.pickupAddress || '',
    pickupZone: booking.pickupZone || '',
  } as BookingRecord
}

const findDuplicateSlot = (
  bookings: BookingRecord[],
  appointmentDate: string,
  appointmentWindow: string,
  excludeId?: string,
) =>
  bookings.find(
    (booking) =>
      booking.id !== excludeId &&
      booking.appointmentDate === appointmentDate &&
      booking.appointmentWindow === appointmentWindow &&
      isBlockingBookingStatus(booking.status),
  )

export const getSiteContent = async () =>
  readStoreFile<SiteContent>(SITE_CONTENT_FILE, getDefaultSiteContent())

export const saveSiteContent = async (content: SiteContent) => {
  await writeStoreFile(SITE_CONTENT_FILE, content)
  return content
}

export const getSiteSettings = async () =>
  readStoreFile<SiteSettings>(SETTINGS_FILE, getDefaultSiteSettings())

export const saveSiteSettings = async (settings: SiteSettings) => {
  await writeStoreFile(SETTINGS_FILE, settings)
  return settings
}

export const getGalleryItems = async () => {
  const items = await readStoreFile<GalleryItem[]>(GALLERY_FILE, getDefaultGalleryItems())
  return sortGalleryItems(items)
}

export const getGalleryItemById = async (id: string) => {
  const items = await getGalleryItems()
  return items.find((item) => item.id === id) || null
}

export const createGalleryItem = async (
  input: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const items = await getGalleryItems()
  const now = new Date().toISOString()

  const nextItem: GalleryItem = {
    ...input,
    id: createId('gallery'),
    createdAt: now,
    updatedAt: now,
  }

  const nextItems = sortGalleryItems([...items, nextItem])
  await writeStoreFile(GALLERY_FILE, nextItems)

  return nextItem
}

export const updateGalleryItem = async (
  id: string,
  updates: Partial<Omit<GalleryItem, 'id' | 'createdAt'>>,
) => {
  const items = await getGalleryItems()
  const currentItem = items.find((item) => item.id === id)

  if (!currentItem) {
    throw new Error('La imagen solicitada no existe.')
  }

  const nextItem: GalleryItem = {
    ...currentItem,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  const nextItems = sortGalleryItems(items.map((item) => (item.id === id ? nextItem : item)))
  await writeStoreFile(GALLERY_FILE, nextItems)

  return nextItem
}

export const deleteGalleryItem = async (id: string) => {
  const items = await getGalleryItems()
  const removedItem = items.find((item) => item.id === id) || null
  const nextItems = items.filter((item) => item.id !== id)

  await writeStoreFile(GALLERY_FILE, nextItems)

  return removedItem
}

export const getFeaturedGalleryItems = async (limit = 3) => {
  const items = await getGalleryItems()
  const featuredItems = items.filter((item) => item.featured)

  return (featuredItems.length > 0 ? featuredItems : items).slice(0, limit)
}

export const getBookings = async () => {
  const rawBookings = await readStoreFile<(Partial<BookingRecord> & { id: string })[]>(BOOKINGS_FILE, [])
  const normalizedBookings = rawBookings.map(normalizeBooking)
  return sortBookings(normalizedBookings)
}

export const getBookingById = async (id: string) => {
  const bookings = await getBookings()
  return bookings.find((booking) => booking.id === id) || null
}

export const findBookingForClientLookup = async ({
  rut,
  contactValue,
}: {
  rut: string
  contactValue: string
}) => {
  const bookings = await getBookings()
  const normalizedRut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase()
  const normalizedContact = contactValue.trim().toLowerCase()

  const matchingBookings = bookings.filter((booking) => {
    const bookingRut = booking.rut.replace(/\./g, '').replace(/-/g, '').toUpperCase()
    const matchesRut = bookingRut === normalizedRut
    const matchesContact =
      booking.phone.trim().toLowerCase() === normalizedContact ||
      booking.email.trim().toLowerCase() === normalizedContact ||
      booking.lookupToken.trim().toLowerCase() === normalizedContact

    return matchesRut && matchesContact
  })

  return (
    [...matchingBookings].sort((left, right) => {
      const leftPriority = isBlockingBookingStatus(left.status) ? 1 : 0
      const rightPriority = isBlockingBookingStatus(right.status) ? 1 : 0

      if (leftPriority !== rightPriority) {
        return rightPriority - leftPriority
      }

      return right.updatedAt.localeCompare(left.updatedAt)
    })[0] || null
  )
}

export const createBooking = async (
  input: Omit<BookingRecord, 'id' | 'createdAt' | 'updatedAt' | 'lookupToken' | 'history' | 'serviceLabel'>,
) => {
  const bookings = await getBookings()

  if (isBlockingBookingStatus(input.status)) {
    const duplicatedBooking = findDuplicateSlot(
      bookings,
      input.appointmentDate,
      input.appointmentWindow,
    )

    if (duplicatedBooking) {
      throw new Error('La fecha y ventana seleccionadas ya estan reservadas.')
    }
  }

  const now = new Date().toISOString()
  const nextBooking: BookingRecord = {
    ...input,
    id: createId('booking'),
    lookupToken: createLookupToken(),
    serviceLabel: buildServiceLabel(input.bookingMode, input.selectedPack, input.individualServices),
    history: [
      createHistoryEntry(
        'created',
        `Reserva creada para ${input.appointmentDate} (${input.appointmentWindow.toUpperCase()}).`,
      ),
    ],
    createdAt: now,
    updatedAt: now,
  }

  const nextBookings = sortBookings([...bookings, nextBooking])
  await writeStoreFile(BOOKINGS_FILE, nextBookings)

  return nextBooking
}

export const updateBooking = async (
  id: string,
  updates: Partial<Omit<BookingRecord, 'id' | 'createdAt' | 'lookupToken'>>,
) => {
  const bookings = await getBookings()
  const currentBooking = bookings.find((booking) => booking.id === id)

  if (!currentBooking) {
    throw new Error('La reserva solicitada no existe.')
  }

  const nextStatus = updates.status ?? currentBooking.status
  const nextDate = updates.appointmentDate ?? currentBooking.appointmentDate
  const nextWindow = updates.appointmentWindow ?? currentBooking.appointmentWindow

  if (isBlockingBookingStatus(nextStatus)) {
    const duplicatedBooking = findDuplicateSlot(bookings, nextDate, nextWindow, id)

    if (duplicatedBooking) {
      throw new Error('La fecha y ventana seleccionadas ya estan reservadas.')
    }
  }

  const historyEntries = [...currentBooking.history]

  if (updates.status && updates.status !== currentBooking.status) {
    historyEntries.push(
      createHistoryEntry(
        updates.status === 'cancelled' ? 'cancelled' : 'status_changed',
        `Estado actualizado de ${currentBooking.status} a ${updates.status}.`,
      ),
    )
  }

  if (
    (updates.appointmentDate && updates.appointmentDate !== currentBooking.appointmentDate) ||
    (updates.appointmentWindow && updates.appointmentWindow !== currentBooking.appointmentWindow)
  ) {
    historyEntries.push(
      createHistoryEntry(
        'rescheduled',
        `Reserva reagendada de ${currentBooking.appointmentDate} ${currentBooking.appointmentWindow.toUpperCase()} a ${nextDate} ${nextWindow.toUpperCase()}.`,
      ),
    )
  }

  if (updates.internalNotes && updates.internalNotes !== currentBooking.internalNotes) {
    historyEntries.push(createHistoryEntry('admin_note', 'Notas internas actualizadas.'))
  }

  const nextBooking: BookingRecord = {
    ...currentBooking,
    ...updates,
    status:
      updates.status ||
      (updates.appointmentDate || updates.appointmentWindow ? 'rescheduled' : currentBooking.status),
    serviceLabel: buildServiceLabel(
      updates.bookingMode ?? currentBooking.bookingMode,
      updates.selectedPack ?? currentBooking.selectedPack,
      updates.individualServices ?? currentBooking.individualServices,
    ),
    history: historyEntries,
    updatedAt: new Date().toISOString(),
  }

  const nextBookings = sortBookings(
    bookings.map((booking) => (booking.id === id ? nextBooking : booking)),
  )

  await writeStoreFile(BOOKINGS_FILE, nextBookings)

  return nextBooking
}

export const deleteBooking = async (id: string) => {
  const bookings = await getBookings()
  const nextBookings = bookings.filter((booking) => booking.id !== id)

  await writeStoreFile(BOOKINGS_FILE, nextBookings)
}

export const getBookingAvailability = async (referenceDate = new Date()) => {
  const bookings = await getBookings()

  return createBookingAvailabilitySnapshot(bookings, referenceDate)
}

export const getUpcomingAvailableSlots = async (limit = 10, referenceDate = new Date()) => {
  const availability = await getBookingAvailability(referenceDate)
  const slots: {
    date: string
    window: 'am' | 'pm'
    label: string
  }[] = []

  for (let offset = 1; offset <= 45; offset += 1) {
    const currentDate = new Date(referenceDate)
    currentDate.setDate(currentDate.getDate() + offset)

    const dateKey = formatDateKey(currentDate)
    const availableWindows = getAvailableBookingWindows(
      dateKey,
      referenceDate,
      availability.blockedWindowsByDate,
    )

    availableWindows.forEach((windowKey) => {
      slots.push({
        date: dateKey,
        window: windowKey,
        label: `${getFormattedBookingDateLabel(dateKey)} · ${
          windowKey === 'am' ? 'Recepcion AM' : 'Recepcion PM'
        }`,
      })
    })

    if (slots.length >= limit) {
      break
    }
  }

  return slots.slice(0, limit)
}

export const getUpcomingBookings = async (limit = 5) => {
  const today = new Date().toISOString().slice(0, 10)
  const bookings = await getBookings()

  return bookings
    .filter(
      (booking) =>
        booking.appointmentDate >= today && isBlockingBookingStatus(booking.status),
    )
    .slice(0, limit)
}

export const getBookingMetrics = async () => {
  const bookings = await getBookings()
  const total = bookings.length
  const byStatus = BOOKING_ACTIVE_STATUSES.reduce(
    (accumulator, status) => ({
      ...accumulator,
      [status]: bookings.filter((booking) => booking.status === status).length,
    }),
    {} as Record<string, number>,
  )

  byStatus.completed = bookings.filter((booking) => booking.status === 'completed').length
  byStatus.cancelled = bookings.filter((booking) => booking.status === 'cancelled').length

  const servicesCounter = bookings.reduce<Record<string, number>>((accumulator, booking) => {
    accumulator[booking.serviceLabel] = (accumulator[booking.serviceLabel] || 0) + 1
    return accumulator
  }, {})

  const mostRequestedServices = Object.entries(servicesCounter)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([service, count]) => ({ service, count }))

  const cancellationRate = total > 0 ? (byStatus.cancelled / total) * 100 : 0

  return {
    total,
    byStatus,
    mostRequestedServices,
    cancellationRate,
  }
}

export const getCustomers = async () => {
  const bookings = await getBookings()
  const customersMap = new Map<
    string,
    {
      rut: string
      name: string
      phone: string
      email: string
      lastBookingAt: string
      lastBookingId: string
      totalBookings: number
      completedBookings: number
      activeBookings: number
      vehicles: string[]
    }
  >()

  bookings.forEach((booking) => {
    const key = booking.rut.replace(/\./g, '').replace(/-/g, '').toUpperCase()
    const existingCustomer = customersMap.get(key)
    const vehicleLabel = `${booking.vehicleBrand} ${booking.vehicleModel}`.trim()

    if (!existingCustomer) {
      customersMap.set(key, {
        rut: booking.rut,
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        lastBookingAt: booking.appointmentDate,
        lastBookingId: booking.id,
        totalBookings: 1,
        completedBookings: booking.status === 'completed' ? 1 : 0,
        activeBookings: isBlockingBookingStatus(booking.status) ? 1 : 0,
        vehicles: vehicleLabel ? [vehicleLabel] : [],
      })
      return
    }

    existingCustomer.totalBookings += 1
    existingCustomer.completedBookings += booking.status === 'completed' ? 1 : 0
    existingCustomer.activeBookings += isBlockingBookingStatus(booking.status) ? 1 : 0

    if (booking.appointmentDate >= existingCustomer.lastBookingAt) {
      existingCustomer.lastBookingAt = booking.appointmentDate
      existingCustomer.lastBookingId = booking.id
      existingCustomer.name = booking.name
      existingCustomer.phone = booking.phone
      existingCustomer.email = booking.email
    }

    if (vehicleLabel && !existingCustomer.vehicles.includes(vehicleLabel)) {
      existingCustomer.vehicles.push(vehicleLabel)
    }
  })

  return [...customersMap.values()].sort((left, right) =>
    right.lastBookingAt.localeCompare(left.lastBookingAt),
  )
}

export const getCustomerByRut = async (rut: string) => {
  const customers = await getCustomers()
  const normalizedRut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase()

  return (
    customers.find(
      (customer) => customer.rut.replace(/\./g, '').replace(/-/g, '').toUpperCase() === normalizedRut,
    ) || null
  )
}

export const getProducts = async () => {
  const items = await readStoreFile<ProductRecord[]>(PRODUCTS_FILE, getDefaultProducts())
  return sortProducts(items)
}

export const getProductById = async (id: string) => {
  const products = await getProducts()
  return products.find((product) => product.id === id) || null
}

export const createProduct = async (
  input: Omit<ProductRecord, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const products = await getProducts()
  const now = new Date().toISOString()

  const nextProduct: ProductRecord = {
    ...input,
    id: createId('product'),
    createdAt: now,
    updatedAt: now,
  }

  const nextProducts = sortProducts([...products, nextProduct])
  await writeStoreFile(PRODUCTS_FILE, nextProducts)

  return nextProduct
}

export const updateProduct = async (
  id: string,
  updates: Partial<Omit<ProductRecord, 'id' | 'createdAt'>>,
) => {
  const products = await getProducts()
  const currentProduct = products.find((product) => product.id === id)

  if (!currentProduct) {
    throw new Error('El producto solicitado no existe.')
  }

  const nextProduct: ProductRecord = {
    ...currentProduct,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  const nextProducts = sortProducts(
    products.map((product) => (product.id === id ? nextProduct : product)),
  )

  await writeStoreFile(PRODUCTS_FILE, nextProducts)
  return nextProduct
}

export const deleteProduct = async (id: string) => {
  const products = await getProducts()
  const nextProducts = products.filter((product) => product.id !== id)

  await writeStoreFile(PRODUCTS_FILE, nextProducts)
}

export const getServiceProductUsage = async () =>
  readStoreFile<ServiceProductUsageRecord[]>(
    SERVICE_USAGE_FILE,
    getDefaultServiceProductUsage(),
  )

export const saveServiceProductUsage = async (items: ServiceProductUsageRecord[]) => {
  await writeStoreFile(SERVICE_USAGE_FILE, items)
  return items
}

export const upsertServiceProductUsage = async (
  input: Omit<ServiceProductUsageRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
) => {
  const usageItems = await getServiceProductUsage()
  const now = new Date().toISOString()

  if (input.id) {
    const nextItems = usageItems.map((item) =>
      item.id === input.id
        ? {
            ...item,
            ...input,
            updatedAt: now,
          }
        : item,
    )

    await writeStoreFile(SERVICE_USAGE_FILE, nextItems)
    return nextItems.find((item) => item.id === input.id) || null
  }

  const nextItem: ServiceProductUsageRecord = {
    ...input,
    id: createId('usage'),
    createdAt: now,
    updatedAt: now,
  }

  const nextItems = [...usageItems, nextItem]
  await writeStoreFile(SERVICE_USAGE_FILE, nextItems)

  return nextItem
}

export const deleteServiceProductUsage = async (id: string) => {
  const usageItems = await getServiceProductUsage()
  const nextItems = usageItems.filter((item) => item.id !== id)

  await writeStoreFile(SERVICE_USAGE_FILE, nextItems)
}

export const getServiceUsageSummaries = async () => {
  const [usageItems, products, siteContent] = await Promise.all([
    getServiceProductUsage(),
    getProducts(),
    getSiteContent(),
  ])

  return siteContent.services.map((service) => {
    const serviceUsage = usageItems.filter((item) => item.serviceId === service.id)

    const productRows = serviceUsage
      .map((usageItem) => {
        const product = products.find((currentProduct) => currentProduct.id === usageItem.productId)

        if (!product) {
          return null
        }

        return {
          ...usageItem,
          product,
          estimatedCost: usageItem.estimatedQuantity * product.unitCost,
        }
      })
      .filter(Boolean) as {
      id: string
      estimatedQuantity: number
      estimatedCost: number
      product: ProductRecord
    }[]

    return {
      service,
      products: productRows,
      estimatedCost: productRows.reduce((total, item) => total + item.estimatedCost, 0),
    }
  })
}

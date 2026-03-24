import { brand, services as defaultServices, testimonials as defaultTestimonials } from '@/appData/garage'
import type { ServiceIconKey } from '@/appData/garage'

export const SERVICE_ICON_OPTIONS: ServiceIconKey[] = [
  'wash',
  'interior',
  'polish',
  'shield',
  'ceramic',
  'restore',
]

export const BOOKING_STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'rescheduled',
] as const

export const BOOKING_ACTIVE_STATUSES = ['pending', 'confirmed', 'rescheduled'] as const

export type BookingStatus = (typeof BOOKING_STATUS_OPTIONS)[number]

export type BookingMode = 'pack' | 'individual' | 'custom'
export type ClientType = 'particular' | 'empresa'
export type AppointmentWindow = 'am' | 'pm'
export type HandoffOption = 'same_day' | 'previous_day' | 'pickup_delivery'

export type SiteSectionIntro = {
  eyebrow: string
  title: string
  description: string
}

export type HeroContent = {
  eyebrow: string
  title: string
  subtitle: string
  description: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

export type ClosingCtaContent = {
  eyebrow: string
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
}

export type EditableService = {
  id: string
  name: string
  description: string
  benefit: string
  icon: ServiceIconKey
}

export type EditableTestimonial = {
  id: string
  name: string
  vehicle: string
  feedback: string
}

export type GalleryItem = {
  id: string
  title: string
  category: string
  description: string
  alt: string
  imageUrl: string
  featured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type SiteContent = {
  hero: HeroContent
  servicesSection: SiteSectionIntro
  gallerySection: SiteSectionIntro
  testimonialsSection: SiteSectionIntro
  closingCta: ClosingCtaContent
  services: EditableService[]
  testimonials: EditableTestimonial[]
}

export type SiteSettings = {
  whatsapp: string
  email: string
  address: string
  serviceArea: string
  businessHours: string
  instagram: string
  facebook: string
  contactNote: string
}

export type BookingRecord = {
  id: string
  createdAt: string
  updatedAt: string
  status: BookingStatus
  lookupToken: string
  clientType: ClientType
  name: string
  rut: string
  phone: string
  email: string
  companyName: string
  companyContact: string
  secondaryContactName: string
  secondaryContactPhone: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: number
  vehicleType: string
  vehiclePlate: string
  vehicleUse: string
  bookingMode: BookingMode
  selectedPack: string
  individualServices: string[]
  addOns: string[]
  appointmentDate: string
  appointmentWindow: AppointmentWindow
  handoffOption: HandoffOption
  pickupAddress: string
  pickupZone: string
  message: string
  serviceLabel: string
  internalNotes: string
  history: BookingHistoryEntry[]
}

export type BookingHistoryEntry = {
  id: string
  createdAt: string
  type:
    | 'created'
    | 'status_changed'
    | 'rescheduled'
    | 'cancelled'
    | 'client_update'
    | 'admin_note'
  note: string
}

export type ProductRecord = {
  id: string
  name: string
  category: string
  unit: string
  stockCurrent: number
  stockMinimum: number
  unitCost: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export type ServiceProductUsageRecord = {
  id: string
  serviceId: string
  productId: string
  estimatedQuantity: number
  createdAt: string
  updatedAt: string
}

export const getDefaultSiteContent = (): SiteContent => ({
  hero: {
    eyebrow: brand.eyebrow,
    title: brand.name,
    subtitle: brand.tagline,
    description:
      'Lavado premium, detailing interior, pulido, sellado y tratamiento ceramico en una puesta de marca sobria, moderna y orientada a resultados visibles.',
    primaryCtaLabel: 'Agendar servicio',
    primaryCtaHref: '/agendar',
    secondaryCtaLabel: 'Ver trabajos',
    secondaryCtaHref: '/#resultados',
  },
  servicesSection: {
    eyebrow: 'Servicios',
    title: 'Tratamientos pensados para elevar presencia, brillo y proteccion.',
    description:
      'Cada servicio responde a una necesidad concreta del vehiculo: limpieza profunda, correccion visual, terminacion cuidada o proteccion de superficie.',
  },
  gallerySection: {
    eyebrow: 'Trabajos realizados',
    title: 'Resultados que transmiten limpieza tecnica y presencia premium.',
    description:
      'La galeria deja de ser un bloque de proyectos y pasa a mostrar terminaciones, brillo, control visual y el tipo de trabajo que se espera de un servicio serio de detailing automotriz.',
  },
  testimonialsSection: {
    eyebrow: 'Testimonios',
    title: 'La confianza se construye con resultado, proceso y detalle.',
    description:
      'Opiniones redactadas para transmitir una experiencia premium, creible y alineada con el tipo de cliente que busca un detailing automotriz serio.',
  },
  closingCta: {
    eyebrow: 'Reserva dedicada',
    title: 'La reserva ahora vive en una pagina dedicada, mas ordenada y mas personalizada.',
    description:
      'La portada mantiene el foco en marca, servicios y resultados. El flujo largo de agenda pasa a Agendar, donde el cliente puede completar todo con contexto, cronologia y una experiencia mas privada.',
    primaryLabel: 'Agendar servicio',
    primaryHref: '/agendar',
    secondaryLabel: 'Revisar servicios',
    secondaryHref: '/#servicios',
  },
  services: defaultServices.map((service, index) => ({
    id: `service-${index + 1}`,
    name: service.name,
    description: service.description,
    benefit: service.benefit,
    icon: service.icon,
  })),
  testimonials: defaultTestimonials.map((testimonial, index) => ({
    id: `testimonial-${index + 1}`,
    name: testimonial.name,
    vehicle: testimonial.vehicle,
    feedback: testimonial.feedback,
  })),
})

export const getDefaultSiteSettings = (): SiteSettings => ({
  whatsapp: '+56 9 8765 4321',
  email: 'agenda@garagezonacero.cl',
  address: 'Atencion previa coordinacion',
  serviceArea: 'Santiago y comunas cercanas',
  businessHours: 'Lunes a Sabado · 09:00 a 19:00',
  instagram: '@garagezonacero',
  facebook: 'Garage Zona Cero',
  contactNote: 'Reservas con evaluacion previa, confirmacion manual y seguimiento por WhatsApp.',
})

export const getDefaultGalleryItems = (): GalleryItem[] => {
  const now = new Date().toISOString()

  return [
    {
      id: 'gallery-1',
      title: 'Correccion visual y negro profundo',
      category: 'Exterior premium',
      description:
        'Trabajo orientado a recuperar reflejo, lectura de lineas y presencia en una carroceria de alto contraste.',
      alt: 'Coupe negro con terminacion de alto brillo en taller Garage Zona Cero',
      imageUrl: brand.heroImage.src,
      featured: true,
      sortOrder: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'gallery-2',
      title: 'Gloss controlado y terminacion de taller',
      category: 'Pulido + proteccion',
      description:
        'Detalle de superficies, brillo uniforme y un acabado que transmite limpieza tecnica desde el primer vistazo.',
      alt: 'Vehiculo detallado en zona de trabajo Garage Zona Cero',
      imageUrl: brand.showcaseImage.src,
      featured: true,
      sortOrder: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'gallery-3',
      title: 'Entrega con identidad de marca',
      category: 'Presentacion final',
      description:
        'Cada trabajo se presenta con una puesta visual sobria, cuidada y alineada con una experiencia premium.',
      alt: 'Logo y presentacion de marca Garage Zona Cero',
      imageUrl: brand.heritageLogo.src,
      featured: true,
      sortOrder: 3,
      createdAt: now,
      updatedAt: now,
    },
  ]
}

export const getDefaultProducts = (): ProductRecord[] => {
  const now = new Date().toISOString()

  return [
    {
      id: 'product-1',
      name: 'Shampoo pH neutro',
      category: 'Lavado',
      unit: 'ml',
      stockCurrent: 5200,
      stockMinimum: 1200,
      unitCost: 0.09,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'product-2',
      name: 'Quick detailer',
      category: 'Terminacion',
      unit: 'ml',
      stockCurrent: 1800,
      stockMinimum: 700,
      unitCost: 0.14,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'product-3',
      name: 'Coating ceramico',
      category: 'Proteccion',
      unit: 'ml',
      stockCurrent: 280,
      stockMinimum: 120,
      unitCost: 1.8,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
  ]
}

export const getDefaultServiceProductUsage = (): ServiceProductUsageRecord[] => {
  const now = new Date().toISOString()

  return [
    {
      id: 'usage-1',
      serviceId: 'service-1',
      productId: 'product-1',
      estimatedQuantity: 120,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'usage-2',
      serviceId: 'service-4',
      productId: 'product-2',
      estimatedQuantity: 80,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'usage-3',
      serviceId: 'service-5',
      productId: 'product-3',
      estimatedQuantity: 35,
      createdAt: now,
      updatedAt: now,
    },
  ]
}

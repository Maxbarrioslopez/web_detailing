import blackCoupe from '@/assets/images/auto_logo1.png'
import emblem from '@/assets/images/log_sinfondo.png'
import heritageLogo from '@/assets/images/logo.jpeg'
import workshopDetail from '@/assets/images/logo_auto2.jpg'

export type ServiceIconKey =
  | 'wash'
  | 'interior'
  | 'polish'
  | 'shield'
  | 'ceramic'
  | 'restore'

export const brand = {
  name: 'Garage Zona Cero',
  eyebrow: 'Detailing automotriz premium',
  tagline: 'Precision, estetica y proteccion para vehiculos que exigen presencia.',
  description:
    'Cuidado estetico profesional para autos con foco en pintura, interior, brillo profundo y terminaciones limpias.',
  primaryCta: {
    label: 'Agendar servicio',
    href: '/agendar',
  },
  secondaryCta: {
    label: 'Ver trabajos',
    href: '/#resultados',
  },
  logo: emblem,
  heroImage: blackCoupe,
  showcaseImage: workshopDetail,
  heritageLogo,
} as const

export const navLinks = [
  { label: 'Inicio', href: '/#inicio' },
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Trabajos', href: '/#resultados' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Agendar', href: '/agendar' },
] as const

export const heroPillars = [
  {
    title: 'Diagnostico preciso',
    text: 'Cada servicio parte con una revision visual del estado real del vehiculo.',
  },
  {
    title: 'Acabado premium',
    text: 'Buscamos profundidad, limpieza visual y reflejo controlado en cada superficie.',
  },
  {
    title: 'Proteccion duradera',
    text: 'Sellado y tratamientos pensados para mantener presencia y facilitar el cuidado.',
  },
] as const

export const services = [
  {
    name: 'Lavado premium',
    description:
      'Lavado seguro por etapas, limpieza de detalles, secado controlado y terminacion sin marcas.',
    benefit: 'Ideal para mantener gloss, limpieza y presencia entre tratamientos mayores.',
    icon: 'wash',
  },
  {
    name: 'Detailing interior',
    description:
      'Higienizacion de cabina, plasticos, tapicerias, paneles y zonas de uso diario con foco en terminacion.',
    benefit: 'Devuelve sensacion de orden, limpieza y confort a cada trayecto.',
    icon: 'interior',
  },
  {
    name: 'Pulido y correccion de pintura',
    description:
      'Correccion visual de swirls, opacidad y marcas leves para recuperar profundidad y lectura del color.',
    benefit: 'La pintura gana nitidez, reflejo y una presencia mucho mas limpia.',
    icon: 'polish',
  },
  {
    name: 'Sellado y proteccion',
    description:
      'Aplicacion de sellantes para reforzar brillo, repelencia y mantenimiento cotidiano de la carroceria.',
    benefit: 'Ayuda a extender el resultado estetico y simplifica el cuidado posterior.',
    icon: 'shield',
  },
  {
    name: 'Tratamientos ceramicos',
    description:
      'Proteccion avanzada para pintura y superficies seleccionadas con terminacion sobria y durable.',
    benefit: 'Aporta profundidad visual, menor adherencia de suciedad y presencia prolongada.',
    icon: 'ceramic',
  },
  {
    name: 'Restauracion estetica',
    description:
      'Recuperacion de piezas visualmente castigadas, detalles de terminacion y mejora integral de la imagen del auto.',
    benefit: 'Levanta la percepcion general del vehiculo y refuerza su valor estetico.',
    icon: 'restore',
  },
] as const

export const servicePlans = [
  {
    name: 'Pack Base',
    description: 'Lavado premium, cabina ordenada y terminacion exterior para uso frecuente.',
  },
  {
    name: 'Pack Signature',
    description: 'Detailing interior + correccion visual ligera + sellado de mantenimiento.',
  },
  {
    name: 'Pack Ceramic',
    description: 'Preparacion de superficie y tratamiento ceramico orientado a proteccion y presencia.',
  },
] as const

export const bookingModes = [
  {
    key: 'pack',
    label: 'Pack recomendado',
    description: 'Una seleccion cerrada para clientes que prefieren una propuesta definida.',
  },
  {
    key: 'individual',
    label: 'Servicios individuales',
    description: 'Elige tratamientos puntuales segun el estado actual del vehiculo.',
  },
  {
    key: 'custom',
    label: 'Evaluacion personalizada',
    description: 'Ideal si necesitas una propuesta a medida o un diagnostico previo.',
  },
] as const

export const vehicleTypes = [
  'Hatchback',
  'Sedan',
  'SUV',
  'Pickup',
  'Coupe',
  'Deportivo',
  'Furgon',
  'Vehiculo comercial',
] as const

export const bookingTimeWindows = [
  {
    key: 'am',
    label: 'Recepcion AM',
    description: 'Ingreso entre 09:00 y 11:30.',
  },
  {
    key: 'pm',
    label: 'Recepcion PM',
    description: 'Ingreso entre 14:00 y 17:30.',
  },
] as const

export const handoffOptions = [
  {
    key: 'same_day',
    label: 'Llevo el vehiculo el mismo dia',
    description: 'Ingreso normal en la ventana horaria elegida.',
  },
  {
    key: 'previous_day',
    label: 'Lo dejo el dia anterior',
    description: 'Recomendado para trabajos de mayor dedicacion o entregas tempranas.',
  },
  {
    key: 'pickup_delivery',
    label: 'Quiero retiro y entrega',
    description: 'Servicio logistico con valor extra segun zona y disponibilidad.',
  },
] as const

export const serviceAddOns = [
  'Limpieza de vano motor',
  'Tratamiento de llantas y neumaticos',
  'Ozonizacion interior',
  'Acondicionamiento de cuero',
] as const

export const results = [
  {
    title: 'Correccion visual y negro profundo',
    description:
      'Trabajo orientado a recuperar reflejo, lectura de lineas y presencia en una carroceria de alto contraste.',
    label: 'Exterior premium',
    image: blackCoupe,
  },
  {
    title: 'Gloss controlado y terminacion de taller',
    description:
      'Detalle de superficies, brillo uniforme y un acabado que transmite limpieza tecnica desde el primer vistazo.',
    label: 'Pulido + proteccion',
    image: workshopDetail,
  },
  {
    title: 'Entrega con identidad de marca',
    description:
      'Cada trabajo se presenta con una puesta visual sobria, cuidada y alineada con una experiencia premium.',
    label: 'Presentacion final',
    image: heritageLogo,
  },
] as const

export const reasons = [
  'Atencion minuciosa a pintura, interiores y terminaciones.',
  'Productos seleccionados para brillo, proteccion y mantenimiento.',
  'Lectura estetica del vehiculo, no solo limpieza superficial.',
  'Proceso ordenado, comunicacion clara y servicio con reserva.',
  'Resultados visibles que mejoran presencia y percepcion general del auto.',
  'Compromiso con una entrega prolija y consistente en cada etapa.',
] as const

export const processSteps = [
  {
    step: '01',
    title: 'Evaluamos el vehiculo',
    text: 'Revisamos estado visual, objetivos del cliente y nivel de intervencion recomendado.',
  },
  {
    step: '02',
    title: 'Definimos el tratamiento',
    text: 'Ajustamos el servicio segun pintura, interior, proteccion y resultado esperado.',
  },
  {
    step: '03',
    title: 'Entregamos con criterio premium',
    text: 'Cierre limpio, detalles controlados y recomendaciones para mantener el acabado.',
  },
] as const

export const testimonials = [
  {
    name: 'Sebastian R.',
    vehicle: 'Mercedes-AMG GT',
    feedback:
      'El nivel de terminacion fue impecable. La pintura quedo mucho mas profunda y el auto se siente realmente cuidado.',
  },
  {
    name: 'Valentina M.',
    vehicle: 'Audi Q5',
    feedback:
      'El interior quedo limpio, sobrio y con una sensacion premium real. Se nota el trabajo detallista en cada zona.',
  },
  {
    name: 'Matias G.',
    vehicle: 'BMW Serie 3',
    feedback:
      'No fue un lavado comun. Hubo criterio tecnico, buena comunicacion y un resultado visual que levanto por completo el auto.',
  },
] as const

export const contactHighlights = [
  'Reserva guiada con datos completos del cliente y del vehiculo',
  'Eleccion entre pack, servicios individuales o evaluacion personalizada',
  'Agenda visual con fechas bloqueadas y opciones de logistica segun el servicio',
] as const

export const bookingJourney = [
  {
    step: '01',
    title: 'Definimos tu necesidad',
    text: 'Seleccionas si quieres un pack, servicios puntuales o una evaluacion hecha a medida.',
  },
  {
    step: '02',
    title: 'Armamos la reserva',
    text: 'Registras titular, vehiculo, fecha disponible y detalles clave para preparar el ingreso.',
  },
  {
    step: '03',
    title: 'Coordinamos la logistica',
    text: 'Puedes dejarlo el mismo dia, el dia anterior o solicitar retiro y entrega con costo adicional.',
  },
  {
    step: '04',
    title: 'Confirmamos la agenda',
    text: 'Revisamos disponibilidad real, alcance del trabajo y te devolvemos la confirmacion final.',
  },
] as const

export const bookingPersonalization = [
  'Reserva mas limpia y privada, sin sobrecargar la home principal.',
  'Flujo pensado para clientes particulares, empresas y vehiculos de uso ejecutivo o flota.',
  'Informacion suficiente para cotizar mejor, bloquear agenda y anticipar tiempos de entrega.',
] as const

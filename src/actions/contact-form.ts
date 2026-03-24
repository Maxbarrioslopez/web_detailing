'use server'

import { revalidatePath } from 'next/cache'
import { createBooking, getBookingAvailability } from '@/lib/site-store'
import { getAvailableBookingWindows } from '@/utils/booking'

type ContactState = {
  success: boolean
  message: string
}

const getValue = (formData: FormData, key: string) => formData.get(key)?.toString().trim() || ''
const getValues = (formData: FormData, key: string) =>
  formData.getAll(key).map((value) => value.toString().trim()).filter(Boolean)

const sanitizeRut = (rut: string) => rut.replace(/\./g, '').replace(/-/g, '').toUpperCase()

const isValidRut = (rut: string) => {
  const cleanRut = sanitizeRut(rut)

  if (!/^\d{7,8}[0-9K]$/.test(cleanRut)) {
    return false
  }

  const body = cleanRut.slice(0, -1)
  const verifier = cleanRut.slice(-1)

  let sum = 0
  let multiplier = 2

  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const remainder = 11 - (sum % 11)
  const expectedVerifier =
    remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder)

  return verifier === expectedVerifier
}

const action = async (_: ContactState | null, formData: FormData): Promise<ContactState> => {
  const name = getValue(formData, 'name')
  const rut = getValue(formData, 'rut')
  const phone = getValue(formData, 'phone')
  const email = getValue(formData, 'email')
  const clientType = getValue(formData, 'clientType')
  const companyName = getValue(formData, 'companyName')
  const companyContact = getValue(formData, 'companyContact')
  const secondaryContactName = getValue(formData, 'secondaryContactName')
  const secondaryContactPhone = getValue(formData, 'secondaryContactPhone')
  const vehicleBrand = getValue(formData, 'vehicleBrand')
  const vehicleModel = getValue(formData, 'vehicleModel')
  const vehicleYear = getValue(formData, 'vehicleYear')
  const vehicleType = getValue(formData, 'vehicleType')
  const vehiclePlate = getValue(formData, 'vehiclePlate')
  const vehicleUse = getValue(formData, 'vehicleUse')
  const bookingMode = getValue(formData, 'bookingMode')
  const selectedPack = getValue(formData, 'selectedPack')
  const selectedDate = getValue(formData, 'appointmentDate')
  const appointmentWindow = getValue(formData, 'appointmentWindow')
  const handoffOption = getValue(formData, 'handoffOption')
  const pickupAddress = getValue(formData, 'pickupAddress')
  const pickupZone = getValue(formData, 'pickupZone')
  const message = getValue(formData, 'message')
  const individualServices = getValues(formData, 'individualServices')
  const addOns = getValues(formData, 'addOns')

  if (!name) {
    return { success: false, message: 'Indica el nombre completo del titular de la reserva.' }
  }

  if (!rut) {
    return { success: false, message: 'Indica el RUT del titular.' }
  }

  if (!isValidRut(rut)) {
    return { success: false, message: 'El RUT ingresado no tiene un formato valido.' }
  }

  if (!phone) {
    return { success: false, message: 'Indica un telefono o WhatsApp de contacto.' }
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: 'El correo ingresado no es valido.' }
  }

  if (!clientType) {
    return { success: false, message: 'Selecciona si la reserva es particular o empresa.' }
  }

  if (clientType === 'empresa' && !companyName) {
    return { success: false, message: 'Indica el nombre de la empresa para continuar.' }
  }

  if (!vehicleBrand || !vehicleModel || !vehicleYear || !vehicleType) {
    return { success: false, message: 'Completa marca, modelo, ano y tipo de vehiculo.' }
  }

  const numericYear = Number(vehicleYear)

  if (!Number.isFinite(numericYear) || numericYear < 1990 || numericYear > new Date().getFullYear() + 1) {
    return { success: false, message: 'El ano del vehiculo no es valido.' }
  }

  if (!bookingMode) {
    return { success: false, message: 'Selecciona la modalidad del servicio.' }
  }

  if (bookingMode === 'pack' && !selectedPack) {
    return { success: false, message: 'Selecciona un pack para continuar con la reserva.' }
  }

  if (bookingMode === 'individual' && individualServices.length === 0) {
    return {
      success: false,
      message: 'Selecciona al menos un servicio individual para la reserva.',
    }
  }

  if (!selectedDate) {
    return { success: false, message: 'Selecciona una fecha disponible en el calendario.' }
  }

  const availability = await getBookingAvailability()
  const availableWindows = getAvailableBookingWindows(
    selectedDate,
    new Date(),
    availability.blockedWindowsByDate,
  )

  if (availableWindows.length === 0) {
    return {
      success: false,
      message: 'La fecha seleccionada ya no esta disponible. Elige otra fecha.',
    }
  }

  if (!appointmentWindow) {
    return { success: false, message: 'Selecciona una ventana de recepcion.' }
  }

  if (!availableWindows.includes(appointmentWindow as 'am' | 'pm')) {
    return {
      success: false,
      message: 'La ventana horaria seleccionada ya fue tomada. Elige otra opcion.',
    }
  }

  if (!handoffOption) {
    return { success: false, message: 'Selecciona la logistica del vehiculo.' }
  }

  if (handoffOption === 'pickup_delivery' && (!pickupAddress || !pickupZone)) {
    return {
      success: false,
      message: 'Completa la direccion y la zona para retiro y entrega.',
    }
  }

  if (!message) {
    return {
      success: false,
      message: 'Describe el estado del vehiculo o el objetivo del trabajo.',
    }
  }

  try {
    const booking = await createBooking({
      status: 'pending',
      clientType: clientType === 'empresa' ? 'empresa' : 'particular',
      name,
      rut,
      phone,
      email,
      companyName,
      companyContact,
      secondaryContactName,
      secondaryContactPhone,
      vehicleBrand,
      vehicleModel,
      vehicleYear: numericYear,
      vehicleType,
      vehiclePlate,
      vehicleUse,
      bookingMode: bookingMode as 'pack' | 'individual' | 'custom',
      selectedPack,
      individualServices,
      addOns,
      appointmentDate: selectedDate,
      appointmentWindow: appointmentWindow as 'am' | 'pm',
      handoffOption: handoffOption as 'same_day' | 'previous_day' | 'pickup_delivery',
      pickupAddress,
      pickupZone,
      message,
      internalNotes: '',
    })

    revalidatePath('/agendar')
    revalidatePath('/admin')
    revalidatePath('/admin/reservas')
    revalidatePath('/admin/clientes')
    revalidatePath('/mi-reserva')
    revalidatePath('/')

    const endpoint = process.env.CONTACT_FORM_ACTION_URL

    if (endpoint) {
      try {
        const payload = new FormData()

        formData.forEach((value, key) => {
          payload.append(key, value)
        })

        payload.append('subject', `Reserva Zona Cero Garage | ${bookingMode} | ${selectedDate}`)
        payload.append(
          'bookingSummary',
          bookingMode === 'pack'
            ? selectedPack
            : bookingMode === 'individual'
              ? individualServices.join(', ')
              : 'Evaluacion personalizada',
        )
        payload.append('extrasSummary', addOns.join(', '))
        payload.append('bookingLookupToken', booking.lookupToken)

        const response = await fetch(endpoint, {
          method: 'POST',
          body: payload,
          headers: {
            Accept: 'application/json',
          },
          cache: 'no-store',
        })

        if (!response.ok) {
          console.error('Contact form webhook error:', response.status)
        }
      } catch (error) {
        console.error('Contact form submission error:', error)
      }
    }

    return {
      success: true,
      message: `Reserva registrada. Codigo ${booking.lookupToken}. Puedes revisarla, cancelarla o reagendarla desde /mi-reserva usando tu RUT y telefono, email o codigo.`,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'No pudimos guardar la reserva. Intenta nuevamente.',
    }
  }
}

export default action

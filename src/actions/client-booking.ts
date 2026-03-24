'use server'

import { revalidatePath } from 'next/cache'
import { getBookingById, getUpcomingAvailableSlots, updateBooking, findBookingForClientLookup } from '@/lib/site-store'

export type ClientReservationState = {
  success: boolean
  message: string
  booking: {
    id: string
    lookupToken: string
    name: string
    vehicleLabel: string
    serviceLabel: string
    appointmentDate: string
    appointmentWindow: 'am' | 'pm'
    status: string
    notes: string
  } | null
  availableSlots: {
    value: string
    label: string
  }[]
}

const initialState: ClientReservationState = {
  success: false,
  message: '',
  booking: null,
  availableSlots: [],
}

const getValue = (formData: FormData, key: string) => formData.get(key)?.toString().trim() || ''

const toPublicBookingState = async (
  bookingId: string,
  successMessage: string,
): Promise<ClientReservationState> => {
  const booking = await getBookingById(bookingId)

  if (!booking) {
    return {
      ...initialState,
      success: false,
      message: 'No pudimos recuperar la reserva solicitada.',
    }
  }

  const availableSlots =
    booking.status === 'cancelled' || booking.status === 'completed'
      ? []
      : (await getUpcomingAvailableSlots(10)).map((slot) => ({
          value: `${slot.date}|${slot.window}`,
          label: slot.label,
        }))

  return {
    success: true,
    message: successMessage,
    booking: {
      id: booking.id,
      lookupToken: booking.lookupToken,
      name: booking.name,
      vehicleLabel: `${booking.vehicleBrand} ${booking.vehicleModel}`.trim(),
      serviceLabel: booking.serviceLabel,
      appointmentDate: booking.appointmentDate,
      appointmentWindow: booking.appointmentWindow,
      status: booking.status,
      notes: booking.message,
    },
    availableSlots,
  }
}

const assertClientAccess = async (bookingId: string, lookupToken: string) => {
  const booking = await getBookingById(bookingId)

  if (!booking || booking.lookupToken !== lookupToken) {
    throw new Error('No pudimos validar el acceso a esta reserva.')
  }

  return booking
}

export const lookupClientReservationAction = async (
  _: ClientReservationState,
  formData: FormData,
): Promise<ClientReservationState> => {
  const rut = getValue(formData, 'rut')
  const contactValue = getValue(formData, 'contactValue')

  if (!rut || !contactValue) {
    return {
      ...initialState,
      success: false,
      message: 'Ingresa tu RUT y telefono, email o codigo de reserva.',
    }
  }

  const booking = await findBookingForClientLookup({ rut, contactValue })

  if (!booking) {
    return {
      ...initialState,
      success: false,
      message: 'No encontramos una reserva que coincida con esos datos.',
    }
  }

  return toPublicBookingState(booking.id, 'Reserva encontrada. Puedes revisar estado, cancelar o reagendar.')
}

export const cancelClientReservationAction = async (
  _: ClientReservationState,
  formData: FormData,
): Promise<ClientReservationState> => {
  const bookingId = getValue(formData, 'bookingId')
  const lookupToken = getValue(formData, 'lookupToken')

  try {
    const booking = await assertClientAccess(bookingId, lookupToken)

    if (booking.status === 'cancelled') {
      return toPublicBookingState(booking.id, 'La reserva ya estaba cancelada.')
    }

    await updateBooking(booking.id, {
      status: 'cancelled',
    })

    revalidatePath('/agendar')
    revalidatePath('/admin')
    revalidatePath('/admin/reservas')
    revalidatePath('/mi-reserva')

    return toPublicBookingState(
      booking.id,
      'Reserva cancelada correctamente. Si necesitas una nueva fecha, puedes volver a agendar.',
    )
  } catch (error) {
    return {
      ...initialState,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'No pudimos cancelar la reserva en este momento.',
    }
  }
}

export const rescheduleClientReservationAction = async (
  _: ClientReservationState,
  formData: FormData,
): Promise<ClientReservationState> => {
  const bookingId = getValue(formData, 'bookingId')
  const lookupToken = getValue(formData, 'lookupToken')
  const selectedSlot = getValue(formData, 'selectedSlot')

  if (!selectedSlot.includes('|')) {
    return {
      ...initialState,
      success: false,
      message: 'Selecciona una nueva fecha y ventana disponible.',
    }
  }

  const [nextDate, nextWindow] = selectedSlot.split('|') as [string, 'am' | 'pm']

  try {
    const booking = await assertClientAccess(bookingId, lookupToken)

    if (booking.status === 'cancelled') {
      return {
        ...initialState,
        success: false,
        message: 'La reserva cancelada no puede reagendarse desde este flujo.',
      }
    }

    await updateBooking(booking.id, {
      appointmentDate: nextDate,
      appointmentWindow: nextWindow,
      status: 'rescheduled',
    })

    revalidatePath('/agendar')
    revalidatePath('/admin')
    revalidatePath('/admin/reservas')
    revalidatePath('/mi-reserva')

    return toPublicBookingState(
      booking.id,
      'Reserva reagendada correctamente. El nuevo horario queda sujeto a validacion final del equipo.',
    )
  } catch (error) {
    return {
      ...initialState,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'No pudimos reagendar la reserva en este momento.',
    }
  }
}

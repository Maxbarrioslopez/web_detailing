import { BOOKING_ACTIVE_STATUSES, type AppointmentWindow, type BookingStatus } from '@/lib/site-schema'

const BOOKING_LEAD_DAYS = 1
const BOOKING_MONTHS_TO_RENDER = 2
const BOOKING_LOOKAHEAD_DAYS = 70
const BOOKING_BLOCKED_OFFSETS = [2, 5, 9, 12, 16, 21, 27, 34]

export const bookingWeekdayLabels = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'] as const
export const bookingWindowKeys: AppointmentWindow[] = ['am', 'pm']

const isActiveBookingStatus = (status: BookingStatus) =>
  BOOKING_ACTIVE_STATUSES.includes(status as (typeof BOOKING_ACTIVE_STATUSES)[number])

export type BookingAvailabilitySnapshot = {
  blockedDateKeys: string[]
  blockedWindowsByDate: Partial<Record<string, AppointmentWindow[]>>
}

type ReservationLike = {
  appointmentDate: string
  appointmentWindow: AppointmentWindow
  status: BookingStatus
}

const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const addDays = (date: Date, days: number) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return normalizeDate(result)
}

const getMondayIndex = (date: Date) => {
  const day = date.getDay()
  return day === 0 ? 6 : day - 1
}

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const getOperationallyBlockedDateKeys = (referenceDate = new Date()) => {
  const baseDate = normalizeDate(referenceDate)
  const blockedDates = new Set<string>()

  BOOKING_BLOCKED_OFFSETS.forEach((offset) => {
    blockedDates.add(formatDateKey(addDays(baseDate, offset)))
  })

  for (let index = 0; index <= BOOKING_LOOKAHEAD_DAYS; index += 1) {
    const date = addDays(baseDate, index)

    if (date.getDay() === 0) {
      blockedDates.add(formatDateKey(date))
    }
  }

  return blockedDates
}

export const getBlockedWindowsByDate = (reservations: ReservationLike[]) => {
  const blockedWindowsByDate: Partial<Record<string, AppointmentWindow[]>> = {}

  reservations.forEach((reservation) => {
    if (!isActiveBookingStatus(reservation.status)) {
      return
    }

    const currentWindows = blockedWindowsByDate[reservation.appointmentDate] || []

    if (!currentWindows.includes(reservation.appointmentWindow)) {
      blockedWindowsByDate[reservation.appointmentDate] = [
        ...currentWindows,
        reservation.appointmentWindow,
      ]
    }
  })

  return blockedWindowsByDate
}

export const getAvailableBookingWindows = (
  dateKey: string,
  referenceDate = new Date(),
  blockedWindowsByDate: Partial<Record<string, AppointmentWindow[]>> = {},
) => {
  if (!dateKey) {
    return []
  }

  const baseDate = normalizeDate(referenceDate)
  const selectedDate = normalizeDate(parseDateKey(dateKey))
  const minimumDate = addDays(baseDate, BOOKING_LEAD_DAYS)

  if (selectedDate < minimumDate) {
    return []
  }

  const operationallyBlockedDates = getOperationallyBlockedDateKeys(baseDate)

  if (operationallyBlockedDates.has(dateKey)) {
    return []
  }

  const takenWindows = blockedWindowsByDate[dateKey] || []

  return bookingWindowKeys.filter((windowKey) => !takenWindows.includes(windowKey))
}

export const getBlockedBookingDateKeys = (
  referenceDate = new Date(),
  blockedWindowsByDate: Partial<Record<string, AppointmentWindow[]>> = {},
) => {
  const baseDate = normalizeDate(referenceDate)
  const blockedDates = getOperationallyBlockedDateKeys(baseDate)

  Object.keys(blockedWindowsByDate).forEach((dateKey) => {
    if (getAvailableBookingWindows(dateKey, baseDate, blockedWindowsByDate).length === 0) {
      blockedDates.add(dateKey)
    }
  })

  return [...blockedDates]
}

export const isBookingDateBlocked = (
  dateKey: string,
  referenceDate = new Date(),
  blockedWindowsByDate: Partial<Record<string, AppointmentWindow[]>> = {},
) => getAvailableBookingWindows(dateKey, referenceDate, blockedWindowsByDate).length === 0

export const getFirstAvailableBookingDateKey = (
  referenceDate = new Date(),
  blockedWindowsByDate: Partial<Record<string, AppointmentWindow[]>> = {},
) => {
  const baseDate = normalizeDate(referenceDate)

  for (let index = BOOKING_LEAD_DAYS; index <= BOOKING_LOOKAHEAD_DAYS; index += 1) {
    const candidate = addDays(baseDate, index)
    const candidateKey = formatDateKey(candidate)

    if (!isBookingDateBlocked(candidateKey, baseDate, blockedWindowsByDate)) {
      return candidateKey
    }
  }

  return formatDateKey(addDays(baseDate, BOOKING_LEAD_DAYS))
}

export const getFirstAvailableBookingWindow = (
  dateKey: string,
  referenceDate = new Date(),
  blockedWindowsByDate: Partial<Record<string, AppointmentWindow[]>> = {},
) => getAvailableBookingWindows(dateKey, referenceDate, blockedWindowsByDate)[0] || 'am'

export const getFormattedBookingDateLabel = (dateKey: string) => {
  if (!dateKey) return 'Selecciona una fecha'

  return parseDateKey(dateKey).toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export type CalendarMonth = {
  key: string
  label: string
  days: {
    key: string
    dayNumber: number
    isCurrentMonth: boolean
    isBlocked: boolean
    isSelected: boolean
  }[]
}

export const getBookingCalendarMonths = (
  referenceDate = new Date(),
  selectedDateKey = '',
  blockedWindowsByDate: Partial<Record<string, AppointmentWindow[]>> = {},
): CalendarMonth[] => {
  const baseDate = normalizeDate(referenceDate)
  const months: CalendarMonth[] = []
  const firstMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)

  for (let monthOffset = 0; monthOffset < BOOKING_MONTHS_TO_RENDER; monthOffset += 1) {
    const monthDate = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + monthOffset, 1)
    const gridStart = addDays(monthDate, -getMondayIndex(monthDate))
    const days = Array.from({ length: 42 }, (_, dayOffset) => {
      const currentDate = addDays(gridStart, dayOffset)
      const currentKey = formatDateKey(currentDate)

      return {
        key: currentKey,
        dayNumber: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === monthDate.getMonth(),
        isBlocked: isBookingDateBlocked(currentKey, baseDate, blockedWindowsByDate),
        isSelected: currentKey === selectedDateKey,
      }
    })

    months.push({
      key: `${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`,
      label: monthDate.toLocaleDateString('es-CL', {
        month: 'long',
        year: 'numeric',
      }),
      days,
    })
  }

  return months
}

export const createBookingAvailabilitySnapshot = (
  reservations: ReservationLike[],
  referenceDate = new Date(),
): BookingAvailabilitySnapshot => {
  const blockedWindowsByDate = getBlockedWindowsByDate(reservations)

  return {
    blockedDateKeys: getBlockedBookingDateKeys(referenceDate, blockedWindowsByDate),
    blockedWindowsByDate,
  }
}

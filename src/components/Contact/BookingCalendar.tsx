'use client'

import {
  type BookingAvailabilitySnapshot,
  bookingWeekdayLabels,
  getBookingCalendarMonths,
  getFormattedBookingDateLabel,
} from '@/utils/booking'

type BookingCalendarProps = {
  selectedDate: string
  onSelectDate: (dateKey: string) => void
  referenceDate: Date | null
  availability: BookingAvailabilitySnapshot
}

const BookingCalendar = ({
  selectedDate,
  onSelectDate,
  referenceDate,
  availability,
}: BookingCalendarProps) => {
  if (!referenceDate) {
    return (
      <div className="glass-panel rounded-[24px] p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
          Disponibilidad
        </p>
        <p className="mt-2 text-sm leading-7 text-muted">Cargando agenda de reservas...</p>
      </div>
    )
  }

  const months = getBookingCalendarMonths(
    referenceDate,
    selectedDate,
    availability.blockedWindowsByDate,
  )

  return (
    <div className="glass-panel rounded-[24px] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            Calendario de agenda
          </p>
          <p className="mt-1.5 text-sm leading-7 text-muted">
            Las fechas marcadas como tomadas no estan disponibles para reserva.
          </p>
        </div>
        <p className="rounded-full border border-[rgba(197,154,90,0.18)] bg-[rgba(197,154,90,0.08)] px-3 py-1.5 text-sm font-semibold text-ink">
          {getFormattedBookingDateLabel(selectedDate)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-[0.68rem] uppercase tracking-[0.16em] text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[rgba(197,154,90,0.18)]" />
          Disponible
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-white/10" />
          Tomado
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-accent" />
          Seleccionado
        </span>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {months.map((month) => (
          <div key={month.key} className="rounded-[20px] border border-white/10 bg-black/20 p-3.5">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-ink">
              {month.label}
            </p>

            <div className="mt-3 grid grid-cols-7 gap-1.5 text-center text-[0.64rem] uppercase tracking-[0.16em] text-muted">
              {bookingWeekdayLabels.map((label) => (
                <span key={`${month.key}-${label}`}>{label}</span>
              ))}
            </div>

            <div className="mt-2.5 grid grid-cols-7 gap-1.5">
              {month.days.map((day) => {
                const disabled = !day.isCurrentMonth || day.isBlocked

                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => onSelectDate(day.key)}
                    disabled={disabled}
                    aria-pressed={day.isSelected}
                    className={[
                      'aspect-square rounded-[14px] border text-[0.82rem] font-semibold transition',
                      !day.isCurrentMonth
                        ? 'border-transparent bg-transparent text-white/15'
                        : day.isSelected
                          ? 'border-[rgba(235,200,143,0.55)] bg-accent text-[#0b0d10]'
                          : day.isBlocked
                            ? 'cursor-not-allowed border-white/8 bg-white/5 text-white/25 line-through'
                            : 'border-white/10 bg-[rgba(197,154,90,0.1)] text-ink hover:border-[rgba(197,154,90,0.32)] hover:bg-[rgba(197,154,90,0.18)]',
                    ].join(' ')}>
                    {day.dayNumber}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BookingCalendar

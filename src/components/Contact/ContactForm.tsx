'use client'

import {
  bookingModes,
  bookingTimeWindows,
  handoffOptions,
  serviceAddOns,
  servicePlans,
  services,
  vehicleTypes,
} from '@/appData/garage'
import action from '@/actions/contact-form'
import type { AppointmentWindow, HandoffOption } from '@/lib/site-schema'
import {
  type BookingAvailabilitySnapshot,
  getAvailableBookingWindows,
  getFirstAvailableBookingDateKey,
  getFirstAvailableBookingWindow,
  getFormattedBookingDateLabel,
} from '@/utils/booking'
import { CheckIcon, ChevronRightIcon } from '@/utils/icons'
import { useActionState, useEffect, useState } from 'react'
import BookingCalendar from './BookingCalendar'

const fieldClassName =
  'mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-[0.94rem] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition focus:border-[rgba(197,154,90,0.42)] focus:bg-[rgba(255,255,255,0.06)] focus:shadow-[0_0_0_3px_rgba(197,154,90,0.10)]'

const sectionClassName =
  'rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-5 lg:p-6'

const choiceCardClass = (active: boolean) =>
  [
    'rounded-[20px] border p-4 text-left transition',
    active
      ? 'border-[rgba(197,154,90,0.35)] bg-[linear-gradient(180deg,rgba(197,154,90,0.18),rgba(197,154,90,0.07))] shadow-[0_18px_44px_rgba(0,0,0,0.22)]'
      : 'border-white/8 bg-[rgba(255,255,255,0.03)] hover:border-white/16 hover:bg-[rgba(255,255,255,0.05)]',
  ].join(' ')

const summaryCardClass =
  'rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'

const bookingSteps = [
  { step: '01', label: 'Titular' },
  { step: '02', label: 'Vehiculo' },
  { step: '03', label: 'Servicio' },
  { step: '04', label: 'Agenda' },
] as const

const sectionMeta = {
  titular: {
    step: '01',
    title: 'Titular de la reserva',
    text: 'Datos para validar la reserva y la comunicacion previa.',
  },
  vehiculo: {
    step: '02',
    title: 'Vehiculo',
    text: 'Informacion base para ajustar alcance, tiempos y propuesta.',
  },
  servicio: {
    step: '03',
    title: 'Servicio de interes',
    text: 'Elige pack, servicios puntuales o evaluacion mas personalizada.',
  },
  agenda: {
    step: '04',
    title: 'Agenda y logistica',
    text: 'Selecciona fecha, recepcion y forma de ingreso del vehiculo.',
  },
} as const

type ContactFormProps = {
  availability: BookingAvailabilitySnapshot
}

const ContactForm = ({ availability }: ContactFormProps) => {
  const [status, formAction, isPending] = useActionState(action, null)
  const [referenceDate, setReferenceDate] = useState<Date | null>(null)
  const [clientType, setClientType] = useState<'particular' | 'empresa'>('particular')
  const [bookingMode, setBookingMode] = useState<'pack' | 'individual' | 'custom'>('pack')
  const [selectedPack, setSelectedPack] = useState<string>(
    servicePlans[1]?.name ?? servicePlans[0].name,
  )
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [appointmentWindow, setAppointmentWindow] = useState<AppointmentWindow>(
    bookingTimeWindows[0].key,
  )
  const [handoffOption, setHandoffOption] = useState<HandoffOption>('same_day')

  useEffect(() => {
    const now = new Date()
    const firstDate = getFirstAvailableBookingDateKey(now, availability.blockedWindowsByDate)

    setReferenceDate(now)
    setSelectedDate(firstDate)
    setAppointmentWindow(getFirstAvailableBookingWindow(firstDate, now, availability.blockedWindowsByDate))
  }, [availability.blockedWindowsByDate])

  useEffect(() => {
    if (!referenceDate || !selectedDate) {
      return
    }

    const availableWindows = getAvailableBookingWindows(
      selectedDate,
      referenceDate,
      availability.blockedWindowsByDate,
    )

    if (availableWindows.length > 0 && !availableWindows.includes(appointmentWindow)) {
      setAppointmentWindow(availableWindows[0])
    }
  }, [appointmentWindow, availability.blockedWindowsByDate, referenceDate, selectedDate])

  const toggleCheckboxValue = (
    value: string,
    currentValues: string[],
    updateValues: (values: string[]) => void,
  ) => {
    if (currentValues.includes(value)) {
      updateValues(currentValues.filter((item) => item !== value))
      return
    }

    updateValues([...currentValues, value])
  }

  const selectedModeLabel =
    bookingModes.find((mode) => mode.key === bookingMode)?.label ?? 'Seleccion sin definir'
  const selectedWindowLabel =
    bookingTimeWindows.find((window) => window.key === appointmentWindow)?.label ?? 'Sin ventana'
  const selectedHandoffLabel =
    handoffOptions.find((option) => option.key === handoffOption)?.label ?? 'Sin logistica'
  const selectedServiceSummary =
    bookingMode === 'pack'
      ? selectedPack
      : bookingMode === 'individual'
        ? selectedServices.length > 0
          ? selectedServices.join(', ')
          : 'Selecciona uno o mas servicios'
        : 'Evaluacion personalizada'
  const availableWindows = referenceDate
    ? getAvailableBookingWindows(selectedDate, referenceDate, availability.blockedWindowsByDate)
    : []

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="clientType" value={clientType} />
      <input type="hidden" name="bookingMode" value={bookingMode} />
      <input type="hidden" name="selectedPack" value={selectedPack} />
      <input type="hidden" name="appointmentDate" value={selectedDate} />
      <input type="hidden" name="appointmentWindow" value={appointmentWindow} />
      <input type="hidden" name="handoffOption" value={handoffOption} />

      <div className="rounded-[26px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-accent">
              Reserva operativa
            </p>
            <h3 className="text-2xl font-semibold text-ink sm:text-[1.95rem]">
              Agenda tu servicio con una estructura mas clara.
            </h3>
            <p className="max-w-2xl text-sm leading-7 text-muted">
              Organiza el ingreso del vehiculo, el tratamiento y la logistica en un solo flujo,
              sin recargar visualmente la experiencia.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {bookingSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-[18px] border border-white/8 bg-black/20 px-3 py-3 text-center">
                <p className="display-font text-xl text-accent">{item.step}</p>
                <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="grid gap-5 xl:grid-cols-2">
            <section className={sectionClassName}>
              <div className="flex items-start gap-4 border-b border-white/8 pb-4">
                <span className="display-font text-3xl leading-none text-accent">
                  {sectionMeta.titular.step}
                </span>
                <div className="space-y-1">
                  <h4 className="text-lg font-semibold text-ink">{sectionMeta.titular.title}</h4>
                  <p className="text-sm leading-7 text-muted">{sectionMeta.titular.text}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="text-sm text-muted">
                  Nombre completo
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nombre y apellido"
                    className={fieldClassName}
                    required
                  />
                </label>

                <label className="text-sm text-muted">
                  RUT
                  <input
                    id="rut"
                    name="rut"
                    type="text"
                    placeholder="12.345.678-5"
                    className={fieldClassName}
                    required
                  />
                </label>

                <label className="text-sm text-muted">
                  Telefono o WhatsApp
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="+56 9 ..."
                    className={fieldClassName}
                    required
                  />
                </label>

                <label className="text-sm text-muted">
                  Email
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="correo@dominio.cl"
                    className={fieldClassName}
                  />
                </label>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {[
                  {
                    key: 'particular',
                    label: 'Particular',
                    description: 'Reserva personal o familiar.',
                  },
                  {
                    key: 'empresa',
                    label: 'Empresa',
                    description: 'Facturacion o coordinacion corporativa.',
                  },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setClientType(option.key as 'particular' | 'empresa')}
                    className={choiceCardClass(clientType === option.key)}>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                      {option.label}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted">{option.description}</p>
                  </button>
                ))}
              </div>

              {clientType === 'empresa' && (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="text-sm text-muted">
                    Empresa
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="Nombre de la empresa"
                      className={fieldClassName}
                      required={clientType === 'empresa'}
                    />
                  </label>

                  <label className="text-sm text-muted">
                    Area o responsable
                    <input
                      id="companyContact"
                      name="companyContact"
                      type="text"
                      placeholder="Administracion, flota, compras..."
                      className={fieldClassName}
                    />
                  </label>
                </div>
              )}

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="text-sm text-muted">
                  Contacto adicional
                  <input
                    id="secondaryContactName"
                    name="secondaryContactName"
                    type="text"
                    placeholder="Otra persona autorizada"
                    className={fieldClassName}
                  />
                </label>

                <label className="text-sm text-muted">
                  Telefono contacto adicional
                  <input
                    id="secondaryContactPhone"
                    name="secondaryContactPhone"
                    type="text"
                    placeholder="+56 9 ..."
                    className={fieldClassName}
                  />
                </label>
              </div>
            </section>

            <section className={sectionClassName}>
              <div className="flex items-start gap-4 border-b border-white/8 pb-4">
                <span className="display-font text-3xl leading-none text-accent">
                  {sectionMeta.vehiculo.step}
                </span>
                <div className="space-y-1">
                  <h4 className="text-lg font-semibold text-ink">{sectionMeta.vehiculo.title}</h4>
                  <p className="text-sm leading-7 text-muted">{sectionMeta.vehiculo.text}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="text-sm text-muted">
                  Marca
                  <input
                    id="vehicleBrand"
                    name="vehicleBrand"
                    type="text"
                    placeholder="Audi, BMW, Toyota..."
                    className={fieldClassName}
                    required
                  />
                </label>

                <label className="text-sm text-muted">
                  Modelo
                  <input
                    id="vehicleModel"
                    name="vehicleModel"
                    type="text"
                    placeholder="Modelo o version"
                    className={fieldClassName}
                    required
                  />
                </label>

                <label className="text-sm text-muted">
                  Ano
                  <input
                    id="vehicleYear"
                    name="vehicleYear"
                    type="number"
                    min="1990"
                    max={String(new Date().getFullYear() + 1)}
                    placeholder="2022"
                    className={fieldClassName}
                    required
                  />
                </label>

                <label className="text-sm text-muted">
                  Tipo de vehiculo
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    className={fieldClassName}
                    required
                    defaultValue="">
                    <option value="" disabled>
                      Selecciona el tipo
                    </option>
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm text-muted">
                  Patente
                  <input
                    id="vehiclePlate"
                    name="vehiclePlate"
                    type="text"
                    placeholder="AA-BB-10"
                    className={fieldClassName}
                  />
                </label>

                <label className="text-sm text-muted">
                  Uso del vehiculo
                  <input
                    id="vehicleUse"
                    name="vehicleUse"
                    type="text"
                    placeholder="Particular, ejecutivo, flota..."
                    className={fieldClassName}
                  />
                </label>
              </div>
            </section>
          </div>

          <section className={sectionClassName}>
            <div className="flex items-start gap-4 border-b border-white/8 pb-4">
              <span className="display-font text-3xl leading-none text-accent">
                {sectionMeta.servicio.step}
              </span>
              <div className="space-y-1">
                <h4 className="text-lg font-semibold text-ink">{sectionMeta.servicio.title}</h4>
                <p className="text-sm leading-7 text-muted">{sectionMeta.servicio.text}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {bookingModes.map((mode) => (
                <button
                  key={mode.key}
                  type="button"
                  onClick={() => setBookingMode(mode.key as 'pack' | 'individual' | 'custom')}
                  className={choiceCardClass(bookingMode === mode.key)}>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                    {mode.label}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted">{mode.description}</p>
                </button>
              ))}
            </div>

            {bookingMode === 'pack' && (
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {servicePlans.map((plan) => (
                  <label key={plan.name} className={choiceCardClass(selectedPack === plan.name)}>
                    <input
                      type="radio"
                      className="sr-only"
                      checked={selectedPack === plan.name}
                      onChange={() => setSelectedPack(plan.name)}
                    />
                    <p className="text-base font-semibold text-ink">{plan.name}</p>
                    <p className="mt-2 text-sm leading-7 text-muted">{plan.description}</p>
                  </label>
                ))}
              </div>
            )}

            {bookingMode === 'individual' && (
              <div className="mt-4 space-y-4">
                <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                  {services.map((service) => {
                    const isSelected = selectedServices.includes(service.name)

                    return (
                      <label key={service.name} className={choiceCardClass(isSelected)}>
                        <input
                          type="checkbox"
                          name="individualServices"
                          value={service.name}
                          checked={isSelected}
                          onChange={() =>
                            toggleCheckboxValue(service.name, selectedServices, setSelectedServices)
                          }
                          className="sr-only"
                        />
                        <p className="text-base font-semibold text-ink">{service.name}</p>
                        <p className="mt-2 text-sm leading-7 text-muted">{service.benefit}</p>
                      </label>
                    )
                  })}
                </div>

                <div className="rounded-[20px] border border-white/8 bg-black/20 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                    Extras sugeridos
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {serviceAddOns.map((addOn) => {
                      const isSelected = selectedExtras.includes(addOn)

                      return (
                        <label
                          key={addOn}
                          className={[
                            'inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm transition',
                            isSelected
                              ? 'border-[rgba(197,154,90,0.35)] bg-[rgba(197,154,90,0.14)] text-ink'
                              : 'border-white/8 bg-[rgba(255,255,255,0.03)] text-muted hover:border-white/16 hover:text-ink',
                          ].join(' ')}>
                          <input
                            type="checkbox"
                            name="addOns"
                            value={addOn}
                            checked={isSelected}
                            onChange={() =>
                              toggleCheckboxValue(addOn, selectedExtras, setSelectedExtras)
                            }
                            className="sr-only"
                          />
                          {addOn}
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            <label className="mt-4 block text-sm text-muted">
              Estado actual, objetivo del trabajo o detalles relevantes
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Describe el estado del vehiculo, prioridades esteticas, nivel de correccion o necesidades especiales."
                className={`${fieldClassName} resize-none`}
                required
              />
            </label>
          </section>

          <section className={sectionClassName}>
            <div className="flex items-start gap-4 border-b border-white/8 pb-4">
              <span className="display-font text-3xl leading-none text-accent">
                {sectionMeta.agenda.step}
              </span>
              <div className="space-y-1">
                <h4 className="text-lg font-semibold text-ink">{sectionMeta.agenda.title}</h4>
                <p className="text-sm leading-7 text-muted">{sectionMeta.agenda.text}</p>
              </div>
            </div>

            <div className="mt-4">
              <BookingCalendar
                availability={availability}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                referenceDate={referenceDate}
              />
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              <div className="rounded-[20px] border border-white/8 bg-black/20 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  Ventana de recepcion
                </p>
                <div className="mt-3 grid gap-3">
                  {bookingTimeWindows.map((window) => (
                    <button
                      key={window.key}
                      type="button"
                      onClick={() => setAppointmentWindow(window.key)}
                      disabled={!availableWindows.includes(window.key)}
                      className={`${choiceCardClass(appointmentWindow === window.key)} disabled:cursor-not-allowed disabled:opacity-55`}>
                      <p className="text-base font-semibold text-ink">{window.label}</p>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        {!availableWindows.includes(window.key)
                          ? 'Ya reservada para la fecha seleccionada.'
                          : window.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] border border-white/8 bg-black/20 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  Logistica del vehiculo
                </p>
                <div className="mt-3 grid gap-3">
                  {handoffOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() =>
                        setHandoffOption(
                          option.key as 'same_day' | 'previous_day' | 'pickup_delivery',
                        )
                      }
                      className={choiceCardClass(handoffOption === option.key)}>
                      <p className="text-base font-semibold text-ink">{option.label}</p>
                      <p className="mt-2 text-sm leading-7 text-muted">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {handoffOption === 'pickup_delivery' && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="text-sm text-muted">
                  Direccion para retiro y entrega
                  <input
                    id="pickupAddress"
                    name="pickupAddress"
                    type="text"
                    placeholder="Calle, numero y referencia"
                    className={fieldClassName}
                    required={handoffOption === 'pickup_delivery'}
                  />
                </label>

                <label className="text-sm text-muted">
                  Comuna o sector
                  <input
                    id="pickupZone"
                    name="pickupZone"
                    type="text"
                    placeholder="Comuna, sector o zona"
                    className={fieldClassName}
                    required={handoffOption === 'pickup_delivery'}
                  />
                </label>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4 2xl:pt-[2px]">
          <div className="glass-panel rounded-[28px] p-5 2xl:sticky 2xl:top-28">
            <div className="space-y-2 border-b border-white/8 pb-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-accent">
                Resumen
              </p>
              <h4 className="text-xl font-semibold text-ink">Vista previa de la reserva</h4>
              <p className="text-sm leading-7 text-muted">
                Una lectura compacta para revisar modalidad, fecha y logistica antes de enviar.
              </p>
            </div>

            <div className="mt-4 space-y-3.5">
              <div className={summaryCardClass}>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">Modalidad</p>
                <p className="mt-1.5 text-base font-semibold text-ink">{selectedModeLabel}</p>
              </div>

              <div className={summaryCardClass}>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">Servicio</p>
                <p className="mt-1.5 text-sm leading-7 text-ink">{selectedServiceSummary}</p>
              </div>

              <div className={summaryCardClass}>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">Fecha</p>
                <p className="mt-1.5 text-sm leading-7 text-ink">
                  {getFormattedBookingDateLabel(selectedDate)}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
                <div className={summaryCardClass}>
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">Recepcion</p>
                  <p className="mt-1.5 text-sm leading-7 text-ink">{selectedWindowLabel}</p>
                </div>
                <div className={summaryCardClass}>
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">Logistica</p>
                  <p className="mt-1.5 text-sm leading-7 text-ink">{selectedHandoffLabel}</p>
                </div>
              </div>

              {selectedExtras.length > 0 && (
                <div className={summaryCardClass}>
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">Extras</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedExtras.map((extra) => (
                      <span
                        key={extra}
                        className="rounded-full border border-[rgba(197,154,90,0.2)] bg-[rgba(197,154,90,0.1)] px-2.5 py-1 text-[0.72rem] text-ink">
                        {extra}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-[22px] border border-[rgba(197,154,90,0.18)] bg-[rgba(197,154,90,0.08)] p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-full border border-[rgba(197,154,90,0.28)] bg-[rgba(197,154,90,0.12)] p-2 text-accent">
                    <CheckIcon />
                  </span>
                  <p className="text-sm leading-7 text-[rgba(244,239,232,0.9)]">
                    La reserva queda lista para validacion final, confirmacion de agenda y ajuste
                    de logistica si corresponde.
                  </p>
                </div>
              </div>

              {status?.message && (
                <p
                  className={`text-sm leading-7 ${status.success ? 'text-accent-bright' : 'text-[#f1b87f]'}`}>
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="cta-primary inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70">
                {isPending ? 'Preparando reserva...' : 'Solicitar reserva'}
                <ChevronRightIcon className="size-5" />
              </button>

              <p className="text-xs leading-6 text-muted">
                La fecha seleccionada queda sujeta a validacion final, revision del vehiculo y
                confirmacion del servicio elegido.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </form>
  )
}

export default ContactForm

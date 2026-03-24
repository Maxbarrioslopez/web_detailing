'use client'

import {
  cancelClientReservationAction,
  lookupClientReservationAction,
  rescheduleClientReservationAction,
  type ClientReservationState,
} from '@/actions/client-booking'
import { useActionState, useEffect, useState } from 'react'

const fieldClassName =
  'mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-[0.94rem] text-ink outline-none transition focus:border-[rgba(197,154,90,0.42)] focus:bg-[rgba(255,255,255,0.06)]'

type ClientReservationManagerProps = {
  whatsappUrl: string
}

const initialState: ClientReservationState = {
  success: false,
  message: '',
  booking: null,
  availableSlots: [],
}

const ClientReservationManager = ({ whatsappUrl }: ClientReservationManagerProps) => {
  const [lookupState, lookupAction, lookupPending] = useActionState(
    lookupClientReservationAction,
    initialState,
  )
  const [cancelState, cancelAction, cancelPending] = useActionState(
    cancelClientReservationAction,
    initialState,
  )
  const [rescheduleState, rescheduleAction, reschedulePending] = useActionState(
    rescheduleClientReservationAction,
    initialState,
  )
  const [currentState, setCurrentState] = useState<ClientReservationState>(initialState)

  useEffect(() => {
    if (lookupState.message || lookupState.booking) {
      setCurrentState(lookupState)
    }
  }, [lookupState])

  useEffect(() => {
    if (cancelState.message || cancelState.booking) {
      setCurrentState(cancelState)
    }
  }, [cancelState])

  useEffect(() => {
    if (rescheduleState.message || rescheduleState.booking) {
      setCurrentState(rescheduleState)
    }
  }, [rescheduleState])

  const booking = currentState.booking
  const isLocked = booking?.status === 'cancelled' || booking?.status === 'completed'

  return (
    <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
      <section className="glass-panel rounded-[28px] p-5 sm:p-6">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
          Consulta segura
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-ink">Buscar mi reserva</h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          Ingresa tu RUT y tu telefono, email o codigo de reserva para consultar el estado.
        </p>

        <form action={lookupAction} className="mt-5 grid gap-4">
          <label className="text-sm text-muted">
            RUT
            <input
              name="rut"
              placeholder="12.345.678-5"
              className={fieldClassName}
              required
            />
          </label>
          <label className="text-sm text-muted">
            Telefono, email o codigo
            <input
              name="contactValue"
              placeholder="+56 9..., correo o codigo"
              className={fieldClassName}
              required
            />
          </label>

          <button
            type="submit"
            disabled={lookupPending}
            className="cta-primary rounded-2xl px-5 py-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70">
            {lookupPending ? 'Buscando reserva...' : 'Consultar reserva'}
          </button>
        </form>

        {currentState.message ? (
          <div
            className={[
              'mt-4 rounded-[20px] border p-4 text-sm leading-7',
              currentState.success
                ? 'border-[rgba(197,154,90,0.18)] bg-[rgba(197,154,90,0.08)] text-[rgba(244,239,232,0.92)]'
                : 'border-[rgba(241,184,127,0.22)] bg-[rgba(241,184,127,0.08)] text-[#f7d0aa]',
            ].join(' ')}>
            {currentState.message}
          </div>
        ) : null}

        <div className="mt-5 rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">Soporte directo</p>
          <p className="mt-2 text-sm leading-7 text-muted">
            Si necesitas ayuda inmediata, puedes escribir por WhatsApp al equipo.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="cta-secondary mt-4 inline-flex rounded-full px-4 py-3 text-sm font-semibold">
            Abrir WhatsApp
          </a>
        </div>
      </section>

      <section className="glass-panel rounded-[28px] p-5 sm:p-6">
        {booking ? (
          <div className="space-y-5">
            <div className="border-b border-white/8 pb-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
                Estado actual
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">
                {booking.serviceLabel}
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted">
                {booking.vehicleLabel} · {booking.appointmentDate} ·{' '}
                {booking.appointmentWindow === 'am' ? 'Recepcion AM' : 'Recepcion PM'}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">Estado</p>
                <p className="mt-2 text-lg font-semibold text-ink">{booking.status}</p>
              </div>
              <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">Codigo</p>
                <p className="mt-2 text-lg font-semibold text-ink">{booking.lookupToken}</p>
              </div>
            </div>

            <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">Observaciones</p>
              <p className="mt-2 text-sm leading-7 text-muted">{booking.notes}</p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
              <form action={cancelAction} className="rounded-[22px] border border-white/8 bg-black/20 p-4">
                <input type="hidden" name="bookingId" value={booking.id} />
                <input type="hidden" name="lookupToken" value={booking.lookupToken} />
                <p className="text-sm font-semibold text-ink">Cancelar reserva</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Disponible mientras la reserva siga activa.
                </p>
                <button
                  type="submit"
                  disabled={cancelPending || isLocked}
                  className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#f7d0aa] transition hover:border-[rgba(241,184,127,0.3)] disabled:cursor-not-allowed disabled:opacity-45">
                  {cancelPending ? 'Cancelando...' : 'Cancelar reserva'}
                </button>
              </form>

              <form
                action={rescheduleAction}
                className="rounded-[22px] border border-white/8 bg-black/20 p-4">
                <input type="hidden" name="bookingId" value={booking.id} />
                <input type="hidden" name="lookupToken" value={booking.lookupToken} />
                <p className="text-sm font-semibold text-ink">Reagendar reserva</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Selecciona uno de los proximos cupos disponibles para solicitar cambio.
                </p>

                <div className="mt-4 grid gap-3">
                  {currentState.availableSlots.length > 0 ? (
                    currentState.availableSlots.map((slot, index) => (
                      <label
                        key={slot.value}
                        className="flex cursor-pointer items-start gap-3 rounded-[18px] border border-white/8 bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-ink">
                        <input
                          type="radio"
                          name="selectedSlot"
                          value={slot.value}
                          defaultChecked={index === 0}
                          className="mt-1"
                        />
                        <span className="leading-7">{slot.label}</span>
                      </label>
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-dashed border-white/10 bg-[rgba(255,255,255,0.02)] p-4 text-sm leading-7 text-muted">
                      No hay nuevos cupos disponibles para reagendar en este momento.
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={reschedulePending || isLocked || currentState.availableSlots.length === 0}
                  className="cta-primary mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45">
                  {reschedulePending ? 'Reagendando...' : 'Solicitar reagendamiento'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[320px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-black/20 p-6 text-center text-sm leading-7 text-muted">
            Aqui veras el detalle de tu reserva cuando completes la consulta.
          </div>
        )}
      </section>
    </div>
  )
}

export default ClientReservationManager

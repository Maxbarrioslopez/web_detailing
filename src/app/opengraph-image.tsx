import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Garage Zona Cero - Detailing automotriz premium'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          color: '#f4efe8',
          background:
            'radial-gradient(circle at top left, rgba(197,154,90,0.24), transparent 28%), linear-gradient(135deg, #050608 0%, #10151b 100%)',
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: 20,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#c59a5a',
          }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: '#c59a5a',
            }}
          />
          Detailing automotriz premium
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f4efe8',
            }}>
            Garage Zona Cero
          </h1>
          <p
            style={{
              margin: 0,
              width: '78%',
              fontSize: 32,
              lineHeight: 1.3,
              color: '#f4efe8',
            }}>
            Precision, estetica y proteccion para vehiculos que exigen presencia.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            fontSize: 24,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#c59a5a',
          }}>
          Lavado premium
          <span style={{ color: 'rgba(244,239,232,0.55)' }}>•</span>
          Pulido
          <span style={{ color: 'rgba(244,239,232,0.55)' }}>•</span>
          Tratamiento ceramico
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}

# Zona Cero Garage

Aplicacion web construida con **Next.js 15 + App Router** para **Zona Cero Garage**, una marca de detailing automotriz premium. El proyecto combina una **landing comercial** de alto impacto con una **demo funcional de operacion interna** para reservas, clientes, contenido, galeria e inventario.

## 1. Objetivo del proyecto

Esta base fue evolucionada para cubrir dos frentes:

1. **Captacion comercial**
   - home premium orientada a marca, servicios, resultados y conversion
   - pagina de agendamiento dedicada
   - experiencia cliente coherente con el rubro automotriz premium

2. **Operacion interna**
   - reservas persistentes en modo demo
   - consulta publica de reserva por cliente
   - cancelacion y reagendamiento
   - panel admin sin login obligatorio mientras `DEMO_MODE=true`
   - gestion de contenido web, imagenes, clientes y productos

## 2. Estado actual

El proyecto ya incluye:

- landing comercial responsive para Zona Cero Garage
- pagina publica `/agendar`
- pagina publica `/mi-reserva`
- panel interno `/admin`
- CRUD demo para reservas
- CRM basico derivado desde bookings
- gestion de galeria e imagenes locales
- edicion de contenido del sitio desde panel
- modulo simple de productos / stock / consumo estimado por servicio
- estructura preparada para auth futura
- esquema SQL base para Supabase

## 3. Stack

- **Framework:** Next.js 15
- **Router:** App Router
- **UI:** React 19
- **Estilos:** Tailwind CSS v4
- **Persistencia actual:** JSON local en `content/garage-demo`
- **Storage actual de imagenes admin:** `public/uploads`
- **Persistencia objetivo futura:** Supabase PostgreSQL + Storage + Auth

## 4. Rutas principales

### Publicas

- `/`
- `/agendar`
- `/mi-reserva`

### Internas

- `/admin`
- `/admin/reservas`
- `/admin/reservas/[id]`
- `/admin/clientes`
- `/admin/galeria`
- `/admin/contenido`
- `/admin/productos`
- `/admin/configuracion`

## 5. Modulos funcionales

### Landing comercial

Ubicada principalmente en `src/app/page.tsx`, con contenido editable desde store local.

Incluye:

- hero comercial
- servicios
- trabajos realizados
- seccion de confianza
- testimonios
- CTA final
- footer con accesos principales

### Reserva publica

Ruta: `/agendar`

Incluye:

- formulario completo del titular
- datos del vehiculo
- seleccion de pack o servicios individuales
- extras
- disponibilidad con fechas y ventanas bloqueadas
- logistica del vehiculo
- persistencia real en modo demo local
- codigo de reserva para seguimiento

### Consulta publica de reserva

Ruta: `/mi-reserva`

Incluye:

- busqueda por RUT + segundo dato de validacion
- visualizacion del estado actual
- cancelacion por cliente
- reagendamiento controlado segun cupos disponibles

### Admin

Ruta: `/admin`

Secciones:

- **Dashboard:** resumen operativo y metricas basicas
- **Reservas:** listado, filtros, cambio de estado, detalle, eliminacion, creacion manual
- **Clientes:** vista CRM basica derivada desde historial real
- **Galeria:** subir, editar, reemplazar, destacar y eliminar imagenes
- **Contenido web:** editar hero, secciones, servicios, testimonios y CTA
- **Productos:** control simple de stock y consumo por servicio
- **Configuracion:** WhatsApp, email, cobertura, horarios, redes y estado del runtime

## 6. Estructura relevante del proyecto

```text
app_pedro/
├─ content/
│  └─ garage-demo/              # persistencia demo local generada en runtime
├─ public/
│  └─ uploads/                  # imagenes subidas desde admin
├─ src/
│  ├─ app/                      # rutas App Router
│  ├─ actions/                  # server actions
│  ├─ components/               # UI publica y admin
│  ├─ lib/                      # store, auth demo, runtime config, schema
│  ├─ appData/                  # identidad base y catalogos
│  └─ utils/                    # helpers de calendario y UI
├─ supabase/
│  └─ schema.sql                # base SQL para migracion futura
├─ .env.example
├─ .gitignore
└─ README.md
```

## 7. Instalacion local

### Requisitos

- Node.js 18+ recomendado
- npm

### Instalar dependencias

```powershell
cd "C:\Users\Maxi Barrios\Desktop\Pedro_web\app_pedro"
npm install
```

### Correr en desarrollo

```powershell
npm.cmd run dev
```

Abrir:

```text
http://localhost:3000
```

### Build de produccion

```powershell
npm.cmd run build
npm.cmd run start
```

## 8. Scripts

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

## 9. Variables de entorno

Usa `.env.example` como base.

### Variables activas hoy

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DEMO_MODE=true
DATA_PROVIDER=demo
CONTACT_FORM_ACTION_URL=
```

### Variables preparadas para Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=garage-zona-cero
```

### Significado

- `NEXT_PUBLIC_SITE_URL`: URL base del proyecto
- `DEMO_MODE`: habilita acceso libre a `/admin`; si no se define, el proyecto ahora lo considera activo por defecto
- `DATA_PROVIDER`: hoy soporta `demo`; `supabase` queda como siguiente etapa
- `CONTACT_FORM_ACTION_URL`: webhook opcional para duplicar notificaciones
- variables `SUPABASE_*`: preparacion para persistencia y auth reales

## 10. Persistencia actual

Actualmente el proyecto usa persistencia por archivos JSON locales en:

```text
content/garage-demo/
```

Archivos esperados:

- `bookings.json`
- `gallery.json`
- `site-content.json`
- `settings.json`
- `products.json`
- `service-product-usage.json`

Las imagenes cargadas desde `/admin/galeria` se guardan en:

```text
public/uploads/
```

## 11. Modo demo y acceso al admin

Mientras:

```env
DEMO_MODE=true
```

el panel queda accesible sin login en:

```text
/admin
```

Cuando:

```env
DEMO_MODE=false
```

la estructura queda preparada para auth futura y el panel deja de abrirse libremente.

Si `DEMO_MODE` no existe en el entorno, el comportamiento por defecto es `true`.

Puntos de extension:

- `src/lib/admin-auth.ts`
- `src/lib/runtime-config.ts`

## 12. SQL para Supabase

Se dejo el esquema base en:

```text
supabase/schema.sql
```

Incluye tablas para:

- `site_content`
- `site_settings`
- `services`
- `testimonials`
- `gallery_items`
- `bookings`
- `booking_history`
- `products`
- `service_product_usage`

Tambien crea:

- funcion trigger para `updated_at`
- indice unico parcial para evitar doble reserva activa en misma fecha/ventana
- bucket `garage-zona-cero`

## 13. Despliegue en Vercel

### Importante

**La landing se puede desplegar en Vercel, pero la persistencia local por archivos no es una solucion valida para produccion en Vercel.**

Motivo:

- Vercel no garantiza persistencia de escritura local entre ejecuciones
- las server actions que hoy escriben en `content/garage-demo` y `public/uploads` no deben considerarse persistencia de produccion

### Que si funcionara hoy en Vercel

- la parte visual publica
- la navegacion
- el render general del sitio
- lectura de contenido ya generado

### Que no debes considerar productivo en Vercel sin Supabase

- reservas persistentes en archivos
- subida de imagenes al filesystem
- cambios admin que dependan de escritura local

### Camino correcto para Vercel

1. Crear proyecto en Supabase.
2. Ejecutar `supabase/schema.sql`.
3. Configurar variables `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
4. Reemplazar la capa local de `src/lib/site-store.ts` por adaptador Supabase.
5. Migrar uploads al bucket de Supabase Storage.
6. Activar auth real para `/admin`.
7. Desplegar en Vercel.

## 14. Publicacion en GitHub

Flujo esperado:

```powershell
git init
git add .
git commit -m "feat: zona cero garage demo app"
git branch -M main
git remote add origin https://github.com/Maxbarrioslopez/web_detailing.git
git push -u origin main
```

## 15. Checklist recomendado antes de produccion

- mover persistencia a Supabase
- mover uploads a Storage
- proteger `/admin`
- definir RLS / roles
- revisar UX final mobile
- conectar dominio real
- completar metadata final de marca
- reemplazar assets demo por galeria definitiva del negocio

## 16. Notas finales

- Esta base ya es util para demo comercial, presentacion a cliente y validacion de flujos.
- Para despliegue serio de reservas, clientes e imagenes en Vercel, el siguiente paso obligatorio es salir de filesystem local y conectar Supabase.

import AdminNotice from '@/components/Admin/AdminNotice'
import {
  createProductAction,
  deleteProductAction,
  deleteServiceProductUsageAction,
  updateProductAction,
  upsertServiceProductUsageAction,
} from '@/actions/admin'
import { getProducts, getServiceUsageSummaries } from '@/lib/site-store'

type ProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const fieldClassName =
  'mt-2 w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none'

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const params = searchParams ? await searchParams : undefined
  const query = (getSingleValue(params?.q) || '').toLowerCase()
  const [products, serviceSummaries] = await Promise.all([getProducts(), getServiceUsageSummaries()])

  const filteredProducts = products.filter((product) => {
    if (!query) {
      return true
    }

    return [product.name, product.category, product.unit].join(' ').toLowerCase().includes(query)
  })

  const lowStockProducts = products.filter(
    (product) => product.active && product.stockCurrent <= product.stockMinimum,
  )
  const activeProducts = products.filter((product) => product.active).length
  const mappedServices = serviceSummaries.filter((summary) => summary.products.length > 0).length
  const estimatedCost = serviceSummaries.reduce((total, summary) => total + summary.estimatedCost, 0)

  return (
    <>
      <section className="section-shell px-5 py-6 sm:px-6 sm:py-7">
        <div className="relative z-10 space-y-5">
          <div className="space-y-3">
            <p className="eyebrow text-xs font-semibold text-accent">Productos</p>
            <h1 className="display-font text-4xl leading-tight text-ink sm:text-5xl">
              Base operativa de stock y consumo.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted">
              Este modulo deja lista una capa simple para saber que productos se usan, cuanto stock
              queda y que costo estimado arrastra cada servicio.
            </p>
          </div>

          <AdminNotice
            message={getSingleValue(params?.notice)}
            type={getSingleValue(params?.noticeType)}
          />

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <article className="glass-panel rounded-[24px] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-accent">Productos</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{products.length}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{activeProducts} activos para uso.</p>
            </article>
            <article className="glass-panel rounded-[24px] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-accent">Stock bajo</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{lowStockProducts.length}</p>
              <p className="mt-2 text-sm leading-7 text-muted">
                Alertas sobre minimo definido.
              </p>
            </article>
            <article className="glass-panel rounded-[24px] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-accent">
                Servicios mapeados
              </p>
              <p className="mt-2 text-3xl font-semibold text-ink">{mappedServices}</p>
              <p className="mt-2 text-sm leading-7 text-muted">
                Servicios con consumo estimado.
              </p>
            </article>
            <article className="glass-panel rounded-[24px] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-accent">
                Costo estimado
              </p>
              <p className="mt-2 text-3xl font-semibold text-ink">
                ${estimatedCost.toFixed(2)}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">
                Sumatoria de consumos por servicio.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
            Crear producto
          </p>
          <form action={createProductAction} className="mt-4 grid gap-4">
            <input type="hidden" name="redirectTo" value="/admin/productos" />

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-muted">
                Nombre
                <input name="name" className={fieldClassName} required />
              </label>
              <label className="text-sm text-muted">
                Categoria
                <input name="category" className={fieldClassName} required />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-sm text-muted">
                Unidad
                <input name="unit" placeholder="ml, un, paqo" className={fieldClassName} required />
              </label>
              <label className="text-sm text-muted">
                Stock actual
                <input
                  type="number"
                  name="stockCurrent"
                  min="0"
                  step="0.01"
                  className={fieldClassName}
                  required
                />
              </label>
              <label className="text-sm text-muted">
                Stock minimo
                <input
                  type="number"
                  name="stockMinimum"
                  min="0"
                  step="0.01"
                  className={fieldClassName}
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <label className="text-sm text-muted">
                Costo unitario
                <input
                  type="number"
                  name="unitCost"
                  min="0"
                  step="0.01"
                  className={fieldClassName}
                  required
                />
              </label>
              <label className="flex items-end gap-3 rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-ink">
                <input type="checkbox" name="active" defaultChecked className="size-4" />
                Producto activo
              </label>
            </div>

            <button type="submit" className="cta-primary rounded-2xl px-5 py-4 text-sm font-semibold">
              Crear producto
            </button>
          </form>
        </div>

        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
            Asociar producto a servicio
          </p>
          <form action={upsertServiceProductUsageAction} className="mt-4 grid gap-4">
            <input type="hidden" name="redirectTo" value="/admin/productos" />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-muted">
                Servicio
                <select name="serviceId" className={fieldClassName} required defaultValue="">
                  <option value="" disabled>
                    Selecciona un servicio
                  </option>
                  {serviceSummaries.map((summary) => (
                    <option key={summary.service.id} value={summary.service.id}>
                      {summary.service.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-muted">
                Producto
                <select name="productId" className={fieldClassName} required defaultValue="">
                  <option value="" disabled>
                    Selecciona un producto
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="text-sm text-muted">
              Cantidad estimada por servicio
              <input
                type="number"
                name="estimatedQuantity"
                min="0"
                step="0.01"
                className={fieldClassName}
                required
              />
            </label>

            <button type="submit" className="cta-secondary rounded-2xl px-5 py-4 text-sm font-semibold">
              Guardar consumo estimado
            </button>
          </form>
        </div>
      </section>

      <section className="glass-panel rounded-[28px] p-5 sm:p-6">
        <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
              Inventario
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              {filteredProducts.length} productos visibles
            </h2>
          </div>

          <form className="flex w-full max-w-sm gap-3">
            <input
              name="q"
              defaultValue={query}
              placeholder="Buscar producto o categoria"
              className="w-full rounded-xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4 py-3 text-sm text-ink outline-none"
            />
            <button
              type="submit"
              className="cta-secondary shrink-0 rounded-full px-4 py-3 text-sm font-semibold">
              Buscar
            </button>
          </form>
        </div>

        <div className="mt-5 grid gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const updateAction = updateProductAction.bind(null, product.id)
              const removeAction = deleteProductAction.bind(null, product.id)
              const isLowStock = product.active && product.stockCurrent <= product.stockMinimum

              return (
                <article
                  key={product.id}
                  className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                  <form action={updateAction} className="grid gap-4">
                    <input type="hidden" name="redirectTo" value="/admin/productos" />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-ink">{product.name}</p>
                        <p className="text-sm leading-7 text-muted">
                          {product.category} - {product.unit}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={[
                            'rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em]',
                            isLowStock
                              ? 'border border-[rgba(241,184,127,0.25)] bg-[rgba(241,184,127,0.08)] text-[#f7d0aa]'
                              : 'border border-[rgba(197,154,90,0.18)] bg-[rgba(197,154,90,0.08)] text-accent',
                          ].join(' ')}>
                          {isLowStock ? 'Stock bajo' : product.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <label className="text-sm text-muted">
                        Nombre
                        <input name="name" defaultValue={product.name} className={fieldClassName} />
                      </label>
                      <label className="text-sm text-muted">
                        Categoria
                        <input
                          name="category"
                          defaultValue={product.category}
                          className={fieldClassName}
                        />
                      </label>
                      <label className="text-sm text-muted">
                        Unidad
                        <input name="unit" defaultValue={product.unit} className={fieldClassName} />
                      </label>
                      <label className="text-sm text-muted">
                        Costo unitario
                        <input
                          type="number"
                          name="unitCost"
                          min="0"
                          step="0.01"
                          defaultValue={product.unitCost}
                          className={fieldClassName}
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                      <label className="text-sm text-muted">
                        Stock actual
                        <input
                          type="number"
                          name="stockCurrent"
                          min="0"
                          step="0.01"
                          defaultValue={product.stockCurrent}
                          className={fieldClassName}
                        />
                      </label>
                      <label className="text-sm text-muted">
                        Stock minimo
                        <input
                          type="number"
                          name="stockMinimum"
                          min="0"
                          step="0.01"
                          defaultValue={product.stockMinimum}
                          className={fieldClassName}
                        />
                      </label>
                      <label className="flex items-end gap-3 rounded-[20px] border border-white/8 bg-black/20 px-4 py-3 text-sm text-ink">
                        <input type="checkbox" name="active" defaultChecked={product.active} className="size-4" />
                        Activo
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        className="cta-secondary rounded-full px-4 py-3 text-sm font-semibold">
                        Guardar producto
                      </button>
                      <button
                        type="submit"
                        formAction={removeAction}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#f7d0aa] transition hover:border-[rgba(241,184,127,0.3)]">
                        Eliminar
                      </button>
                    </div>
                  </form>
                </article>
              )
            })
          ) : (
            <div className="rounded-[22px] border border-dashed border-white/10 bg-black/20 p-6 text-sm leading-7 text-muted">
              No hay productos para esa busqueda.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-2">
        {serviceSummaries.map((summary) => (
          <article key={summary.service.id} className="glass-panel rounded-[28px] p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/8 pb-4">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
                  Consumo por servicio
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">{summary.service.name}</h2>
              </div>
              <span className="rounded-full border border-[rgba(197,154,90,0.18)] bg-[rgba(197,154,90,0.08)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-accent">
                ${summary.estimatedCost.toFixed(2)}
              </span>
            </div>

            <p className="mt-3 text-sm leading-7 text-muted">{summary.service.description}</p>

            <div className="mt-4 space-y-3">
              {summary.products.length > 0 ? (
                summary.products.map((usage) => {
                  const removeUsageAction = deleteServiceProductUsageAction.bind(null, usage.id)

                  return (
                    <div
                      key={usage.id}
                      className="rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                      <form action={upsertServiceProductUsageAction} className="grid gap-4">
                        <input type="hidden" name="redirectTo" value="/admin/productos" />
                        <input type="hidden" name="id" value={usage.id} />
                        <input type="hidden" name="serviceId" value={summary.service.id} />
                        <input type="hidden" name="productId" value={usage.product.id} />

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold text-ink">{usage.product.name}</p>
                            <p className="text-sm leading-7 text-muted">
                              {usage.product.category} - {usage.product.unit}
                            </p>
                          </div>
                          <p className="text-sm leading-7 text-muted">
                            Costo estimado: ${usage.estimatedCost.toFixed(2)}
                          </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                          <label className="text-sm text-muted">
                            Cantidad estimada
                            <input
                              type="number"
                              name="estimatedQuantity"
                              min="0"
                              step="0.01"
                              defaultValue={usage.estimatedQuantity}
                              className={fieldClassName}
                            />
                          </label>

                          <div className="flex flex-wrap items-end gap-3">
                            <button
                              type="submit"
                              className="cta-secondary rounded-full px-4 py-3 text-sm font-semibold">
                              Guardar
                            </button>
                            <button
                              type="submit"
                              formAction={removeUsageAction}
                              className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#f7d0aa] transition hover:border-[rgba(241,184,127,0.3)]">
                              Quitar
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )
                })
              ) : (
                <div className="rounded-[20px] border border-dashed border-white/10 bg-black/20 p-5 text-sm leading-7 text-muted">
                  Este servicio aun no tiene productos asociados.
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  )
}

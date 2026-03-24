type AdminStatCardProps = {
  label: string
  value: string | number
  detail: string
}

const AdminStatCard = ({ label, value, detail }: AdminStatCardProps) => {
  return (
    <article className="metal-card rounded-[24px] p-5">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent">
        {label}
      </p>
      <p className="display-font mt-3 text-4xl text-ink">{value}</p>
      <p className="mt-3 text-sm leading-7 text-muted">{detail}</p>
    </article>
  )
}

export default AdminStatCard

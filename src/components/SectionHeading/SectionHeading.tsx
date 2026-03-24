interface SectionHeadingTypes {
  title: string
  subtitle?: string
  className?: string
}

const SectionHeading: React.FC<SectionHeadingTypes> = ({ title, subtitle, className }) => {
  // Limpieza de títulos legacy
  const cleanTitle = (title || '').replace(/\/\/(.*)/, '').replace(/Projects|Skills|Testimonials|Services|Offers/gi, '').trim()
  return (
    <div className={`mb-8 ${className || ''}`}>
      <h2 className="text-3xl font-bold text-accent">
        {cleanTitle}
      </h2>
      {subtitle && <p className="text-tertiary-content mt-5 text-lg text-pretty">{subtitle}</p>}
    </div>
  )
}

export default SectionHeading

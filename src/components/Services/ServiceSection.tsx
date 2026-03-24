import SectionHeading from '../SectionHeading/SectionHeading'
import ServiceCard from './ServiceCard'

const detailingServices = [
  {
    icon: '/images/logo/auto_logo1.jpg',
    title: 'Detailing Exterior Premium',
    shortDescription: 'Lavado a mano, descontaminado, pulido y protección cerámica para un brillo inigualable.'
  },
  {
    icon: '/images/logo/logo2.jpg',
    title: 'Detailing Interior',
    shortDescription: 'Limpieza profunda de tapizados, plásticos y alfombras. Higienización y protección.'
  },
  {
    icon: '/images/logo/auto_logo1.jpg',
    title: 'Tratamiento Cerámico',
    shortDescription: 'Protección avanzada para pintura, vidrios y llantas. Durabilidad y repelencia extrema.'
  },
  {
    icon: '/images/logo/logo2.jpg',
    title: 'Restauración de Faros',
    shortDescription: 'Recuperación de transparencia y protección UV para máxima seguridad y estética.'
  },
  {
    icon: '/images/logo/auto_logo1.jpg',
    title: 'Lavado Premium',
    shortDescription: 'Lavado a mano con productos de alta gama, secado sin contacto y detalles de terminación.'
  },
]

const ServiceSection = () => {
  return (
    <section id="services" className="my-14">
      <SectionHeading
        title="Servicios Premium"
        subtitle="Especialistas en detailing automotriz: restauración, protección y estética profesional."
      />
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 md:mt-[3.75rem] md:grid-cols-3">
        {detailingServices.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            shortDescription={service.shortDescription}
          />
        ))}
      </div>
    </section>
  )
}

export default ServiceSection

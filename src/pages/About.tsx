import { motion } from 'framer-motion';
import { Target, Eye, Heart, Award } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Mision',
    description: 'Ofrecer moda premium accesible que inspire confianza y elegancia en cada persona que vista nuestras prendas.',
  },
  {
    icon: Eye,
    title: 'Vision',
    description: 'Ser la marca de referencia en moda minimalista de lujo en Latinoamerica, reconocida por calidad y sostenibilidad.',
  },
  {
    icon: Heart,
    title: 'Valores',
    description: 'Compromiso con la calidad, respeto al medio ambiente, transparencia en nuestros procesos y excelencia en el servicio.',
  },
  {
    icon: Award,
    title: 'Calidad',
    description: 'Seleccionamos cuidadosamente cada material y proceso de fabricacion para garantizar productos excepcionales.',
  },
];

export function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop"
          alt="Sobre LUXE"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-3xl md:text-5xl font-montserrat font-bold text-white uppercase tracking-wider mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-lg font-montserrat text-white/90 max-w-xl mx-auto">
            Elegancia minimalista para tu estilo de vida
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center bg-luxe-gray-light aspect-[4/3]"
            >
              <img
                src="/Logo.png"
                alt="Logo LUXE"
                className="max-w-[60%] max-h-[60%] object-contain"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-6">
                Nuestra Historia
              </h2>
              <p className="text-sm font-montserrat text-luxe-gray-medium leading-relaxed mb-4">
                LUXE nacio de la pasion por la moda contemporanea y el deseo de ofrecer prendas que combinen elegancia atemporal con un enfoque minimalista. Desde nuestros inicios, nos hemos dedicado a crear piezas que trasciendan las tendencias pasajeras.
              </p>
              <p className="text-sm font-montserrat text-luxe-gray-medium leading-relaxed">
                Cada coleccion es cuidadosamente disenada para aquellos que valoran la calidad sobre la cantidad, y buscan construir un guardarropa versatil y sofisticado que refleje su personalidad unica.
              </p>
            </motion.div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-luxe-gray-light flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-luxe-black" />
                </div>
                <h3 className="text-sm font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-3">
                  {value.title}
                </h3>
                <p className="text-xs font-montserrat text-luxe-gray-medium leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

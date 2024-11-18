import { FaCheck, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    title: "Standard",
    monthlyPrice: 10,
    buttonText: "Inicia ahora",
    popular: false,
    inverse: false,
    features: [
      "3 meses gratis sin compromiso de permanencia",
      "Administración de tus vehículos",
      "Servicios de mantenimiento de vehículos",
      "Gestión de stock de respuestos y proveedores",
      "Reservas de vehículos",
      "Gestión avanzada de roles y permisos",
      "Reportes y analíticas",
    ],
    notIncluded: [
      "Optimización de rutas en tiempo real",
      "Monitoreo real time de tu flota",
      "Alertas y rotación de guardias",
      "Controles automáticos de bajo stock",
      "Mantenimiento predictivo de vehiculos con AI",]
  },
  {
    title: "Pro",
    monthlyPrice: 20,
    buttonText: "Inicia ahora",
    popular: false,
    inverse: false,
    features: [
      "3 meses gratis sin compromiso de permanencia",
      "Administración de tus vehículos",
      "Servicios de mantenimiento de vehículos",
      "Gestión de stock de respuestos y proveedores",
      "Reservas de vehículos",
      "Gestión avanzada de roles y permisos",
      "Reportes y analíticas",
      "Optimización de rutas en tiempo real",
      "Monitoreo real time de tu flota",
    ],
    notIncluded: [

      "Alertas y rotación de guardias",
      "Controles automáticos de bajo stock",
      "Mantenimiento predictivo de vehiculos con AI",

    ]
  },
  {
    title: "Ejecutivo",
    monthlyPrice: 25,
    buttonText: "Inicia ahora",
    popular: true,
    inverse: true,
    features: [
      "3 meses gratis sin compromiso de permanencia",
      "Administración de tus vehículos",
      "Servicios de mantenimiento de vehículos",
      "Gestión de stock de respuestos y proveedores",
      "Reservas de vehículos",
      "Gestión avanzada de roles y permisos",
      "Reportes y analíticas",
      "Optimización de rutas en tiempo real",
      "Monitoreo real time de tu flota",
      "Alertas y rotación de guardias",

      "Controles automáticos de bajo stock",
      "Mantenimiento predictivo de vehiculos con AI",
    ],
    notIncluded: []
  },
];

const Pricing = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6 sm:px-8">
        <div className="section-heading text-center px-6 sm:px-8 md:px-16">
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-semibold text-white">Planes adaptados a tu flota</h2>
          <p className="section-description mt-5 text-lg sm:text-xl md:text-2xl text-gray-300">
            Desde pequeñas flotas hasta grandes empresas, tenemos la solución perfecta para optimizar la gestión de tus vehículos y maximizar tu eficiencia operativa.

          </p>
        </div>
        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-start lg:justify-center  lg:gap-8">
          {pricingTiers.map(
            (
              { title, monthlyPrice, buttonText, popular, inverse, features, notIncluded },
              index
            ) => (
              <div
                key={`${title}-${index}`}
                className={`card p-6 rounded-lg w-full sm:w-96 md:w-80 lg:w-96 
                  ${inverse ? "border-gray-300 bg-gray-900 text-white/60" : "border-gray-600 bg-gray-700"}`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white/50">{title}</h3>
                  {popular && (
                    <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
                      <motion.span
                        animate={{
                          backgroundPositionX: '100%',
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                          repeatType: 'loop',
                        }}
                        className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] [background-size:200%] text-transparent bg-clip-text font-medium">
                        Más popular
                      </motion.span>
                    </div>)
                  }
                </div>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-bold tracking-tighter leading-none">
                    ${monthlyPrice}
                  </span>
                  <span className="tracking-tighter font-bold text-white/50">
                    /mes
                  </span>
                </div>
                <button className="btn btn-primary w-full mt-6">
                  {buttonText}
                </button>
                <ul className="flex flex-col gap-5 mt-8">
                  {features.map((feature, index) => (
                    <li
                      key={`${feature}-${index}`}
                      className="text-sm flex items-center gap-4"
                    >
                      <FaCheck className="h-6 w-6 text-blue-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {notIncluded.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="text-sm flex items-center gap-4"
                    >
                      <FaTimes className="h-6 w-6 text-red-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

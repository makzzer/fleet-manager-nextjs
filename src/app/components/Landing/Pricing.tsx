import { FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    title: "Gratis",
    monthlyPrice: 0,
    buttonText: "Inicia una prueba gratuita",
    popular: false,
    inverse: false,
    features: [
      "Gestión de hasta 10 vehículos",
      "Seguimiento básico de mantenimiento",
      "Registro de conductores",
      "Alertas de mantenimiento programado",
      "Informes mensuales básicos",
      "Soporte por correo electrónico",
    ],
  },
  {
    title: "Pro",
    monthlyPrice: 10,
    buttonText: "Inicia ahora",
    popular: true,
    inverse: true,
    features: [
      "Gestión de hasta 50 vehículos",
      "Seguimiento avanzado de mantenimiento",
      "Gestión completa de usuarios",
      "Reservas de vehículos",
      "Seguimiento GPS en tiempo real",
      "Alertas personalizadas",
      "Gestión de repuestos y stock",
      "Informes detallados y análisis",
      "Integración con proveedores",
      "Ingreación con QR",
    ],
  },
  {
    title: "Ejecutivo",
    monthlyPrice: 25,
    buttonText: "Inicia ahora",
    popular: false,
    inverse: false,
    features: [
      "Gestión ilimitada de vehículos",
      "Mantenimiento predictivo con IA",
      "Gestión avanzada de roles y permisos",
      "Optimización de rutas en tiempo real",
      "Integración IoT para diagnóstico avanzado",
      "Análisis predictivo de costos y eficiencia",
      "Gestión automatizada de órdenes de compra",
      "Informes personalizados y dashboards",
      "API para integraciones personalizadas",
      "Soporte dedicado 24/7",
    ],
  },
];

const Pricing = () => {
  return (
    <section className="py-24">
      <div>
        <div className="section-heading">
        <h2 className="section-title">Planes adaptados a tu flota</h2>
        <p className="section-description mt-5">
        Desde pequeñas flotas hasta grandes empresas, tenemos la solución perfecta para optimizar la gestión de tus vehículos y maximizar tu eficiencia operativa.

        </p>
        </div>
        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
          {pricingTiers.map(
            (
              { title, monthlyPrice, buttonText, popular, inverse, features },
              index
            ) => (
              <div
                key={`${title}-${index}`}
                className={`card 
                  ${inverse 
                    ? "border-gray-300 bg-gray-900 text-white/60"
                  : "border-gray-600 bg-gray-700"}`}
              >
                <div className="flex justify-between">
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
                <div className="flex items-baseline gap-1 mt-[30px]">
                  <span className="text-4xl font-bold tracking-tighter leading-none">
                    ${monthlyPrice}
                  </span>
                  <span className="tracking-tighter font-bold text-white/50">
                    /mes
                  </span>
                </div>
                <button className="btn btn-primary w-full mt-[30px]">
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

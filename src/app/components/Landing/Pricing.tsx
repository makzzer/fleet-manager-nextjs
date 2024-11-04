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
      "Capacidad para hasta 10 vehículos",
      "Integración con QR",
      "Soporte basico",
      "Gestión basica de respuestos",
    ],
  },
  {
    title: "Pro",
    monthlyPrice: 10,
    buttonText: "Inicia ahora",
    popular: true,
    inverse: true,
    features: [
      "Capacidad para hasta 10 vehículos",
      "Integración con QR",
      "Soporte basico",
      "Gestión basica de respuestos",
    ],
  },
  {
    title: "Ejecutivo",
    monthlyPrice: 25,
    buttonText: "Inicia ahora",
    popular: false,
    inverse: false,
    features: [
      "Capacidad para hasta 10 vehículos",
      "Integración con QR",
      "Soporte basico",
      "Gestión basica de respuestos",
    ],
  },
];

const Pricing = () => {
  return (
    <section className="py-24">
      <div>
        <div className="section-heading">
        <h2 className="section-title">Pricing</h2>
        <p className="section-description mt-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Exercitationem laudantium omnis soluta cumque, reprehenderit amet.
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
                    ? "border-gray-300 bg-gray-400 text-black/60"
                  : "border-gray-900"}`}
              >
                <div className="flex justify-between">
                  <h3 className="text-lg font-bold text-white/50">{title}</h3>
                  {popular && (
                  <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-black/20">
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
                      Popular
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
                      <FaCheck className="h-6 w-6" />
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

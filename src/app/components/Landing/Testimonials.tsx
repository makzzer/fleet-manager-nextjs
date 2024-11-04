import { motion } from "framer-motion";
import React from "react";
import { FaUser } from "react-icons/fa";

const testimonials = [
  {
    text: "La app ha sido clave para mejorar la eficiencia en la gestión de nuestra flota. Con las alertas automáticas de mantenimiento, nos hemos ahorrado muchísimas averías y costos.",
    imageSrc: <FaUser className="h-10 w-10 rounded-full" />,
    name: "Carlos Méndez",
    username: "@carlosFleetManager",
  },
  {
    text: "La integración con los reportes de consumo de combustible es fantástica. Ahora podemos identificar qué vehículos están gastando más y optimizar nuestras rutas.",
    imageSrc: <FaUser className="h-10 w-10 rounded-full" />,
    name: "Ana Ramírez",
    username: "@anaRami",
  },
  {
    text: "Antes llevábamos todo en papel, pero esta app ha simplificado todo. La función de geoposicionamiento y las alertas nos permiten saber dónde está cada vehículo en tiempo real.",
    imageSrc: <FaUser className="h-10 w-10 rounded-full" />,
    name: "Luis Pérez",
    username: "@luisAutoTrack",
  },
  {
    text: "La función de reservas es una maravilla. Nos permite organizar el uso de los vehículos de manera eficiente y evitar conflictos entre los operadores.",
    imageSrc: <FaUser className="h-10 w-10 rounded-full" />,
    name: "Beatriz Ortega",
    username: "@beatrizO",
  },
  {
    text: "Gracias a la sección de analíticas, ahora tengo un control detallado del rendimiento de nuestra flota. Puedo ver de un vistazo qué vehículos necesitan atención urgente.",
    imageSrc: <FaUser className="h-10 w-10 rounded-full" />,
    name: "Marcos Salgado",
    username: "@marcosS",
  },
  {
    text: "Me encanta que puedo gestionar los pedidos de repuestos directamente desde la app. La generación automática de órdenes de compra nos ahorra mucho tiempo.",
    imageSrc: <FaUser className="h-10 w-10 rounded-full" />,
    name: "Laura Navarro",
    username: "@lauraFleetAdmin",
  },
  {
    text: "Las alertas en tiempo real nos han permitido reducir accidentes y asegurar que cada vehículo esté en óptimas condiciones. Es una herramienta esencial para nuestra empresa.",
    imageSrc: <FaUser className="h-10 w-10 rounded-full" />,
    name: "Rafael Gómez",
    username: "@rafaFleetSafety",
  },
  {
    text: "Con esta app, el seguimiento de los vehículos es mucho más fácil. Puedo ver rutas, historial de mantenimientos, y generar reportes detallados en segundos.",
    imageSrc: <FaUser className="h-10 w-10 rounded-full" />,
    name: "Isabel Flores",
    username: "@isabelFleets",
  },
  {
    text: "La app es increíblemente intuitiva. Desde que la usamos, hemos reducido el tiempo de inactividad de la flota y optimizado el inventario de repuestos.",
    imageSrc: <FaUser className="h-10 w-10 rounded-full" />,
    name: "José Villalobos",
    username: "@joseVAutoFleet",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: { testimonials: typeof testimonials, customClass?: string, customDuration?: number }) => {
  return (
    <div className={`${props.customClass && props.customClass}`}>
    <motion.div 
    animate={{
      translateY: "-50%",
    }}
    transition={{
      duration: props.customDuration || 10,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
    }}
    className={`flex flex-col gap-6 pb-6`}>
      {[...new Array(2)].fill(0).map((_, index) => (
        <React.Fragment key={index}>
          {props.testimonials.map(({ text, imageSrc, name, username }, index) => (
        <div key={`${username}-${index}`} className="card border-gray-900">
          <div>{text}</div>
          <div className="flex items-center gap-2 mt-5">
            {imageSrc}
            <div className="flex flex-col">
              <div className="font-medium tracking-tight leading-5">{name}</div>
              <div className="leading-5 tracking-tight">{username}</div>
            </div>
          </div>
        </div>
      ))}
        </React.Fragment>
      ))}
    </motion.div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section>
      <div>
        <div className="section-heading">
        <div className="flex justify-center">
          <div className="tag">Testimonios</div>
        </div>
        <h2 className="section-title">Que dicen nuestros usuarios</h2>
        <p className="section-description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. At possimus
          porro non, suscipit facilis rem debitis iure consectetur quasi.
        </p>
        </div>
      </div>
      <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,white_25%,white_75%,transparent)] max-h-[738px] overflow-hidden">
        <TestimonialsColumn testimonials={firstColumn} customDuration={15} />
        <TestimonialsColumn testimonials={secondColumn} customClass="hidden md:block" customDuration={20} />
        <TestimonialsColumn testimonials={thirdColumn} customClass="hidden lg:block" customDuration={25} />
      </div>
    </section>
  );
};

export default Testimonials;

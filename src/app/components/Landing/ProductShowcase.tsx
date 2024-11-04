import { motion, useScroll, useTransform } from "framer-motion";
import dashboardImage from "../../../../public/landingMedia/dashboardSS.jpeg";
import Image from "next/image";
import { useRef } from "react";
const ProductShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  return (
    <section className="bg-gradient-to-b from-blue-950 to-gray-800 py-24">
      <div>
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Potencia tu Productividad</div>
          </div>
          <h2 className="section-title mt-5">
            Control Total de tu Flota en Una Plataforma
          </h2>
          <p className="section-description mt-5">
          Desde la gestión de repuestos hasta el seguimiento en tiempo real, Fleetfly te ofrece todas las herramientas que necesitas para maximizar la eficiencia de tu flota.
          </p>
        </div>
        <div className="overflow-hidden mt-10" ref={containerRef}>
        <motion.div
          style={{
            opacity: opacity,
            rotateX: rotateX,
            transformPerspective: "800px",
          }}
          className="flex justify-center"
        >
          <Image
            src={dashboardImage}
            alt={"Imagen del dashboard de la aplicación fleetfly"}
            className="max-w-5xl rounded-lg shadow-2xl"
            layout="responsive"
          />
        </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

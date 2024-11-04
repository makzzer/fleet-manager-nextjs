import { motion, useScroll, useTransform } from "framer-motion";
import dashboardImage from "../../../../public/landingMedia/dashboardSS.jpeg";
import Image from "next/image";
import { useRef } from "react";
const ProductShowcase = () => {
  const appImage = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({
    target: appImage,
    offset: ["start end", "end end"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  return (
    <section className="bg-gradient-to-b from-gray-800 to-gray-700 py-24">
      <div>
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Incrementa tu productividad</div>
          </div>
          <h2 className="section-title mt-5">
            La forma mas efectiva de seguir tu flota
          </h2>
          <p className="section-description mt-5">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Perspiciatis consequuntur nam eveniet adipisc.
          </p>
        </div>
        <motion.div
          style={{
            opacity: opacity,
            rotateX: rotateX,
            transformPerspective: "800px",
          }}
          className="mt-10 flex justify-center"
        >
          <Image
            src={dashboardImage}
            alt={"Imagen del dashboard de la aplicación fleetfly"}
            className="mt-10 max-w-5xl rounded-lg shadow-2xl"
            ref={appImage}
            layout="responsive"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;

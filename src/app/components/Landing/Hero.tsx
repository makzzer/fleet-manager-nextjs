import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="pt-8 pb-20 md:pt-5 md:pb-10 bg-gradient-to-b from-gray-900 to-blue-950 md:px-20">
      <div>
        <div className="md:flex items-center">
          <div className="md:w-[600px]">
            <div className="tag">
              Integración con IA
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mt-6">
              Impulsa tu <span className="text-blue-400">flota</span>
            </h1>
            <p className="text-xl text-gray-300 tracking-tight mt-6">
            Fleetfly revoluciona la gestión de flotas con tecnología avanzada. Desde mantenimiento predictivo hasta optimización de rutas, te ofrecemos el control total de tus vehículos.
            </p>
            <div className="flex gap-1 items-center mt-[30px]">
              <button className="btn btn-primary">Prueba gratuita</button>
              <button className="btn btn-text gap-1">
                <span>Mas información</span>
                <FaArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-20 md:mt-0">
            <Image
              src={"/landingMedia/truckDelivery.svg"}
              alt={"Imagen de un camión"}
              width={1300}
              height={648}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <section className="pt-8 pb-20 md:pt-10 md:pb-12 bg-gradient-to-b from-gray-900 to-blue-950 md:px-20">
      <div>
        <div className="flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-[600px] text-center md:text-left">
            <div className="tag mb-4 text-sm md:text-base">Integración con IA</div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-white mt-4 md:mt-6">
              Impulsa tu <span className="text-blue-400">flota</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 tracking-tight mt-4 md:mt-6">
              Fleetfly revoluciona la gestión de flotas con tecnología avanzada.
              Desde mantenimiento predictivo hasta optimización de rutas, te
              ofrecemos el control total de tus vehículos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
              <button className="btn btn-primary w-full sm:w-auto" onClick={handleLogin}>Prueba gratuita</button>
              <button className="btn btn-text gap-1 w-full sm:w-auto">
                <span>Mas información</span>
                <FaArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-10 md:mt-0 w-full md:w-auto">
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

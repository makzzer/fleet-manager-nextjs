import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#18488c,#1f2937_100%)] md:px-20">
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[600px]">
            <div className="tag">
              IA incoming
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-white to-[#18488c] text-transparent bg-clip-text mt-6">
              Impulsa tu flota
            </h1>
            <p className="text-xl text-gray-300 tracking-tight mt-6">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur
              magni doloribus ad possimus iure deleniti rerum architecto, omnis
              vel id impedit ipsum repellat cupiditate ex culpa ea sint cum?
              Aperiam?
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

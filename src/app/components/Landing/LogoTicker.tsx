import Image from "next/image";
import { motion } from "framer-motion";

const LogoTicker = () => {
  return (
    <div className="py-8 md:py-12 bg-blue-950">
      <div>
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <motion.div className="flex gap-40 flex-none pr-40"
            animate={{
              translateX: "-50%",
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
              repeatType: "loop",
            }}  
          >
            <Image
              src={'/landingMedia/enterprisesLogos/logo_andreani.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de Andreani"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={'/landingMedia/enterprisesLogos/logo_OCA.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de OCA"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={'/landingMedia/enterprisesLogos/logo_ups.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de UPS"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={'/landingMedia/enterprisesLogos/logo_esmax.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de Esmax"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={'/landingMedia/enterprisesLogos/logo_correo_argentino.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de Correo Argentino"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={'/landingMedia/enterprisesLogos/logo_dhl.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de DHL"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={'/landingMedia/enterprisesLogos/logo_fedex.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de FEDEX"}
              className="logo-ticker-image grayscale"
            />

            {/* Segundo set de logos para la animación */}
            <Image
              src={'/landingMedia/enterprisesLogos/logo_andreani.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de Andreani"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={'/landingMedia/enterprisesLogos/logo_OCA.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de OCA"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={'/landingMedia/enterprisesLogos/logo_ups.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de UPS"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={'/landingMedia/enterprisesLogos/logo_esmax.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de Esmax"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={'/landingMedia/enterprisesLogos/logo_correo_argentino.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de Correo Argentino"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={'/landingMedia/enterprisesLogos/logo_dhl.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de DHL"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={'/landingMedia/enterprisesLogos/logo_fedex.png'}
              width={1920}
              height={1080}
              alt={"Logotipo de FEDEX"}
              className="logo-ticker-image grayscale"
            />

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LogoTicker;

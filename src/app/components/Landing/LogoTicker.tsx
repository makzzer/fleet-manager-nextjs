import Image from "next/image";
import esmaxLogo from "../../../../public/landingMedia/enterprisesLogos/logo_esmax_bn.png";
import ocaLogo from "../../../../public/landingMedia/enterprisesLogos/logo_OCA_bn.png";
import upsLogo from "../../../../public/landingMedia/enterprisesLogos/logo_ups_bn.png";
import correoArgentinoLogo from "../../../../public/landingMedia/enterprisesLogos/logo_correo_argentino_bn.png";
import andreaniLogo from "../../../../public/landingMedia/enterprisesLogos/logo_andreani.png";
import dhlLogo from "../../../../public/landingMedia/enterprisesLogos/logo_dhl_bn.png";
import fedexLogo from "../../../../public/landingMedia/enterprisesLogos/logo_fedex_bn.png";

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
              src={andreaniLogo}
              alt={"Logotipo de Andreani"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={ocaLogo}
              alt={"Logotipo de OCA"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={upsLogo}
              alt={"Logotipo de UPS"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={esmaxLogo}
              alt={"Logotipo de Esmax"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={correoArgentinoLogo}
              alt={"Logotipo de Correo Argentino"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={dhlLogo}
              alt={"Logotipo de DHL"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={fedexLogo}
              alt={"Logotipo de FEDEX"}
              className="logo-ticker-image grayscale"
            />

            {/* Segundo set de logos para la animación */}
            <Image
              src={andreaniLogo}
              alt={"Logotipo de Andreani"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={ocaLogo}
              alt={"Logotipo de OCA"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={upsLogo}
              alt={"Logotipo de UPS"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={esmaxLogo}
              alt={"Logotipo de Esmax"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={correoArgentinoLogo}
              alt={"Logotipo de Correo Argentino"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={dhlLogo}
              alt={"Logotipo de DHL"}
              className="logo-ticker-image grayscale"
            />
            <Image
              src={fedexLogo}
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

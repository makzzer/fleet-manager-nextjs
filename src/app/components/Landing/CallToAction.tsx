import { FaArrowRight } from "react-icons/fa";

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-b from-blue-950 to-gray-800 py-24">
      <div className="container mx-auto px-6 sm:px-8">
        <div className="section-heading text-center">
        <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-semibold text-white mt-5">Comienza a Optimizar tu Flota Hoy</h2>
        <p className="section-description mt-5 text-lg sm:text-xl text-gray-300">Únete a las empresas líderes que ya están ahorrando tiempo y dinero con Fleetfly. Prueba nuestra plataforma sin compromiso y descubre el poder de una gestión de flota inteligente.</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
        <button className="btn btn-primary w-full sm:w-auto">
          Iniciar Prueba Gratuita
        </button>
        <button className="btn btn-text gap-1 w-full sm:w-auto">
            <span>
            Solicitar Demo
            </span>
            <FaArrowRight className="h-5 w-5"/>
        </button>
      </div>
    </section>
  );
}

export default CallToAction;
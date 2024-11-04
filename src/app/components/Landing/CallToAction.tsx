import { FaArrowRight } from "react-icons/fa";

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-24">
      <div>
        <div className="section-heading">
        <h2 className="section-title">Comienza a Optimizar tu Flota Hoy</h2>
        <p className="section-description mt-5">Únete a las empresas líderes que ya están ahorrando tiempo y dinero con Fleetfly. Prueba nuestra plataforma sin compromiso y descubre el poder de una gestión de flota inteligente.</p>
        </div>
      </div>
      <div className="flex gap-2 mt-10 justify-center">
        <button className="btn btn-primary">Iniciar Prueba Gratuita</button>
        <button className="btn btn-text gap-1">
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
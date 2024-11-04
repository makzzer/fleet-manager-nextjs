import { FaArrowRight } from "react-icons/fa";

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-b from-gray-800 to-gray-700 py-24">
      <div className="container">
        <div className="section-heading">
        <h2 className="section-title">Inicia gratis hoy</h2>
        <p className="section-description mt-5">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias expedita labore, dolor non minus, est perspiciatis dignissimos.</p>
        </div>
      </div>
      <div className="flex gap-2 mt-10 justify-center">
        <button className="btn btn-primary">Obtener gratis</button>
        <button className="btn btn-text gap-1">
            <span>
            Mas información
            </span>
            <FaArrowRight className="h-5 w-5"/>
          </button>
      </div>
    </section>
  );
}

export default CallToAction;
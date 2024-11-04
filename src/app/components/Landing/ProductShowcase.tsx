import dashboardImage from '../../../../public/landingMedia/dashboardSS.jpeg'
import Image from 'next/image'
const ProductShowcase = () => {

  return (
    <section className='bg-gradient-to-b from-gray-800 to-gray-700 py-24'>
      <div>
        <div className='section-heading'>
        <div className='flex justify-center'>
          <div className='tag'>Incrementa tu productividad</div>
        </div>
        <h2 className='section-title mt-5'>La forma mas efectiva de seguir tu flota</h2>
        <p className='section-description mt-5'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis consequuntur nam eveniet adipisc.</p>
      </div>
      <Image src={dashboardImage} alt={"Imagen del dashboard de la aplicación fleetfly"} className='px-10 mt-10'/>
    </div>
    </section>
  );
}

export default ProductShowcase;
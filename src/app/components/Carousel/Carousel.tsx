import React, { useCallback, useEffect } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { Vehiculo } from '../../context/VehiculoContext'
import { FaCar, FaTruck, FaMotorcycle, FaCaravan } from 'react-icons/fa'


type PropType = {
  vehicles: Vehiculo[]
  options?: EmblaOptionsType
  onSelectVehicle: (vehicleId: string) => void
  selectedVehicleId: string | null
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { vehicles, options, onSelectVehicle, selectedVehicleId } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    const selectedIndex = emblaApi.selectedScrollSnap()
    const selectedVehicle = vehicles[selectedIndex]
    onSelectVehicle(selectedVehicle.id)
  }, [emblaApi, vehicles, onSelectVehicle])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const typeIcons = (type: string, fuelType: string) => {
    const iconClass = `text-2xl font-bold ${fuelType === 'NAPHTHA' ? 'text-amber-400' : fuelType === 'DIESEL' ? 'text-red-400' : fuelType === 'GAS' ? 'text-gray-400' : 'text-cyan-400'}`
    switch (type) {
      case 'CAR':
        return <FaCar className={iconClass} />
      case 'TRUCK':
        return <FaTruck className={iconClass} />
      case 'MOTORCYCLE':
        return <FaMotorcycle className={iconClass} />
      default: 
        return <FaCaravan className={iconClass}/>
    }
  }

  const handleCardClick = (vehicleId: string) => {
    onSelectVehicle(vehicleId)
    const clickedIndex = vehicles.findIndex(v => v.id === vehicleId)
    if (emblaApi) {
      emblaApi.scrollTo(clickedIndex)
    }
  }


  return (
    <section className="embla h-[250px]">
      <div className="embla__viewport min-h-full" ref={emblaRef}>
        <div className="embla__container flex">
          {vehicles.map((vehicle) => (
            <div className="embla__slide flex-[0_0_100%] md:flex-[0_0_33.33%] min-w-0 relative" key={vehicle.id}>
              <div 
                className={`p-4 m-4 rounded-lg shadow-lg text-white transition duration-300 ease-in-out bg-gray-800 hover:bg-gray-700 h-full flex flex-col justify-between cursor-pointer ${
                  selectedVehicleId === vehicle.id ? 'ring-2 ring-blue-500 scale-100 opacity-100 z-10' : 'scale-95 opacity-60'
                }`}
                onClick={() => handleCardClick(vehicle.id)}
              >
                <div className="min-h-[100px]">
                  <div className="flex flex-row justify-between items-center mb-2">
                    <h3 className="text-lg font-bold truncate max-w-[80%]" title={`${vehicle.brand} ${vehicle.model}`}>
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    {typeIcons(vehicle.type, vehicle.fuel_type)}
                  </div>
                  <p className="text-sm text-gray-300 mb-1">ID: {vehicle.id}</p>
                  <p className="text-lg font-semibold">{vehicle.year}</p>
                </div>
                <div className="mt-2 text-gray-400">
                  <p className="text-xs">Combustible: {vehicle.fuel_type}</p>
                  <p className="text-xs">Consumo: {vehicle.fuel_consumption} {vehicle.fuel_measurement}/100km</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
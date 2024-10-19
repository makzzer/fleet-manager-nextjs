import React from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { tiposCombustible, tiposVehiculo, unidadesCombustible, useVehiculo, Vehiculo } from "@/app/context/VehiculoContext";
import { FiEdit, FiEye, FiTrash, FiCheckCircle } from "react-icons/fi"; // Feather Icons (más modernos)
import { FaCar, FaTruck, FaShip } from "react-icons/fa";

function generarSelect(map:{ [key: string]: string }, id:string, textSeleccione:string, selected:string) {
  const options = Object.entries(map)
    .map(([key, value]) => `<option key="${key}" value="${key}"  ${selected == key ? "selected" : ""}>${value}</option>`)
    .join('');

  return `<select id="${id}" class="swal2-select p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" ${selected == "" ? "selected" : ""}>${textSeleccione}</option>
            ${options}
          </select>`;
}

// Función para generar el rango de años
function generarSelectAnios(selectedAnio:number) {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 30;
  const anios : { [key: string]: string } = {};

  for (let year = currentYear; year >= startYear; year--) {
    anios[year.toString()] = year.toString()
  }

  return generarSelect(anios, "edit-vehicle-year", "Seleccione Año", selectedAnio.toString());
}

interface VehiculoCardProps {
  vehiculo: Vehiculo;
}

const VehiculoCard = ({ vehiculo }: VehiculoCardProps) => {
  const router = useRouter();
  const { modifyVehiculo, deleteVehiculo, enableVehiculo } = useVehiculo();

  const camiones = {
    marcas: [
      {
        marca: 'Toyota',
        modelos: ['Hino 300', 'Dyna', 'Toyotace']
      },
      {
        marca: 'Ford',
        modelos: ['F-750', 'Cargo 1723', 'Transit Chasis']
      },
      {
        marca: 'Chevrolet',
        modelos: ['N-Series', 'T-Series', 'C4500 Kodiak']
      },
      {
        marca: 'Volkswagen',
        modelos: ['Constellation 24.280', 'Delivery 9.170', 'Worker 17.220']
      },
      {
        marca: 'Mercedes-Benz',
        modelos: ['Atego 1726', 'Accelo 1016', 'Actros 2545']
      }
    ]
  };

  const typeIcons = (vehiculo: Vehiculo) => {
    return vehiculo.type === 'Auto'
    ? <FaCar className={`text-2xl font-bold max-w-full mt-1 ${vehiculo.fuel_type === 'Gasoil' ? 'text-amber-400' : 'text-cyan-400'}`}/>
    : vehiculo.type === 'Camión'
    ? <FaTruck className={`text-2xl font-bold max-w-full mt-1 ${vehiculo.fuel_type === 'Gasoil' ? 'text-amber-400' : 'text-cyan-400'}`}/>
    : <FaShip className={`text-2xl font-bold max-w-full mt-1 ${vehiculo.fuel_type === 'Gasoil' ? 'text-amber-400' : 'text-cyan-400'}`}/>
  }

  const handleViewVehiculo = (id: string) => {
    if (vehiculo.status === "AVAILABLE") {
      router.push(`/vehiculos/${id}`);
    }
  };

  const handleDisableVehicle = async () => {
    const newStatus = vehiculo.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
    const updatedVehiculo = { ...vehiculo, status: newStatus };
    try {
      if (vehiculo.status === "AVAILABLE") {
        await deleteVehiculo(updatedVehiculo); // Deshabilita el vehículo
        Swal.fire({
          title: "Vehículo deshabilitado",
          text: "El vehículo ha sido deshabilitado correctamente.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      } else {
        await enableVehiculo(updatedVehiculo.id); // Habilita el vehículo
        Swal.fire({
          title: "Vehículo habilitado",
          text: "El vehículo ha sido habilitado correctamente.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al cambiar el estado del vehículo. Por favor, intenta de nuevo.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleEdit = () => {
    if (vehiculo.status === "AVAILABLE") {
      const opcionesMarcas = camiones.marcas.map(marca => `<option value="${marca.marca}">${marca.marca}</option>`).join('');

      Swal.fire({
        title: "Editar vehículo",
        html: `
          <style>
            .form-container {
              width: 100%; /* Set the form to take full width */
              max-width: 600px; /* Limit the maximum width for larger screens */
              margin: 0 auto; /* Center the form horizontally */
            }

            input.swal2-input, select.swal2-select {
              border: 1px solid #ccc;
              border-radius: 4px;
              padding: 10px;
              width: 100%; /* Make the input/select take full width of the container */
              height: 54px;
              margin-top: 5px;
              margin-bottom: 10px;
              margin-left: 0px;
              margin-right: 0px;
              box-sizing: border-box;
            }
            
            .input-container {
              display: flex;
              align-items: center; /* Align label and input vertically */
              /* Space between label and input */
              justify-content: space-between; 
            }

            label {
              margin-right: 10px; /* Space between label and input */
              width: 50%; /* Set label width */
            }
            
            input[type="checkbox"] {
              width: 24px; /* Increase the checkbox size */
              height: 24px; /* Increase the checkbox size */
            }
          </style>

          <div class="form-container">
            <div class="flex flex-col space-y-4">
              <div class="input-container">
                <label for="edit-vehicle-brand" class="text-left text-gray-700 font-medium">Marca</label>
                <select id="edit-vehicle-brand" class="swal2-select p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="" disabled>Seleccione una marca</option>
                  ${opcionesMarcas}
                </select>
              </div>
              <div class="input-container">
                <label for="edit-vehicle-model" class="text-left text-gray-700 font-medium">Modelo</label>
                <select id="edit-vehicle-model" class="swal2-select p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
                  <option value="" disabled>Seleccione una marca primero</option>
                </select>
              </div>
              <div class="input-container">
                <label for="edit-vehicle-year" class="text-left text-gray-700 font-medium">Año</label>
                ${generarSelectAnios(vehiculo.year)}
              </div>
              <div class="input-container">
                <label for="color" class="text-left text-gray-700 font-medium">Color</label>
                <input type="text" id="edit-vehicle-color" class="swal2-input" placeholder="Color" value="${vehiculo.color}"  oninput="this.value"/>  
              </div>
              <div class="input-container">
                <label for="edit-vehicle-fuel_type" class="text-left text-gray-700 font-medium">Combustible</label>
                ${generarSelect(tiposCombustible, "edit-vehicle-fuel_type", "Seleccione tipo de combustible", vehiculo.fuel_type)}
              </div>
              <div class="input-container">
                <label for="edit-vehicle-fuel_measurement" class="text-left text-gray-700 font-medium">Unidad de medida</label>
                ${generarSelect(unidadesCombustible, "edit-vehicle-fuel_measurement", "Seleccione una unidad", vehiculo.fuel_measurement)}
              </div>     
              <div class="input-container">
                <label for="edit-vehicle-fuel_comsumption" class="text-left text-gray-700 font-medium">Consumo</label>
                <input type="number" id="edit-vehicle-fuel_comsumption" class="swal2-input" placeholder="Consumo(cada 100 km)" value="${vehiculo.fuel_consumption}" oninput="this.value"/>  
              </div>
              <div class="input-container">
                <label for="edit-vehicle-type" class="text-left text-gray-700 font-medium">Tipo de vehiculo</label>
                ${generarSelect(tiposVehiculo, "edit-vehicle-type", "Seleccione tipo de vehículo", vehiculo.type)} 
              </div>
              <div class="input-container">
                <label for="edit-vehicle-cant_axles" class="text-left text-gray-700 font-medium">Cantidad de ejes</label>
                <input type="number" id="edit-vehicle-cant_axles" class="swal2-input" placeholder="Cantidad de ejes" value="${vehiculo.cant_axles}" oninput="this.value"/>  
              </div>
              <div class="input-container">
                <label for="edit-vehicle-cant_seats" class="text-left text-gray-700 font-medium">Cantidad de asientos</label>
                <input type="number" id="edit-vehicle-cant_seats" class="swal2-input" placeholder="Cantidad de asientos" value="${vehiculo.cant_seats}" oninput="this.value"/>  
              </div>  
              <div class="input-container">
                <label for="edit-vehicle-load" class="text-left text-gray-700 font-medium">Carga max.(Ton)</label>
                <input type="number" id="edit-vehicle-load" class="swal2-input" placeholder="Carga max.(Ton)" value="${vehiculo.load}" oninput="this.value"/>  
              </div>
              <div class="input-container">
                <label for=""edit-vehicle-has_trailer" class="text-left text-gray-700 font-medium">Tiene acoplado</label>
                <input type="checkbox" id="edit-vehicle-has_trailer" ${vehiculo.has_trailer ? "checked" : ""}>
              </div> 
          </div>

        `,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const brand = (document.getElementById("edit-vehicle-brand") as HTMLInputElement).value;
          const model = (document.getElementById("edit-vehicle-model") as HTMLInputElement).value;
          const year = parseInt((document.getElementById("edit-vehicle-year") as HTMLInputElement).value);
          const fuel_type = (document.getElementById("edit-vehicle-fuel_type") as HTMLInputElement).value;
          const fuel_comsumption = (document.getElementById("edit-vehicle-fuel_comsumption") as HTMLInputElement).value;
          const type = (document.getElementById("edit-vehicle-type") as HTMLInputElement).value;
          const load = parseInt((document.getElementById("edit-vehicle-load") as HTMLInputElement).value);
          const has_trailer = (document.getElementById("edit-vehicle-has_trailer") as HTMLInputElement).checked;
          const color = (document.getElementById("edit-vehicle-color") as HTMLInputElement).value;
          const fuel_measurement = (document.getElementById("edit-vehicle-fuel_measurement") as HTMLInputElement).value;
          const cant_axles = (document.getElementById("edit-vehicle-cant_axles") as HTMLInputElement).value;
          const cant_seats = (document.getElementById("edit-vehicle-cant_seats") as HTMLInputElement).value;

          if (!model || !brand || year < 1900 || year > new Date().getFullYear() 
            || !fuel_type || !fuel_comsumption || !type || !load
            || !color || !fuel_measurement || !cant_axles || !cant_seats) {

            Swal.showValidationMessage("Por favor, complete todos los campos correctamente.");
            return false;
          }

          return { model, brand, year, fuel_type, fuel_comsumption, type, load, has_trailer, color, fuel_measurement, cant_axles, cant_seats };
        },
        didOpen: () => {
          const brandSelect = document.getElementById('edit-vehicle-brand') as HTMLSelectElement;
          const modelSelect = document.getElementById('edit-vehicle-model') as HTMLSelectElement;

          brandSelect.value = vehiculo.brand; // Establecer valor actual de la marca
          const opcionesModelos = camiones.marcas.find(m => m.marca === vehiculo.brand)?.modelos.map(modelo => `<option value="${modelo}">${modelo}</option>`).join('');
          if (opcionesModelos) {
            modelSelect.innerHTML = opcionesModelos;
            modelSelect.disabled = false;
            modelSelect.value = vehiculo.model; // Establecer el valor del modelo actual
          }

          brandSelect.addEventListener('change', function () {
            const marcaSeleccionada = brandSelect.value;
            const marca = camiones.marcas.find(m => m.marca === marcaSeleccionada);
            if (marca) {
              const opcionesModelos = marca.modelos.map(modelo => `<option value="${modelo}">${modelo}</option>`).join('');
              modelSelect.innerHTML = opcionesModelos;
              modelSelect.disabled = false;
            } else {
              modelSelect.disabled = true;
              modelSelect.innerHTML = '<option value="" disabled>Seleccione una marca primero</option>';
            }
          });
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const {model, brand, year, fuel_type, fuel_comsumption, type, load, has_trailer, color, fuel_measurement, cant_axles, cant_seats } = result.value;
          const updatedVehiculo = { ...vehiculo, model, brand, year, fuel_type, fuel_comsumption, type, load, has_trailer, color, fuel_measurement, cant_axles, cant_seats };

          modifyVehiculo(updatedVehiculo);

          Swal.fire({
            title: "Actualizado!",
            text: "El vehículo ha sido actualizado.",
            icon: "success",
          });
        }
      });
    };
  };

  return (
    <div className="p-6 rounded-lg shadow-lg text-white transition duration-300 ease-in-out bg-gray-800 hover:bg-gray-900 h-full flex flex-col justify-between">
      <div className="min-h-[120px]">
        <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-3 truncate max-w-full" title={`${vehiculo.brand}`}>
          {vehiculo.brand} {vehiculo.model}
        </h2>
        {typeIcons(vehiculo)}
        </div>
        <p className="text-lg text-gray-300 mb-3 ">ID: {vehiculo.id}</p>
        <h3 className="text-2xl font-bold truncate max-w-full" title={`${vehiculo.brand} ${vehiculo.model}`}>
          {vehiculo.year}
        </h3>


      </div>


      <div className="mt-4 text-gray-400">
        <p className="text-sm">Creado el: {new Date(vehiculo.date_created).toLocaleString()}</p>
        <p className="text-sm">Actualizado el: {new Date(vehiculo.date_updated).toLocaleString()}</p>
      </div>

      <div className="flex justify-between text-center mt-6 space-x-2">
        <button
          title="Detalle"
          onClick={() => handleViewVehiculo(vehiculo.id)}
          disabled={vehiculo.status !== "AVAILABLE"}
          className="bg-blue-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center justify-center w-full"
        >
          <FiEye className="w-5 h-5" />  {/* Eliminamos el 'mr-2' para centrar */}
        </button>

        <button
          title="Editar"
          onClick={handleEdit}
          disabled={vehiculo.status !== "AVAILABLE"}
          className="bg-yellow-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center justify-center w-full"
        >
          <FiEdit className="w-5 h-5" />  {/* Eliminamos el 'mr-2' para centrar */}
        </button>

        {vehiculo.status === "AVAILABLE" ? (
          <button
            title="Deshabilitar"
            onClick={handleDisableVehicle}
            className="font-bold py-2 px-4 rounded bg-red-500 hover:bg-red-600 flex items-center justify-center w-full"
          >
            <FiTrash className="w-5 h-5" />  {/* Eliminamos el 'mr-2' para centrar */}
          </button>
        ) : (
          <button
            title="Habilitar"
            onClick={handleDisableVehicle}
            className="font-bold py-2 px-4 rounded bg-green-500 hover:bg-blue-600 flex items-center justify-center w-full"
          >
            <FiCheckCircle className="w-5 h-5" />  {/* Eliminamos el 'mr-2' para centrar */}
          </button>
        )}
      </div>
    </div>
  );
};

export default VehiculoCard;
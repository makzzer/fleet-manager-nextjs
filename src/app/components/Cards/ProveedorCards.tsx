import React from "react";
import { useRouter } from "next/navigation";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { useProveedor } from "@/app/context/ProveedorContext"; 

interface Proveedor {
  id: string;
  name: string;
  email: string;
  cuit: string;
  phone_number: string;
  address: string;
}

interface ProveedorCardProps {
  proveedor: Proveedor;
}

const ProveedorCard = ({ proveedor }: ProveedorCardProps) => {
  const router = useRouter();
  const { modifyProvider } = useProveedor();

  const handleViewProveedor = (id: string) => {
    router.push(`/proveedores/${id}`);
  };

  {/*
  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Eliminado!', 'El proveedor ha sido eliminado.', 'success');
      }
    });
  };
  */}

  // const handleEditProveedor = () => {
  //   Swal.fire({
  //     title: 'Editar proveedor',
  //     html: `
  //       <input type="text" id="edit-name" class="swal2-input" placeholder="Nombre" value="${proveedor.name}">
  //       <input type="text" id="edit-email" class="swal2-input" placeholder="Email" value="${proveedor.email}">
  //       <input type="text" id="edit-cuit" class="swal2-input" placeholder="CUIT" value="${proveedor.cuit}">
  //       <input type="text" id="edit-phone" class="swal2-input" placeholder="Teléfono" value="${proveedor.phone_number}">
  //       <input type="text" id="edit-address" class="swal2-input" placeholder="Dirección" value="${proveedor.address}">
  //     `,
  //     showCancelButton: true,
  //     confirmButtonText: 'Guardar',
  //     preConfirm: async () => {
  //       const nameElement = document.getElementById("name") as HTMLInputElement;
  //       const emailElement = document.getElementById(
  //         "email"
  //       ) as HTMLInputElement;
  //       const cuitElement = document.getElementById("cuit") as HTMLInputElement;
  //       const phone_numberElement = document.getElementById(
  //         "phone_number"
  //       ) as HTMLInputElement;
  //       const streetElement = document.getElementById(
  //         "street"
  //       ) as HTMLInputElement;
  //       const numberElement = document.getElementById(
  //         "number"
  //       ) as HTMLInputElement;
  //       const localityElement = document.getElementById(
  //         "locality"
  //       ) as HTMLInputElement;

  //       const name = nameElement?.value;
  //       const email = emailElement?.value;
  //       const cuit = cuitElement?.value;
  //       const phone_number = phone_numberElement?.value;
  //       const street = streetElement?.value;
  //       const number = numberElement?.value;
  //       const locality = localityElement?.value;

  //       // const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.&0-9]+$/;
  //       // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //       // const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
  //       // const telefonoRegex = /^(?=(?:\D*\d){10})(?:\d+-?){0,2}\d+$/;
  //       // const streetRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]+$/; // Regex para la calle
  //       // const numberRegex = /^\d+$/; // Regex para el número
  //       // const localityRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Regex para la localidad

  //       // if (!name || !nameRegex.test(name)) {
  //       //   Swal.showValidationMessage(
  //       //     "Nombre inválido. El nombre no puede estar vacío ni contener caracteres especiales o números."
  //       //   );
  //       //   return null;
  //       // }

  //       // if (!email || !emailRegex.test(email)) {
  //       //   Swal.showValidationMessage(
  //       //     "Email inválido. El email no puede estar vacío, además debe contener un solo '@' y un formato válido."
  //       //   );
  //       //   return null;
  //       // }

  //       // if (!cuit || !cuitRegex.test(cuit)) {
  //       //   Swal.showValidationMessage(
  //       //     "CUIT inválido. Debe seguir el formato 00-00000000-0."
  //       //   );
  //       //   return null;
  //       // }

  //       // if (!phone_number || !telefonoRegex.test(phone_number)) {
  //       //   Swal.showValidationMessage(
  //       //     "Teléfono inválido. Debe contener solo números y opcionalmente guiones."
  //       //   );
  //       //   return null;
  //       // }

  //       // if (!street || !streetRegex.test(street)) {
  //       //   Swal.showValidationMessage("Calle inválida.");
  //       //   return null;
  //       // }

  //       // if (!number || !numberRegex.test(number)) {
  //       //   Swal.showValidationMessage("Número inválido.");
  //       //   return null;
  //       // }

  //       // if (!locality || !localityRegex.test(locality)) {
  //       //   Swal.showValidationMessage("Localidad inválida.");
  //       //   return null;
  //       // }
  //       return {
  //         name,
  //         email,
  //         cuit,
  //         phone_number,
  //         address: `${street} ${number}, ${locality}`,
  //       };
  //     },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const { name, email, cuit, phone_number, address } = result.value;
  //       const updatedProveedor = { ...proveedor, name, email, cuit, phone_number, address };

  //       console.log ("actualizando proveedor: ", result.value);

  //       modifyProvider(updatedProveedor);

  //       Swal.fire({
  //         title: "Actualizado!",
  //         text: "El proveedor ha sido actualizado.",
  //         icon: "success",
  //       });
  //     }
  //   });
  // };

  const handleEditProveedor = () => {
      Swal.fire({
        title: "Editar proveedor",
        html: `
          <div class="flex flex-col space-y-4">
            <div class="flex flex-col">
              <label for="edit-proveedor-name" class="text-left text-gray-700 font-medium">Nombre</label>
              <input type="text" id="edit-name" class="swal2-input" placeholder="Nombre" value="${proveedor.name}">       
              <label for="edit-proveedor-email" class="text-left text-gray-700 font-medium">Email</label>
              <input type="text" id="edit-email" class="swal2-input" placeholder="Email" value="${proveedor.email}">
              <label for="edit-proveedor-cuit" class="text-left text-gray-700 font-medium">Cuit</label>
              <input type="text" id="edit-cuit" class="swal2-input" placeholder="CUIT" value="${proveedor.cuit}">
              <label for="edit-proveedor-phone_number" class="text-left text-gray-700 font-medium">Telefono</label>
              <input type="text" id="edit-phone" class="swal2-input" placeholder="Teléfono" value="${proveedor.phone_number}">
              <label for="edit-proveedor-street" class="text-left text-gray-700 font-medium">Calle</label>
              <input type="text" id="edit-street" class="swal2-input" placeholder="Calle">
              <label for="edit-proveedor-number" class="text-left text-gray-700 font-medium">Altura</label>
              <input type="text" id="edit-number" class="swal2-input" placeholder="Altura">
              <label for="edit-proveedor-locality" class="text-left text-gray-700 font-medium">Localidad</label>
              <input type="text" id="edit-locality" class="swal2-input" placeholder="Localidad">
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const name = (document.getElementById("edit-proveedor-name") as HTMLInputElement).value;
          const email = (document.getElementById("edit-proveedor-email") as HTMLInputElement).value;
          const cuit = ((document.getElementById("edit-proveedor-cuit") as HTMLInputElement).value);
          const phone_number = ((document.getElementById("edit-proveedor-phone_number") as HTMLInputElement).value);
          const street = ((document.getElementById("edit-proveedor-street") as HTMLInputElement).value);
          const number = ((document.getElementById("edit-proveedor-number") as HTMLInputElement).value);
          const locality = ((document.getElementById("edit-proveedor-locality") as HTMLInputElement).value);

          return {
          name,
          email,
          cuit,
          phone_number,
          address: `${street} ${number}, ${locality}`,
        };
        },
        // didOpen: () => {
        //   const brandSelect = document.getElementById('edit-vehicle-brand') as HTMLSelectElement;
        //   const modelSelect = document.getElementById('edit-vehicle-model') as HTMLSelectElement;

        //   brandSelect.value = vehiculo.brand; // Establecer valor actual de la marca
        //   const opcionesModelos = camiones.marcas.find(m => m.marca === vehiculo.brand)?.modelos.map(modelo => `<option value="${modelo}">${modelo}</option>`).join('');
        //   if (opcionesModelos) {
        //     modelSelect.innerHTML = opcionesModelos;
        //     modelSelect.disabled = false;
        //     modelSelect.value = vehiculo.model; // Establecer el valor del modelo actual
        //   }

        //   brandSelect.addEventListener('change', function () {
        //     const marcaSeleccionada = brandSelect.value;
        //     const marca = camiones.marcas.find(m => m.marca === marcaSeleccionada);
        //     if (marca) {
        //       const opcionesModelos = marca.modelos.map(modelo => `<option value="${modelo}">${modelo}</option>`).join('');
        //       modelSelect.innerHTML = opcionesModelos;
        //       modelSelect.disabled = false;
        //     } else {
        //       modelSelect.disabled = true;
        //       modelSelect.innerHTML = '<option value="" disabled>Seleccione una marca primero</option>';
        //     }
        //   });
        // }
      }).then((result) => {
        if (result.isConfirmed) {
          const { name, email, cuit, phone_number, address } = result.value;
          const updatedProveedor = { ...proveedor, name, email, cuit, phone_number, address };

          modifyProvider(updatedProveedor);

          Swal.fire({
            title: "Actualizado!",
            text: "El vehículo ha sido actualizado.",
            icon: "success",
          });
        }
      });
    };


  return (
    <div className="bg-gray-800 border border-gray-600 p-6 rounded-lg shadow-lg text-white hover:bg-gray-900 transition duration-300 ease-in-out min-h-[320px] flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-3">{proveedor.name}</h2>
        {/*<p className="text-lg text-gray-300">ID: {proveedor.id}</p>*/}
        <p className="text-lg text-gray-300">CUIT: {proveedor.cuit}</p>
        <p className="text-lg text-gray-300">Email: {proveedor.email}</p>
        <p className="text-lg text-gray-300">Teléfono: {proveedor.phone_number}</p>
        <p className="text-lg text-gray-300">Dirección: {proveedor.address}</p>
      </div>
      <div className="flex justify-between mt-4">
        <IconButton
          aria-label="Ver proveedor"
          color="secondary"
          title="Ver proveedor"
          onClick={() => handleViewProveedor(proveedor.id)}
        >
          <VisibilityIcon sx={{ fontSize: 40 }} />
        </IconButton>

        <IconButton
          aria-label="Editar proveedor"
          color="primary"
          title="Editar proveedor"
          onClick={handleEditProveedor}
        >
          <EditIcon sx={{ fontSize: 40 }} />
        </IconButton>

      </div>
      
    </div>
  );
};

export default ProveedorCard;
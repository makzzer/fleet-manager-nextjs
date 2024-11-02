import React from "react";
import { useRouter } from "next/navigation";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";

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

  const handleEdit = () => {
    Swal.fire({
      title: 'Editar proveedor',
      html: `
        <input type="text" id="edit-name" class="swal2-input" placeholder="Nombre" value="${proveedor.name}">
        <input type="text" id="edit-cuit" class="swal2-input" placeholder="CUIT" value="${proveedor.cuit}">
        <input type="text" id="edit-email" class="swal2-input" placeholder="Email" value="${proveedor.email}">
        <input type="text" id="edit-phone" class="swal2-input" placeholder="Teléfono" value="${proveedor.phone_number}">
        <input type="text" id="edit-address" class="swal2-input" placeholder="Dirección" value="${proveedor.address}">
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Actualizado!', 'El proveedor ha sido actualizado.', 'success');
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
          onClick={handleEdit}
        >
          <EditIcon sx={{ fontSize: 40 }} />
        </IconButton>

      </div>
      
    </div>
  );
};

export default ProveedorCard;
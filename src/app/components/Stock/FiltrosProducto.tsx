import React, { useState, ChangeEvent } from 'react';
import { TextField, InputAdornment, MenuItem } from '@mui/material';
import { FaSearch, FaFilter } from 'react-icons/fa';

interface FiltrosProductoProps {
  onFilter: (filters: { searchTerm: string; selectedProveedor: string }) => void;
}

const FiltrosProducto: React.FC<FiltrosProductoProps> = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProveedor, setSelectedProveedor] = useState('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onFilter({ searchTerm: value, selectedProveedor });
  };

  const handleProveedorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedProveedor(value);
    onFilter({ searchTerm, selectedProveedor: value });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-6">
      <TextField
        label="Buscar productos"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        className="bg-gray-800 text-white rounded-lg shadow-md border border-gray-600 transition-all duration-300 ease-in-out hover:shadow-lg focus:shadow-lg"
        InputProps={{
          style: { color: '#fff' },
          startAdornment: (
            <InputAdornment position="start">
              <FaSearch className="text-gray-300" />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          style: { color: '#b0b0b0' },
        }}
      />

      <TextField
        select
        label="Filtrar por proveedor"
        value={selectedProveedor}
        onChange={handleProveedorChange}
        fullWidth
        className="bg-gray-800 text-white rounded-lg shadow-md border border-gray-600 transition-all duration-300 ease-in-out hover:shadow-lg focus:shadow-lg"
        InputProps={{
          style: { color: '#fff' },
          startAdornment: (
            <InputAdornment position="start">
              <FaFilter className="text-gray-300" />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          style: { color: '#b0b0b0' },
        }}
      >
        <MenuItem value="">
          <em>Todos los proveedores</em>
        </MenuItem>
      </TextField>
    </div>
  );
};

export default FiltrosProducto;

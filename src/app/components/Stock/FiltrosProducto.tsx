import React, { useState, ChangeEvent } from 'react';
import { TextField, InputAdornment, MenuItem } from '@mui/material';
import { FaSearch, FaFilter } from 'react-icons/fa';

interface FiltrosProductoProps {
  onFilter: (filters: { searchTerm: string; selectedCategory: string }) => void;
}

const FiltrosProducto: React.FC<FiltrosProductoProps> = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onFilter({ searchTerm: value, selectedCategory });
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedCategory(value);
    onFilter({ searchTerm, selectedCategory: value });
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
          style: { color: "#fff" },
          startAdornment: (
            <InputAdornment position="start">
              <FaSearch className="text-gray-300" />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          style: { color: "#b0b0b0" },
        }}
      />

      <TextField
        select
        label="Filtrar por categoría"
        value={selectedCategory}
        onChange={handleCategoryChange}
        fullWidth
        className="bg-gray-800 text-white rounded-lg shadow-md border border-gray-600 transition-all duration-300 ease-in-out hover:shadow-lg focus:shadow-lg"
        InputProps={{
          style: { color: "#fff" },
          startAdornment: (
            <InputAdornment position="start">
              <FaFilter className="text-gray-300" />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          style: { color: "#b0b0b0" },
        }}
      >
        <MenuItem value=""><em>Todas las categorías</em></MenuItem>
        <MenuItem value="Motores"><em>Motores</em></MenuItem>
        <MenuItem value="Transmisión"><em>Transmisión</em></MenuItem>
        <MenuItem value="Suspensión"><em>Suspensión</em></MenuItem>
        <MenuItem value="Frenos"><em>Frenos</em></MenuItem>
        <MenuItem value="Cristales"><em>Cristales</em></MenuItem>
        <MenuItem value="Luces"><em>Luces</em></MenuItem>
        <MenuItem value="Escape"><em>Escape</em></MenuItem>
        <MenuItem value="Baterías"><em>Baterías</em></MenuItem>
        <MenuItem value="Carrocería"><em>Carrocería</em></MenuItem>
        <MenuItem value="Neumáticos"><em>Neumáticos</em></MenuItem>
        <MenuItem value="Amortiguadores"><em>Amortiguadores</em></MenuItem>
        <MenuItem value="Filtros"><em>Filtros</em></MenuItem>
        <MenuItem value="Correas"><em>Correas</em></MenuItem>
        <MenuItem value="Radiadores"><em>Radiadores</em></MenuItem>
        <MenuItem value="Espejos"><em>Espejos</em></MenuItem>
        <MenuItem value="Dirección"><em>Dirección</em></MenuItem>
        <MenuItem value="Sensores"><em>Sensores</em></MenuItem>
        <MenuItem value="Aire acondicionado"><em>Aire acondicionado</em></MenuItem>
        <MenuItem value="Lubricantes"><em>Lubricantes</em></MenuItem>
        <MenuItem value="Sistemas eléctricos"><em>Sistemas eléctricos</em></MenuItem>
        <MenuItem value="Paragolpes"><em>Paragolpes</em></MenuItem>
      </TextField>
    </div>
  );
};

export default FiltrosProducto;

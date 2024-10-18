import React, { useState, ChangeEvent } from 'react';
import { TextField, InputAdornment, MenuItem } from '@mui/material';
import { FaSearch, FaFilter } from 'react-icons/fa';

interface FiltrosOrdenesProps {
    onFilter: (filters: { searchTerm: string; selectedStatus: string }) => void;
    status: string[];
}

const FiltrosOrdenes: React.FC<FiltrosOrdenesProps> = ({ onFilter, status }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        onFilter({ searchTerm: value, selectedStatus });
    };

    const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedStatus(value);
        onFilter({ searchTerm, selectedStatus: value });
      };

    return (
        <div className="flex flex-col md:flex-row gap-6 mb-6">
            <TextField
                label="Buscar orden de compra"
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
                value={status}
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
                {status.map(estado => <MenuItem key={estado} value={estado}><em>{estado}</em></MenuItem>)}
            </TextField>
        </div>
    );
};

export default FiltrosOrdenes;
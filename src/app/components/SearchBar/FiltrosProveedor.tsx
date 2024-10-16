import React, { useState, ChangeEvent } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { FaSearch } from 'react-icons/fa';

interface FiltrosProveedorProps {
    onFilter: (filters: { searchTerm: string; }) => void;
}

const FiltrosProveedor: React.FC<FiltrosProveedorProps> = ({ onFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        onFilter({ searchTerm: value });
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 mb-6">
            <TextField
                label="Buscar proveedor"
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
        </div>
    );
};

export default FiltrosProveedor;
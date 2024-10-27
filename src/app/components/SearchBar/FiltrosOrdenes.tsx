import React, { useState, ChangeEvent, useEffect } from 'react';
import { TextField, InputAdornment, MenuItem } from '@mui/material';
import { FaFilter } from 'react-icons/fa';
import { Proveedor } from "../../context/OrdenesCompraContext";

const statusMap = new Map<string, string>([
    ["CREATED", "Creada"],
    ["REJECTED", "Rechazada"],
    ["APPROVED", "Aprobada"],
    ["COMPLETED", "Completa"],
    ["INACTIVE", "Inactiva"]
  ]);

  interface FiltrosOrdenesProps {
    onFilter: (filters: { provider: string; status: string, date: string }) => void;
    providers: Proveedor[];
    dates: string[];
}

const FiltrosOrdenes: React.FC<FiltrosOrdenesProps> = ({ onFilter, providers, dates }) => {
    const [selectedProvider, setSelectedProvider] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selecteStatus, setSelectedStatus] = useState('');

    const handleProviderChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedProvider(value);
    };

    const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedStatus(value);
    };

    const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedDate(value);
    };

    useEffect(() => {
        onFilter({ provider: selectedProvider, date: selectedDate, status: selecteStatus });
    }, [selectedProvider, selectedDate, selecteStatus]);

    return (
        <div className="flex flex-col md:flex-row gap-6 mb-6">
            <TextField
                select
                label="Filtrar por proveedor"
                value={selectedProvider}
                onChange={handleProviderChange}
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
                <MenuItem value=""><em>Todos los proveedores</em></MenuItem>
                {providers.map(provider => <MenuItem key={provider.id} value={provider.id}><em>{provider.name}</em></MenuItem>)}
            </TextField>
            <TextField
                select
                label="Filtrar por fecha"
                value={selectedDate}
                onChange={handleDateChange}
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
                <MenuItem value=""><em>Todas las fechas</em></MenuItem>
                {dates.map(date => <MenuItem key={date} value={date}><em>{date}</em></MenuItem>)}
            </TextField>
            <TextField
                select
                label="Filtrar por estado"
                value={selecteStatus}
                onChange={handleStatusChange}
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
                <MenuItem value=""><em>Todos los estados</em></MenuItem>
                {Array.from(statusMap.entries()).map(([key, value]) => <MenuItem key={key} value={key}><em>{value}</em></MenuItem>)}
            </TextField>
        </div>
    );
};

export default FiltrosOrdenes;
import React, { useState, useEffect, useRef } from 'react';

interface Opcion {
  id: string;
  nombre: string;
}

interface AutocompleteSearchBoxProps {
  options: Opcion[];
  onSelection: (opcion: Opcion | null) => void;
  placeholder?: string;
  customInputStyles?: string;
  customItemsStyles?: string;
  customItemContainerStyles?: string;
}

const AutocompleteSearchBox: React.FC<AutocompleteSearchBoxProps> = ({ options, onSelection, placeholder = "Buscar...", customInputStyles, customItemsStyles, customItemContainerStyles }) => {
  const [search, setSearch] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Opcion[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState<Opcion | null>(null);
  const referenciaComponente = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opcionesFiltradas = options.filter(opcion =>
      opcion.nombre.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOptions(opcionesFiltradas);
  }, [search, options]);

  useEffect(() => {
    const manejarClicFuera = (evento: MouseEvent) => {
      if (referenciaComponente.current && !referenciaComponente.current.contains(evento.target as Node)) {
        setShowOptions(false);
        if (!selected) {
          setSearch('');
        }
      }
    };

    document.addEventListener('mousedown', manejarClicFuera);
    return () => {
      document.removeEventListener('mousedown', manejarClicFuera);
    };
  }, [selected]);

  const handleSelection = (option: Opcion) => {
    setSelected(option);
    setSearch(option.nombre);
    setShowOptions(false);
    onSelection(option);
  };

  const handleDeselection = () => {
    setSelected(null);
    setSearch('');
    onSelection(null);
  };

  return (
    <div ref={referenciaComponente} className="relative w-full">
      <div className="flex items-center">
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setSelected(null)
        }}
        onFocus={() => setShowOptions(true)}
        placeholder={placeholder}
        className={`${customInputStyles ? customInputStyles : 'w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
      />
      {selected && (
          <button
            onClick={handleDeselection}
            className="absolute right-2 text-gray-500 hover:text-gray-700"
            aria-label="Deseleccionar opción"
          >
            ✕
          </button>
      )}
      </div>
      {showOptions && (
        <ul className={`${customItemContainerStyles ? customItemContainerStyles : 'absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'}`}>
          {filteredOptions.map((option) => (
            <li
              key={option.id}
              onClick={() => handleSelection(option)}
              className={`${customItemsStyles ? customItemsStyles : 'p-2 hover:bg-gray-100 cursor-pointer'}`}
            >
              {option.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteSearchBox;
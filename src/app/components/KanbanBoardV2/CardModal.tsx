'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { FiX, FiTool, FiAlertCircle } from 'react-icons/fi'
import { IoPulse } from 'react-icons/io5'
import { FaBox } from 'react-icons/fa'
import { Button, TextField, InputAdornment, MenuItem } from '@mui/material'
import Swal from 'sweetalert2'
import dynamic from 'next/dynamic'
import { Control, useControl } from '@/app/context/ControlContext'
import { useUser } from '@/app/context/UserContext'
import { useProducto } from '@/app/context/ProductoContext'

const MapVehiculo = dynamic(() => import('@/app/components/Maps/MapVehiculo'), { ssr: false })

interface KanbanCardModalProps {
  control: Control
  closeModal: () => void
  showModal: boolean
}

export default function CardModal({ control, closeModal, showModal }: KanbanCardModalProps) {
  const { controls, assignOperator, addProductList, setControlStatus } = useControl()
  const { users } = useUser()
  const { productos } = useProducto()

  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [selectedProductQuantity, setQuantity] = useState<number>(1)
  const [selectedProductsList, setSelectedProductsList] = useState<any[]>(control.products)
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [currentStatus, setCurrentStatus] = useState(control.status)


  const categorias = [
    'Aceite', 'Aire Acondicionado', 'Amortiguadores', 'Baterías', 'Carrocería', 'Correas',
    'Cristales', 'Dirección', 'Escape', 'Espejos', 'Filtros', 'Frenos', 'Líquido de frenos', 'Lubricantes', 'Luces',
    'Motores', 'Motor', 'Neumáticos ', 'Paragolpes', 'Radiadores', 'Sistemas eléctricos', 'Sensores',
    'Suspensión', 'Transmisión',
  ]

  useEffect(() => {
    setSelectedProductsList(control.products);
  }, [control.products])

  const showErrorToast = (message: string) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#1F2937',
      color: '#F3F4F6',
      iconColor: '#EF4444',
      customClass: {
        popup: 'swal2-modern',
        title: 'swal2-modern-title',
        htmlContainer: 'swal2-modern-content'
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value
    if (!control.operator) {
      showErrorToast('Debe asignarse un operador antes de cambiar el estado');
      setCurrentStatus(control.status);
    } else if (newStatus !== control.status) {
      setCurrentStatus(newStatus);
      setControlStatus(control.id, newStatus)
    }
  }

  const getControlCount = (operatorId: string) => {
    return controls
      .filter(control => control.operator && control.operator.id == operatorId)
      .length
  }

  const operadores = users
    .filter((usuario) => usuario.roles.includes('OPERATOR'))
    .map(usuario => ({
      id: usuario.id,
      full_name: `${usuario.full_name} (${getControlCount(usuario.id)} controles)`,
      control_count: getControlCount(usuario.id)
    }))
    .filter(operator => operator.control_count <= 5)
    .sort((a, b) => a.control_count - b.control_count)

  const handleRemoveProduct = (productId: any) => {
    const updatedList = selectedProductsList.filter(
      (item) => item.id !== productId
    )
    setSelectedProductsList(updatedList)
  }

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const category = event.target.value as string
    setSelectedCategory(category)
    const filtered = productos.filter(producto => producto.category === category)
    setFilteredProducts(filtered)
  }

  const handleProductSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    const select = event.target.value as string
    setSelectedProductId(select)
  }

  const handleQuantityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const quantity = event.target.value as number
    setQuantity(quantity)
  }

  const handleAddProductToList = () => {
    if (selectedProductId && selectedProductQuantity > 0) {
      const existingProductIndex = selectedProductsList.findIndex(
        (item) => item.product.id === selectedProductId
      )

      if (existingProductIndex >= 0) {
        const updatedList = [...selectedProductsList]
        updatedList[existingProductIndex].quantity += Number(selectedProductQuantity)
        setSelectedProductsList(updatedList)
      } else {
        const productNew = filteredProducts.find(
          (item) => item.id === selectedProductId
        )
        setSelectedProductsList([
          ...selectedProductsList,
          { product: productNew, quantity: Number(selectedProductQuantity), isNew: true },
        ])
      }

      setSelectedProductId('')
      setQuantity(1)
    }
  }

  const handleConfirmList = async () => {
    try {
      const newProductsList = selectedProductsList.filter((item) => item.isNew);
      if (newProductsList.length > 0) {
        Swal.fire({
          title: '¿Confirmar lista?',
          text: '¿Estás seguro de confirmar esta lista de productos?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
        }).then(async (result) => {
          if (result.isConfirmed) {
            closeModal()
            Swal.fire({
              title: 'Procesando productos...',
              html: `<div>Procesados: 0 de ${selectedProductsList.length}</div>
                     <div class="progress-bar-container" style="width: 100%; background-color: #e0e0e0; height: 10px;">
                       <div class="progress-bar" style="width: 0%; background-color: #4caf50; height: 100%;"></div>
                     </div>`,
              showConfirmButton: false,
              allowOutsideClick: false,
              didOpen: () => Swal.showLoading()
            })
  
            let successCount = 0
            let failedCount = 0
  
            
            
            for (let i = 0; i < newProductsList.length; i++) {
              const newProduct = newProductsList[i]
              try {
                const result = await addProductList(control.id, newProduct.product.id, newProduct.quantity)
                if (result) {
                  successCount++
                } else {
                  failedCount++
                }
  
                const progressPercentage = Math.round(((successCount + failedCount) / newProductsList.length) * 100)
  
                Swal.update({
                  html: `<div>Procesados: ${successCount + failedCount} de ${newProductsList.length}</div>
                         <div class="progress-bar-container" style="width: 100%; background-color: #e0e0e0; height: 10px;">
                           <div class="progress-bar" style="width: ${progressPercentage}%; background-color: #4caf50; height: 100%;"></div>
                         </div>`
                })
              } catch (error) {
                console.error('Error al enviar producto al backend', error)
                failedCount++
              
            }
  
            await Swal.fire({
              title: 'Carga completada',
              html: `Productos agregados exitosamente: ${successCount}<br>Fallidos: ${failedCount}`,
              icon: 'success',
            })
            }
          }
        })
      } else {
        Swal.fire({
          title: 'Falla en la confirmación',
          html: `Por favor, agregue nuevos repuestos a la lista para poder confirmarla.`,
          icon: 'info',
        })
      }
    } catch (error) {
      console.error('Error al confirmar la lista', error)
      Swal.fire('Error', 'Hubo un problema al procesar la lista de productos', 'error')
    }
  }

  const typeLogo = (type: string) => {
    const typeStyles = 'flex inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full mb-2 '
    switch (type) {
      case 'CORRECTIVE':
        return (
          <div className={`${typeStyles} bg-red-500 text-white`}>
            <FiTool />
            <span>Correctivo</span>
          </div>
        )
      case 'PREVENTIVE':
        return (
          <div className={`${typeStyles} bg-green-500 text-white`}>
            <FiAlertCircle />
            <span>Preventivo</span>
          </div>
        )
      default:
        return (
          <div className={`${typeStyles} bg-blue-500 text-white`}>
            <IoPulse />
            <span>Predictivo</span>
          </div>
        )
    }
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg max-w-3xl w-full relative max-h-screen overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-gray-100"
          onClick={closeModal}
        >
          <FiX className="w-6 h-6" />
        </button>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex gap-2 md:gap-5 text-xs justify-start align-start">
            {typeLogo(control.type)}
            /
            <p>
              ({control.vehicle.id}) - {control.vehicle.brand}{' '}
              {control.vehicle.model} {control.vehicle.year}
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="flex flex-col gap-2 items-start">
              <h3 className="text-3xl mb-6 font-bold text-left">
                {control.subject}
              </h3>
              <h4 className="text-xl font-semibold text-left">
                Descripción
              </h4>
              <p className="text-base text-left">
                {control.description}
              </p>
            </div>

            <div className="flex flex-col gap-2 items-start md:px-4 md:border-l-2 border-gray-700">
              <h4 className="text-xl font-semibold">Detalles</h4>
              {control.operator ? (
                <p className="text-left">
                  Persona asignada: {control.operator.full_name}
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  <label htmlFor="operator-select" className="text-left">
                    Asignar operador:
                  </label>
                  <select
                    id="operator-select"
                    className="bg-gray-800 text-white rounded-md p-2"
                    onChange={async (e) => {
                      const selectedOperatorId = e.target.value
                      if (selectedOperatorId && assignOperator) {
                        try {
                          await assignOperator(control.id, selectedOperatorId)
                          closeModal()
                        } catch (error) {
                          console.error(error)
                        }
                      }
                    }}
                  >
                    <option value="">Seleccionar operador</option>
                    {operadores.map((operador) => (
                      <option key={operador.id} value={operador.id}>
                        {operador.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label htmlFor="status-select" className="text-left">
                  Estado:
                </label>
                <select
                  id="status-select"
                  className="bg-gray-800 rounded-md p-2"
                  value={currentStatus}
                  onChange={handleStatusChange}
                >
                  <option value="TODO" className='text-yellow-200'>Por hacer</option>
                  <option value="DOING" className='text-blue-200'>En proceso</option>
                  <option value="DONE" className='text-emerald-200'>Completado</option>
                </select>
              </div>
              <p className="text-left">
                Prioridad:{' '}
                {control.priority === 'HIGH'
                  ? 'Alta'
                  : control.priority === 'MEDIUM'
                  ? 'Media'
                  : 'Baja'}
              </p>
            </div>
          </div>
          {(control.type === 'CORRECTIVE' || control.type === 'PREVENTIVE') &&
            (control.status === 'DONE' || control.status === 'DOING') && (
              <div className="flex flex-col gap-2 items-start w-full">
                <h4 className="text-xl font-semibold">Productos para el caso:</h4>
                <ul className="bg-gray-100 rounded-lg p-4 w-full mt-4">
                  {selectedProductsList &&
                    selectedProductsList.map((item, index) => (
                      <li
                        key={index}
                        className={`py-3 px-4 rounded-lg mb-2 flex justify-between items-center ${
                          item.isNew ? 'bg-blue-700' : 'bg-gray-700'
                        }`}
                      >
                        <span className="font-semibold">
                          {item.product.name} - {item.product.brand}
                        </span>
                        <span className="text-sm text-gray-100 ml-2">
                          Cantidad: {item.quantity}
                        </span>
                        <button
                          onClick={() => handleRemoveProduct(item.product.id)}
                          className="text-red-500"
                        >
                          <FiX />
                        </button>
                      </li>
                    ))}
                </ul>

                {control.status === 'DOING' && (
                  <>
                    <Button
                      onClick={handleConfirmList}
                      variant="contained"
                      color="primary"
                      className="mt-2"
                    >
                      Confirmar lista
                    </Button>
                    <TextField
                      select
                      label="Seleccionar categoría"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      className="bg-gray-800 text-white rounded-lg border border-gray-600 w-full mt-2"
                      InputProps={{
                        style: { color: '#ffffff' },
                        startAdornment: (
                          <InputAdornment position="start">
                            <FaBox className="text-gray-300" />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{ style: { color: '#e2e2e2' } }}
                      SelectProps={{
                        MenuProps: { PaperProps: { style: { maxHeight: 200, width: 400 } } },
                      }}
                    >
                      {categorias.map((categoria, index) => (
                        <MenuItem key={index} value={categoria}>
                          {categoria}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      label="Seleccionar producto"
                      value={selectedProductId}
                      onChange={handleProductSelect}
                      className="bg-gray-800 text-white rounded-lg border border-gray-600 w-full mt-2"
                      disabled={!filteredProducts.length}
                      InputProps={{
                        style: { color: '#ffffff' },
                        startAdornment: (
                          <InputAdornment position="start">
                            <FaBox className="text-gray-300" />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{ style: { color: '#e2e2e2' } }}
                      SelectProps={{
                        MenuProps: { PaperProps: { style: { maxHeight: 200, width: 400 } } },
                      }}
                    >
                      {filteredProducts.map((producto) => (
                        <MenuItem key={producto.id} value={producto.id}>
                          {producto.name} - {producto.brand}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Cantidad"
                      type="number"
                      value={selectedProductQuantity}
                      onChange={handleQuantityChange}
                      InputProps={{ style: { color: '#ffffff' } }}
                      InputLabelProps={{ style: { color: '#e2e2e2' } }}
                      className="bg-gray-800 text-white rounded-lg border border-gray-600 w-full mt-2"
                    />

                    <Button
                      onClick={handleAddProductToList}
                      variant="contained"
                      color="primary"
                      className="mt-2"
                    >
                      Agregar a la lista
                    </Button>
                  </>
                )}
              </div>
            )}
          {control.type === 'CORRECTIVE' && (
            <div className="mt-4">
              <h4 className="text-xl font-semibold">Ubicación</h4>
              <div className="h-64 rounded-lg shadow-lg flex items-center justify-center">
                <MapVehiculo coordinates={control.vehicle.coordinates} />
              </div>
            </div>
          )}
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={closeModal}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
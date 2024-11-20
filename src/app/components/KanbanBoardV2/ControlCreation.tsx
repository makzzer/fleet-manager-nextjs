"use client"

import React from 'react'
import Swal from 'sweetalert2'
import { FaPlus } from 'react-icons/fa'
import { useVehiculo } from '@/app/context/VehiculoContext'
import { useUser } from '@/app/context/UserContext'
import { useControl, POSTMassiveControl, POSTCorrectiveControl, POSTPredictiveControl } from '@/app/context/ControlContext'

export const ControlCreation: React.FC = () => {
  const { vehiculos } = useVehiculo()
  const { users } = useUser()
  const { createCorrectiveControl, createMassiveControl, createPredictiveControl } = useControl()

  const handleAgregarControl = () => {
    Swal.fire({
      title: "Agregar Control",
      html: `
      <div class="grid grid-cols-3 gap-4">
        <button id="addIndividual" class="swal2-confirm swal2-styled flex flex-col justify-center items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
          <span>Individual</span>
        </button>
        <button id="addMasivo" class="swal2-confirm swal2-styled flex flex-col justify-center items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
          </svg>
          <span>Carga Masiva</span>
        </button>
        <button id="addIA" class="swal2-confirm swal2-styled flex flex-col justify-center items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
          <span>IA</span>
        </button>
      </div>
      `,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      customClass: {
        title: "text-white",
        popup: "bg-gray-800",
      },
      didOpen: () => {
        document.getElementById("addIndividual")?.addEventListener("click", () => {
          Swal.close()
          handleCreateIndividualControl()
        })
        document.getElementById("addMasivo")?.addEventListener("click", () => {
          Swal.close()
          handleCreatePredictiveControl()
        })
        document.getElementById("addIA")?.addEventListener("click", () => {
          Swal.close()
          handleCreateAIControl()
        })
      },
    })
  }

  const handleCreateIndividualControl = async () => {
    const vehicleOptions = vehiculos.map(v => `<option value="${v.id}">${v.brand} ${v.model} (${v.id})</option>`).join('')

    const { value: formValues } = await Swal.fire({
      title: 'Crear Control Individual',
      html: `
        <div class="flex flex-col gap-4">
          <h3 class="text-left font-bold text-sm text-gray-200">Informe</h3>
          <input id="subject" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Asunto">
          <textarea id="description" class="w-full h-40 px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Descripción"></textarea>
          <select id="vehicle" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled selected>Seleccione un vehículo</option>
            ${vehicleOptions}
          </select>
          <div class="mt-4">
          <h3 class="text-left font-bold mb-4 text-sm text-gray-200">Tipo:</h3>
          <div class="flex justify-start gap-4">
            <label class="inline-flex items-center">
              <input type="radio" name="type" value="corrective" class="form-radio text-blue-600">
              <span class="ml-2 text-white">Correctivo</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="type" value="preventive" class="form-radio text-green-600">
              <span class="ml-2 text-white">Preventivo</span>
            </label>
          </div>
          </div>
          <div class="mt-4">
              <h3 class="text-left font-bold mb-4 text-sm text-gray-200">Prioridad:</h3>
              <div class="flex gap-4 items-center">
                <div class="flex items-center">
                  <input type="radio" id="priority-high" name="priority" value="HIGH" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500">
                  <label for="priority-high" class="ml-2 text-sm font-medium text-gray-300">Alta</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="priority-medium" name="priority" value="MEDIUM" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500">
                  <label for="priority-medium" class="ml-2 text-sm font-medium text-gray-300">Media</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="priority-low" name="priority" value="LOW" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500">
                  <label for="priority-low" class="ml-2 text-sm font-medium text-gray-300">Baja</label>
                </div>
              </div>
            </div>
        </div>
      `,
      focusConfirm: false,
      customClass: {
        container: 'bg-gray-900',
        popup: 'bg-gray-800 rounded-lg shadow-xl border border-gray-700',
        title: 'text-2xl font-bold text-white mb-4',
        closeButton: 'text-white',
        confirmButton: 'bg-blue-500 hover:bg-blue-600',
        cancelButton: 'bg-red-500 hover:bg-red-600',
      },
      preConfirm: () => {
        return {
          subject: (document.getElementById('subject') as HTMLInputElement).value,
          description: (document.getElementById('description') as HTMLTextAreaElement).value,
          vehicle_id: (document.getElementById('vehicle') as HTMLSelectElement).value,
          type: (document.querySelector('input[name="type"]:checked') as HTMLInputElement)?.value,
          priority: (
            document.querySelector(
              'input[name="priority"]:checked'
            ) as HTMLInputElement
          ).value,
        }
      }
    })

    if (formValues) {
      const newControl: POSTCorrectiveControl = {
        ...formValues,
        method: 'default',
      }
      createCorrectiveControl(newControl)
      Swal.fire('Control individual creado!', '', 'success')
    }
  }

  const handleCreatePredictiveControl = async () => {
    const brandModelMap = new Map()
    vehiculos.forEach((coche) => {
      if (!brandModelMap.has(coche.brand)) {
        brandModelMap.set(coche.brand, new Map())
      }
      if (!brandModelMap.get(coche.brand).has(coche.model)) {
        brandModelMap.get(coche.brand).set(coche.model, new Set())
      }
      brandModelMap.get(coche.brand).get(coche.model).add(coche.year)
    })

    const uniqueBrands = Array.from(brandModelMap.keys())

    const opcionesOperadores = users
      .filter((usuario) => usuario.roles.includes("OPERATOR"))
      .map(
        (usuario) =>
          `<option value="${usuario.id}">${usuario.full_name}</option>`
      )
      .join("")

    let selectedBrand = ""
    let selectedModel = ""

    const { value: formValues } = await Swal.fire({
      title: `Crear control Masivo`,
      color: "white",
      html: `
        <div class="flex flex-col md:flex-row justify-center gap-6 w-full max-w-4xl mx-auto">
          <div class="flex flex-col gap-4 w-full md:w-1/2">
            <h3 class="text-left font-bold text-sm">Informe</h3>
            <input id="asunto" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Asunto">
            <textarea id="descripcion" class="w-full h-40 px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Descripción"></textarea>
          </div>

          <div class="hidden md:block w-px bg-gray-600 mx-2"></div>

          <div class="flex flex-col gap-4 w-full md:w-1/2">
            <h3 class="text-left font-bold text-sm">Vehículo</h3>
            <select id="vehiculo-brand" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled selected>Seleccione una marca</option>
              ${uniqueBrands
                .map((brand) => `<option value="${brand}">${brand}</option>`)
                .join("")}
            </select>
            <select id="vehiculo-model" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
              <option value="" disabled selected>Seleccione un modelo</option>
            </select>
            <select id="vehiculo-year" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
              <option value="" disabled selected>Seleccione un año</option>
            </select>

            <div class="mt-4">
              <h3 class="text-left font-bold mb-4 text-sm">Prioridad:</h3>
              <div class="flex gap-4 items-center">
                <div class="flex items-center">
                  <input type="radio" id="priority-high" name="priority" value="HIGH" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500">
                  <label for="priority-high" class="ml-2 text-sm font-medium text-gray-300">Alta</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="priority-medium" name="priority" value="MEDIUM" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500">
                  <label for="priority-medium" class="ml-2 text-sm font-medium text-gray-300">Media</label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="priority-low" name="priority" value="LOW" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500">
                  <label for="priority-low" class="ml-2 text-sm font-medium text-gray-300">Baja</label>
                </div>
              </div>
            </div>
            
            <h3 class="text-left font-bold text-sm">Responsable</h3>
            <select id="operador" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled selected>Seleccione un operador</option>
              ${opcionesOperadores}
            </select>
          </div>
        </div>
      `,
      focusConfirm: false,
      customClass: {
        popup: "bg-gray-800 text-white w-full max-w-4xl p-6 rounded-lg",
        title: "text-2xl font-bold mb-4",
        confirmButton:
          "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
      },
      didOpen: () => {
        const brandSelect = document.getElementById(
          "vehiculo-brand"
        ) as HTMLSelectElement
        const modelSelect = document.getElementById(
          "vehiculo-model"
        ) as HTMLSelectElement
        const yearSelect = document.getElementById(
          "vehiculo-year"
        ) as HTMLSelectElement

        brandSelect.addEventListener("change", (e) => {
          selectedBrand = (e.target as HTMLSelectElement).value
          modelSelect.innerHTML =
            '<option value="" disabled selected>Seleccione un modelo</option>'
          yearSelect.innerHTML =
            '<option value="" disabled selected>Seleccione un año</option>'

          if (selectedBrand) {
            const models: string[] = Array.from(
              brandModelMap.get(selectedBrand).keys()
            )
            models.forEach((model) => {
              const option = document.createElement("option")
              option.value = model
              option.textContent = model
              modelSelect.appendChild(option)
            })
            modelSelect.disabled = false
            yearSelect.disabled = true
          } else {
            modelSelect.disabled = true
            yearSelect.disabled = true
          }
        })

        modelSelect.addEventListener("change", (e) => {
          selectedModel = (e.target as HTMLSelectElement).value
          yearSelect.innerHTML =
            '<option value="" disabled selected>Seleccione un año</option>'

          if (selectedModel) {
            const years: number[] = Array.from(
              brandModelMap.get(selectedBrand).get(selectedModel)
            )
            years.forEach((year) => {
              const option = document.createElement("option")
              option.value = year.toString()
              option.textContent = year.toString()
              yearSelect.appendChild(option)
            })
            yearSelect.disabled = false
          } else {
            yearSelect.disabled = true
          }
        })
      },
      preConfirm: () => {
        const operatorId = (document.getElementById("operador") as HTMLInputElement)
        .value;

        if(operatorId){
          return {
            subject: (document.getElementById("asunto") as HTMLInputElement)
            .value,
          description: (
            document.getElementById("descripcion") as HTMLInputElement
          ).value,
          brand: (document.getElementById("vehiculo-brand") as HTMLInputElement)
            .value,
          model: (document.getElementById("vehiculo-model") as HTMLInputElement)
            .value,
          year: parseInt(
            (document.getElementById("vehiculo-year") as HTMLInputElement).value
          ),
          priority: (
            document.querySelector(
              'input[name="priority"]:checked'
            ) as HTMLInputElement
          ).value,
          operator_id: operatorId,
          }
        }
        return {
          subject: (document.getElementById("asunto") as HTMLInputElement)
            .value,
          description: (
            document.getElementById("descripcion") as HTMLInputElement
          ).value,
          brand: (document.getElementById("vehiculo-brand") as HTMLInputElement)
            .value,
          model: (document.getElementById("vehiculo-model") as HTMLInputElement)
            .value,
          year: parseInt(
            (document.getElementById("vehiculo-year") as HTMLInputElement).value
          ),
          priority: (
            document.querySelector(
              'input[name="priority"]:checked'
            ) as HTMLInputElement
          ).value,
        }
      },
    })

    if (formValues) {
      const newMassiveControl: POSTMassiveControl = {
        method: 'massive',
        ...formValues,
      }
      await createMassiveControl(newMassiveControl)

      Swal.fire("¡Control masivo creado!", "", "success")
    }
  }

  const handleCreateAIControl = async () => {
    const vehicleOptions = vehiculos.map(v => `<option value="${v.id}">${v.brand} ${v.model} (${v.id})</option>`).join('')
    const operatorOptions = users
      .filter(user => user.roles.includes("OPERATOR"))
      .map(user => `<option value="${user.id}">${user.full_name}</option>`)
      .join('')

    const { value: formValues } = await Swal.fire({
      title: 'Crear Control con IA',
      html: `
        <div class="flex flex-col gap-4">
          <select id="vehicle" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled selected>Seleccione un vehículo</option>
            ${vehicleOptions}
          </select>
          <select id="operator" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled selected>Seleccione un operador (opcional)</option>
            ${operatorOptions}
          </select>
        </div>
      `,
      focusConfirm: false,
      customClass: {
        container: 'bg-gray-900',
        popup: 'bg-gray-800 rounded-lg shadow-xl border border-gray-700',
        title: 'text-2xl font-bold text-white mb-4',
        closeButton: 'text-white',
        confirmButton: 'bg-purple-500 hover:bg-purple-600',
        cancelButton: 'bg-red-500 hover:bg-red-600',
      },
      preConfirm: () => {
        return {
          vehicle_id: (document.getElementById('vehicle') as HTMLSelectElement).value,
          operator_id: (document.getElementById('operator') as HTMLSelectElement).value,
        }
      }
    })

    if (formValues) {
      const newControl: POSTPredictiveControl = {
        ...formValues,
        method: 'predictive',
      }
      createPredictiveControl(newControl)
      Swal.fire('Control con IA creado!', '', 'success')
    }
  }

  return (
    <button
      onClick={handleAgregarControl}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2"
    >
      <FaPlus />
      Agregar Control
    </button>
  )
}
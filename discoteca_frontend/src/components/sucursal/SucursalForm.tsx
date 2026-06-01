import type { UseFormRegister, FieldErrors } from "react-hook-form"
import { Building2, MapPin } from "lucide-react"
import ErrorMessage from "../ErrorMessage"
import type { SucursalFormData } from "@/types/SucursalType"

type SucursalProps = {
  register: UseFormRegister<SucursalFormData>
  errors: FieldErrors<SucursalFormData>
}

export default function SucursalForm({ register, errors }: SucursalProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* =========================
          ENCABEZADO DEL FORMULARIO
      ========================= */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-800">
          Datos de la Sucursal
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Registra la información principal de la sucursal.
        </p>
      </div>

      {/* =========================
          NOMBRE DE LA SUCURSAL
      ========================= */}
      <div className="space-y-2">
        <label
          htmlFor="nombreSucursal"
          className="block text-sm font-bold uppercase tracking-wide text-gray-700"
        >
          Nombre de la Sucursal
        </label>

        <div className="relative">
          <Building2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            id="nombreSucursal"
            type="text"
            placeholder="Ej: Sucursal Central"
            className={`
              w-full rounded-xl border bg-gray-50 py-3 pl-12 pr-4 text-gray-800
              outline-none transition-all duration-200
              placeholder:text-gray-400
              focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100
              ${
                errors.nombreSucursal
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200"
              }
            `}
            {...register("nombreSucursal", {
              required: "El nombre de la sucursal es obligatorio",
            })}
          />
        </div>

        {errors.nombreSucursal ? (
          <ErrorMessage>{errors.nombreSucursal.message}</ErrorMessage>
        ) : (
          <p className="text-xs text-gray-400">
            Ingresa un nombre claro para identificar la sucursal.
          </p>
        )}
      </div>

      {/* =========================
          UBICACIÓN DE LA SUCURSAL
      ========================= */}
      <div className="space-y-2">
        <label
          htmlFor="ubicacionSucursal"
          className="block text-sm font-bold uppercase tracking-wide text-gray-700"
        >
          Ubicación
        </label>

        <div className="relative">
          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            id="ubicacionSucursal"
            type="text"
            placeholder="Ej: Av. Camacho #123, La Paz"
            className={`
              w-full rounded-xl border bg-gray-50 py-3 pl-12 pr-4 text-gray-800
              outline-none transition-all duration-200
              placeholder:text-gray-400
              focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100
              ${
                errors.ubicacionSucursal
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200"
              }
            `}
            {...register("ubicacionSucursal", {
              required: "La ubicación es obligatoria",
            })}
          />
        </div>

        {errors.ubicacionSucursal ? (
          <ErrorMessage>{errors.ubicacionSucursal.message}</ErrorMessage>
        ) : (
          <p className="text-xs text-gray-400">
            Puedes colocar una dirección, zona o referencia de la sucursal.
          </p>
        )}
      </div>
    </div>
  )
}

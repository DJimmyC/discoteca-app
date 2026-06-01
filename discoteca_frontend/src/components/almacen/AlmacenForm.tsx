// src/components/almacen/AlmacenForm.tsx

import {
  Building2,
  FileText,
  MapPin,
  Package,
  Save,
  Warehouse,
} from "lucide-react";

import type {

  AlmacenFormData,

} from "@/types/AlmacenType";

import type {

  SucursalType,

} from "@/types/SucursalType";

type Props = {

  formData:
    AlmacenFormData;

  setFormData:
    React.Dispatch<
      React.SetStateAction<AlmacenFormData>
    >;

  onSubmit:
    (e: React.FormEvent) => void;

  sucursales:
    SucursalType[];

  loading?:
    boolean;

  submitText?:
    string;

};

export default function AlmacenForm({

  formData,

  setFormData,

  onSubmit,

  sucursales,

  loading,

  submitText = "Guardar",

}: Props) {

  return (

    <form
      onSubmit={onSubmit}
      className="space-y-8"
    >

      {/* GRID */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* SUCURSAL */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">
            Sucursal
          </label>

          <div className="relative">

            <Building2
              className="
                absolute
                left-3
                top-3.5
                h-5
                w-5
                text-slate-400
              "
            />

            <select
            disabled
              value={
                typeof formData.idSucursal ===
                "string"

                  ? formData.idSucursal

                  : ""
              }
              onChange={(e) =>
                setFormData({

                  ...formData,

                  idSucursal:
                    e.target.value,

                })
              }
              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                bg-white
                py-3
                pl-10
                pr-4
                text-sm
                focus:border-fuchsia-500
                focus:outline-none
              "
            >

           

              {sucursales.map(
                (sucursal) => (

                  <option
                    key={sucursal._id}
                    value={sucursal._id}
                  >

                    {sucursal.nombreSucursal}

                  </option>

                )
              )}

            </select>

          </div>

        </div>

        {/* NOMBRE */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">
            Nombre
          </label>

          <div className="relative">

            <Warehouse
              className="
                absolute
                left-3
                top-3.5
                h-5
                w-5
                text-slate-400
              "
            />

            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  nombre:
                    e.target.value,

                })
              }
              placeholder="Nombre del almacén"
              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                bg-white
                py-3
                pl-10
                pr-4
                text-sm
                focus:border-fuchsia-500
                focus:outline-none
              "
            />

          </div>

        </div>

        {/* TIPO */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">
            Tipo
          </label>

          <div className="relative">

            <Package
              className="
                absolute
                left-3
                top-3.5
                h-5
                w-5
                text-slate-400
              "
            />

            <select
              value={formData.tipo}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  tipo:
                    e.target.value as any,

                })
              }
              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                bg-white
                py-3
                pl-10
                pr-4
                text-sm
                focus:border-fuchsia-500
                focus:outline-none
              "
            >

              <option value="">
                -- Seleccione --
              </option>

              <option value="principal">
                Principal
              </option>

              <option value="barra">
                Barra
              </option>

              <option value="deposito">
                Depósito
              </option>

              <option value="auxiliar">
                Auxiliar
              </option>

            </select>

          </div>

        </div>

      
      </div>

      {/* DESCRIPCION */}
      <div>

        <label className="mb-2 block text-sm font-bold text-slate-700">
          Descripción
        </label>

        <div className="relative">

          <FileText
            className="
              absolute
              left-3
              top-3.5
              h-5
              w-5
              text-slate-400
            "
          />

          <textarea
            rows={4}
            value={
              formData.descripcion || ""
            }
            onChange={(e) =>
              setFormData({

                ...formData,

                descripcion:
                  e.target.value,

              })
            }
            placeholder="Descripción del almacén"
            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-white
              py-3
              pl-10
              pr-4
              text-sm
              focus:border-fuchsia-500
              focus:outline-none
            "
          />

        </div>

      </div>

      {/* ESTADO */}
      <div>

        <label className="mb-3 block text-sm font-bold text-slate-700">
          Estado
        </label>

        <button
          type="button"
          onClick={() =>
            setFormData({

              ...formData,

              estado:
                !formData.estado,

            })
          }
          className={`
            relative
            inline-flex
            h-7
            w-14
            items-center
            rounded-full
            transition

            ${formData.estado

              ? "bg-emerald-500"

              : "bg-slate-300"
            }
          `}
        >

          <span
            className={`
              inline-block
              h-5
              w-5
              transform
              rounded-full
              bg-white
              transition

              ${formData.estado

                ? "translate-x-8"

                : "translate-x-1"
              }
            `}
          />

        </button>

      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-4">

        <button
          type="submit"
          disabled={loading}
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-gradient-to-r
            from-fuchsia-600
            to-purple-600
            px-6
            py-3
            font-semibold
            text-white
            shadow-lg
            transition
            hover:scale-105
            disabled:opacity-50
          "
        >

          <Save className="h-5 w-5" />

          {loading
            ? "Guardando..."
            : submitText}

        </button>

      </div>

    </form>

  );

}
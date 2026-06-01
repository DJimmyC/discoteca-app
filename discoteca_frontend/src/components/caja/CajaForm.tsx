// src/components/caja/CajaForm.tsx

import {
  Loader2,
  Save,
  ArrowLeft,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import type {
  CajaForm as CajaFormType,
} from "@/types/CajaType";

type Props = {

  formData:
    CajaFormType;

  setFormData:
    React.Dispatch<
      React.SetStateAction<CajaFormType>
    >;

  onSubmit:
    (e: React.FormEvent) => void;

  loading?:
    boolean;

  submitText?:
    string;

};

export default function CajaForm({

  formData,

  setFormData,

  onSubmit,

  loading,

  submitText =
    "Guardar Caja",

}: Props) {

  const { sucursalId } =
    useParams();

  return (

    <form
      onSubmit={onSubmit}
      className="space-y-8"
    >

      {/* TOP ACTIONS */}
      <div className="flex items-center justify-between">

        <Link

          to={`/sucursal/${sucursalId}/caja`}

          className="
            inline-flex
            items-center
            gap-2
            rounded-2xl
            border
            border-slate-300
            bg-white
            px-5
            py-3
            text-sm
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-100
          "
        >

          <ArrowLeft className="h-4 w-4" />

          Volver

        </Link>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* NOMBRE */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Nombre Caja

          </label>

          <input

            type="text"

            value={formData.nombre}

            onChange={(e) =>

              setFormData((prev) => ({

                ...prev,

                nombre:
                  e.target.value,

              }))

            }

            placeholder="Caja principal"

            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-white
              px-5
              py-4
              text-sm
              focus:border-fuchsia-500
              focus:outline-none
            "
          />

        </div>

        {/* ESTADO */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Estado

          </label>

          <select

            value={
              formData.estado
                ? "true"
                : "false"
            }

            onChange={(e) =>

              setFormData((prev) => ({

                ...prev,

                estado:
                  e.target.value ===
                  "true",

              }))

            }

            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-white
              px-5
              py-4
              text-sm
              focus:border-fuchsia-500
              focus:outline-none
            "
          >

            <option value="true">
              Activo
            </option>

            <option value="false">
              Inactivo
            </option>

          </select>

        </div>

      </div>

      {/* DESCRIPCION */}
      <div>

        <label className="mb-2 block text-sm font-bold text-slate-700">

          Descripción

        </label>

        <textarea

          rows={5}

          value={
            formData.descripcion ||
            ""
          }

          onChange={(e) =>

            setFormData((prev) => ({

              ...prev,

              descripcion:
                e.target.value,

            }))

          }

          placeholder="Descripción de la caja..."

          className="
            w-full
            rounded-2xl
            border
            border-slate-300
            bg-white
            px-5
            py-4
            text-sm
            focus:border-fuchsia-500
            focus:outline-none
          "
        />

      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-end gap-4 border-t border-slate-200 pt-6">

        <Link

          to={`/sucursal/${sucursalId}/caja`}

          className="
            rounded-2xl
            border
            border-slate-300
            bg-white
            px-6
            py-3
            text-sm
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-100
          "
        >

          Cancelar

        </Link>

        <button

          type="submit"

          disabled={loading}

          className="
            inline-flex
            items-center
            gap-2
            rounded-2xl
            bg-gradient-to-r
            from-fuchsia-600
            to-purple-600
            px-6
            py-3
            text-sm
            font-semibold
            text-white
            shadow-lg
            transition
            hover:scale-105
            disabled:cursor-not-allowed
            disabled:opacity-70
          "
        >

          {loading ? (

            <>

              <Loader2 className="h-5 w-5 animate-spin" />

              Guardando...

            </>

          ) : (

            <>

              <Save className="h-5 w-5" />

              {submitText}

            </>

          )}

        </button>

      </div>

    </form>

  );

}
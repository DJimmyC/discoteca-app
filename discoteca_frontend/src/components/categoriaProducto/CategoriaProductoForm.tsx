import type {
  CategoriaProductoFormData,
} from "@/types/CategoriaProductoType";

import {
  Package,
  Save,
  FileText,
} from "lucide-react";

type CategoriaProductoFormProps = {

  formData:
    CategoriaProductoFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<CategoriaProductoFormData>
  >;

  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>
  ) => void;

  isPending: boolean;

  submitText: string;

  cancelAction: () => void;

};

export default function CategoriaProductoForm({

  formData,

  setFormData,

  handleSubmit,

  isPending,

  submitText,

  cancelAction,

}: CategoriaProductoFormProps) {

  return (

    <form
      onSubmit={handleSubmit}
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-8
        shadow-sm
      "
    >

      <div className="grid gap-6 md:grid-cols-2">

        {/* NOMBRE */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">
            Nombre
          </label>

          <div className="relative">

            <Package className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input
              type="text"
              placeholder="Ingrese nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nombre:
                    e.target.value,
                })
              }
              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                py-3
                pl-10
                pr-4
                text-sm
                focus:border-fuchsia-500
                focus:outline-none
              "
              required
            />

          </div>

        </div>

        {/* ESTADO */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">
            Estado
          </label>

          <select
            value={
              formData.estado
                ? "activo"
                : "inactivo"
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                estado:
                  e.target.value ===
                  "activo",
              })
            }
            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              px-4
              py-3
              text-sm
              focus:border-fuchsia-500
              focus:outline-none
            "
          >

            <option value="activo">
              Activo
            </option>

            <option value="inactivo">
              Inactivo
            </option>

          </select>

        </div>

      </div>

      {/* DESCRIPCION */}
      <div className="mt-6">

        <label className="mb-2 block text-sm font-bold text-slate-700">
          Descripción
        </label>

        <div className="relative">

          <FileText className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

          <textarea
            rows={4}
            placeholder="Ingrese descripción"
            value={formData.descripcion || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                descripcion:
                  e.target.value,
              })
            }
            className="
              w-full
              rounded-2xl
              border
              border-slate-300
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

      {/* CREADO POR */}
      <div className="mt-6">

        <label className="mb-2 block text-sm font-bold text-slate-700">
          Creado Por
        </label>

        <input
          type="text"
          value={formData.creadoPor || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              creadoPor:
                e.target.value,
            })
          }
          className="
            w-full
            rounded-2xl
            border
            border-slate-300
            px-4
            py-3
            text-sm
            focus:border-fuchsia-500
            focus:outline-none
          "
        />

      </div>

      {/* BOTONES */}
      <div className="mt-8 flex justify-end gap-4">

        <button
          type="button"
          onClick={cancelAction}
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
        </button>

        <button
          type="submit"
          disabled={isPending}
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
            text-sm
            font-semibold
            text-white
            shadow-lg
            transition
            hover:scale-105
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          <Save className="h-5 w-5" />

          {isPending
            ? "Guardando..."
            : submitText}

        </button>

      </div>

    </form>

  );

}
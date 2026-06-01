import {
  useQuery,
} from "@tanstack/react-query";

import {
  Package,
  Save,
  FileText,
  Tag,
  BadgeInfo,
} from "lucide-react";

import {
  getCategoriaProductos,
} from "@/api/CategoriaProductoApi";

import type {
  ProductoFormData,
} from "@/types/ProductoType";

type ProductoFormProps = {

  formData:
    ProductoFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<ProductoFormData>
  >;

  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>
  ) => void;

  isPending: boolean;

  submitText: string;

  cancelAction: () => void;

};

export default function ProductoForm({

  formData,

  setFormData,

  handleSubmit,

  isPending,

  submitText,

  cancelAction,

}: ProductoFormProps) {

  /* =========================
      GET CATEGORIAS
  ========================= */
  const {
    data,
  } = useQuery({

    queryKey: [
      "categoria-productos"
    ],

    queryFn:
      getCategoriaProductos,

  });

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

        {/* CATEGORIA */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">
            Categoría
          </label>

          <div className="relative">

            <Tag className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <select
              value={
                typeof formData.idCategoria ===
                "string"

                  ? formData.idCategoria

                  : formData.idCategoria?._id || ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  idCategoria:
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
              required
            >

              <option value="">
                -- Seleccione --
              </option>

              {data?.map((categoria) => (

                <option
                  key={categoria._id}
                  value={categoria._id}
                >

                  {categoria.nombre}

                </option>

              ))}

            </select>

          </div>

        </div>

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

        {/* MARCA */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">
            Marca
          </label>

          <div className="relative">

            <BadgeInfo className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input
              type="text"
              placeholder="Ingrese marca"
              value={formData.marca || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  marca:
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
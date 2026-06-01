// src/components/inventario/InventarioForm.tsx

import {
  useMemo,
  useState,
} from "react";

import {
  Boxes,
  DollarSign,
  Package,
  Search,
  Warehouse,
} from "lucide-react";

import type {
  InventarioFormData,
} from "@/types/InventarioType";

type Props = {

  formData:
  InventarioFormData;

  setFormData:
  React.Dispatch<
    React.SetStateAction<InventarioFormData>
  >;

  onSubmit:
  (
    e: React.FormEvent
  ) => void;

  almacenes:
  any[];

  productos:
  any[];

  loading?:
  boolean;

  submitText?:
  string;

};

export default function InventarioForm({

  formData,

  setFormData,

  onSubmit,

  almacenes,

  productos,

  loading,

  submitText = "Guardar Inventario",

}: Props) {

  /* =========================
      SEARCH PRODUCTO
  ========================= */

  const [
    productoSearch,

    setProductoSearch,

  ] = useState("");

  const filteredProductos =
    useMemo(() => {

      if (
        !productoSearch
      )
        return productos;

      return productos.filter(
        (producto) =>

          producto.nombre
            ?.toLowerCase()
            .includes(
              productoSearch.toLowerCase()
            ) ||

          producto.marca
            ?.toLowerCase()
            .includes(
              productoSearch.toLowerCase()
            )

      );

    }, [

      productos,

      productoSearch,

    ]);

  return (

    <form
      onSubmit={onSubmit}
      className="space-y-8"
    >

      {/* GRID */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* =========================
            ALMACEN
        ========================= */}

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Almacén

          </label>

          <div className="relative">

            <Warehouse className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <select

              value={
                typeof formData.idAlmacen === "string"
                  ? formData.idAlmacen
                  : formData.idAlmacen?._id || ""
              }

              onChange={(e) =>
                setFormData({
                  ...formData,
                  idAlmacen:
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
                pl-11
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

              {almacenes.map(
                (almacen) => (

                  <option
                    key={
                      almacen._id
                    }
                    value={
                      almacen._id
                    }
                  >

                    {almacen.nombre}

                    {" - "}

                    {almacen.tipo}

                  </option>

                )
              )}

            </select>

          </div>

        </div>

        {/* =========================
            PRODUCTO SEARCH
        ========================= */}

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Buscar Producto

          </label>

          <div className="relative">

            <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input

              type="text"

              placeholder="Buscar producto..."

              value={
                productoSearch
              }

              onChange={(e) =>
                setProductoSearch(
                  e.target.value
                )
              }

              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                bg-white
                py-3
                pl-11
                pr-4
                text-sm
                focus:border-fuchsia-500
                focus:outline-none
              "
            />

          </div>

        </div>

      </div>

      {/* =========================
          PRODUCTOS
      ========================= */}

      <div>

        <label className="mb-3 block text-sm font-bold text-slate-700">

          Productos

        </label>

        <div
          className="
            max-h-72
            overflow-y-auto
            rounded-3xl
            border
            border-slate-200
            bg-slate-50
            p-4
          "
        >

          <div className="grid gap-3">

            {filteredProductos.map(
              (producto) => {

                const selected =
                  formData.idProducto ===
                  producto._id;

                return (

                  <button

                    key={
                      producto._id
                    }

                    type="button"

                    onClick={() =>
                      setFormData({
                        ...formData,
                        idProducto:
                          producto._id,
                      })
                    }

                    className={`
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition
                      hover:scale-[1.01]

                      ${selected

                        ? "border-fuchsia-500 bg-fuchsia-50"

                        : "border-slate-200 bg-white"

                      }
                    `}
                  >

                    <div className="flex items-center gap-4">

                      <div
                        className="
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-2xl
                          bg-fuchsia-100
                          text-fuchsia-600
                        "
                      >

                        <Package className="h-6 w-6" />

                      </div>

                      <div>

                        <p className="font-bold text-slate-800">

                          {
                            producto.nombre
                          }

                        </p>

                        <p className="text-sm text-slate-500">

                          {
                            producto.marca ||
                            "Sin marca"
                          }

                        </p>

                      </div>

                    </div>

                    {selected && (

                      <span
                        className="
                          rounded-full
                          bg-fuchsia-600
                          px-3
                          py-1
                          text-xs
                          font-bold
                          text-white
                        "
                      >
                        Seleccionado
                      </span>

                    )}

                  </button>

                );

              }
            )}

          </div>

        </div>

      </div>

      {/* =========================
          DATOS
      ========================= */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {/* CANTIDAD */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Cantidad

          </label>

          <div className="relative">

            <Boxes className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input

              type="number"

              min={0}

              value={
                formData.cantidad
              }

              onChange={(e) =>
                setFormData({
                  ...formData,
                  cantidad:
                    Number(
                      e.target.value
                    ),
                })
              }

              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                py-3
                pl-11
                pr-4
                text-sm
                focus:border-fuchsia-500
                focus:outline-none
              "

              required
            />

          </div>

        </div>

        {/* COSTO */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Costo Unitario

          </label>

          <div className="relative">

            <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input

              type="number"

              step="0.01"

              min={0}

              value={
                formData.costoUnitario
              }

              onChange={(e) =>
                setFormData({
                  ...formData,
                  costoUnitario:
                    Number(
                      e.target.value
                    ),
                })
              }

              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                py-3
                pl-11
                pr-4
                text-sm
                focus:border-fuchsia-500
                focus:outline-none
              "

              required
            />

          </div>

        </div>

        {/* PRECIO */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Precio Venta

          </label>

          <div className="relative">

            <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input

              type="number"

              step="0.01"

              min={0}

              value={
                formData.precioVenta
              }

              onChange={(e) =>
                setFormData({
                  ...formData,
                  precioVenta:
                    Number(
                      e.target.value
                    ),
                })
              }

              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                py-3
                pl-11
                pr-4
                text-sm
                focus:border-fuchsia-500
                focus:outline-none
              "

              required
            />

          </div>

        </div>

        {/* STOCK */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Stock Mínimo

          </label>

          <div className="relative">

            <Boxes className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input

              type="number"

              min={0}

              value={
                formData.stockMinimo
              }

              onChange={(e) =>
                setFormData({
                  ...formData,
                  stockMinimo:
                    Number(
                      e.target.value
                    ),
                })
              }

              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                py-3
                pl-11
                pr-4
                text-sm
                focus:border-fuchsia-500
                focus:outline-none
              "
            />

          </div>

        </div>

      </div>

      {/* ESTADO */}
      <div className="flex items-center gap-3">

        <input

          type="checkbox"

          checked={
            formData.estado
          }

          onChange={(e) =>
            setFormData({
              ...formData,
              estado:
                e.target.checked,
            })
          }

          className="h-5 w-5 rounded border-slate-300 text-fuchsia-600"
        />

        <span className="text-sm font-medium text-slate-700">

          Inventario Activo

        </span>

      </div>

      {/* BUTTON */}
      <div className="flex justify-end">

        <button

          type="submit"

          disabled={loading}

          className="
            rounded-2xl
            bg-gradient-to-r
            from-fuchsia-600
            to-purple-600
            px-8
            py-3
            text-sm
            font-bold
            text-white
            shadow-lg
            transition
            hover:scale-105
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          {

            loading

              ? "Guardando..."

              : submitText

          }

        </button>

      </div>

    </form>

  );

}
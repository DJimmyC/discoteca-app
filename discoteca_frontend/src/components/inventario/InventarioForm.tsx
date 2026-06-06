// src/components/inventario/InventarioForm.tsx

import {
  useMemo,
  useState,
} from "react";

import {
  Boxes,
  Calculator,
  DollarSign,
  Package,
  Search,
  Warehouse,
} from "lucide-react";

import type {
  InventarioFormData,
} from "@/types/InventarioType";

type AlmacenOption = {

  _id:
    string;

  nombre?:
    string | null;

  tipo?:
    string | null;

  estado?:
    boolean;

};

type ProductoOption = {

  _id:
    string;

  nombre?:
    string | null;

  descripcion?:
    string | null;

  marca?:
    string | null;

  estado?:
    boolean;

};

type Props = {

  formData:
    InventarioFormData;

  setFormData:
    React.Dispatch<
      React.SetStateAction<InventarioFormData>
    >;

  onSubmit:
    (
      event:
        React.FormEvent<HTMLFormElement>
    ) => void;

  almacenes:
    AlmacenOption[];

  productos:
    ProductoOption[];

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

  loading = false,

  submitText =
    "Registrar entrada",

}: Props) {

  const [
    productoSearch,
    setProductoSearch,
  ] = useState("");

  /* =========================
      PRODUCTOS FILTRADOS
  ========================= */

  const filteredProductos =
    useMemo(() => {

      const search =
        productoSearch
          .trim()
          .toLowerCase();

      return productos.filter(
        (
          producto
        ) => {

          if (
            producto.estado ===
            false
          ) {
            return false;
          }

          if (!search) {
            return true;
          }

          const texto = [

            producto.nombre,

            producto.marca,

            producto.descripcion,

          ]
            .filter(
              Boolean
            )
            .join(" ")
            .toLowerCase();

          return texto.includes(
            search
          );

        }
      );

    }, [
      productos,
      productoSearch,
    ]);

  /* =========================
      PRODUCTO SELECCIONADO
  ========================= */

  const productoSeleccionado =
    productos.find(
      (
        producto
      ) =>
        producto._id ===
        formData.idProducto
    );

  /* =========================
      VALOR DE LA ENTRADA
  ========================= */

  const valorEntrada =
    Number(
      formData.cantidad ||
      0
    ) *
    Number(
      formData.costoUnitario ||
      0
    );

  return (

    <form
      onSubmit={onSubmit}
      className="space-y-8"
    >

      {/* =========================
          ALMACÉN Y BUSCADOR
      ========================= */}

      <div className="grid gap-6 lg:grid-cols-2">

        <div>

          <label
            htmlFor="idAlmacen"
            className="mb-2 block text-sm font-bold text-slate-700"
          >

            Almacén de ingreso

          </label>

          <div className="relative">

            <Warehouse className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <select
              id="idAlmacen"
              value={
                formData.idAlmacen
              }
              onChange={(
                event
              ) =>
                setFormData(
                  (
                    current
                  ) => ({

                    ...current,

                    idAlmacen:
                      event.target.value,

                  })
                )
              }
              disabled={loading}
              required
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
                outline-none
                transition
                focus:border-fuchsia-500
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              <option value="">

                Seleccione un almacén

              </option>

              {almacenes
                .filter(
                  (
                    almacen
                  ) =>
                    almacen.estado !==
                    false
                )
                .map(
                  (
                    almacen
                  ) => (

                    <option
                      key={
                        almacen._id
                      }
                      value={
                        almacen._id
                      }
                    >

                      {almacen.nombre ||
                        "Almacén"}

                      {" - "}

                      {almacen.tipo ||
                        "sin tipo"}

                    </option>

                  )
                )}

            </select>

          </div>

        </div>

        <div>

          <label
            htmlFor="buscarProducto"
            className="mb-2 block text-sm font-bold text-slate-700"
          >

            Buscar producto

          </label>

          <div className="relative">

            <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input
              id="buscarProducto"
              type="text"
              value={
                productoSearch
              }
              onChange={(
                event
              ) =>
                setProductoSearch(
                  event.target.value
                )
              }
              disabled={loading}
              placeholder="Nombre, marca o descripción..."
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
                outline-none
                transition
                focus:border-fuchsia-500
                disabled:opacity-60
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

          Seleccione el producto

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

          {filteredProductos.length ===
          0 ? (

            <div className="py-10 text-center text-slate-500">

              No se encontraron productos.

            </div>

          ) : (

            <div className="grid gap-3 sm:grid-cols-2">

              {filteredProductos.map(
                (
                  producto
                ) => {

                  const selected =
                    formData.idProducto ===
                    producto._id;

                  return (

                    <button
                      key={
                        producto._id
                      }
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setFormData(
                          (
                            current
                          ) => ({

                            ...current,

                            idProducto:
                              producto._id,

                          })
                        )
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
                        disabled:cursor-not-allowed
                        disabled:opacity-60

                        ${
                          selected
                            ? "border-fuchsia-500 bg-fuchsia-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-fuchsia-300"
                        }
                      `}
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className={`
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl

                            ${
                              selected
                                ? "bg-fuchsia-600 text-white"
                                : "bg-slate-100 text-slate-500"
                            }
                          `}
                        >

                          <Package className="h-5 w-5" />

                        </div>

                        <div>

                          <p className="font-black text-slate-800">

                            {producto.nombre ||
                              "Producto"}

                          </p>

                          <p className="text-xs text-slate-500">

                            {producto.marca ||
                              "Sin marca"}

                          </p>

                        </div>

                      </div>

                      {selected && (

                        <span className="rounded-full bg-fuchsia-600 px-3 py-1 text-xs font-bold text-white">

                          Seleccionado

                        </span>

                      )}

                    </button>

                  );

                }
              )}

            </div>

          )}

        </div>

      </div>

      {/* =========================
          PRODUCTO ELEGIDO
      ========================= */}

      {productoSeleccionado && (

        <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-4">

          <p className="text-xs font-bold uppercase tracking-wide text-fuchsia-600">

            Producto seleccionado

          </p>

          <p className="mt-1 text-lg font-black text-slate-800">

            {productoSeleccionado.nombre}

          </p>

          <p className="text-sm text-slate-500">

            {productoSeleccionado.descripcion ||
              "Sin descripción"}

          </p>

        </div>

      )}

      {/* =========================
          DATOS DE ENTRADA
      ========================= */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div>

          <label
            htmlFor="cantidad"
            className="mb-2 block text-sm font-bold text-slate-700"
          >

            Cantidad que ingresa

          </label>

          <div className="relative">

            <Boxes className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input
              id="cantidad"
              type="number"
              min={1}
              step={1}
              value={
                formData.cantidad
              }
              onChange={(
                event
              ) =>
                setFormData(
                  (
                    current
                  ) => ({

                    ...current,

                    cantidad:
                      Number(
                        event.target.value
                      ),

                  })
                )
              }
              disabled={loading}
              required
              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-fuchsia-500
              "
            />

          </div>

        </div>

        <div>

          <label
            htmlFor="costoUnitario"
            className="mb-2 block text-sm font-bold text-slate-700"
          >

            Costo de esta entrada

          </label>

          <div className="relative">

            <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input
              id="costoUnitario"
              type="number"
              min={0}
              step="0.01"
              value={
                formData.costoUnitario
              }
              onChange={(
                event
              ) =>
                setFormData(
                  (
                    current
                  ) => ({

                    ...current,

                    costoUnitario:
                      Number(
                        event.target.value
                      ),

                  })
                )
              }
              disabled={loading}
              required
              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-fuchsia-500
              "
            />

          </div>

          <p className="mt-1 text-xs text-slate-500">

            El backend calculará el nuevo costo promedio.

          </p>

        </div>

        <div>

          <label
            htmlFor="precioVenta"
            className="mb-2 block text-sm font-bold text-slate-700"
          >

            Precio de venta

          </label>

          <div className="relative">

            <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input
              id="precioVenta"
              type="number"
              min={0}
              step="0.01"
              value={
                formData.precioVenta
              }
              onChange={(
                event
              ) =>
                setFormData(
                  (
                    current
                  ) => ({

                    ...current,

                    precioVenta:
                      Number(
                        event.target.value
                      ),

                  })
                )
              }
              disabled={loading}
              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-fuchsia-500
              "
            />

          </div>

        </div>

        <div>

          <label
            htmlFor="stockMinimo"
            className="mb-2 block text-sm font-bold text-slate-700"
          >

            Stock mínimo

          </label>

          <div className="relative">

            <Package className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input
              id="stockMinimo"
              type="number"
              min={0}
              step={1}
              value={
                formData.stockMinimo
              }
              onChange={(
                event
              ) =>
                setFormData(
                  (
                    current
                  ) => ({

                    ...current,

                    stockMinimo:
                      Number(
                        event.target.value
                      ),

                  })
                )
              }
              disabled={loading}
              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-fuchsia-500
              "
            />

          </div>

        </div>

      </div>

      {/* =========================
          RESUMEN ENTRADA
      ========================= */}

      <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white">

            <Calculator className="h-6 w-6" />

          </div>

          <div>

            <p className="text-sm font-bold text-cyan-700">

              Valor de la nueva entrada

            </p>

            <p className="text-2xl font-black text-slate-800">

              Bs. {valorEntrada.toFixed(2)}

            </p>

          </div>

        </div>

      </div>

      {/* =========================
          ESTADO
      ========================= */}

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">

        <input
          type="checkbox"
          checked={
            formData.estado
          }
          onChange={(
            event
          ) =>
            setFormData(
              (
                current
              ) => ({

                ...current,

                estado:
                  event.target.checked,

              })
            )
          }
          disabled={loading}
          className="h-5 w-5"
        />

        <div>

          <p className="font-bold text-slate-800">

            Inventario activo

          </p>

          <p className="text-sm text-slate-500">

            El producto estará disponible para operaciones.

          </p>

        </div>

      </label>

      {/* =========================
          SUBMIT
      ========================= */}

      <button
        type="submit"
        disabled={
          loading ||
          !formData.idAlmacen ||
          !formData.idProducto ||
          formData.cantidad <= 0
        }
        className="
          inline-flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-fuchsia-600
          px-6
          py-4
          font-black
          text-white
          transition
          hover:bg-fuchsia-700
          disabled:cursor-not-allowed
          disabled:bg-slate-300
        "
      >

        <Boxes className="h-5 w-5" />

        {loading
          ? "Registrando entrada..."
          : submitText}

      </button>

    </form>

  );

}
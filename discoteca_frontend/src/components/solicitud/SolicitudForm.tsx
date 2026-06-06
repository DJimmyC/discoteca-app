// src/components/solicitud/SolicitudForm.tsx

import {
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

/* =========================
    DETALLE SOLICITUD ITEM
========================= */

export type DetalleSolicitudItem = {
  idDetalle?: string;
  idProducto: string;
  cantidadSolicitada: number;
  cantidadAprobada?: number | null;
  cantidadAtendida?: number | null;
  unidad: string;
  observacion?: string | null;
  estado?: string | null;
  esNuevo?: boolean;
};

/* =========================
    OPTIONS
========================= */

type AlmacenOption = {
  _id?: string;
  nombre?: string | null;
  tipo?: string | null;
  descripcion?: string | null;
  ubicacion?: string | null;
  estado?: boolean | null;
};

type ProductoOption = {
  _id?: string;
  nombre?: string | null;
  descripcion?: string | null;
  marca?: string | null;
  estado?: boolean | null;
  stockDisponible?: number;
};

/* =========================
    PROPS
========================= */

type SolicitudFormProps = {
  almacenes: AlmacenOption[];
  productos: ProductoOption[];

  tipoSolicitud: string;
  setTipoSolicitud: (value: string) => void;

  idAlmacenOrigen: string;
  setIdAlmacenOrigen: (value: string) => void;

  idAlmacenDestino: string;
  setIdAlmacenDestino: (value: string) => void;

  estado: string;
  setEstado: (value: string) => void;

  observacion: string;
  setObservacion: (value: string) => void;

  detalles: DetalleSolicitudItem[];
  setDetalles: Dispatch<
    SetStateAction<DetalleSolicitudItem[]>
  >;

  isPending?: boolean;
  buttonText?: string;
  onSubmit: () => void;
};

/* =========================
    COMPONENTE
========================= */

export default function SolicitudForm({

  almacenes,

  productos,

  tipoSolicitud,

  setTipoSolicitud,

  idAlmacenOrigen,

  setIdAlmacenOrigen,

  idAlmacenDestino,

  setIdAlmacenDestino,

  estado,

  setEstado,

  observacion,

  setObservacion,

  detalles,

  setDetalles,

  isPending = false,

  buttonText = "Guardar solicitud",

  onSubmit,

}: SolicitudFormProps) {

  /* =========================
      AGREGAR DETALLE
  ========================= */

  const agregarDetalle = () => {

    setDetalles((prev) => [
      ...prev,
      {
        idProducto: "",
        cantidadSolicitada: 1,
        cantidadAprobada: null,
        cantidadAtendida: null,
        unidad: "unidades",
        observacion: "",
        estado: "pendiente",
        esNuevo: true,
      },
    ]);

  };

  /* =========================
      ELIMINAR DETALLE
  ========================= */

  const eliminarDetalle = (
    index: number
  ) => {

    setDetalles((prev) =>
      prev.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );

  };

  /* =========================
      ACTUALIZAR DETALLE
  ========================= */

  const actualizarDetalle = (
    index: number,
    field: keyof DetalleSolicitudItem,
    value: string | number | null
  ) => {

    setDetalles((prev) =>
      prev.map((detalle, itemIndex) =>
        itemIndex === index
          ? {
              ...detalle,
              [field]: value,
            }
          : detalle
      )
    );

  };

  /* =========================
      FILTRO PRODUCTOS
  ========================= */

  const filtrarProductos = (
    search: string
  ) => {

    const value =
      search.trim().toLowerCase();

    if (!value) {
      return productos;
    }

    return productos.filter((producto) => {

      const texto = `
        ${producto.nombre || ""}
        ${producto.descripcion || ""}
        ${producto.marca || ""}
      `.toLowerCase();

      return texto.includes(
        value
      );

    });

  };

  const esCompraExterna =
    tipoSolicitud === "compra_externa";

  return (

    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* TITULO */}
      <div className="mb-8">

        <h2 className="text-4xl font-black text-slate-900">
          Datos de la Solicitud
        </h2>

        <p className="mt-2 text-slate-500">
          Registra una solicitud de reposición interna o compra externa.
        </p>

      </div>

      {/* DATOS PRINCIPALES */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* TIPO SOLICITUD */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Tipo de solicitud
          </label>

          <select
            value={tipoSolicitud}
            onChange={(e) => {

              const value =
                e.target.value;

              setTipoSolicitud(value);

              if (value === "compra_externa") {
                setIdAlmacenOrigen("");
              }

            }}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          >
            <option value="reposicion_interna">
              Reposición interna
            </option>

            <option value="compra_externa">
              Compra externa
            </option>
          </select>

        </div>

        {/* ESTADO */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Estado
          </label>

          <select
            value={estado}
            onChange={(e) =>
              setEstado(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          >
            <option value="pendiente">
              Pendiente
            </option>

            <option value="en_revision">
              En revisión
            </option>

            <option value="aprobada">
              Aprobada
            </option>

            <option value="rechazada">
              Rechazada
            </option>

            <option value="en_proceso">
              En proceso
            </option>

            <option value="en_transito">
              En tránsito
            </option>

            <option value="atendida">
              Atendida
            </option>

            <option value="anulada">
              Anulada
            </option>
          </select>

        </div>

        {/* ALMACEN ORIGEN */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Almacén origen
          </label>

          <select
            value={idAlmacenOrigen}
            onChange={(e) =>
              setIdAlmacenOrigen(
                e.target.value
              )
            }
            disabled={true}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">
              {esCompraExterna
                ? "Compra externa / proveedor"
                : "Almacén principal seleccionado automáticamente"}
            </option>

            {almacenes
              .filter(
                (almacen) =>
                  almacen._id &&
                  almacen._id !== idAlmacenOrigen
              )
              .map((almacen) => (

                <option
                  key={almacen._id}
                  value={almacen._id}
                >
                  {almacen.nombre || "Sin nombre"} - {almacen.tipo || "Sin tipo"}
                </option>

              ))}

          </select>

        </div>

        {/* ALMACEN DESTINO */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Almacén destino
          </label>

          <select
            value={idAlmacenDestino}
            onChange={(e) =>
              setIdAlmacenDestino(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          >
            <option value="">
              Seleccione almacén destino
            </option>

            {almacenes
              .filter((almacen) => almacen._id)
              .map((almacen) => (

                <option
                  key={almacen._id}
                  value={almacen._id}
                >
                  {almacen.nombre || "Sin nombre"} - {almacen.tipo || "Sin tipo"}
                </option>

              ))}

          </select>

        </div>

      </div>

      {/* OBSERVACION */}
      <div className="mt-6">

        <label className="mb-2 block text-sm font-bold text-slate-600">
          Observación
        </label>

        <textarea
          value={observacion}
          onChange={(e) =>
            setObservacion(
              e.target.value
            )
          }
          rows={3}
          placeholder="Ej: la barra se quedó sin stock, se solicita reposición urgente..."
          className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
        />

      </div>

      {/* DETALLES */}
      <div className="mt-10">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h3 className="text-2xl font-black text-slate-900">
              Productos solicitados
            </h3>

            <p className="text-sm text-slate-500">
              Agrega los productos que se solicitarán para reposición o compra.
            </p>

          </div>

          <button
            type="button"
            onClick={agregarDetalle}
            title="Agregar producto"
            aria-label="Agregar producto"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-500/20 transition hover:bg-purple-700"
          >
            <Plus className="h-6 w-6" />
          </button>

        </div>

        {detalles.length === 0 ? (

          <div className="flex h-40 items-center justify-center rounded-3xl border border-dashed border-slate-300 text-slate-500">
            No hay productos agregados
          </div>

        ) : (

          <div className="space-y-5">

            {detalles.map((detalle, index) => {

              const productoSeleccionado =
                productos.find(
                  (producto) =>
                    producto._id ===
                    detalle.idProducto
                );

              const searchProducto =
                productoSeleccionado
                  ? productoSeleccionado.nombre || ""
                  : "";

              return (

                <div
                  key={
                    detalle.idDetalle ||
                    `detalle-${index}`
                  }
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >

                  <div className="grid gap-4 xl:grid-cols-[1.3fr_140px_140px_140px_1fr_50px]">

                    {/* PRODUCTO */}
                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
                        Producto
                      </label>

                      <div className="relative">

                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          placeholder="Buscar producto..."
                          defaultValue={
                            searchProducto
                          }
                          className="mb-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pl-10 text-slate-700 outline-none transition focus:border-purple-400"
                        />

                      </div>

                      <select
                        value={detalle.idProducto}
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "idProducto",
                            e.target.value
                          )
                        }
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-purple-400"
                      >
                        <option value="">
                          Seleccione producto
                        </option>

                        {filtrarProductos(
                          searchProducto
                        )
                          .filter(
                            (producto) =>
                              producto._id
                          )
                          .map((producto) => (

                            <option
                              key={producto._id}
                              value={producto._id}
                            >
                              {producto.nombre}
                              {producto.marca
                                ? ` - ${producto.marca}`
                                : ""}
                              {typeof producto.stockDisponible === "number"
                                ? ` | Stock: ${producto.stockDisponible}`
                                : ""}
                            </option>

                          ))}

                      </select>

                    </div>

                    {/* CANTIDAD SOLICITADA */}
                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
                        Solicitada
                      </label>

                      <input
                        type="number"
                        min={1}
                        max={
                          productoSeleccionado
                            ?.stockDisponible
                        }
                        value={detalle.cantidadSolicitada}
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "cantidadSolicitada",
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-purple-400"
                      />

                      {typeof productoSeleccionado?.stockDisponible === "number" && (
                        <p className="mt-2 text-xs font-bold text-emerald-700">
                          Stock disponible: {productoSeleccionado.stockDisponible}
                        </p>
                      )}

                    </div>

                    {/* CANTIDAD APROBADA */}
                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
                        Aprobada
                      </label>

                      <input
                        type="number"
                        min={0}
                        value={
                          detalle.cantidadAprobada ??
                          ""
                        }
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "cantidadAprobada",
                            e.target.value === ""
                              ? null
                              : Number(
                                  e.target.value
                                )
                          )
                        }
                        placeholder="Auto"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-purple-400"
                      />

                    </div>

                    {/* UNIDAD */}
                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
                        Unidad
                      </label>

                      <select
                        value={detalle.unidad}
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "unidad",
                            e.target.value
                          )
                        }
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-purple-400"
                      >
                        <option value="unidades">
                          Unidades
                        </option>

                        <option value="cajas">
                          Cajas
                        </option>

                        <option value="botellas">
                          Botellas
                        </option>

                        <option value="bolsas">
                          Bolsas
                        </option>

                        <option value="paquetes">
                          Paquetes
                        </option>
                      </select>

                    </div>

                    {/* OBSERVACION DETALLE */}
                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
                        Observación
                      </label>

                      <input
                        type="text"
                        value={
                          detalle.observacion || ""
                        }
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "observacion",
                            e.target.value
                          )
                        }
                        placeholder="Ej: urgente"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-purple-400"
                      />

                    </div>

                    {/* ELIMINAR */}
                    <div className="flex items-end">

                      <button
                        type="button"
                        onClick={() =>
                          eliminarDetalle(index)
                        }
                        title="Eliminar producto"
                        aria-label="Eliminar producto"
                        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 transition hover:bg-red-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>

      {/* GUARDAR */}
      <div className="mt-10 flex justify-end">

        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-8 py-4 font-black text-white shadow-lg shadow-purple-500/20 transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Save className="h-5 w-5" />

          {isPending
            ? "Guardando..."
            : buttonText}
        </button>

      </div>

    </section>

  );

}
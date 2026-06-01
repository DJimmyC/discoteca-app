// src/views/comanda/EditDetalleComandaView.tsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  ArrowLeft,
  ClipboardList,
  LogOut,
  Menu,
  Minus,
  Plus,
  Save,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import Swal from "sweetalert2";

import { useAuth } from "@/hooks/useAuth";

import {
  getComandasConDetallesPorPerfil,
  updateComanda,
} from "@/api/ComandaApi";

import {
  getInventarioBarraPorSucursal,
} from "@/api/InventarioApi";

import {
  createDetalleComanda,
  deleteDetalleComandaById,
  updateDetalleComanda,
} from "@/api/DetalleComandaApi";

type ProductoInventario = {
  idInventario: string;
  idProducto: string;
  nombre: string;
  descripcion: string;
  marca: string;
  precio: number;
  stock: number;
};

type ItemDetalleEdit = {
  idDetalle?: string;
  idInventario?: string;
  idProducto: string;
  nombre: string;
  descripcion?: string;
  marca?: string;
  precio: number;
  cantidad: number;
  stock: number;
  observacion?: string;
  esNuevo: boolean;
};

export default function EditDetalleComandaView() {

  const navigate = useNavigate();

  const params = useParams();

  const queryClient = useQueryClient();

  const comandaId =
    params.comandaId ||
    params.id ||
    "";

  const {
    data: perfilAuth,
    isLoading: loadingAuth,
  } = useAuth();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    observacion,
    setObservacion,
  ] = useState("");

  const [
    items,
    setItems,
  ] = useState<ItemDetalleEdit[]>([]);

  const [
    detallesEliminados,
    setDetallesEliminados,
  ] = useState<string[]>([]);

  const [
    inicializado,
    setInicializado,
  ] = useState(false);

  /* =========================
      IDS AUTH
  ========================= */

  const idPerfil =
    perfilAuth?._id;

  const idSucursal =
    typeof perfilAuth?.idSucursal === "object"
      ? perfilAuth.idSucursal?._id
      : perfilAuth?.idSucursal;

  /* =========================
      GET COMANDAS DEL PERFIL
  ========================= */

  const {
    data: dataComandas,
    isLoading: loadingComandas,
    isError: errorComandas,
  } = useQuery({

    queryKey: [
      "comandas-con-detalles",
      idPerfil,
    ],

    queryFn: () =>
      getComandasConDetallesPorPerfil(
        idPerfil!
      ),

    enabled:
      !!idPerfil,

  });

  /* =========================
      GET INVENTARIO BARRA
  ========================= */

  const {
    data: inventarioBarra = [],
    isLoading: loadingInventario,
    isError: errorInventario,
  } = useQuery({

    queryKey: [
      "inventario-barra",
      idSucursal,
    ],

    queryFn: () =>
      getInventarioBarraPorSucursal(
        idSucursal!
      ),

    enabled:
      !!idSucursal,

  });

  /* =========================
      COMANDA SELECCIONADA
  ========================= */

  const comandaSeleccionada =
    dataComandas?.comandas?.find(
      (comanda) =>
        comanda._id === comandaId
    );

  /* =========================
      PRODUCTOS DEL INVENTARIO
  ========================= */

  const productosInventario =
    useMemo(() => {

      return inventarioBarra.map((item) => {

        const producto =
          typeof item.idProducto === "object" &&
          item.idProducto !== null
            ? item.idProducto
            : null;

        return {

          idInventario:
            item._id || "",

          idProducto:
            producto?._id || "",

          nombre:
            producto?.nombre ||
            "Producto sin nombre",

          descripcion:
            producto?.descripcion ||
            "",

          marca:
            producto?.marca ||
            "Sin marca",

          precio:
            item.precioVenta,

          stock:
            item.cantidad,

        };

      });

    }, [inventarioBarra]);

  /* =========================
      INICIALIZAR FORMULARIO
  ========================= */

  useEffect(() => {

    if (
      !comandaSeleccionada ||
      inicializado
    ) {
      return;
    }

    setObservacion(
      comandaSeleccionada.observacion ||
      ""
    );

    const detallesIniciales =
      comandaSeleccionada.detalles.map(
        (detalle) => {

          const producto =
            detalle.producto;

          const productoInventario =
            productosInventario.find(
              (prod) =>
                prod.idProducto === producto?._id
            );

          return {

            idDetalle:
              detalle._id,

            idInventario:
              productoInventario?.idInventario,

            idProducto:
              producto?._id || "",

            nombre:
              producto?.nombre ||
              "Producto sin nombre",

            descripcion:
              producto?.descripcion ||
              "",

            marca:
              producto?.marca ||
              "Sin marca",

            precio:
              detalle.precioUnitario,

            cantidad:
              detalle.cantidad,

            stock:
              productoInventario?.stock ?? 9999,

            observacion:
              detalle.observacion || "",

            esNuevo:
              false,

          };

        }
      );

    setItems(detallesIniciales);

    setInicializado(true);

  }, [
    comandaSeleccionada,
    productosInventario,
    inicializado,
  ]);

  /* =========================
      BUSCADOR PRODUCTOS
  ========================= */

  const productosFiltrados =
    productosInventario.filter((producto) => {

      const texto = `
        ${producto.nombre}
        ${producto.descripcion}
        ${producto.marca}
        ${producto.precio}
        ${producto.stock}
      `.toLowerCase();

      return texto.includes(
        search.trim().toLowerCase()
      );

    });

  /* =========================
      AGREGAR PRODUCTO
  ========================= */

  const agregarProducto = (
    producto: ProductoInventario
  ) => {

    if (producto.stock <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin stock",
        text: "Este producto no tiene stock disponible",
      });

      return;
    }

    setItems((prev) => {

      const existe =
        prev.find(
          (item) =>
            item.idProducto ===
            producto.idProducto
        );

      if (existe) {

        if (
          existe.cantidad >=
          producto.stock
        ) {
          return prev;
        }

        return prev.map((item) =>
          item.idProducto === producto.idProducto
            ? {
                ...item,
                cantidad:
                  item.cantidad + 1,
              }
            : item
        );

      }

      return [
        ...prev,
        {
          idInventario:
            producto.idInventario,

          idProducto:
            producto.idProducto,

          nombre:
            producto.nombre,

          descripcion:
            producto.descripcion,

          marca:
            producto.marca,

          precio:
            producto.precio,

          cantidad:
            1,

          stock:
            producto.stock,

          observacion:
            "",

          esNuevo:
            true,
        },
      ];

    });

  };

  /* =========================
      AUMENTAR CANTIDAD
  ========================= */

  const aumentarCantidad = (
    idProducto: string
  ) => {

    setItems((prev) =>
      prev.map((item) => {

        if (
          item.idProducto !== idProducto
        ) {
          return item;
        }

        if (
          item.cantidad >= item.stock
        ) {
          return item;
        }

        return {
          ...item,
          cantidad:
            item.cantidad + 1,
        };

      })
    );

  };

  /* =========================
      DISMINUIR CANTIDAD
  ========================= */

  const disminuirCantidad = (
    idProducto: string
  ) => {

    setItems((prev) =>
      prev
        .map((item) =>
          item.idProducto === idProducto
            ? {
                ...item,
                cantidad:
                  item.cantidad - 1,
              }
            : item
        )
        .filter((item) => {

          if (item.cantidad > 0) {
            return true;
          }

          if (
            item.idDetalle &&
            !item.esNuevo
          ) {
            setDetallesEliminados((prevIds) => [
              ...prevIds,
              item.idDetalle!,
            ]);
          }

          return false;

        })
    );

  };

  /* =========================
      ELIMINAR ITEM
  ========================= */

  const eliminarItem = (
    itemEliminar: ItemDetalleEdit
  ) => {

    if (
      itemEliminar.idDetalle &&
      !itemEliminar.esNuevo
    ) {
      setDetallesEliminados((prev) => [
        ...prev,
        itemEliminar.idDetalle!,
      ]);
    }

    setItems((prev) =>
      prev.filter(
        (item) =>
          item.idProducto !==
          itemEliminar.idProducto
      )
    );

  };

  /* =========================
      CAMBIAR OBSERVACION ITEM
  ========================= */

  const cambiarObservacionItem = (
    idProducto: string,
    value: string
  ) => {

    setItems((prev) =>
      prev.map((item) =>
        item.idProducto === idProducto
          ? {
              ...item,
              observacion: value,
            }
          : item
      )
    );

  };

  /* =========================
      TOTAL
  ========================= */

  const total =
    items.reduce(
      (acc, item) =>
        acc + item.precio * item.cantidad,
      0
    );

  const totalItems =
    items.reduce(
      (acc, item) =>
        acc + item.cantidad,
      0
    );

  /* =========================
      GUARDAR CAMBIOS
  ========================= */

  const {
    mutate: guardarCambios,
    isPending: guardando,
  } = useMutation({

    mutationFn: async () => {

      if (!comandaId) {
        throw new Error(
          "No se encontró el ID de la comanda"
        );
      }

      if (items.length === 0) {
        throw new Error(
          "La comanda debe tener al menos un producto"
        );
      }

      /*
        1. Actualizar cabecera de comanda
      */
      await updateComanda({

        comandaId,

        formData: {
          observacion:
            observacion || "Sin observación",

          actualizadoPor:
            perfilAuth?.nombres || "sistema",
        },

      });

      /*
        2. Eliminar lógicamente detalles quitados
      */
      await Promise.all(
        detallesEliminados.map((idDetalle) =>
          deleteDetalleComandaById({
            id:
              idDetalle,

            eliminadoPor:
              perfilAuth?.nombres || "sistema",
          })
        )
      );

      /*
        3. Actualizar detalles existentes
      */
      const detallesExistentes =
        items.filter(
          (item) =>
            item.idDetalle &&
            !item.esNuevo
        );

      await Promise.all(
        detallesExistentes.map((item) =>
          updateDetalleComanda({

            detalleComandaId:
              item.idDetalle!,

            formData: {
              idComanda:
                comandaId,

              idProducto:
                item.idProducto,

              cantidad:
                item.cantidad,

              precioUnitario:
                item.precio,

              subtotal:
                item.precio * item.cantidad,

              estado:
                "activo",

              observacion:
                item.observacion || "",

              creadoPor:
                perfilAuth?.nombres || "sistema",
            },

          })
        )
      );

      /*
        4. Crear detalles nuevos
      */
      const detallesNuevos =
        items.filter(
          (item) =>
            item.esNuevo
        );

      await Promise.all(
        detallesNuevos.map((item) =>
          createDetalleComanda({

            idComanda:
              comandaId,

            idProducto:
              item.idProducto,

            cantidad:
              item.cantidad,

            precioUnitario:
              item.precio,

            subtotal:
              item.precio * item.cantidad,

            estado:
              "activo",

            observacion:
              item.observacion || "",

            creadoPor:
              perfilAuth?.nombres || "sistema",

            idInventario:
              item.idInventario,
          })
        )
      );

    },

    onSuccess: () => {

      Swal.fire({
        icon: "success",
        title: "Comanda actualizada",
        text: "La comanda y sus detalles fueron actualizados correctamente",
      });

      queryClient.invalidateQueries({
        queryKey: [
          "comandas-con-detalles",
          idPerfil,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "inventario-barra",
          idSucursal,
        ],
      });

      navigate(-1);

    },

    onError: (error) => {

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Error al actualizar la comanda",
      });

    },

  });

  /* =========================
      CERRAR SESION
  ========================= */

  const cerrarSesion = () => {

    localStorage.removeItem(
      "AUTH_TOKEN"
    );

    navigate("/auth/login");

  };

  /* =========================
      LOADING
  ========================= */

  if (
    loadingAuth ||
    loadingComandas ||
    loadingInventario
  ) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-lg font-bold">
          Cargando edición de comanda...
        </p>
      </div>
    );

  }

  /* =========================
      ERROR
  ========================= */

  if (
    errorComandas ||
    errorInventario
  ) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-lg font-bold text-red-400">
          Error al cargar la comanda
        </p>
      </div>
    );

  }

  if (!comandaSeleccionada) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl border border-red-500/20 bg-slate-900 p-8 text-center">
          <p className="text-xl font-black text-red-400">
            Comanda no encontrada
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="mt-5 rounded-2xl bg-fuchsia-600 px-5 py-3 font-bold text-white hover:bg-fuchsia-700"
          >
            Volver
          </button>
        </div>
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-fuchsia-500/20 bg-slate-950/95 backdrop-blur">

        <div className="flex h-20 items-center justify-between px-6">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="rounded-xl border border-fuchsia-500/30 p-3 text-fuchsia-400 hover:bg-fuchsia-500/10"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              className="rounded-xl border border-fuchsia-500/30 p-3 text-fuchsia-400 hover:bg-fuchsia-500/10"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-600/20 shadow-[0_0_25px_#d946ef]">

                <ClipboardList className="h-7 w-7 text-fuchsia-400" />

              </div>

              <div>

                <h1 className="text-2xl font-black text-fuchsia-400">
                  Editar Comanda
                </h1>

                <p className="text-xs tracking-[3px] text-slate-400">
                  {comandaSeleccionada.numeroComanda ||
                    "SIN NÚMERO"}
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={cerrarSesion}
            className="flex items-center gap-2 rounded-2xl bg-red-500/10 px-5 py-3 font-bold text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="h-5 w-5" />
            Salir
          </button>

        </div>

      </header>

      {/* CONTENIDO */}
      <main className="grid gap-6 p-6 lg:grid-cols-[1fr_430px]">

        {/* PRODUCTOS DISPONIBLES */}
        <section className="rounded-3xl border border-fuchsia-500/20 bg-slate-900 p-6 shadow-2xl">

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-3xl font-black text-white">
                Agregar Productos
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Selecciona productos del inventario de barra
              </p>

            </div>

            <div className="relative w-full md:w-80">

              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Buscar producto..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-fuchsia-500"
              />

            </div>

          </div>

          {productosFiltrados.length === 0 ? (

            <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-700 text-slate-400">
              No hay productos disponibles
            </div>

          ) : (

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

              {productosFiltrados.map((producto) => (

                <article
                  key={producto.idInventario}
                  className="rounded-3xl border border-slate-700 bg-slate-950 p-5 transition hover:border-fuchsia-500/60 hover:shadow-[0_0_25px_rgba(217,70,239,0.25)]"
                >

                  <div className="mb-4 flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/10">

                    <ShoppingCart className="h-12 w-12 text-fuchsia-400" />

                  </div>

                  <h3 className="line-clamp-1 text-xl font-black text-white">
                    {producto.nombre}
                  </h3>

                  <p className="mt-1 line-clamp-1 text-sm text-slate-400">
                    {producto.marca}
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {producto.descripcion}
                  </p>

                  <div className="mt-5 flex items-center justify-between">

                    <div>

                      <p className="text-xs text-slate-500">
                        Precio
                      </p>

                      <p className="text-2xl font-black text-fuchsia-400">
                        Bs. {producto.precio.toFixed(2)}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-xs text-slate-500">
                        Stock
                      </p>

                      <p
                        className={
                          producto.stock <= 0
                            ? "font-black text-red-400"
                            : "font-black text-emerald-400"
                        }
                      >
                        {producto.stock}
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      agregarProducto(producto)
                    }
                    disabled={producto.stock <= 0}
                    className="mt-5 w-full rounded-2xl bg-fuchsia-600 px-4 py-3 font-black text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                  >
                    Agregar
                  </button>

                </article>

              ))}

            </div>

          )}

        </section>

        {/* DETALLE ACTUAL */}
        <aside className="rounded-3xl border border-fuchsia-500/20 bg-slate-900 p-6 shadow-2xl">

          <div className="mb-6">

            <h2 className="text-3xl font-black">
              Detalle
            </h2>

            <p className="text-sm text-slate-400">
              {totalItems} productos en la comanda
            </p>

          </div>

          <label className="mb-2 block text-sm font-bold text-slate-300">
            Observación general
          </label>

          <input
            type="text"
            value={observacion}
            onChange={(e) =>
              setObservacion(e.target.value)
            }
            placeholder="Ej: Mesa 5, VIP, sin hielo..."
            className="mb-5 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500"
          />

          {items.length === 0 ? (

            <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-700 text-center text-slate-400">
              Esta comanda no tiene productos
            </div>

          ) : (

            <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">

              {items.map((item) => (

                <div
                  key={item.idDetalle || item.idProducto}
                  className="rounded-2xl border border-slate-700 bg-slate-950 p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <h3 className="font-black text-white">
                        {item.nombre}
                      </h3>

                      <p className="text-sm text-slate-400">
                        Bs. {item.precio.toFixed(2)} c/u
                      </p>

                      <p className="text-xs text-slate-500">
                        {item.marca}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        eliminarItem(item)
                      }
                      className="rounded-xl bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                  </div>

                  <div className="mt-4 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          disminuirCantidad(
                            item.idProducto
                          )
                        }
                        className="rounded-xl bg-slate-800 p-2 hover:bg-slate-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="w-8 text-center font-black">
                        {item.cantidad}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          aumentarCantidad(
                            item.idProducto
                          )
                        }
                        disabled={
                          item.cantidad >= item.stock
                        }
                        className="rounded-xl bg-slate-800 p-2 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" />
                      </button>

                    </div>

                    <p className="text-lg font-black text-fuchsia-400">
                      Bs.{" "}
                      {(
                        item.precio *
                        item.cantidad
                      ).toFixed(2)}
                    </p>

                  </div>

                  <input
                    type="text"
                    value={item.observacion || ""}
                    onChange={(e) =>
                      cambiarObservacionItem(
                        item.idProducto,
                        e.target.value
                      )
                    }
                    placeholder="Observación del producto"
                    className="mt-4 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white outline-none transition focus:border-fuchsia-500"
                  />

                </div>

              ))}

            </div>

          )}

          <div className="mt-6 border-t border-slate-700 pt-6">

            <div className="mb-5 flex items-center justify-between">

              <span className="text-lg font-bold text-slate-300">
                Total
              </span>

              <span className="text-3xl font-black text-fuchsia-400">
                Bs. {total.toFixed(2)}
              </span>

            </div>

            <button
              type="button"
              onClick={() =>
                guardarCambios()
              }
              disabled={
                guardando ||
                items.length === 0
              }
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-lg font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              <Save className="h-5 w-5" />

              {guardando
                ? "Guardando..."
                : "Guardar cambios"}
            </button>

          </div>

        </aside>

      </main>

    </div>

  );

}
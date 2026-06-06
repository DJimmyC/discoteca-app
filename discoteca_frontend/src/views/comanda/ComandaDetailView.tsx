import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  ClipboardList,
  LogOut,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import Swal from "sweetalert2";

import { useAuth } from "@/hooks/useAuth";

import {
  getInventarioBarraPorSucursal,
} from "@/api/InventarioApi";

import {
  createComanda,
} from "@/api/ComandaApi";

import {
  createManyDetalleComanda,
} from "@/api/DetalleComandaApi";

type ProductoComanda = {
  idInventario: string;
  idProducto: string;
  nombre: string;
  descripcion: string;
  marca: string;
  precio: number;
  stock: number;
  cantidad: number;
};

export default function ComandaDetailView() {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: perfil,
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
    comanda,
    setComanda,
  ] = useState<ProductoComanda[]>([]);

  /* =========================
      OBTENER ID SUCURSAL
  ========================= */

  const idSucursal =
    typeof perfil?.idSucursal === "object"
      ? perfil.idSucursal?._id
      : perfil?.idSucursal;

  const idPerfil =
    perfil?._id;

  const idAlmacen =
    typeof perfil?.idAlmacen === "object"
      ? perfil.idAlmacen?._id
      : perfil?.idAlmacen;

  /* =========================
      GET INVENTARIO BARRA
  ========================= */

  const {
    data: inventarioBarra = [],
    isLoading: loadingInventario,
    isError,
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
  console.log(inventarioBarra)
  /* =========================
    FILTRAR INVENTARIO POR ALMACEN DEL PERFIL
========================= */

  const inventarioBarraFiltrado =
    useMemo(() => {

      if (!idAlmacen) {
        return [];
      }

      return inventarioBarra.filter((item: any) => {

        const idAlmacenInventario =
          typeof item.idAlmacen === "object"
            ? item.idAlmacen?._id
            : item.idAlmacen!;
        return String(idAlmacenInventario) === String(idAlmacen);

      });

    }, [
      inventarioBarra,
      idAlmacen,
    ]);


  /* =========================
      CREAR COMANDA + DETALLES
  ========================= */

  const {
    mutate: confirmarComandaMutation,
    isPending: creandoComanda,
  } = useMutation({

    mutationFn: async () => {

      if (!idPerfil) {
        throw new Error(
          "No se encontró el perfil del usuario"
        );
      }

      if (!idSucursal) {
        throw new Error(
          "No se encontró la sucursal del usuario"
        );
      }
      if (!idAlmacen) {
        throw new Error(
          "El perfil no tiene un almacén asignado"
        );
      }

      const detalleSinInventario =
        comanda.find(
          (item) =>
            !item.idInventario
        );

      if (detalleSinInventario) {
        throw new Error(
          `El producto ${detalleSinInventario.nombre} no tiene inventario asociado`
        );
      }

      if (comanda.length === 0) {
        throw new Error(
          "Debe agregar al menos un producto"
        );
      }

      /*
        1. Crear cabecera de comanda
      */
      const responseComanda =
        await createComanda({

          idPerfil,

          idSucursal,

          observacion:
            observacion || "Sin observación",

          creadoPor:
            perfil?.nombres || "sistema",

          estado:
            "en_proceso",

        });

      /*
        IMPORTANTE:
        Tu backend debe responder:
        {
          message: "Comanda creada",
          comanda: { _id: "..." }
        }
      */
      const idComandaCreada =
        responseComanda?.comanda?._id;

      if (!idComandaCreada) {
        throw new Error(
          "No se recibió el ID de la comanda creada"
        );
      }

      /*
        2. Crear detalles de esa comanda
      */
      const detalles =
        comanda.map((item) => ({

          idComanda:
            idComandaCreada,

          idProducto:
            item.idProducto,

          idInventario:
            item.idInventario,

          idAlmacen,

          cantidad:
            item.cantidad,

          precioUnitario:
            item.precio,

          subtotal:
            item.precio *
            item.cantidad,

          estado:
            "activo" as const,

          observacion:
            "",

          creadoPor:
            perfil?.nombres ||
            "sistema",

        }));
      await createManyDetalleComanda(
        detalles
      );

      return {
        idComanda:
          idComandaCreada,
      };

    },

    onSuccess: () => {

      Swal.fire({
        icon: "success",
        title: "Comanda creada",
        text: "La comanda y sus detalles fueron registrados correctamente",
      });

      setComanda([]);
      setObservacion("");

      queryClient.invalidateQueries({
        queryKey: [
          "inventario-barra",
          idSucursal,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "comandas",
        ],
      });

    },

    onError: (error) => {

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Error al crear la comanda",
      });

    },

  });

  /* =========================
      CONVERTIR INVENTARIO A PRODUCTOS
  ========================= */

  const productos = useMemo(() => {

    return inventarioBarraFiltrado.map((item) => {

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

  }, [inventarioBarraFiltrado]);
  console.log(productos)

  /* =========================
      BUSCADOR
  ========================= */

  const productosFiltrados =
    productos.filter((producto) => {

      const texto = `
        ${producto.nombre}
        ${producto.descripcion}
        ${producto.marca}
        ${producto.precio}
        ${producto.stock}
      `.toLowerCase();

      return texto.includes(
        search.toLowerCase()
      );

    });

  /* =========================
      AGREGAR PRODUCTO
  ========================= */

  const agregarProducto = (
    producto: typeof productos[number]
  ) => {

    if (producto.stock <= 0) return;

    setComanda((prev) => {

      const existe =
        prev.find(
          (item) =>
            item.idInventario ===
            producto.idInventario
        );

      if (existe) {

        if (
          existe.cantidad >=
          producto.stock
        ) {
          return prev;
        }

        return prev.map((item) =>
          item.idInventario ===
            producto.idInventario
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
          ...producto,
          cantidad: 1,
        },
      ];

    });

  };

  /* =========================
      AUMENTAR CANTIDAD
  ========================= */

  const aumentarCantidad = (
    idInventario: string
  ) => {

    setComanda((prev) =>
      prev.map((item) => {

        if (
          item.idInventario !==
          idInventario
        ) {
          return item;
        }

        if (
          item.cantidad >=
          item.stock
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
    idInventario: string
  ) => {

    setComanda((prev) =>
      prev
        .map((item) =>
          item.idInventario === idInventario
            ? {
              ...item,
              cantidad:
                item.cantidad - 1,
            }
            : item
        )
        .filter(
          (item) =>
            item.cantidad > 0
        )
    );

  };

  /* =========================
      ELIMINAR ITEM
  ========================= */

  const eliminarItem = (
    idInventario: string
  ) => {

    setComanda((prev) =>
      prev.filter(
        (item) =>
          item.idInventario !==
          idInventario
      )
    );

  };

  /* =========================
      TOTALES
  ========================= */

  const total =
    comanda.reduce(
      (acc, item) =>
        acc +
        item.precio * item.cantidad,
      0
    );

  const totalItems =
    comanda.reduce(
      (acc, item) =>
        acc + item.cantidad,
      0
    );

  /* =========================
      CERRAR SESION
  ========================= */

  const cerrarSesion = () => {

    localStorage.removeItem(
      "AUTH_TOKEN"
    );

    navigate("/auth/login");

  };

  if (
    loadingAuth ||
    loadingInventario
  ) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-lg font-bold">
          Cargando comanda...
        </p>
      </div>
    );

  }

  if (isError) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-lg font-bold text-red-400">
          Error al cargar el inventario de barra
        </p>
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-950 text-white">



      {/* CONTENIDO */}
      <main className="grid gap-6 p-6 lg:grid-cols-[1fr_420px]">

        {/* PRODUCTOS */}
        <section className="rounded-3xl border border-fuchsia-500/20 bg-slate-900 p-6 shadow-2xl">

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-3xl font-black text-white">
                Productos de Barra
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Inventario disponible para la sucursal actual
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

                  <div className="mb-4 flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/10">

                    <ShoppingCart className="h-14 w-14 text-fuchsia-400" />

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

        {/* COMANDA */}
        <aside className="rounded-3xl border border-fuchsia-500/20 bg-slate-900 p-6 shadow-2xl">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-3xl font-black">
                Pedido
              </h2>

              <p className="text-sm text-slate-400">
                {totalItems} productos agregados
              </p>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-600/20">

              <ShoppingCart className="h-7 w-7 text-fuchsia-400" />

            </div>

          </div>

          {/* OBSERVACION / MESA */}
          <input
            type="text"
            value={observacion}
            onChange={(e) =>
              setObservacion(e.target.value)
            }
            placeholder="Ej: Mesa 5, sin hielo, VIP..."
            className="mb-4 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500"
          />

          {comanda.length === 0 ? (

            <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-700 text-center text-slate-400">
              Todavía no agregaste productos
            </div>

          ) : (

            <div className="space-y-4">

              {comanda.map((item) => (

                <div
                  key={item.idInventario}
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

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        eliminarItem(
                          item.idInventario
                        )
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
                            item.idInventario
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
                            item.idInventario
                          )
                        }
                        disabled={
                          item.cantidad >=
                          item.stock
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
                confirmarComandaMutation()
              }
              disabled={
                comanda.length === 0 ||
                creandoComanda
              }
              className="w-full rounded-2xl bg-emerald-600 px-5 py-4 text-lg font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {creandoComanda
                ? "Registrando..."
                : "Confirmar Comanda"}
            </button>

          </div>

        </aside>

      </main>

    </div>

  );

}


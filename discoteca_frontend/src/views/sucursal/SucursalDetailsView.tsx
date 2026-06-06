// import { Navigate, useParams } from 'react-router-dom'
// import { useQuery } from '@tanstack/react-query'
// import { getSucursalById } from '@/api/SucursalApi'
// import type { SucursalType } from '@/types/SucursalType'
// import MenuList from '@/components/MenuList'
// import Card from "@/components/card"

// export default function SucursalDetailsView() {

//   const params = useParams()
//   const sucursalId = params.sucursalId

//   if (!sucursalId) return <Navigate to="/404" />

//   const { data, isLoading, isError } = useQuery<SucursalType>({
//     queryKey: ['sucursal', sucursalId],
//     queryFn: () => getSucursalById(sucursalId),
//     retry: false
//   })

//   if (isLoading) return <p className="p-5">Cargando...</p>
//   if (isError || !data) return <Navigate to="/404" />

//   return (
//     <div className="h-screen flex bg-gray-50 overflow-hidden">
  
//   {/* SIDEBAR */}
//   {/* <MenuList sucursalId={sucursalId} /> */}
//   <MenuList  />

//   {/* CONTENIDO */}
//   <main className="
//     flex-1 
//     flex 
//     flex-col 
//     overflow-y-auto
//   ">

//     <div className="p-6 md:p-8 w-full max-w-none">

//       {/* HEADER */}
//       <div className="bg-white rounded-xl shadow p-5 mb-6">
//         <h1 className="text-2xl md:text-3xl font-bold">
//           {data.nombreSucursal}
//         </h1>

//         <p className="text-gray-500 mt-1">
//            {data.ubicacionSucursal}
//         </p>
//       </div>

//       {/* GRID */}
//       <div className="
//         grid 
//         grid-cols-1 
//         sm:grid-cols-2 
//         lg:grid-cols-3 
//         xl:grid-cols-4
//         gap-6
//         w-full
//       ">
//         <Card title="Inventario" desc="Controla productos y stock" />
//         <Card title="Ventas" desc="Gestiona ventas y comandas" />
//         <Card title="Caja" desc="Control financiero diario" />
//         <Card title="Usuarios" desc="Administración de personal" />
//       </div>

//     </div>

//   </main>

// </div>
//   )
// }
import {
  useMemo,
} from "react";

import {
  Link,
  Navigate,
  useParams,
} from "react-router-dom";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  AlertTriangle,
  ArrowRight,
  Building2,
  ClipboardList,
  MapPin,
  PackageSearch,
  RefreshCcw,
  ShoppingCart,
  TrendingUp,
  Trophy,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import MenuList from "@/components/MenuList";

import {
  getSucursalById,
} from "@/api/SucursalApi";

import {
  getReporteDashboard,
  getReporteProductosMasVendidos,
} from "@/api/ReporteApi";

import type {
  SucursalType,
} from "@/types/SucursalType";

import type {
  DashboardReporteResponse,
  ProductosMasVendidosResponse,
} from "@/types/ReporteType";

/* =====================================================
   FORMATEADORES
===================================================== */

const formatoMoneda =
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  });

const formatoNumero =
  new Intl.NumberFormat("es-BO");

function convertirNumero(
  valor:
    | number
    | string
    | null
    | undefined
): number {
  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : 0;
}

function mostrarMoneda(
  valor:
    | number
    | string
    | null
    | undefined
): string {
  return formatoMoneda.format(
    convertirNumero(valor)
  );
}

function mostrarNumero(
  valor:
    | number
    | string
    | null
    | undefined
): string {
  return formatoNumero.format(
    convertirNumero(valor)
  );
}

function recortarTexto(
  texto: string,
  limite = 16
): string {
  if (texto.length <= limite) {
    return texto;
  }

  return `${texto.slice(0, limite)}...`;
}

/* =====================================================
   INDICADOR
===================================================== */

type IndicadorProps = {
  titulo: string;
  valor: string;
  descripcion: string;
  icono: React.ElementType;
  variante?:
    | "normal"
    | "positivo"
    | "advertencia"
    | "negativo";
};

function Indicador({
  titulo,
  valor,
  descripcion,
  icono: Icono,
  variante = "normal",
}: IndicadorProps) {
  const estilos = {
    normal: {
      borde: "border-gray-200",
      fondoIcono: "bg-gray-100",
      colorIcono: "text-gray-700",
      colorValor: "text-gray-900",
    },

    positivo: {
      borde: "border-emerald-200",
      fondoIcono: "bg-emerald-100",
      colorIcono: "text-emerald-700",
      colorValor: "text-emerald-700",
    },

    advertencia: {
      borde: "border-amber-200",
      fondoIcono: "bg-amber-100",
      colorIcono: "text-amber-700",
      colorValor: "text-amber-700",
    },

    negativo: {
      borde: "border-red-200",
      fondoIcono: "bg-red-100",
      colorIcono: "text-red-700",
      colorValor: "text-red-700",
    },
  };

  const estilo =
    estilos[variante];

  return (
    <article
      className={`
        rounded-2xl border bg-white p-5 shadow-sm
        transition hover:-translate-y-0.5 hover:shadow-md
        ${estilo.borde}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {titulo}
          </p>

          <p
            className={`
              mt-3 text-2xl font-bold
              ${estilo.colorValor}
            `}
          >
            {valor}
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            {descripcion}
          </p>
        </div>

        <div
          className={`
            flex h-11 w-11 shrink-0 items-center
            justify-center rounded-xl
            ${estilo.fondoIcono}
            ${estilo.colorIcono}
          `}
        >
          <Icono size={21} />
        </div>
      </div>
    </article>
  );
}

/* =====================================================
   TOOLTIP DE PRODUCTOS
===================================================== */

type ProductoGrafica = {
  nombre: string;
  cantidadVendida: number;
  totalVendido: number;
};

type TooltipProductoProps = {
  active?: boolean;

  payload?: Array<{
    payload?: ProductoGrafica;
  }>;
};

function TooltipProducto({
  active,
  payload,
}: TooltipProductoProps) {
  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }

  const producto =
    payload[0]?.payload;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="font-semibold text-gray-900">
        {producto?.nombre}
      </p>

      <p className="mt-2 text-sm text-gray-600">
        Cantidad vendida:{" "}
        <strong>
          {mostrarNumero(
            producto?.cantidadVendida
          )}
        </strong>
      </p>

      <p className="mt-1 text-sm text-emerald-700">
        Total vendido:{" "}
        <strong>
          {mostrarMoneda(
            producto?.totalVendido
          )}
        </strong>
      </p>
    </div>
  );
}

/* =====================================================
   CARGANDO
===================================================== */

function CargandoPanel() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-40 rounded-3xl bg-gray-200" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-2xl bg-gray-200"
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="h-[420px] rounded-2xl bg-gray-200 xl:col-span-2" />

        <div className="h-[420px] rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}

/* =====================================================
   VISTA
===================================================== */

export default function SucursalDetailsView() {
  const {
    sucursalId,
  } = useParams<{
    sucursalId: string;
  }>();

  const {
    data: sucursal,
    isLoading: cargandoSucursal,
    isError: errorSucursal,
    refetch: recargarSucursal,
    isFetching: actualizandoSucursal,
  } = useQuery<
    SucursalType,
    Error
  >({
    queryKey: [
      "sucursal",
      sucursalId,
    ],

    queryFn: () =>
      getSucursalById(
        sucursalId!
      ),

    enabled:
      Boolean(sucursalId),

    retry: false,

    refetchOnWindowFocus: false,
  });

  const {
    data: dashboard,
    isLoading: cargandoDashboard,
    isError: errorDashboard,
    refetch: recargarDashboard,
    isFetching: actualizandoDashboard,
  } = useQuery<
    DashboardReporteResponse,
    Error
  >({
    queryKey: [
      "dashboard-sucursal",
      sucursalId,
    ],

    queryFn: () =>
      getReporteDashboard({
        idSucursal:
          sucursalId!,
      }),

    enabled:
      Boolean(sucursalId),

    staleTime:
      1000 * 60 * 2,

    refetchOnWindowFocus: false,
  });

  const {
    data: reporteProductos,
    isLoading: cargandoProductos,
    refetch: recargarProductos,
    isFetching: actualizandoProductos,
  } = useQuery<
    ProductosMasVendidosResponse,
    Error
  >({
    queryKey: [
      "productos-mas-vendidos-inicio",
      sucursalId,
    ],

    queryFn: () =>
      getReporteProductosMasVendidos({
        idSucursal:
          sucursalId!,

        limite: 5,
      }),

    enabled:
      Boolean(sucursalId),

    staleTime:
      1000 * 60 * 2,

    refetchOnWindowFocus: false,
  });

  const productosGrafica =
    useMemo<ProductoGrafica[]>(
      () =>
        (
          reporteProductos?.data ??
          []
        ).map((producto) => ({
          nombre:
            producto.nombre,

          cantidadVendida:
            convertirNumero(
              producto.cantidadVendida
            ),

          totalVendido:
            convertirNumero(
              producto.totalVendido
            ),
        })),
      [
        reporteProductos,
      ]
    );

  if (!sucursalId) {
    return (
      <Navigate
        to="/404"
        replace
      />
    );
  }

  if (
    cargandoSucursal ||
    cargandoDashboard
  ) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 overflow-x-hidden">
          <section className="p-4 pt-20 sm:p-6 sm:pt-20 md:p-8 md:pt-8">
            <CargandoPanel />
          </section>
        </main>
      </div>
    );
  }

  if (
    errorSucursal ||
    !sucursal
  ) {
    return (
      <Navigate
        to="/404"
        replace
      />
    );
  }

  const baseSucursal =
    `/sucursal/${sucursalId}`;

  const resumen =
    dashboard?.resumen;

  const productoDestacado =
    dashboard?.productoMasVendido;

  const vendedorDestacado =
    dashboard?.vendedorMayorVenta;

  const nombreVendedor =
    vendedorDestacado
      ? [
          vendedorDestacado.nombres,
          vendedorDestacado.apellidos,
        ]
          .filter(Boolean)
          .join(" ")
      : "Sin información";

  const gananciaEstimada =
    convertirNumero(
      resumen?.gananciaEstimada
    );

  const stockBajo =
    convertirNumero(
      resumen?.productosStockBajo
    );

  const solicitudesPendientes =
    convertirNumero(
      resumen?.solicitudesPendientes
    );

  const actualizando =
    actualizandoSucursal ||
    actualizandoDashboard ||
    actualizandoProductos;

  const actualizarPanel =
    async () => {
      await Promise.all([
        recargarSucursal(),
        recargarDashboard(),
        recargarProductos(),
      ]);
    };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MenuList />

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <section className="space-y-6 p-4 pt-20 sm:p-6 sm:pt-20 md:p-8 md:pt-8">
          {/* ENCABEZADO */}

          <header className="rounded-3xl bg-gray-900 p-6 text-white shadow-lg">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-white/10 p-3">
                  <Building2 size={27} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Panel de sucursal
                  </p>

                  <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                    {sucursal.nombreSucursal}
                  </h1>

                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-300">
                    <MapPin size={16} />

                    <span>
                      {sucursal.ubicacionSucursal ||
                        "Ubicación no registrada"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`${baseSucursal}/venta`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-white px-4 py-2.5
                    text-sm font-bold text-gray-900
                    transition hover:bg-gray-100
                  "
                >
                  <ShoppingCart size={17} />

                  Registrar venta
                </Link>

                <button
                  type="button"
                  onClick={
                    actualizarPanel
                  }
                  disabled={
                    actualizando
                  }
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-white/20
                    bg-white/10 px-4 py-2.5
                    text-sm font-semibold text-white
                    transition hover:bg-white/20
                    disabled:opacity-50
                  "
                >
                  <RefreshCcw
                    size={17}
                    className={
                      actualizando
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Actualizar
                </button>
              </div>
            </div>
          </header>

          {/* ERROR SECUNDARIO */}

          {errorDashboard && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle
                  size={20}
                  className="text-amber-700"
                />

                <p className="text-sm font-medium text-amber-800">
                  No se pudieron cargar todos los indicadores del panel.
                </p>
              </div>
            </div>
          )}

          {/* INDICADORES */}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Indicador
              titulo="Ventas"
              valor={mostrarMoneda(
                resumen?.totalVentas
              )}
              descripcion={`${mostrarNumero(
                resumen?.cantidadVentas
              )} operaciones pagadas.`}
              icono={ShoppingCart}
              variante="positivo"
            />

            <Indicador
              titulo="Ganancia estimada"
              valor={mostrarMoneda(
                gananciaEstimada
              )}
              descripcion="Ventas menos egresos registrados."
              icono={TrendingUp}
              variante={
                gananciaEstimada >= 0
                  ? "positivo"
                  : "negativo"
              }
            />

            <Indicador
              titulo="Stock bajo"
              valor={mostrarNumero(
                stockBajo
              )}
              descripcion="Productos que requieren reposición."
              icono={PackageSearch}
              variante={
                stockBajo > 0
                  ? "negativo"
                  : "positivo"
              }
            />

            <Indicador
              titulo="Solicitudes pendientes"
              valor={mostrarNumero(
                solicitudesPendientes
              )}
              descripcion="Solicitudes que necesitan atención."
              icono={ClipboardList}
              variante={
                solicitudesPendientes >
                0
                  ? "advertencia"
                  : "positivo"
              }
            />
          </section>

          {/* CONTENIDO PRINCIPAL */}

          <section className="grid gap-5 xl:grid-cols-3">
            {/* PRODUCTOS MÁS VENDIDOS */}

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Productos más vendidos
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Cinco productos con mayor cantidad vendida.
                  </p>
                </div>

                <Link
                  to={`${baseSucursal}/reportes/productos-mas-vendidos`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black"
                >
                  Ver reporte

                  <ArrowRight size={16} />
                </Link>
              </div>

              {cargandoProductos ? (
                <div className="mt-5 h-[310px] animate-pulse rounded-xl bg-gray-100" />
              ) : productosGrafica.length >
                0 ? (
                <div className="mt-5 h-[310px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={
                        productosGrafica
                      }
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 30,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="nombre"
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        height={65}
                        tickFormatter={(
                          valor
                        ) =>
                          recortarTexto(
                            String(valor)
                          )
                        }
                        tick={{
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        tickLine={false}
                        axisLine={false}
                      />

                      <Tooltip
                        content={
                          <TooltipProducto />
                        }
                      />

                      <Bar
                        dataKey="cantidadVendida"
                        name="Cantidad vendida"
                        fill="#111827"
                        radius={[
                          7,
                          7,
                          0,
                          0,
                        ]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-5 flex h-[310px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                  <Trophy
                    size={40}
                    className="text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-600">
                    No existen ventas suficientes
                  </p>
                </div>
              )}
            </article>

            {/* DESTACADOS Y ALERTAS */}

            <div className="space-y-5">
              {/* MESERO DESTACADO */}

              <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <UserRoundCheck
                      size={22}
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Mesero destacado
                    </h2>

                    <p className="text-xs text-gray-500">
                      Mayor monto vendido
                    </p>
                  </div>
                </div>

                {vendedorDestacado ? (
                  <div className="mt-5">
                    <p className="text-lg font-bold text-gray-900">
                      {nombreVendedor}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {mostrarNumero(
                        vendedorDestacado.cantidadVentas
                      )}{" "}
                      ventas realizadas
                    </p>

                    <div className="mt-4 rounded-xl bg-blue-50 p-4">
                      <p className="text-xs font-medium text-blue-600">
                        Total vendido
                      </p>

                      <p className="mt-1 text-xl font-bold text-blue-700">
                        {mostrarMoneda(
                          vendedorDestacado.totalVendido
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-gray-500">
                    No hay información disponible.
                  </p>
                )}

                <Link
                  to={`${baseSucursal}/reportes/ventas-vendedor`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black"
                >
                  Ver ventas por mesero

                  <ArrowRight size={16} />
                </Link>
              </article>

              {/* RESUMEN OPERATIVO */}

              <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="font-bold text-gray-900">
                  Resumen operativo
                </h2>

                <div className="mt-4 space-y-3">
                  <Link
                    to={`${baseSucursal}/reportes/stock-bajo`}
                    className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <PackageSearch
                        size={19}
                        className={
                          stockBajo > 0
                            ? "text-red-600"
                            : "text-emerald-600"
                        }
                      />

                      <span className="text-sm font-medium text-gray-700">
                        Stock bajo
                      </span>
                    </div>

                    <strong
                      className={
                        stockBajo > 0
                          ? "text-red-700"
                          : "text-emerald-700"
                      }
                    >
                      {mostrarNumero(
                        stockBajo
                      )}
                    </strong>
                  </Link>

                  <Link
                    to={`${baseSucursal}/solicitud`}
                    className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <ClipboardList
                        size={19}
                        className={
                          solicitudesPendientes >
                          0
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }
                      />

                      <span className="text-sm font-medium text-gray-700">
                        Solicitudes pendientes
                      </span>
                    </div>

                    <strong
                      className={
                        solicitudesPendientes >
                        0
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }
                    >
                      {mostrarNumero(
                        solicitudesPendientes
                      )}
                    </strong>
                  </Link>

                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                    <div className="flex items-center gap-3">
                      <WalletCards
                        size={19}
                        className="text-blue-600"
                      />

                      <span className="text-sm font-medium text-gray-700">
                        Cajas abiertas
                      </span>
                    </div>

                    <strong className="text-blue-700">
                      {mostrarNumero(
                        resumen?.cajasAbiertas
                      )}
                    </strong>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* PRODUCTO DESTACADO */}

          {productoDestacado && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Trophy size={23} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      Producto líder
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-gray-900">
                      {productoDestacado.nombre}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {productoDestacado.marca ||
                        "Marca no registrada"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:min-w-80">
                  <div className="rounded-xl bg-gray-50 p-3 text-center">
                    <p className="text-xs text-gray-500">
                      Unidades
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {mostrarNumero(
                        productoDestacado.cantidadVendida
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-50 p-3 text-center">
                    <p className="text-xs text-emerald-600">
                      Vendido
                    </p>

                    <p className="mt-1 text-lg font-bold text-emerald-700">
                      {mostrarMoneda(
                        productoDestacado.totalVendido
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
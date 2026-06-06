import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  AlertTriangle,
  ArrowRight,
  BanknoteArrowDown,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  PackageCheck,
  ReceiptText,
  RefreshCcw,
  ShoppingCart,
  TrendingUp,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import MenuList from "@/components/MenuList";
import { getReporteDashboard } from "@/api/ReporteApi";

/* =====================================================
   FORMATEADORES
===================================================== */

const formatoMoneda = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
  minimumFractionDigits: 2,
});

const formatoNumero = new Intl.NumberFormat("es-BO");

function convertirNumero(
  valor: number | string | null | undefined
): number {
  const numero = Number(valor);

  return Number.isFinite(numero) ? numero : 0;
}

function mostrarMoneda(
  valor: number | string | null | undefined
): string {
  return formatoMoneda.format(convertirNumero(valor));
}

function mostrarNumero(
  valor: number | string | null | undefined
): string {
  return formatoNumero.format(convertirNumero(valor));
}

/* =====================================================
   TIPOS AUXILIARES
===================================================== */

type TarjetaIndicadorProps = {
  titulo: string;
  valor: string;
  descripcion: string;
  icono: React.ElementType;
  variante?: "normal" | "principal" | "alerta" | "exito";
};

type AccesoRapidoProps = {
  to: string;
  titulo: string;
  descripcion: string;
  icono: React.ElementType;
};

type TooltipFinancieroProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: {
      nombre?: string;
      valor?: number;
    };
  }>;
};

type TooltipOperativoProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: {
      nombre?: string;
      valor?: number;
    };
  }>;
};

/* =====================================================
   TARJETA DE INDICADOR
===================================================== */

function TarjetaIndicador({
  titulo,
  valor,
  descripcion,
  icono: Icono,
  variante = "normal",
}: TarjetaIndicadorProps) {
  const estilos = {
    normal: {
      borde: "border-gray-200",
      icono: "bg-gray-100 text-gray-700",
    },

    principal: {
      borde: "border-gray-900",
      icono: "bg-gray-900 text-white",
    },

    alerta: {
      borde: "border-amber-200",
      icono: "bg-amber-100 text-amber-700",
    },

    exito: {
      borde: "border-emerald-200",
      icono: "bg-emerald-100 text-emerald-700",
    },
  };

  const estilo = estilos[variante];

  return (
    <article
      className={`
        relative overflow-hidden rounded-2xl border bg-white p-5
        shadow-sm transition duration-200
        hover:-translate-y-0.5 hover:shadow-md
        ${estilo.borde}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {titulo}
          </p>

          <p className="mt-3 truncate text-2xl font-bold text-gray-900 sm:text-3xl">
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
            ${estilo.icono}
          `}
        >
          <Icono size={21} />
        </div>
      </div>
    </article>
  );
}

/* =====================================================
   ACCESO RÁPIDO
===================================================== */

function AccesoRapido({
  to,
  titulo,
  descripcion,
  icono: Icono,
}: AccesoRapidoProps) {
  return (
    <Link
      to={to}
      className="
        group flex items-center justify-between gap-4
        rounded-2xl border border-gray-200 bg-white
        p-4 shadow-sm transition duration-200
        hover:-translate-y-0.5 hover:border-gray-300
        hover:shadow-md
      "
    >
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="
            flex h-11 w-11 shrink-0 items-center
            justify-center rounded-xl bg-gray-100
            text-gray-700 transition
            group-hover:bg-gray-900
            group-hover:text-white
          "
        >
          <Icono size={20} />
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-gray-900">
            {titulo}
          </p>

          <p className="mt-1 text-sm leading-5 text-gray-500">
            {descripcion}
          </p>
        </div>
      </div>

      <ArrowRight
        size={18}
        className="
          shrink-0 text-gray-400 transition
          group-hover:translate-x-1
          group-hover:text-gray-900
        "
      />
    </Link>
  );
}

/* =====================================================
   TOOLTIPS DE GRÁFICAS
===================================================== */

function TooltipFinanciero({
  active,
  payload,
}: TooltipFinancieroProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="rounded-xl border bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">
        {item?.nombre}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        {mostrarMoneda(item?.valor)}
      </p>
    </div>
  );
}

function TooltipOperativo({
  active,
  payload,
}: TooltipOperativoProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="rounded-xl border bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">
        {item?.nombre}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        {mostrarNumero(item?.valor)}
      </p>
    </div>
  );
}

/* =====================================================
   GRÁFICA FINANCIERA
===================================================== */

type GraficaFinancieraProps = {
  totalVentas: number;
  totalEgresos: number;
  gananciaEstimada: number;
};

function GraficaFinanciera({
  totalVentas,
  totalEgresos,
  gananciaEstimada,
}: GraficaFinancieraProps) {
  const datos = [
    {
      nombre: "Ventas",
      valor: totalVentas,
    },
    {
      nombre: "Egresos",
      valor: totalEgresos,
    },
    {
      nombre: "Ganancia",
      valor: gananciaEstimada,
    },
  ];

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          Resumen financiero
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Comparación entre ventas, egresos y ganancia estimada.
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={datos}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
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
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              width={75}
              tickFormatter={(valor) =>
                `Bs ${formatoNumero.format(
                  convertirNumero(valor)
                )}`
              }
            />

            <Tooltip content={<TooltipFinanciero />} />

            <Bar
              dataKey="valor"
              radius={[8, 8, 0, 0]}
              maxBarSize={70}
            >
              {datos.map((item, index) => (
                <Cell
                  key={`${item.nombre}-${index}`}
                  fill={
                    index === 0
                      ? "#111827"
                      : index === 1
                        ? "#ef4444"
                        : "#10b981"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

/* =====================================================
   GRÁFICA OPERATIVA
===================================================== */

type GraficaOperativaProps = {
  cantidadVentas: number;
  cajasAbiertas: number;
  productosStockBajo: number;
  solicitudesPendientes: number;
};

function GraficaOperativa({
  cantidadVentas,
  cajasAbiertas,
  productosStockBajo,
  solicitudesPendientes,
}: GraficaOperativaProps) {
  const datos = [
    {
      nombre: "Ventas",
      valor: cantidadVentas,
    },
    {
      nombre: "Cajas abiertas",
      valor: cajasAbiertas,
    },
    {
      nombre: "Stock bajo",
      valor: productosStockBajo,
    },
    {
      nombre: "Solicitudes",
      valor: solicitudesPendientes,
    },
  ];

  const total = datos.reduce(
    (acumulado, item) => acumulado + item.valor,
    0
  );

  const colores = [
    "#111827",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
  ];

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          Situación operativa
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Distribución de indicadores operativos de la sucursal.
        </p>
      </div>

      {total > 0 ? (
        <>
          <div className="relative h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datos}
                  dataKey="valor"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {datos.map((item, index) => (
                    <Cell
                      key={`${item.nombre}-${index}`}
                      fill={colores[index]}
                    />
                  ))}
                </Pie>

                <Tooltip content={<TooltipOperativo />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {mostrarNumero(total)}
                </p>

                <p className="text-xs text-gray-500">
                  Registros
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {datos.map((item, index) => (
              <div
                key={item.nombre}
                className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: colores[index],
                    }}
                  />

                  <span className="text-sm text-gray-600">
                    {item.nombre}
                  </span>
                </div>

                <span className="text-sm font-bold text-gray-900">
                  {mostrarNumero(item.valor)}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
          <LayoutDashboard
            size={38}
            className="text-gray-300"
          />

          <p className="mt-3 font-semibold text-gray-600">
            Sin datos operativos
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Todavía no existen registros para graficar.
          </p>
        </div>
      )}
    </article>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-72 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-40 rounded-2xl border border-gray-200 bg-white p-5"
          >
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="mt-5 h-8 w-40 rounded bg-gray-200" />
            <div className="mt-4 h-3 w-48 rounded bg-gray-100" />
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-96 rounded-2xl border bg-white" />
        <div className="h-96 rounded-2xl border bg-white" />
      </div>
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function ReporteDashboardView() {
  const { sucursalId } = useParams<{
    sucursalId: string;
  }>();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "reporte-dashboard",
      sucursalId,
    ],

    queryFn: () =>
      getReporteDashboard({
        idSucursal: sucursalId,
      }),

    enabled: Boolean(sucursalId),

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: false,
  });

  if (!sucursalId) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="mt-0.5 text-red-600"
                size={22}
              />

              <div>
                <h1 className="font-bold text-red-800">
                  Sucursal no encontrada
                </h1>

                <p className="mt-1 text-sm text-red-700">
                  No se encontró el ID de la sucursal en la ruta.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <AlertTriangle size={22} />
              </div>

              <div className="flex-1">
                <h1 className="text-lg font-bold text-red-800">
                  No se pudo cargar el panel de reportes
                </h1>

                <p className="mt-2 text-sm text-red-700">
                  {error instanceof Error
                    ? error.message
                    : "Ocurrió un error al consultar el reporte."}
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="
                    mt-4 rounded-lg bg-red-700 px-4 py-2
                    text-sm font-semibold text-white
                    transition hover:bg-red-800
                  "
                >
                  Intentar nuevamente
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const resumen = data?.resumen;

  const totalVentas = convertirNumero(
    resumen?.totalVentas
  );

  const cantidadVentas = convertirNumero(
    resumen?.cantidadVentas
  );

  const ticketPromedio = convertirNumero(
    resumen?.ticketPromedio
  );

  const totalEgresos = convertirNumero(
    resumen?.totalEgresos
  );

  const gananciaEstimada = convertirNumero(
    resumen?.gananciaEstimada
  );

  const cajasAbiertas = convertirNumero(
    resumen?.cajasAbiertas
  );

  const solicitudesPendientes = convertirNumero(
    resumen?.solicitudesPendientes
  );

  const productosStockBajo = convertirNumero(
    resumen?.productosStockBajo
  );

  const productoMasVendido =
    data?.productoMasVendido;

  const vendedorMayorVenta =
    data?.vendedorMayorVenta;

  const baseReportes =
    `/sucursal/${sucursalId}/reportes`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* MENÚ LATERAL */}
      <MenuList />

      {/* CONTENIDO PRINCIPAL */}
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <section className="space-y-7 p-4 pt-20 sm:p-6 sm:pt-20 md:pt-6">
          {/* ENCABEZADO */}

          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-white">
                <LayoutDashboard size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Panel general de reportes
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Información comercial, financiera y operativa de la sucursal.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl border border-gray-300 bg-white
                px-4 py-2.5 text-sm font-semibold
                text-gray-700 shadow-sm transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <RefreshCcw
                size={17}
                className={
                  isFetching ? "animate-spin" : ""
                }
              />

              {isFetching
                ? "Actualizando..."
                : "Actualizar reporte"}
            </button>
          </header>

          {/* TARJETAS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TarjetaIndicador
              titulo="Ventas totales"
              valor={mostrarMoneda(totalVentas)}
              descripcion="Ingresos generados por las ventas registradas."
              icono={DollarSign}
              variante="principal"
            />

            <TarjetaIndicador
              titulo="Cantidad de ventas"
              valor={mostrarNumero(cantidadVentas)}
              descripcion="Número total de ventas procesadas."
              icono={ShoppingCart}
            />

            <TarjetaIndicador
              titulo="Ticket promedio"
              valor={mostrarMoneda(ticketPromedio)}
              descripcion="Valor promedio generado por cada venta."
              icono={ReceiptText}
            />

            <TarjetaIndicador
              titulo="Egresos"
              valor={mostrarMoneda(totalEgresos)}
              descripcion="Salidas de dinero registradas en la sucursal."
              icono={BanknoteArrowDown}
              variante={
                totalEgresos > 0 ? "alerta" : "normal"
              }
            />

            <TarjetaIndicador
              titulo="Ganancia estimada"
              valor={mostrarMoneda(gananciaEstimada)}
              descripcion="Resultado estimado después de considerar egresos."
              icono={TrendingUp}
              variante={
                gananciaEstimada >= 0
                  ? "exito"
                  : "alerta"
              }
            />

            <TarjetaIndicador
              titulo="Cajas abiertas"
              valor={mostrarNumero(cajasAbiertas)}
              descripcion="Cajas que actualmente se encuentran operativas."
              icono={CircleDollarSign}
            />

            <TarjetaIndicador
              titulo="Stock bajo"
              valor={mostrarNumero(productosStockBajo)}
              descripcion="Productos que necesitan reposición."
              icono={Boxes}
              variante={
                productosStockBajo > 0
                  ? "alerta"
                  : "normal"
              }
            />

            <TarjetaIndicador
              titulo="Solicitudes pendientes"
              valor={mostrarNumero(solicitudesPendientes)}
              descripcion="Solicitudes que todavía requieren atención."
              icono={ClipboardList}
              variante={
                solicitudesPendientes > 0
                  ? "alerta"
                  : "normal"
              }
            />
          </div>

          {/* GRÁFICAS */}

          <div className="grid gap-5 xl:grid-cols-2">
            <GraficaFinanciera
              totalVentas={totalVentas}
              totalEgresos={totalEgresos}
              gananciaEstimada={gananciaEstimada}
            />

            <GraficaOperativa
              cantidadVentas={cantidadVentas}
              cajasAbiertas={cajasAbiertas}
              productosStockBajo={productosStockBajo}
              solicitudesPendientes={
                solicitudesPendientes
              }
            />
          </div>

          {/* DESTACADOS */}

          <div className="grid gap-5 xl:grid-cols-2">
            <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <PackageCheck size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Producto más vendido
                    </h2>

                    <p className="text-sm text-gray-500">
                      Producto con mejor desempeño comercial.
                    </p>
                  </div>
                </div>

                <Link
                  to={`${baseReportes}/productos`}
                  className="hidden items-center gap-1 text-sm font-semibold text-gray-700 hover:text-black sm:flex"
                >
                  Ver reporte
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="p-5">
                {productoMasVendido ? (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Producto
                      </p>

                      <p className="mt-2 text-lg font-bold text-gray-900">
                        {productoMasVendido.nombre ||
                          "Sin nombre"}
                      </p>

                      {productoMasVendido.marca && (
                        <p className="mt-1 text-sm text-gray-500">
                          {productoMasVendido.marca}
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Cantidad vendida
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {mostrarNumero(
                          productoMasVendido.cantidadVendida
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Total generado
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {mostrarMoneda(
                          productoMasVendido.totalVendido
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                    <PackageCheck
                      size={34}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 font-semibold text-gray-600">
                      Sin información de productos
                    </p>
                  </div>
                )}
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <UserRoundCheck size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Mesero con mayor venta
                    </h2>

                    <p className="text-sm text-gray-500">
                      Mejor rendimiento comercial registrado.
                    </p>
                  </div>
                </div>

                <Link
                  to={`${baseReportes}/vendedores`}
                  className="hidden items-center gap-1 text-sm font-semibold text-gray-700 hover:text-black sm:flex"
                >
                  Ver reporte
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="p-5">
                {vendedorMayorVenta ? (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Mesero
                      </p>

                      <p className="mt-2 text-lg font-bold text-gray-900">
                        {`${vendedorMayorVenta.nombres ?? ""} ${
                          vendedorMayorVenta.apellidos ?? ""
                        }`.trim() || "Sin nombre"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Ventas realizadas
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {mostrarNumero(
                          vendedorMayorVenta.cantidadVentas
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Total vendido
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {mostrarMoneda(
                          vendedorMayorVenta.totalVendido
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                    <UserRoundCheck
                      size={34}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 font-semibold text-gray-600">
                      Sin información de meseros
                    </p>
                  </div>
                )}
              </div>
            </article>
          </div>

        
        </section>
      </main>
    </div>
  );
}
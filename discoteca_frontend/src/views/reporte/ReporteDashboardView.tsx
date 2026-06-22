
import { useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import {
  AlertTriangle,
  ArrowRight,
  BanknoteArrowDown,
  Boxes,
  Calendar,
  CircleDollarSign,
  ClipboardList,
  DollarSign,
  Filter,
  LayoutDashboard,
  PackageCheck,
  Printer,
  ReceiptText,
  RefreshCcw,
  ShoppingCart,
  TrendingUp,
  UserRoundCheck,
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
import { getPerfilUsuarioById } from "@/api/PerfilUsuarioApi";
import { getSucursalById } from "@/api/SucursalApi";

/* =====================================================
   FORMATEADORES
===================================================== */

const formatoMoneda = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
  minimumFractionDigits: 2,
});

const formatoNumero = new Intl.NumberFormat("es-BO");

function convertirNumero(valor: number | string | null | undefined): number {
  const numero = Number(valor);

  return Number.isFinite(numero) ? numero : 0;
}

function mostrarMoneda(valor: number | string | null | undefined): string {
  return formatoMoneda.format(convertirNumero(valor));
}

function mostrarNumero(valor: number | string | null | undefined): string {
  return formatoNumero.format(convertirNumero(valor));
}

function fechaInputLocal(fecha: Date): string {
  const compensacion = fecha.getTimezoneOffset() * 60000;

  return new Date(fecha.getTime() - compensacion).toISOString().slice(0, 10);
}

function formatearFechaFiltro(fecha?: string): string {
  if (!fecha) {
    return "Todas";
  }

  const valor = new Date(`${fecha}T00:00:00`);

  if (Number.isNaN(valor.getTime())) {
    return fecha;
  }

  return valor.toLocaleDateString("es-BO");
}

function escapeHtml(valor: unknown): string {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function obtenerIdPerfilVendedor(vendedor: any): string {
  if (!vendedor) {
    return "";
  }

  if (typeof vendedor.idPerfil === "string") {
    return vendedor.idPerfil;
  }

  if (typeof vendedor.idPerfil?._id === "string") {
    return vendedor.idPerfil._id;
  }

  if (typeof vendedor.perfil?._id === "string") {
    return vendedor.perfil._id;
  }

  if (typeof vendedor._idPerfil === "string") {
    return vendedor._idPerfil;
  }

  if (typeof vendedor.perfilId === "string") {
    return vendedor.perfilId;
  }

  return "";
}

function obtenerNombreDesdePerfil(perfil: any): string {
  if (!perfil) {
    return "";
  }

  const directo =
    perfil.nombreCompleto ||
    perfil.nombre ||
    perfil.nombreUsuario ||
    perfil.usuario;

  if (directo) {
    return String(directo);
  }

  return `${perfil.nombres || ""} ${perfil.apellidos || ""}`.trim();
}

function obtenerNombreVendedor(vendedor: any, perfilConsultado?: any): string {
  const nombrePerfilConsultado = obtenerNombreDesdePerfil(perfilConsultado);

  if (nombrePerfilConsultado) {
    return nombrePerfilConsultado;
  }

  const nombrePerfilEmbebido =
    obtenerNombreDesdePerfil(vendedor?.idPerfil) ||
    obtenerNombreDesdePerfil(vendedor?.perfil);

  if (nombrePerfilEmbebido) {
    return nombrePerfilEmbebido;
  }

  const nombreDirecto =
    vendedor?.nombreMesero ||
    vendedor?.mesero ||
    vendedor?.responsable ||
    vendedor?.nombreCompleto ||
    vendedor?.nombre;

  if (nombreDirecto) {
    return String(nombreDirecto);
  }

  const nombreSeparado =
    `${vendedor?.nombres || ""} ${vendedor?.apellidos || ""}`.trim();

  return nombreSeparado || "Sin nombre";
}

function obtenerDatosSucursal(
  data: any,
  sucursalConsultada: any,
  sucursalId?: string,
) {
  const posibleSucursal =
    sucursalConsultada?.sucursal ||
    sucursalConsultada?.data ||
    sucursalConsultada ||
    data?.sucursal ||
    data?.sucursalData ||
    data?.datosSucursal ||
    data?.idSucursal ||
    {};

  const nombre =
    posibleSucursal.nombreSucursal ||
    posibleSucursal.nombre ||
    posibleSucursal.descripcion ||
    data?.nombreSucursal ||
    data?.sucursalNombre ||
    "Sucursal";

  const ubicacion =
    posibleSucursal.ubicacionSucursal ||
    posibleSucursal.ubicacion ||
    posibleSucursal.direccion ||
    posibleSucursal.zona ||
    data?.ubicacionSucursal ||
    data?.sucursalUbicacion ||
    "Sin ubicación";

  return {
    id: String(posibleSucursal._id || posibleSucursal.id || sucursalId || ""),
    nombre: String(nombre),
    ubicacion: String(ubicacion),
  };
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
   IMPRESIÓN ESTILO CONTABLE
===================================================== */

function generarHtmlImpresionDashboard({
  data,
  sucursalId,
  fechaDesde,
  fechaHasta,
  sucursalConsultada,
  perfilVendedor,
}: {
  data: any;
  sucursalId: string;
  fechaDesde: string;
  fechaHasta: string;
  sucursalConsultada?: any;
  perfilVendedor?: any;
}) {
  const resumen = data?.resumen || {};

  const productoMasVendido = data?.productoMasVendido;

  const vendedorMayorVenta = data?.vendedorMayorVenta;

  const datosSucursal = obtenerDatosSucursal(
    data,
    sucursalConsultada,
    sucursalId,
  );

  const sucursalNombre = datosSucursal.nombre;

  const sucursalUbicacion = datosSucursal.ubicacion;

  const nombreVendedor = obtenerNombreVendedor(
    vendedorMayorVenta,
    perfilVendedor,
  );

  const fechaImpresion = new Date().toLocaleString("es-BO");

  const totalVentas = convertirNumero(resumen.totalVentas);

  const cantidadVentas = convertirNumero(resumen.cantidadVentas);

  const ticketPromedio = convertirNumero(resumen.ticketPromedio);

  const totalEgresos = convertirNumero(resumen.totalEgresos);

  const gananciaEstimada = convertirNumero(resumen.gananciaEstimada);

  const cajasAbiertas = convertirNumero(resumen.cajasAbiertas);

  const solicitudesPendientes = convertirNumero(resumen.solicitudesPendientes);

  const productosStockBajo = convertirNumero(resumen.productosStockBajo);

  const estadoFinanciero = gananciaEstimada >= 0 ? "POSITIVO" : "NEGATIVO";

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Informe general de reportes</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            background: white;
            color: #111827;
            font-family: "Courier New", Courier, monospace;
            font-size: 12px;
            line-height: 1.25;
          }

          .documento {
            width: 100%;
            padding: 18px 22px;
          }

          .encabezado {
            display: grid;
            grid-template-columns: 1fr 320px;
            gap: 20px;
            border-bottom: 2px solid #111827;
            padding-bottom: 8px;
            margin-bottom: 10px;
          }

          .empresa {
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .subempresa {
            font-size: 13px;
            margin-top: 2px;
          }

          .titulo {
            margin-top: 14px;
            font-size: 18px;
            font-weight: 900;
            text-transform: uppercase;
          }

          .meta {
            font-size: 11px;
          }

          .meta p {
            margin: 2px 0;
          }

          .datos {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 8px;
            margin-bottom: 8px;
          }

          .datos p {
            margin: 2px 0;
          }

          h2 {
            text-align: center;
            font-size: 14px;
            text-transform: uppercase;
            margin: 12px 0 6px;
            padding-top: 4px;
            border-top: 1px solid #111827;
            border-bottom: 1px solid #111827;
          }

          h3 {
            font-size: 13px;
            margin: 8px 0 4px;
            text-transform: uppercase;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0 10px;
          }

          th {
            font-weight: 900;
            text-transform: uppercase;
            border-top: 1px solid #111827;
            border-bottom: 1px solid #111827;
            padding: 4px 5px;
            text-align: left;
            background: #f8fafc;
          }

          td {
            border-bottom: 1px dotted #cbd5e1;
            padding: 4px 5px;
            vertical-align: top;
          }

          .right {
            text-align: right;
          }

          .center {
            text-align: center;
          }

          .strong {
            font-weight: 900;
          }

          .success {
            color: #047857;
            font-weight: 900;
          }

          .danger {
            color: #b91c1c;
            font-weight: 900;
          }

          .warning {
            color: #b45309;
            font-weight: 900;
          }

          .estado {
            font-weight: 900;
            text-transform: uppercase;
          }

          .formula {
            border-top: 1px solid #111827;
            border-bottom: 1px solid #111827;
            margin: 10px 0;
            padding: 6px 0;
            font-weight: 900;
          }

          .firmas {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 36px;
            margin-top: 42px;
            text-align: center;
          }

          .firma-linea {
            height: 38px;
            border-bottom: 1px solid #111827;
            margin-bottom: 6px;
          }

          .page-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          @page {
            size: A4;
            margin: 10mm;
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            tr {
              page-break-inside: avoid;
            }

            .page-avoid {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        </style>
      </head>

      <body>
        <div class="documento">
          <div class="encabezado">
            <div>
              <div class="empresa">${escapeHtml(sucursalNombre)}</div>
              <div class="subempresa">${escapeHtml(sucursalUbicacion)}</div>

              <div class="titulo">
                INFORME GENERAL DE REPORTES
              </div>
            </div>

            <div class="meta">
              <p><b>Sucursal ID:</b> ${escapeHtml(sucursalId)}</p>
              <p><b>Impreso desde:</b> Sistema Web</p>
              <p><b>Fecha de impresión:</b> ${escapeHtml(fechaImpresion)}</p>
              <p><b>Periodo:</b> ${escapeHtml(formatearFechaFiltro(fechaDesde))} - ${escapeHtml(formatearFechaFiltro(fechaHasta))}</p>
              <p><b>Página:</b> 1 de 1</p>
            </div>
          </div>

          <section class="page-avoid">
            <div class="datos">
              <div>
                <p><b>Sucursal:</b> ${escapeHtml(sucursalNombre)}</p>
                <p><b>Ubicación:</b> ${escapeHtml(sucursalUbicacion)}</p>
                <p><b>Fecha desde:</b> ${escapeHtml(formatearFechaFiltro(fechaDesde))}</p>
                <p><b>Fecha hasta:</b> ${escapeHtml(formatearFechaFiltro(fechaHasta))}</p>
              </div>

              <div>
                <p><b>Estado financiero:</b> <span class="${gananciaEstimada >= 0 ? "success" : "danger"}">${estadoFinanciero}</span></p>
                <p><b>Cajas abiertas:</b> ${mostrarNumero(cajasAbiertas)}</p>
                <p><b>Stock bajo:</b> ${mostrarNumero(productosStockBajo)}</p>
                <p><b>Solicitudes pendientes:</b> ${mostrarNumero(solicitudesPendientes)}</p>
              </div>
            </div>
          </section>

          <section class="page-avoid">
            <h2>RESUMEN FINANCIERO</h2>

            <table>
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th class="right">Valor</th>
                  <th>Descripción</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td><b>Ventas totales</b></td>
                  <td class="right strong">${mostrarMoneda(totalVentas)}</td>
                  <td>Ingresos generados por ventas registradas en el periodo.</td>
                </tr>

                <tr>
                  <td><b>Cantidad de ventas</b></td>
                  <td class="right">${mostrarNumero(cantidadVentas)}</td>
                  <td>Número total de ventas procesadas.</td>
                </tr>

                <tr>
                  <td><b>Ticket promedio</b></td>
                  <td class="right">${mostrarMoneda(ticketPromedio)}</td>
                  <td>Promedio monetario generado por venta.</td>
                </tr>

                <tr>
                  <td><b>Egresos</b></td>
                  <td class="right danger">${mostrarMoneda(totalEgresos)}</td>
                  <td>Salidas de dinero registradas.</td>
                </tr>

                <tr>
                  <td><b>Ganancia estimada</b></td>
                  <td class="right ${gananciaEstimada >= 0 ? "success" : "danger"}">${mostrarMoneda(gananciaEstimada)}</td>
                  <td>Resultado estimado después de considerar egresos.</td>
                </tr>
              </tbody>
            </table>

            <div class="formula">
              Fórmula referencial:
              Ventas totales - Egresos = Ganancia estimada
              <br />
              ${mostrarMoneda(totalVentas)} - ${mostrarMoneda(totalEgresos)} = ${mostrarMoneda(gananciaEstimada)}
            </div>
          </section>

          <section class="page-avoid">
            <h2>RESUMEN OPERATIVO</h2>

            <table>
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th class="right">Cantidad</th>
                  <th>Interpretación</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td><b>Cajas abiertas</b></td>
                  <td class="right">${mostrarNumero(cajasAbiertas)}</td>
                  <td>Cajas actualmente operativas.</td>
                </tr>

                <tr>
                  <td><b>Productos con stock bajo</b></td>
                  <td class="right ${productosStockBajo > 0 ? "warning" : ""}">${mostrarNumero(productosStockBajo)}</td>
                  <td>Productos que necesitan reposición.</td>
                </tr>

                <tr>
                  <td><b>Solicitudes pendientes</b></td>
                  <td class="right ${solicitudesPendientes > 0 ? "warning" : ""}">${mostrarNumero(solicitudesPendientes)}</td>
                  <td>Solicitudes que requieren atención.</td>
                </tr>

                <tr>
                  <td><b>Ventas procesadas</b></td>
                  <td class="right">${mostrarNumero(cantidadVentas)}</td>
                  <td>Movimiento comercial generado.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="page-avoid">
            <h2>DESTACADOS COMERCIALES</h2>

            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Nombre</th>
                  <th class="right">Cantidad</th>
                  <th class="right">Total generado</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td><b>Producto más vendido</b></td>
                  <td>
                    ${escapeHtml(productoMasVendido?.nombre || "Sin información")}
                    ${productoMasVendido?.marca ? ` - ${escapeHtml(productoMasVendido.marca)}` : ""}
                  </td>
                  <td class="right">${mostrarNumero(productoMasVendido?.cantidadVendida)}</td>
                  <td class="right strong">${mostrarMoneda(productoMasVendido?.totalVendido)}</td>
                </tr>

                <tr>
                  <td><b>Mesero con mayor venta</b></td>
                  <td>
                    ${escapeHtml(nombreVendedor || "Sin información")}
                  </td>
                  <td class="right">${mostrarNumero(vendedorMayorVenta?.cantidadVentas)}</td>
                  <td class="right strong">${mostrarMoneda(vendedorMayorVenta?.totalVendido)}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="firmas page-avoid">
            <div>
              <div class="firma-linea"></div>
              <p>Responsable de sucursal</p>
            </div>

            <div>
              <div class="firma-linea"></div>
              <p>Administrador</p>
            </div>

            <div>
              <div class="firma-linea"></div>
              <p>Contabilidad</p>
            </div>
          </section>
        </div>
      </body>
    </html>
  `;
}

function imprimirReporteDashboard({
  data,
  sucursalId,
  fechaDesde,
  fechaHasta,
  sucursalConsultada,
  perfilVendedor,
}: {
  data: any;
  sucursalId: string;
  fechaDesde: string;
  fechaHasta: string;
  sucursalConsultada?: any;
  perfilVendedor?: any;
}) {
  const iframe = document.createElement("iframe");

  iframe.style.position = "fixed";

  iframe.style.right = "0";

  iframe.style.bottom = "0";

  iframe.style.width = "0";

  iframe.style.height = "0";

  iframe.style.border = "0";

  document.body.appendChild(iframe);

  const documento = iframe.contentWindow?.document;

  if (!documento) {
    alert("No se pudo preparar el informe para imprimir.");

    document.body.removeChild(iframe);

    return;
  }

  documento.open();

  documento.write(
    generarHtmlImpresionDashboard({
      data,
      sucursalId,
      fechaDesde,
      fechaHasta,
      sucursalConsultada,
      perfilVendedor,
    }),
  );

  documento.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1000);
  }, 700);
}

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
          <p className="text-sm font-medium text-gray-500">{titulo}</p>

          <p className="mt-3 truncate text-2xl font-bold text-gray-900 sm:text-3xl">
            {valor}
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-500">{descripcion}</p>
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
   TOOLTIPS DE GRÁFICAS
===================================================== */

function TooltipFinanciero({ active, payload }: TooltipFinancieroProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="rounded-xl border bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">{item?.nombre}</p>

      <p className="mt-1 text-sm text-gray-600">{mostrarMoneda(item?.valor)}</p>
    </div>
  );
}

function TooltipOperativo({ active, payload }: TooltipOperativoProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="rounded-xl border bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">{item?.nombre}</p>

      <p className="mt-1 text-sm text-gray-600">{mostrarNumero(item?.valor)}</p>
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
        <h2 className="text-lg font-bold text-gray-900">Resumen financiero</h2>

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
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="nombre" tickLine={false} axisLine={false} />

            <YAxis
              tickLine={false}
              axisLine={false}
              width={75}
              tickFormatter={(valor) =>
                `Bs ${formatoNumero.format(convertirNumero(valor))}`
              }
            />

            <Tooltip content={<TooltipFinanciero />} />

            <Bar dataKey="valor" radius={[8, 8, 0, 0]} maxBarSize={70}>
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

  const total = datos.reduce((acumulado, item) => acumulado + item.valor, 0);

  const colores = ["#111827", "#3b82f6", "#f59e0b", "#8b5cf6"];

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">Situación operativa</h2>

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

                <p className="text-xs text-gray-500">Registros</p>
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

                  <span className="text-sm text-gray-600">{item.nombre}</span>
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
          <LayoutDashboard size={38} className="text-gray-300" />

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
        {Array.from({
          length: 8,
        }).map((_, index) => (
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

  const [fechaDesde, setFechaDesde] = useState("");

  const [fechaHasta, setFechaHasta] = useState("");

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["reporte-dashboard", sucursalId, fechaDesde, fechaHasta],

    queryFn: () =>
      getReporteDashboard({
        idSucursal: sucursalId,
        fechaDesde: fechaDesde || undefined,
        fechaHasta: fechaHasta || undefined,
      } as any),

    enabled: Boolean(sucursalId),

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: false,
  });

  const vendedorMayorVentaTemporal = data?.vendedorMayorVenta;

  const idPerfilVendedor = obtenerIdPerfilVendedor(vendedorMayorVentaTemporal);

  const { data: perfilVendedor, isLoading: cargandoPerfilVendedor } = useQuery({
    queryKey: ["perfil-usuario", idPerfilVendedor],

    queryFn: () => getPerfilUsuarioById(idPerfilVendedor),

    enabled: Boolean(idPerfilVendedor),

    staleTime: 1000 * 60 * 10,
  });

  const { data: sucursalConsultada } = useQuery({
    queryKey: ["sucursal", sucursalId],

    queryFn: () => getSucursalById(sucursalId!),

    enabled: Boolean(sucursalId),

    staleTime: 1000 * 60 * 10,
  });

  const aplicarFiltroHoy = () => {
    const hoy = fechaInputLocal(new Date());

    setFechaDesde(hoy);
    setFechaHasta(hoy);
  };

  const aplicarFiltroSemana = () => {
    const hoy = new Date();

    const inicio = new Date(hoy);

    inicio.setDate(hoy.getDate() - hoy.getDay() + 1);

    const fin = new Date(inicio);

    fin.setDate(inicio.getDate() + 6);

    setFechaDesde(fechaInputLocal(inicio));

    setFechaHasta(fechaInputLocal(fin));
  };

  const aplicarFiltroMes = () => {
    const hoy = new Date();

    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    setFechaDesde(fechaInputLocal(inicio));

    setFechaHasta(fechaInputLocal(fin));
  };

  const limpiarFiltros = () => {
    setFechaDesde("");
    setFechaHasta("");
  };

  const handleImprimir = () => {
    if (!data || !sucursalId) {
      alert("No hay datos para imprimir.");

      return;
    }

    imprimirReporteDashboard({
      data,
      sucursalId,
      fechaDesde,
      fechaHasta,
      sucursalConsultada,
      perfilVendedor,
    });
  };

  if (!sucursalId) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 text-red-600" size={22} />

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

  const totalVentas = convertirNumero(resumen?.totalVentas);

  const cantidadVentas = convertirNumero(resumen?.cantidadVentas);

  const ticketPromedio = convertirNumero(resumen?.ticketPromedio);

  const totalEgresos = convertirNumero(resumen?.totalEgresos);

  const gananciaEstimada = convertirNumero(resumen?.gananciaEstimada);

  const cajasAbiertas = convertirNumero(resumen?.cajasAbiertas);

  const solicitudesPendientes = convertirNumero(resumen?.solicitudesPendientes);

  const productosStockBajo = convertirNumero(resumen?.productosStockBajo);

  const productoMasVendido = data?.productoMasVendido;
  const vendedorMayorVenta = data?.vendedorMayorVenta;

  const nombreVendedorMayorVenta = cargandoPerfilVendedor
    ? "Cargando..."
    : obtenerNombreVendedor(vendedorMayorVenta, perfilVendedor);

  const datosSucursalActual = obtenerDatosSucursal(
    data,
    sucursalConsultada,
    sucursalId,
  );

  const baseReportes = `/sucursal/${sucursalId}/reportes`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MenuList />

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <section className="space-y-7 p-4 pt-20 sm:p-6 sm:pt-20 md:pt-6">
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
                  Información comercial, financiera y operativa de $
                  {datosSucursalActual.nombre}.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <button
                type="button"
                onClick={handleImprimir}
                disabled={isFetching || !data}
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
                <Printer size={17} />
                Imprimir
              </button>

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
                  className={isFetching ? "animate-spin" : ""}
                />

                {isFetching ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </header>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <Filter size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Filtros del reporte
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    El panel y la impresión usan el rango de fechas
                    seleccionado.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label>
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                  Fecha desde
                </span>

                <div className="relative">
                  <Calendar
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="date"
                    value={fechaDesde}
                    max={fechaHasta || undefined}
                    onChange={(event) => setFechaDesde(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-gray-900"
                  />
                </div>
              </label>

              <label>
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                  Fecha hasta
                </span>

                <div className="relative">
                  <Calendar
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="date"
                    value={fechaHasta}
                    min={fechaDesde || undefined}
                    onChange={(event) => setFechaHasta(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-gray-900"
                  />
                </div>
              </label>
            </div>
          </section>

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
              variante={totalEgresos > 0 ? "alerta" : "normal"}
            />

            <TarjetaIndicador
              titulo="Ganancia estimada"
              valor={mostrarMoneda(gananciaEstimada)}
              descripcion="Resultado estimado después de considerar egresos."
              icono={TrendingUp}
              variante={gananciaEstimada >= 0 ? "exito" : "alerta"}
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
              variante={productosStockBajo > 0 ? "alerta" : "normal"}
            />

            <TarjetaIndicador
              titulo="Solicitudes pendientes"
              valor={mostrarNumero(solicitudesPendientes)}
              descripcion="Solicitudes que todavía requieren atención."
              icono={ClipboardList}
              variante={solicitudesPendientes > 0 ? "alerta" : "normal"}
            />
          </div>

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
              solicitudesPendientes={solicitudesPendientes}
            />
          </div>

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
                  to={`${baseReportes}/productos-mas-vendidos`}
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
                        {productoMasVendido.nombre || "Sin nombre"}
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
                        {mostrarNumero(productoMasVendido.cantidadVendida)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Total generado
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {mostrarMoneda(productoMasVendido.totalVendido)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                    <PackageCheck size={34} className="mx-auto text-gray-300" />

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
                        {nombreVendedorMayorVenta}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Ventas realizadas
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {mostrarNumero(vendedorMayorVenta.cantidadVentas)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Total vendido
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {mostrarMoneda(vendedorMayorVenta.totalVendido)}
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

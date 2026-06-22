import {
  useMemo,
  useState,
} from "react";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  Banknote,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleSlash,
  ClipboardList,
  CreditCard,
  Download,
  FileText,
  Gift,
  LoaderCircle,
  Printer,
  QrCode,
  ReceiptText,
  RefreshCcw,
  Search,
  ShieldCheck,
  Store,
  TrendingUp,
  UserRound,
  WalletCards,
} from "lucide-react";

import {
  getReporteVentasMeseroPorCajas,
} from "@/api/VentaApi";

import {
  useAuth,
} from "@/hooks/useAuth";

import type {
  ReporteVentasMeseroPorCajasType,
} from "@/types/VentaType";

/* =====================================================
   HELPERS
===================================================== */

function formatoMoneda(
  valor: number | undefined | null
) {
  return `Bs. ${Number(valor || 0).toFixed(2)}`;
}

function formatoFecha(
  fecha?: string | Date | null
) {
  if (!fecha) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "es-BO",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(
    new Date(fecha)
  );
}

function obtenerId(
  valor: any
): string {
  if (!valor) {
    return "";
  }

  if (
    typeof valor === "string"
  ) {
    return valor;
  }

  return String(
    valor._id ||
    valor.id ||
    valor
  );
}

function obtenerNombrePerfil(
  perfil: any
): string {
  if (!perfil) {
    return "Mesero";
  }

  const nombre =
    `${perfil.nombres || ""} ${perfil.apellidos || ""}`
      .trim();

  return (
    nombre ||
    perfil.nombre ||
    perfil.email ||
    "Mesero"
  );
}

function obtenerIniciales(
  nombre: string
) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase() || "M";
}

function obtenerIdSucursalPerfil(
  perfil: any
): string {
  return (
    obtenerId(perfil?.idSucursal) ||
    obtenerId(perfil?.sucursal) ||
    obtenerId(perfil?.sucursalActual) ||
    ""
  );
}

function generarHtmlImpresionReporteMesero(
  reporte: ReporteVentasMeseroPorCajasType,
  nombreMesero: string
) {
  const filasCajas =
    reporte.cajas
      .map(
        (caja) => `
          <tr>
            <td>${caja.caja || "-"}</td>
            <td>${formatoFecha(caja.fechaApertura)}</td>
            <td>${caja.resumen.cantidadVentas}</td>
            <td>${formatoMoneda(caja.resumen.totalEfectivo)}</td>
            <td>${formatoMoneda(caja.resumen.totalQr)}</td>
            <td>${formatoMoneda(caja.resumen.totalTransferencia)}</td>
            <td>${formatoMoneda(caja.resumen.totalMixto)}</td>
            <td>${formatoMoneda(caja.resumen.totalAJustificarSistema)}</td>
          </tr>
        `
      )
      .join("");

  const detalleVentas =
    reporte.cajas
      .map(
        (caja) => `
          <h3>CAJA: ${caja.caja}</h3>
          <table>
            <thead>
              <tr>
                <th>Nro Venta</th>
                <th>Comanda</th>
                <th>Fecha</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${
                [
                  ...caja.ventas,
                  ...caja.cortesias,
                  ...caja.ventasAnuladas,
                ]
                  .map(
                    (venta) => `
                      <tr>
                        <td>${venta.numeroVenta || "-"}</td>
                        <td>${venta.numeroComanda || "-"}</td>
                        <td>${formatoFecha(venta.fechaVenta)}</td>
                        <td>${venta.metodoPago || "-"}</td>
                        <td>${venta.estado || "-"}</td>
                        <td>${formatoMoneda(venta.total)}</td>
                      </tr>
                    `
                  )
                  .join("")
              }
            </tbody>
          </table>
        `
      )
      .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Reporte del Mesero</title>
        <style>
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            font-family: "Courier New", monospace;
            color: #111827;
            font-size: 12px;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #111827;
            padding-bottom: 10px;
            margin-bottom: 14px;
          }

          .header h1 {
            margin: 0;
            font-size: 20px;
          }

          .header p {
            margin: 3px 0;
          }

          .box {
            border: 1px solid #111827;
            padding: 10px;
            margin-bottom: 12px;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            margin-bottom: 16px;
          }

          th {
            background: #111827;
            color: white;
            padding: 6px;
            text-align: left;
            font-size: 11px;
          }

          td {
            border-bottom: 1px dashed #94a3b8;
            padding: 6px;
            font-size: 11px;
          }

          h2 {
            font-size: 15px;
            border-top: 1px solid #111827;
            border-bottom: 1px solid #111827;
            padding: 5px 0;
            margin-top: 18px;
          }

          h3 {
            font-size: 13px;
            margin-top: 18px;
            margin-bottom: 4px;
          }

          .firmas {
            margin-top: 60px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 70px;
            text-align: center;
          }

          .firma {
            border-top: 1px solid #111827;
            padding-top: 8px;
          }
        </style>
      </head>

      <body>
        <div class="header">
          <h1>REPORTE DE ENTREGA DEL MESERO</h1>
          <p>Sistema de ventas - Discoteca</p>
          <p>Fecha de impresión: ${formatoFecha(new Date())}</p>
        </div>

        <div class="box grid">
          <div>
            <strong>Mesero:</strong> ${nombreMesero}<br/>
            <strong>ID Perfil:</strong> ${reporte.general.idPerfil}<br/>
            <strong>ID Sucursal:</strong> ${reporte.general.idSucursal}
          </div>

          <div>
            <strong>Cantidad de cajas:</strong> ${reporte.general.cantidadCajas}<br/>
            <strong>Fecha reporte:</strong> ${formatoFecha(reporte.general.fechaReporte)}<br/>
            <strong>Total sistema:</strong> ${formatoMoneda(reporte.resumenGeneral.totalAJustificarSistema)}
          </div>
        </div>

        <h2>RESUMEN GENERAL</h2>

        <div class="box grid">
          <div>
            <strong>Ventas pagadas:</strong> ${reporte.resumenGeneral.cantidadVentas}<br/>
            <strong>Ventas anuladas:</strong> ${reporte.resumenGeneral.cantidadVentasAnuladas}<br/>
            <strong>Cortesías:</strong> ${reporte.resumenGeneral.cantidadCortesias}
          </div>

          <div>
            <strong>Efectivo a entregar:</strong> ${formatoMoneda(reporte.resumenGeneral.montoEfectivoAEntregar)}<br/>
            <strong>Comprobantes:</strong> ${formatoMoneda(reporte.resumenGeneral.totalAJustificarConComprobante)}<br/>
            <strong>Total a justificar:</strong> ${formatoMoneda(reporte.resumenGeneral.totalAJustificarSistema)}
          </div>
        </div>

        <h2>RESUMEN POR CAJA</h2>

        <table>
          <thead>
            <tr>
              <th>Caja</th>
              <th>Apertura</th>
              <th>Ventas</th>
              <th>Efectivo</th>
              <th>QR</th>
              <th>Transf.</th>
              <th>Mixto</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            ${filasCajas}
          </tbody>
        </table>

        <h2>DETALLE DE VENTAS POR CAJA</h2>

        ${detalleVentas}

        <div class="firmas">
          <div class="firma">
            Firma Mesero
          </div>

          <div class="firma">
            Firma Cajera
          </div>
        </div>
      </body>
    </html>
  `;
}

function imprimirReporte(
  reporte: ReporteVentasMeseroPorCajasType,
  nombreMesero: string
) {
  const html =
    generarHtmlImpresionReporteMesero(
      reporte,
      nombreMesero
    );

  const iframe =
    document.createElement("iframe");

  iframe.style.position =
    "fixed";

  iframe.style.right =
    "0";

  iframe.style.bottom =
    "0";

  iframe.style.width =
    "0";

  iframe.style.height =
    "0";

  iframe.style.border =
    "0";

  document.body.appendChild(
    iframe
  );

  const doc =
    iframe.contentWindow?.document;

  if (!doc) {
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    setTimeout(() => {
      document.body.removeChild(
        iframe
      );
    }, 1000);
  };
}

/* =====================================================
   COMPONENTE
===================================================== */

export default function ReporteMeseroCajaView() {
  const {
    data: perfil,
    isLoading: cargandoPerfil,
  } = useAuth();

  const [
    busqueda,
    setBusqueda,
  ] = useState("");

  const idPerfil =
    obtenerId(perfil);

  const idSucursal =
    obtenerIdSucursalPerfil(perfil);

  const nombreMesero =
    obtenerNombrePerfil(perfil);

  const iniciales =
    obtenerIniciales(nombreMesero);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "reporte-ventas-mesero-cajas",
      idPerfil,
      idSucursal,
    ],

    queryFn: () =>
      getReporteVentasMeseroPorCajas({
        idPerfil,
        idSucursal,
      }),

    enabled:
      Boolean(idPerfil) &&
      Boolean(idSucursal),
  });

  const cajasFiltradas =
    useMemo(() => {
      if (!data) {
        return [];
      }

      const texto =
        busqueda
          .trim()
          .toLowerCase();

      if (!texto) {
        return data.cajas;
      }

      return data.cajas.filter(
        (caja) => {
          const contenido =
            [
              caja.caja,
              caja.idCaja,
              caja.resumen.totalVentas,
              caja.resumen.totalEfectivo,
              caja.resumen.totalQr,
              caja.resumen.totalTransferencia,
              caja.resumen.totalMixto,
              ...caja.ventas.map(
                (venta) =>
                  `${venta.numeroVenta} ${venta.numeroComanda} ${venta.metodoPago} ${venta.estado}`
              ),
            ]
              .join(" ")
              .toLowerCase();

          return contenido.includes(
            texto
          );
        }
      );
    }, [
      data,
      busqueda,
    ]);

  if (
    cargandoPerfil ||
    isLoading
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-14 w-14 animate-spin text-fuchsia-400" />

          <p className="mt-4 text-lg font-black text-white">
            Generando reporte del mesero...
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Calculando ventas por caja abierta.
          </p>
        </div>
      </div>
    );
  }

  if (!idSucursal) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <CircleSlash className="mx-auto h-14 w-14 text-red-400" />

        <h2 className="mt-4 text-2xl font-black text-white">
          No se encontró sucursal
        </h2>

        <p className="mt-2 text-slate-300">
          Tu perfil no tiene una sucursal asignada. Comunícate con el administrador.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <CircleSlash className="mx-auto h-14 w-14 text-red-400" />

        <h2 className="mt-4 text-2xl font-black text-white">
          No se pudo cargar el reporte
        </h2>

        <p className="mt-2 text-slate-300">
          {error instanceof Error
            ? error.message
            : "Ocurrió un error al obtener el reporte."}
        </p>

        <button
          onClick={() => refetch()}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-fuchsia-600 px-5 py-3 font-black text-white transition hover:bg-fuchsia-700"
        >
          <RefreshCcw className="h-5 w-5" />
          Reintentar
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const resumen =
    data.resumenGeneral;

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <section className="relative overflow-hidden rounded-[2rem] border border-fuchsia-500/20 bg-slate-950 p-6 shadow-2xl shadow-fuchsia-950/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.18),transparent_35%)]" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-fuchsia-400/30 bg-fuchsia-500/20 text-fuchsia-300 shadow-xl shadow-fuchsia-500/20">
              <FileText className="h-10 w-10" />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
                Rendición de caja
              </p>

              <h1 className="mt-2 text-4xl font-black text-white">
                Reporte del Mesero
              </h1>

              <p className="mt-2 text-slate-400">
                Ventas agrupadas por caja abierta para justificar dinero y comprobantes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-600 text-white">
                {iniciales}
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Mesero
                </p>

              
              </div>
            </div>

            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 font-black text-cyan-200 transition hover:bg-cyan-400/20 disabled:opacity-50"
            >
              <RefreshCcw className={`h-5 w-5 ${isFetching ? "animate-spin" : ""}`} />
              Actualizar
            </button>

            <button
              onClick={() =>
                imprimirReporte(
                  data,
                  nombreMesero
                )
              }
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-5 py-3 font-black text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.02]"
            >
              <Printer className="h-5 w-5" />
              Imprimir
            </button>
          </div>
        </div>
      </section>

      {/* Resumen principal */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-emerald-400/20 bg-slate-900 p-6 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Efectivo a entregar
              </p>

              <h2 className="mt-3 text-3xl font-black text-emerald-300">
                {formatoMoneda(
                  resumen.montoEfectivoAEntregar
                )}
              </h2>

              <p className="mt-3 text-xs text-slate-500">
                Dinero físico para caja.
              </p>
            </div>

            <Banknote className="h-10 w-10 text-emerald-300" />
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-400/20 bg-slate-900 p-6 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">
                QR / Transferencia / Mixto
              </p>

              <h2 className="mt-3 text-3xl font-black text-cyan-300">
                {formatoMoneda(
                  resumen.totalAJustificarConComprobante
                )}
              </h2>

              <p className="mt-3 text-xs text-slate-500">
                Se justifica con comprobantes.
              </p>
            </div>

            <QrCode className="h-10 w-10 text-cyan-300" />
          </div>
        </div>

        <div className="rounded-3xl border border-fuchsia-400/20 bg-slate-900 p-6 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Total sistema
              </p>

              <h2 className="mt-3 text-3xl font-black text-fuchsia-300">
                {formatoMoneda(
                  resumen.totalAJustificarSistema
                )}
              </h2>

              <p className="mt-3 text-xs text-slate-500">
                Total registrado por ventas.
              </p>
            </div>

            <TrendingUp className="h-10 w-10 text-fuchsia-300" />
          </div>
        </div>

        <div className="rounded-3xl border border-amber-400/20 bg-slate-900 p-6 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Cajas abiertas
              </p>

              <h2 className="mt-3 text-3xl font-black text-amber-300">
                {data.general.cantidadCajas}
              </h2>

              <p className="mt-3 text-xs text-slate-500">
                Cajas donde debe rendir.
              </p>
            </div>

            <Building2 className="h-10 w-10 text-amber-300" />
          </div>
        </div>
      </section>

      {/* Desglose general */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <MiniCard
          icon={<ReceiptText />}
          label="Ventas pagadas"
          value={resumen.cantidadVentas}
          color="text-emerald-300"
        />

        <MiniCard
          icon={<Gift />}
          label="Cortesías"
          value={resumen.cantidadCortesias}
          color="text-amber-300"
        />

        <MiniCard
          icon={<CircleSlash />}
          label="Ventas anuladas"
          value={resumen.cantidadVentasAnuladas}
          color="text-red-300"
        />

        <MiniCard
          icon={<WalletCards />}
          label="Total QR"
          value={formatoMoneda(resumen.totalQr)}
          color="text-cyan-300"
        />

        <MiniCard
          icon={<CreditCard />}
          label="Transferencia"
          value={formatoMoneda(resumen.totalTransferencia)}
          color="text-indigo-300"
        />
      </section>

      {/* Buscador */}
      <section className="rounded-3xl border border-slate-700 bg-slate-900/80 p-5">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

          <input
            value={busqueda}
            onChange={(event) =>
              setBusqueda(
                event.target.value
              )
            }
            placeholder="Buscar por caja, venta, comanda, método de pago..."
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-4 pl-14 pr-4 text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-500/10"
          />
        </div>
      </section>

      {/* Cajas */}
      <section className="space-y-6">
        {cajasFiltradas.map(
          (caja) => (
            <article
              key={String(caja.idAperturaCaja)}
              className="overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900 shadow-2xl"
            >
              <div className="border-b border-slate-700 bg-slate-950/80 p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                      <Store className="h-9 w-9" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-black text-white">
                        {caja.caja}
                      </h2>

                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-400">
                        <span className="inline-flex items-center gap-2">
                          <CalendarClock className="h-4 w-4" />
                          Apertura: {formatoFecha(caja.fechaApertura)}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <UserRound className="h-4 w-4" />
                          Responsable: {caja.responsableApertura || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-emerald-300">
                    <p className="text-xs font-bold uppercase tracking-widest">
                      Efectivo para esta caja
                    </p>

                    <p className="mt-1 text-2xl font-black">
                      {formatoMoneda(
                        caja.resumen.montoEfectivoAEntregar
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
                <CajaResumenCard
                  label="Total sistema"
                  value={formatoMoneda(caja.resumen.totalAJustificarSistema)}
                  icon={<ShieldCheck />}
                  color="fuchsia"
                />

                <CajaResumenCard
                  label="Efectivo"
                  value={formatoMoneda(caja.resumen.totalEfectivo)}
                  icon={<Banknote />}
                  color="emerald"
                />

                <CajaResumenCard
                  label="QR"
                  value={formatoMoneda(caja.resumen.totalQr)}
                  icon={<QrCode />}
                  color="cyan"
                />

                <CajaResumenCard
                  label="Transferencia"
                  value={formatoMoneda(caja.resumen.totalTransferencia)}
                  icon={<CreditCard />}
                  color="indigo"
                />
              </div>

              <div className="grid gap-4 px-6 pb-6 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Ventas pagadas
                  </p>

                  <p className="mt-2 text-2xl font-black text-emerald-300">
                    {caja.resumen.cantidadVentas}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Cortesías
                  </p>

                  <p className="mt-2 text-2xl font-black text-amber-300">
                    {caja.resumen.cantidadCortesias}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Anuladas
                  </p>

                  <p className="mt-2 text-2xl font-black text-red-300">
                    {caja.resumen.cantidadVentasAnuladas}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-700 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-white">
                  <ClipboardList className="h-6 w-6 text-fuchsia-300" />
                  Detalle de ventas
                </h3>

                <div className="space-y-3">
                  {[
                    ...caja.ventas,
                    ...caja.cortesias,
                    ...caja.ventasAnuladas,
                  ].length === 0 ? (
                    <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6 text-center text-slate-400">
                      No hay ventas registradas para esta caja.
                    </div>
                  ) : (
                    [
                      ...caja.ventas,
                      ...caja.cortesias,
                      ...caja.ventasAnuladas,
                    ].map(
                      (venta) => (
                        <VentaRow
                          key={String(venta.idVenta)}
                          venta={venta}
                        />
                      )
                    )
                  )}
                </div>
              </div>
            </article>
          )
        )}
      </section>
    </div>
  );
}

/* =====================================================
   SUBCOMPONENTES
===================================================== */

function MiniCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
      <div className={`mb-4 h-7 w-7 ${color}`}>
        {icon}
      </div>

      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className={`mt-2 text-2xl font-black ${color}`}>
        {value}
      </p>
    </div>
  );
}

function CajaResumenCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "fuchsia" | "emerald" | "cyan" | "indigo";
}) {
  const estilos = {
    fuchsia:
      "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-300",

    emerald:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",

    cyan:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",

    indigo:
      "border-indigo-400/20 bg-indigo-400/10 text-indigo-300",
  };

  return (
    <div className={`rounded-3xl border p-5 ${estilos[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-300">
            {label}
          </p>

          <p className="mt-3 text-2xl font-black">
            {value}
          </p>
        </div>

        <div className="h-9 w-9">
          {icon}
        </div>
      </div>
    </div>
  );
}

function VentaRow({
  venta,
}: {
  venta: any;
}) {
  const estadoColor =
    venta.estado === "pagado"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
      : venta.estado === "cortesia"
        ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
        : "border-red-400/30 bg-red-400/10 text-red-300";

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="text-lg font-black text-white">
              Venta {venta.numeroVenta || "sin número"}
            </h4>

            <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${estadoColor}`}>
              {venta.estado}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">
            <span>
              Comanda:{" "}
              <b className="text-slate-200">
                {venta.numeroComanda || "-"}
              </b>
            </span>

            <span>
              Método:{" "}
              <b className="text-slate-200">
                {venta.metodoPago}
              </b>
            </span>

            <span>
              Fecha:{" "}
              <b className="text-slate-200">
                {formatoFecha(venta.fechaVenta)}
              </b>
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Total
          </p>

          <p className="text-2xl font-black text-fuchsia-300">
            {formatoMoneda(venta.total)}
          </p>
        </div>
      </div>

      {venta.productos?.length > 0 && (
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {venta.productos.map(
            (producto: any) => (
              <div
                key={String(producto.idDetalleVenta || producto.idProducto)}
                className="rounded-xl bg-slate-900 px-4 py-3"
              >
                <p className="font-bold text-slate-200">
                  {producto.producto || "Producto"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Cant: {producto.cantidad} · Subtotal: {formatoMoneda(producto.subtotal)}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
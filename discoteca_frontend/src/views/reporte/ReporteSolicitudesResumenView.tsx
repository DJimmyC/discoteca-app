import {
  type ElementType,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileBarChart,
  Filter,
  Hourglass,
  LoaderCircle,
  PackageCheck,
  Printer,
  RefreshCcw,
  RotateCcw,
  Search,
  Send,
  TimerReset,
  Truck,
  XCircle,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import MenuList from "@/components/MenuList";

import {
  getReporteSolicitudesResumen,
} from "@/api/ReporteApi";

import type {
  SolicitudesResumenResponse,
  SolicitudResumenEstado,
} from "@/types/ReporteType";

/* =====================================================
   FORMATEADORES
===================================================== */

const formatoNumero =
  new Intl.NumberFormat(
    "es-BO"
  );

function convertirNumero(
  valor:
    | number
    | string
    | null
    | undefined
): number {
  const numero =
    Number(valor);

  return Number.isFinite(numero)
    ? numero
    : 0;
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

function mostrarHoras(
  valor:
    | number
    | string
    | null
    | undefined
): string {
  const horas =
    convertirNumero(valor);

  if (horas < 1) {
    const minutos =
      Math.round(
        horas * 60
      );

    return `${minutos} min`;
  }

  if (horas < 24) {
    return `${horas.toFixed(
      2
    )} h`;
  }

  const dias =
    Math.floor(
      horas / 24
    );

  const horasRestantes =
    horas % 24;

  return `${dias} d ${horasRestantes.toFixed(
    1
  )} h`;
}

function mostrarPorcentaje(
  valor:
    | number
    | string
    | null
    | undefined
): string {
  return `${convertirNumero(
    valor
  ).toFixed(2)}%`;
}

function normalizarEstado(
  estado?: string
): string {
  if (!estado) {
    return "Sin estado";
  }

  return estado
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letra) =>
        letra.toUpperCase()
    );
}

function formatearFecha(
  fecha?: string
): string {
  if (!fecha) {
    return "-";
  }

  const valor =
    new Date(
      `${fecha}T00:00:00`
    );

  if (
    Number.isNaN(
      valor.getTime()
    )
  ) {
    return fecha;
  }

  return valor.toLocaleDateString(
    "es-BO",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}

function formatearFechaHoraActual(): string {
  return new Date().toLocaleString(
    "es-BO",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function limpiarNombreArchivo(
  texto: string
): string {
  return texto
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-zA-Z0-9-_]/g,
      "_"
    )
    .replace(
      /_+/g,
      "_"
    );
}

/* =====================================================
   CONFIGURACIÓN DE ESTADOS
===================================================== */

function obtenerColorEstado(
  estado: string
): string {
  const valor =
    estado.toLowerCase();

  if (
    valor.includes("pendiente")
  ) {
    return "#f59e0b";
  }

  if (
    valor.includes("aprobado") ||
    valor.includes("aceptado")
  ) {
    return "#2563eb";
  }

  if (
    valor.includes("proceso") ||
    valor.includes("despacho")
  ) {
    return "#8b5cf6";
  }

  if (
    valor.includes("entregado") ||
    valor.includes("completado")
  ) {
    return "#10b981";
  }

  if (
    valor.includes("rechazado") ||
    valor.includes("denegado") ||
    valor.includes("cancelado")
  ) {
    return "#ef4444";
  }

  return "#64748b";
}

function obtenerIconoEstado(
  estado: string
): ElementType {
  const valor =
    estado.toLowerCase();

  if (
    valor.includes("pendiente")
  ) {
    return Hourglass;
  }

  if (
    valor.includes("aprobado") ||
    valor.includes("aceptado")
  ) {
    return CheckCircle2;
  }

  if (
    valor.includes("proceso") ||
    valor.includes("despacho")
  ) {
    return Truck;
  }

  if (
    valor.includes("entregado") ||
    valor.includes("completado")
  ) {
    return PackageCheck;
  }

  if (
    valor.includes("rechazado") ||
    valor.includes("denegado") ||
    valor.includes("cancelado")
  ) {
    return XCircle;
  }

  return AlertCircle;
}

/* =====================================================
   TIPOS AUXILIARES
===================================================== */

type VarianteTarjeta =
  | "normal"
  | "principal"
  | "positivo"
  | "negativo"
  | "advertencia"
  | "informativo";

type TarjetaIndicadorProps = {
  titulo: string;
  valor: string;
  descripcion: string;
  icono: ElementType;
  variante?: VarianteTarjeta;
};

type EstadoGrafica = {
  estado: string;
  nombre: string;
  cantidad: number;
  tiempoPromedioHoras: number;
  porcentaje: number;
  color: string;
};

type TooltipEstadoProps = {
  active?: boolean;

  payload?: Array<{
    value?: number;
    payload?: EstadoGrafica;
  }>;
};

type TooltipTiempoProps = {
  active?: boolean;

  payload?: Array<{
    value?: number;
    payload?: EstadoGrafica;
  }>;

  label?: string;
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
      borde:
        "border-gray-200",

      icono:
        "bg-gray-100 text-gray-700",

      valor:
        "text-gray-900",
    },

    principal: {
      borde:
        "border-gray-900",

      icono:
        "bg-gray-900 text-white",

      valor:
        "text-gray-900",
    },

    positivo: {
      borde:
        "border-emerald-200",

      icono:
        "bg-emerald-100 text-emerald-700",

      valor:
        "text-emerald-700",
    },

    negativo: {
      borde:
        "border-red-200",

      icono:
        "bg-red-100 text-red-700",

      valor:
        "text-red-700",
    },

    advertencia: {
      borde:
        "border-amber-200",

      icono:
        "bg-amber-100 text-amber-700",

      valor:
        "text-amber-700",
    },

    informativo: {
      borde:
        "border-blue-200",

      icono:
        "bg-blue-100 text-blue-700",

      valor:
        "text-blue-700",
    },
  };

  const estilo =
    estilos[variante];

  return (
    <article
      className={`
        rounded-2xl border bg-white p-5
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

          <p
            className={`
              mt-3 break-words
              text-2xl font-bold
              sm:text-3xl
              ${estilo.valor}
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
            flex h-11 w-11 shrink-0
            items-center justify-center
            rounded-xl
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
   BADGE DE ESTADO
===================================================== */

function EstadoSolicitudBadge({
  estado,
}: {
  estado: string;
}) {
  const Icono =
    obtenerIconoEstado(
      estado
    );

  const valor =
    estado.toLowerCase();

  let clases =
    "bg-gray-100 text-gray-700";

  if (
    valor.includes("pendiente")
  ) {
    clases =
      "bg-amber-100 text-amber-700";
  } else if (
    valor.includes("aprobado") ||
    valor.includes("aceptado")
  ) {
    clases =
      "bg-blue-100 text-blue-700";
  } else if (
    valor.includes("proceso") ||
    valor.includes("despacho")
  ) {
    clases =
      "bg-violet-100 text-violet-700";
  } else if (
    valor.includes("entregado") ||
    valor.includes("completado")
  ) {
    clases =
      "bg-emerald-100 text-emerald-700";
  } else if (
    valor.includes("rechazado") ||
    valor.includes("denegado") ||
    valor.includes("cancelado")
  ) {
    clases =
      "bg-red-100 text-red-700";
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-3 py-1
        text-xs font-semibold
        ${clases}
      `}
    >
      <Icono size={13} />

      {normalizarEstado(
        estado
      )}
    </span>
  );
}

/* =====================================================
   TOOLTIPS
===================================================== */

function TooltipEstado({
  active,
  payload,
}: TooltipEstadoProps) {
  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }

  const item =
    payload[0]?.payload;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="font-semibold text-gray-900">
        {item?.nombre}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Solicitudes:{" "}
        <strong>
          {mostrarNumero(
            item?.cantidad
          )}
        </strong>
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Participación:{" "}
        <strong>
          {mostrarPorcentaje(
            item?.porcentaje
          )}
        </strong>
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Tiempo promedio:{" "}
        <strong>
          {mostrarHoras(
            item?.tiempoPromedioHoras
          )}
        </strong>
      </p>
    </div>
  );
}

function TooltipTiempo({
  active,
  payload,
  label,
}: TooltipTiempoProps) {
  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }

  const item =
    payload[0]?.payload;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="font-semibold text-gray-900">
        {label}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Tiempo promedio:{" "}
        <strong>
          {mostrarHoras(
            item?.tiempoPromedioHoras
          )}
        </strong>
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Solicitudes:{" "}
        <strong>
          {mostrarNumero(
            item?.cantidad
          )}
        </strong>
      </p>
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function ReporteSolicitudesSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-80 max-w-full rounded bg-gray-200" />

        <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-100" />
      </div>

      <div className="h-40 rounded-2xl border bg-white" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map(
          (_, index) => (
            <div
              key={index}
              className="h-40 rounded-2xl border bg-white"
            />
          )
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-[420px] rounded-2xl border bg-white" />

        <div className="h-[420px] rounded-2xl border bg-white" />
      </div>

      <div className="h-[420px] rounded-2xl border bg-white" />
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function ReporteSolicitudesResumenView() {
  const {
    sucursalId,
  } = useParams<{
    sucursalId: string;
  }>();

  const [
    fechaDesde,
    setFechaDesde,
  ] = useState("");

  const [
    fechaHasta,
    setFechaHasta,
  ] = useState("");

  const [
    estado,
    setEstado,
  ] = useState("");

  const [
    busqueda,
    setBusqueda,
  ] = useState("");

  const {
    data:
      reporteSolicitudes,

    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<
    SolicitudesResumenResponse,
    Error
  >({
    queryKey: [
      "reporte-solicitudes-resumen",
      sucursalId,
      fechaDesde,
      fechaHasta,
      estado,
    ],

    queryFn: () =>
      getReporteSolicitudesResumen({
        idSucursal:
          sucursalId!,

        fechaDesde:
          fechaDesde ||
          undefined,

        fechaHasta:
          fechaHasta ||
          undefined,

        estado:
          estado ||
          undefined,
      }),

    enabled:
      Boolean(
        sucursalId
      ),

    staleTime:
      1000 * 60 * 2,

    refetchOnWindowFocus:
      false,
  });

  const solicitudesPorEstado:
    SolicitudResumenEstado[] =
    reporteSolicitudes
      ?.porEstado ??
    [];

  const estadosDisponibles =
    useMemo(
      () =>
        solicitudesPorEstado
          .map(
            (item) =>
              item.estado
          )
          .filter(Boolean)
          .sort(
            (a, b) =>
              normalizarEstado(
                a
              ).localeCompare(
                normalizarEstado(
                  b
                )
              )
          ),
      [
        solicitudesPorEstado,
      ]
    );

  const estadosFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      return solicitudesPorEstado.filter(
        (item) => {
          const coincideBusqueda =
            !texto ||
            normalizarEstado(
              item.estado
            )
              .toLowerCase()
              .includes(
                texto
              );

          return coincideBusqueda;
        }
      );
    }, [
      solicitudesPorEstado,
      busqueda,
    ]);

  const totalSolicitudes =
    estadosFiltrados.reduce(
      (
        acumulado,
        item
      ) =>
        acumulado +
        convertirNumero(
          item.cantidad
        ),
      0
    );

  const totalGeneral =
    convertirNumero(
      reporteSolicitudes
        ?.totalSolicitudes
    );

  const solicitudesPendientes =
    estadosFiltrados
      .filter(
        (item) =>
          item.estado
            .toLowerCase()
            .includes(
              "pendiente"
            )
      )
      .reduce(
        (
          acumulado,
          item
        ) =>
          acumulado +
          convertirNumero(
            item.cantidad
          ),
        0
      );

  const solicitudesCompletadas =
    estadosFiltrados
      .filter(
        (item) => {
          const valor =
            item.estado.toLowerCase();

          return (
            valor.includes(
              "entregado"
            ) ||
            valor.includes(
              "completado"
            ) ||
            valor.includes(
              "finalizado"
            )
          );
        }
      )
      .reduce(
        (
          acumulado,
          item
        ) =>
          acumulado +
          convertirNumero(
            item.cantidad
          ),
        0
      );

  const solicitudesRechazadas =
    estadosFiltrados
      .filter(
        (item) => {
          const valor =
            item.estado.toLowerCase();

          return (
            valor.includes(
              "rechazado"
            ) ||
            valor.includes(
              "denegado"
            ) ||
            valor.includes(
              "cancelado"
            )
          );
        }
      )
      .reduce(
        (
          acumulado,
          item
        ) =>
          acumulado +
          convertirNumero(
            item.cantidad
          ),
        0
      );

  const tiempoPromedioGeneral =
    totalSolicitudes > 0
      ? estadosFiltrados.reduce(
          (
            acumulado,
            item
          ) =>
            acumulado +
            convertirNumero(
              item.tiempoPromedioHoras
            ) *
              convertirNumero(
                item.cantidad
              ),
          0
        ) /
        totalSolicitudes
      : 0;

  const porcentajePendientes =
    totalSolicitudes > 0
      ? (
          solicitudesPendientes /
          totalSolicitudes
        ) *
        100
      : 0;

  const porcentajeCompletadas =
    totalSolicitudes > 0
      ? (
          solicitudesCompletadas /
          totalSolicitudes
        ) *
        100
      : 0;

  const datosGrafica =
    useMemo<
      EstadoGrafica[]
    >(
      () =>
        estadosFiltrados
          .map(
            (item) => ({
              estado:
                item.estado,

              nombre:
                normalizarEstado(
                  item.estado
                ),

              cantidad:
                convertirNumero(
                  item.cantidad
                ),

              tiempoPromedioHoras:
                convertirNumero(
                  item.tiempoPromedioHoras
                ),

              porcentaje:
                totalSolicitudes >
                0
                  ? (
                      convertirNumero(
                        item.cantidad
                      ) /
                      totalSolicitudes
                    ) *
                    100
                  : 0,

              color:
                obtenerColorEstado(
                  item.estado
                ),
            })
          )
          .sort(
            (a, b) =>
              b.cantidad -
              a.cantidad
          ),
      [
        estadosFiltrados,
        totalSolicitudes,
      ]
    );

  const estadoMayorCantidad =
    datosGrafica[0] ??
    null;

  const estadoMasLento =
    [...datosGrafica].sort(
      (a, b) =>
        b.tiempoPromedioHoras -
        a.tiempoPromedioHoras
    )[0] ?? null;

  const limpiarFiltros =
    () => {
      setFechaDesde("");
      setFechaHasta("");
      setEstado("");
      setBusqueda("");
    };

  /* =====================================================
     PDF
  ===================================================== */

  const generarReportePDF = (
    modo:
      | "descargar"
      | "imprimir" =
      "descargar"
  ) => {
    if (
      !sucursalId ||
      datosGrafica.length ===
        0
    ) {
      return;
    }

    const documento =
      new jsPDF({
        orientation:
          "landscape",

        unit:
          "mm",

        format:
          "a4",
      });

    const anchoPagina =
      documento
        .internal
        .pageSize
        .getWidth();

    const altoPagina =
      documento
        .internal
        .pageSize
        .getHeight();

    const margenIzquierdo =
      15;

    const margenDerecho =
      15;

    const periodoDesde =
      fechaDesde
        ? formatearFecha(
            fechaDesde
          )
        : "Inicio de registros";

    const periodoHasta =
      fechaHasta
        ? formatearFecha(
            fechaHasta
          )
        : "Fecha actual";

    documento.setFillColor(
      17,
      24,
      39
    );

    documento.rect(
      0,
      0,
      anchoPagina,
      38,
      "F"
    );

    documento.setTextColor(
      255,
      255,
      255
    );

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(
      18
    );

    documento.text(
      "RESUMEN DE SOLICITUDES",
      margenIzquierdo,
      15
    );

    documento.setFont(
      "helvetica",
      "normal"
    );

    documento.setFontSize(
      10
    );

    documento.text(
      "Reporte de estados y tiempos promedio de atención",
      margenIzquierdo,
      23
    );

    documento.setFontSize(
      9
    );

    documento.text(
      `Sucursal: ${sucursalId}`,
      anchoPagina -
        margenDerecho,
      13,
      {
        align:
          "right",
      }
    );

    documento.text(
      `Periodo: ${periodoDesde} al ${periodoHasta}`,
      anchoPagina -
        margenDerecho,
      20,
      {
        align:
          "right",
      }
    );

    documento.text(
      `Generado: ${formatearFechaHoraActual()}`,
      anchoPagina -
        margenDerecho,
      27,
      {
        align:
          "right",
      }
    );

    documento.setTextColor(
      31,
      41,
      55
    );

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(
      11
    );

    documento.text(
      "Resumen general",
      margenIzquierdo,
      48
    );

    autoTable(
      documento,
      {
        startY:
          53,

        margin: {
          left:
            margenIzquierdo,

          right:
            margenDerecho,
        },

        head: [
          [
            "Total solicitudes",
            "Pendientes",
            "Completadas",
            "Rechazadas",
            "Tiempo promedio",
            "% pendientes",
            "% completadas",
          ],
        ],

        body: [
          [
            mostrarNumero(
              totalSolicitudes
            ),

            mostrarNumero(
              solicitudesPendientes
            ),

            mostrarNumero(
              solicitudesCompletadas
            ),

            mostrarNumero(
              solicitudesRechazadas
            ),

            mostrarHoras(
              tiempoPromedioGeneral
            ),

            mostrarPorcentaje(
              porcentajePendientes
            ),

            mostrarPorcentaje(
              porcentajeCompletadas
            ),
          ],
        ],

        theme:
          "grid",

        styles: {
          font:
            "helvetica",

          fontSize:
            8.5,

          cellPadding:
            3,

          halign:
            "center",

          textColor: [
            31,
            41,
            55,
          ],

          lineColor: [
            229,
            231,
            235,
          ],
        },

        headStyles: {
          fillColor: [
            55,
            65,
            81,
          ],

          textColor: [
            255,
            255,
            255,
          ],

          fontStyle:
            "bold",
        },
      }
    );

    const posicionResumen =
      (
        documento as
          jsPDF & {
            lastAutoTable?: {
              finalY:
                number;
            };
          }
      )
        .lastAutoTable
        ?.finalY ??
      75;

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(
      11
    );

    documento.text(
      "Detalle por estado",
      margenIzquierdo,
      posicionResumen +
        11
    );

    autoTable(
      documento,
      {
        startY:
          posicionResumen +
          16,

        margin: {
          left:
            margenIzquierdo,

          right:
            margenDerecho,
        },

        head: [
          [
            "Estado",
            "Cantidad",
            "Participación",
            "Tiempo promedio",
            "Interpretación",
          ],
        ],

        body:
          datosGrafica.map(
            (item) => [
              item.nombre,

              mostrarNumero(
                item.cantidad
              ),

              mostrarPorcentaje(
                item.porcentaje
              ),

              mostrarHoras(
                item.tiempoPromedioHoras
              ),

              item.tiempoPromedioHoras >
              24
                ? "Requiere atención"
                : item.tiempoPromedioHoras >
                    8
                  ? "Tiempo moderado"
                  : "Tiempo adecuado",
            ]
          ),

        foot: [
          [
            "TOTAL",

            mostrarNumero(
              totalSolicitudes
            ),

            "100%",

            mostrarHoras(
              tiempoPromedioGeneral
            ),

            "-",
          ],
        ],

        theme:
          "grid",

        styles: {
          font:
            "helvetica",

          fontSize:
            8,

          cellPadding:
            2.8,

          textColor: [
            31,
            41,
            55,
          ],

          lineColor: [
            209,
            213,
            219,
          ],
        },

        headStyles: {
          fillColor: [
            17,
            24,
            39,
          ],

          textColor: [
            255,
            255,
            255,
          ],

          fontStyle:
            "bold",

          halign:
            "center",
        },

        footStyles: {
          fillColor: [
            17,
            24,
            39,
          ],

          textColor: [
            255,
            255,
            255,
          ],

          fontStyle:
            "bold",
        },

        columnStyles: {
          0: {
            cellWidth:
              55,
          },

          1: {
            halign:
              "center",
          },

          2: {
            halign:
              "center",
          },

          3: {
            halign:
              "center",
          },

          4: {
            cellWidth:
              60,
          },
        },
      }
    );

    const posicionTabla =
      (
        documento as
          jsPDF & {
            lastAutoTable?: {
              finalY:
                number;
            };
          }
      )
        .lastAutoTable
        ?.finalY ??
      145;

    let posicionInterpretacion =
      posicionTabla +
      12;

    if (
      posicionInterpretacion >
      altoPagina -
        45
    ) {
      documento.addPage();

      posicionInterpretacion =
        20;
    }

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(
      11
    );

    documento.text(
      "Interpretación administrativa",
      margenIzquierdo,
      posicionInterpretacion
    );

    const interpretaciones:
      string[] = [];

    interpretaciones.push(
      `Se analizaron ${mostrarNumero(
        totalSolicitudes
      )} solicitudes durante el periodo seleccionado.`
    );

    interpretaciones.push(
      `El ${mostrarPorcentaje(
        porcentajePendientes
      )} de las solicitudes permanece pendiente.`
    );

    interpretaciones.push(
      `El tiempo promedio general de atención es de ${mostrarHoras(
        tiempoPromedioGeneral
      )}.`
    );

    if (
      estadoMayorCantidad
    ) {
      interpretaciones.push(
        `${estadoMayorCantidad.nombre} es el estado con mayor cantidad de solicitudes, con ${mostrarNumero(
          estadoMayorCantidad.cantidad
        )} registros.`
      );
    }

    if (
      estadoMasLento &&
      estadoMasLento
        .tiempoPromedioHoras >
        24
    ) {
      interpretaciones.push(
        `${estadoMasLento.nombre} presenta el mayor tiempo promedio de atención: ${mostrarHoras(
          estadoMasLento.tiempoPromedioHoras
        )}. Se recomienda revisar el proceso asociado.`
      );
    }

    documento.setFont(
      "helvetica",
      "normal"
    );

    documento.setFontSize(
      9.5
    );

    let posicionTexto =
      posicionInterpretacion +
      7;

    interpretaciones.forEach(
      (
        texto,
        index
      ) => {
        const lineas =
          documento.splitTextToSize(
            `${index + 1}. ${texto}`,

            anchoPagina -
              margenIzquierdo -
              margenDerecho -
              4
          );

        documento.text(
          lineas,
          margenIzquierdo +
            2,
          posicionTexto
        );

        posicionTexto +=
          lineas.length *
            5 +
          2;
      }
    );

    const totalPaginas =
      documento
        .getNumberOfPages();

    for (
      let pagina = 1;
      pagina <=
      totalPaginas;
      pagina++
    ) {
      documento.setPage(
        pagina
      );

      documento.setDrawColor(
        229,
        231,
        235
      );

      documento.line(
        margenIzquierdo,
        altoPagina -
          14,

        anchoPagina -
          margenDerecho,

        altoPagina -
          14
      );

      documento.setFont(
        "helvetica",
        "normal"
      );

      documento.setFontSize(
        8
      );

      documento.setTextColor(
        107,
        114,
        128
      );

      documento.text(
        "Documento generado automáticamente por el Sistema de Gestión de Discoteca.",

        margenIzquierdo,

        altoPagina -
          8
      );

      documento.text(
        `Página ${pagina} de ${totalPaginas}`,

        anchoPagina -
          margenDerecho,

        altoPagina -
          8,

        {
          align:
            "right",
        }
      );
    }

    const nombreArchivo =
      limpiarNombreArchivo(
        `resumen_solicitudes_${sucursalId}_${fechaDesde || "inicio"}_${fechaHasta || "actual"}`
      );

    if (
      modo ===
      "imprimir"
    ) {
      const urlPDF =
        documento.output(
          "bloburl"
        );

      window.open(
        urlPDF,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    documento.save(
      `${nombreArchivo}.pdf`
    );
  };

  /* =====================================================
     ESTADOS
  ===================================================== */

  if (!sucursalId) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-20 md:pt-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="font-bold text-red-800">
              Sucursal no encontrada
            </h1>

            <p className="mt-1 text-sm text-red-700">
              No se encontró el identificador de la sucursal en la ruta.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-20 md:pt-6">
          <ReporteSolicitudesSkeleton />
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-20 md:pt-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle
                size={24}
                className="text-red-700"
              />

              <div>
                <h1 className="text-lg font-bold text-red-800">
                  No se pudo cargar el resumen de solicitudes
                </h1>

                <p className="mt-2 text-sm text-red-700">
                  {error instanceof
                  Error
                    ? error.message
                    : "Ocurrió un error consultando el reporte."}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    refetch()
                  }
                  className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MenuList />

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <section className="space-y-7 p-4 pt-20 sm:p-6 sm:pt-20 md:pt-6">
          {/* ENCABEZADO */}

          <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-white">
                <Send size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Resumen de solicitudes
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Control de estados, cantidades y tiempos promedio de atención.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:flex">
              <button
                type="button"
                onClick={() =>
                  generarReportePDF(
                    "descargar"
                  )
                }
                disabled={
                  isFetching ||
                  datosGrafica.length ===
                    0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black disabled:opacity-50"
              >
                <Download size={17} />

                Descargar PDF
              </button>

              <button
                type="button"
                onClick={() =>
                  generarReportePDF(
                    "imprimir"
                  )
                }
                disabled={
                  isFetching ||
                  datosGrafica.length ===
                    0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-900 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 disabled:opacity-50"
              >
                <Printer size={17} />

                Imprimir
              </button>

              <button
                type="button"
                onClick={() =>
                  refetch()
                }
                disabled={
                  isFetching
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCcw
                  size={17}
                  className={
                    isFetching
                      ? "animate-spin"
                      : ""
                  }
                />

                {isFetching
                  ? "Actualizando..."
                  : "Actualizar"}
              </button>
            </div>
          </header>

          {/* FILTROS */}

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Filter size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Filtros del reporte
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Selecciona periodo, estado o realiza una búsqueda.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Fecha inicial
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="date"
                    value={
                      fechaDesde
                    }
                    max={
                      fechaHasta ||
                      undefined
                    }
                    onChange={(
                      event
                    ) =>
                      setFechaDesde(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Fecha final
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="date"
                    value={
                      fechaHasta
                    }
                    min={
                      fechaDesde ||
                      undefined
                    }
                    onChange={(
                      event
                    ) =>
                      setFechaHasta(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Estado
                </label>

                <select
                  value={
                    estado
                  }
                  onChange={(
                    event
                  ) =>
                    setEstado(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
                >
                  <option value="">
                    Todos los estados
                  </option>

                  {estadosDisponibles.map(
                    (
                      item
                    ) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                      >
                        {normalizarEstado(
                          item
                        )}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Buscar estado
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={
                      busqueda
                    }
                    onChange={(
                      event
                    ) =>
                      setBusqueda(
                        event.target.value
                      )
                    }
                    placeholder="Ej. pendiente, entregado..."
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Mostrando{" "}
                <strong>
                  {mostrarNumero(
                    totalSolicitudes
                  )}
                </strong>{" "}
                de{" "}
                <strong>
                  {mostrarNumero(
                    totalGeneral
                  )}
                </strong>{" "}
                solicitudes.
              </p>

              <button
                type="button"
                onClick={
                  limpiarFiltros
                }
                disabled={
                  !fechaDesde &&
                  !fechaHasta &&
                  !estado &&
                  !busqueda
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <RotateCcw size={17} />

                Limpiar filtros
              </button>
            </div>
          </article>

          {/* TARJETAS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TarjetaIndicador
              titulo="Total solicitudes"
              valor={mostrarNumero(
                totalSolicitudes
              )}
              descripcion="Cantidad de solicitudes consideradas en el reporte."
              icono={FileBarChart}
              variante="principal"
            />

            <TarjetaIndicador
              titulo="Solicitudes pendientes"
              valor={mostrarNumero(
                solicitudesPendientes
              )}
              descripcion={`${mostrarPorcentaje(
                porcentajePendientes
              )} del total permanece pendiente.`}
              icono={Hourglass}
              variante="advertencia"
            />

            <TarjetaIndicador
              titulo="Solicitudes completadas"
              valor={mostrarNumero(
                solicitudesCompletadas
              )}
              descripcion={`${mostrarPorcentaje(
                porcentajeCompletadas
              )} del total fue completado.`}
              icono={PackageCheck}
              variante="positivo"
            />

            <TarjetaIndicador
              titulo="Tiempo promedio"
              valor={mostrarHoras(
                tiempoPromedioGeneral
              )}
              descripcion="Tiempo promedio ponderado de atención."
              icono={Clock3}
              variante={
                tiempoPromedioGeneral >
                24
                  ? "negativo"
                  : tiempoPromedioGeneral >
                      8
                    ? "advertencia"
                    : "informativo"
              }
            />
          </div>

          {/* ALERTA */}

          {estadoMasLento && (
            <article
              className={`
                rounded-2xl border p-5 shadow-sm
                ${
                  estadoMasLento
                    .tiempoPromedioHoras >
                  24
                    ? "border-red-200 bg-red-50"
                    : "border-blue-200 bg-blue-50"
                }
              `}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`
                      flex h-12 w-12 items-center justify-center rounded-xl
                      ${
                        estadoMasLento
                          .tiempoPromedioHoras >
                        24
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }
                    `}
                  >
                    <TimerReset size={24} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                      Estado con mayor tiempo promedio
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                      {
                        estadoMasLento.nombre
                      }
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      {
                        estadoMasLento.cantidad
                      }{" "}
                      solicitudes registradas.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
                  <p className="text-xs text-gray-500">
                    Tiempo promedio
                  </p>

                  <p
                    className={`
                      mt-1 text-xl font-bold
                      ${
                        estadoMasLento
                          .tiempoPromedioHoras >
                        24
                          ? "text-red-700"
                          : "text-blue-700"
                      }
                    `}
                  >
                    {mostrarHoras(
                      estadoMasLento
                        .tiempoPromedioHoras
                    )}
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* GRÁFICAS */}

          <div className="grid gap-5 xl:grid-cols-2">
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Solicitudes por estado
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Distribución porcentual de las solicitudes.
              </p>

              {datosGrafica.length >
              0 ? (
                <div className="relative mt-4 h-[360px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={
                          datosGrafica
                        }
                        dataKey="cantidad"
                        nameKey="nombre"
                        innerRadius={65}
                        outerRadius={105}
                        paddingAngle={4}
                      >
                        {datosGrafica.map(
                          (
                            item
                          ) => (
                            <Cell
                              key={
                                item.estado
                              }
                              fill={
                                item.color
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        content={
                          <TooltipEstado />
                        }
                      />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {mostrarNumero(
                          totalSolicitudes
                        )}
                      </p>

                      <p className="text-xs text-gray-500">
                        Solicitudes
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex h-[350px] items-center justify-center text-gray-500">
                  Sin solicitudes para graficar
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Tiempo promedio por estado
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Horas promedio requeridas para actualizar cada estado.
              </p>

              {datosGrafica.length >
              0 ? (
                <div className="mt-5 h-[360px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={
                        datosGrafica
                      }
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={
                          false
                        }
                      />

                      <XAxis
                        dataKey="nombre"
                        tickLine={
                          false
                        }
                        axisLine={
                          false
                        }
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        height={65}
                      />

                      <YAxis
                        tickLine={
                          false
                        }
                        axisLine={
                          false
                        }
                        tickFormatter={(
                          valor
                        ) =>
                          `${valor} h`
                        }
                      />

                      <Tooltip
                        content={
                          <TooltipTiempo />
                        }
                      />

                      <Legend />

                      <Bar
                        dataKey="tiempoPromedioHoras"
                        name="Tiempo promedio"
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                      >
                        {datosGrafica.map(
                          (
                            item
                          ) => (
                            <Cell
                              key={
                                item.estado
                              }
                              fill={
                                item.color
                              }
                            />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-5 flex h-[350px] items-center justify-center text-gray-500">
                  Sin tiempos registrados
                </div>
              )}
            </article>
          </div>

          {/* TABLA */}

          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <BarChart3 size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Detalle por estado
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Cantidad, participación y tiempo promedio de atención.
                  </p>
                </div>
              </div>
            </div>

            {datosGrafica.length >
            0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Estado
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Cantidad
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Participación
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Tiempo promedio
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Evaluación
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {datosGrafica.map(
                      (
                        item
                      ) => {
                        const Icono =
                          obtenerIconoEstado(
                            item.estado
                          );

                        return (
                          <tr
                            key={
                              item.estado
                            }
                            className="hover:bg-gray-50"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                                  style={{
                                    backgroundColor:
                                      item.color,
                                  }}
                                >
                                  <Icono
                                    size={19}
                                  />
                                </div>

                                <EstadoSolicitudBadge
                                  estado={
                                    item.estado
                                  }
                                />
                              </div>
                            </td>

                            <td className="px-5 py-4 text-center text-lg font-bold text-gray-900">
                              {mostrarNumero(
                                item.cantidad
                              )}
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                {mostrarPorcentaje(
                                  item.porcentaje
                                )}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center font-semibold text-gray-700">
                              {mostrarHoras(
                                item.tiempoPromedioHoras
                              )}
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span
                                className={`
                                  inline-flex rounded-full px-3 py-1 text-xs font-semibold
                                  ${
                                    item.tiempoPromedioHoras >
                                    24
                                      ? "bg-red-100 text-red-700"
                                      : item.tiempoPromedioHoras >
                                          8
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-emerald-100 text-emerald-700"
                                  }
                                `}
                              >
                                {item.tiempoPromedioHoras >
                                24
                                  ? "Requiere atención"
                                  : item.tiempoPromedioHoras >
                                      8
                                    ? "Tiempo moderado"
                                    : "Tiempo adecuado"}
                              </span>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>

                  <tfoot className="bg-gray-900 text-white">
                    <tr>
                      <td className="px-5 py-4 font-bold">
                        Total
                      </td>

                      <td className="px-5 py-4 text-center font-bold">
                        {mostrarNumero(
                          totalSolicitudes
                        )}
                      </td>

                      <td className="px-5 py-4 text-center font-bold">
                        100%
                      </td>

                      <td className="px-5 py-4 text-center font-bold text-blue-300">
                        {mostrarHoras(
                          tiempoPromedioGeneral
                        )}
                      </td>

                      <td className="px-5 py-4 text-center font-bold">
                        Resumen general
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <Send
                  size={44}
                  className="text-gray-300"
                />

                <p className="mt-4 font-semibold text-gray-600">
                  No se encontraron solicitudes
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Modifica los filtros o actualiza el reporte.
                </p>
              </div>
            )}
          </article>

          {isFetching && (
            <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
              <LoaderCircle
                size={18}
                className="animate-spin"
              />

              Actualizando solicitudes...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
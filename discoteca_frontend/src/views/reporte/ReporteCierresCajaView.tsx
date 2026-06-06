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
  AlertTriangle,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Download,
  FileBarChart,
  Filter,
  LoaderCircle,
  MinusCircle,
  Printer,
  RefreshCcw,
  RotateCcw,
  Search,
  TrendingDown,
  TrendingUp,
  WalletCards,
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
  getReporteCierresCaja,
} from "@/api/ReporteApi";

import type {
  CierreCajaReporte,
  CierresCajaResponse,
} from "@/types/ReporteType";

/* =====================================================
   FORMATEADORES
===================================================== */

const formatoMoneda = new Intl.NumberFormat(
  "es-BO",
  {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  }
);

const formatoNumero = new Intl.NumberFormat(
  "es-BO"
);

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

function formatearFechaHora(
  fecha?: string
): string {
  if (!fecha) {
    return "-";
  }

  const valor = new Date(fecha);

  if (
    Number.isNaN(
      valor.getTime()
    )
  ) {
    return fecha;
  }

  return valor.toLocaleString(
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

function formatearFecha(
  fecha?: string
): string {
  if (!fecha) {
    return "-";
  }

  const valor = new Date(
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

function obtenerNombreCaja(
  cierre: CierreCajaReporte
): string {
  if (
    cierre.idCaja &&
    typeof cierre.idCaja === "object"
  ) {
    return (
      cierre.idCaja.nombre ||
      "Caja sin nombre"
    );
  }

  return "Caja sin nombre";
}

function obtenerNombreSucursal(
  cierre: CierreCajaReporte
): string {
  if (
    cierre.idSucursal &&
    typeof cierre.idSucursal === "object"
  ) {
    return (
      cierre.idSucursal.nombreSucursal ||
      cierre.idSucursal.nombre ||
      "Sucursal sin nombre"
    );
  }

  return "Sucursal sin nombre";
}

function obtenerNombrePerfil(
  cierre: CierreCajaReporte
): string {
  if (
    cierre.idPerfil &&
    typeof cierre.idPerfil === "object"
  ) {
    const nombre = [
      cierre.idPerfil.nombres,
      cierre.idPerfil.apellidos,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      nombre ||
      cierre.idPerfil.email ||
      "Usuario sin nombre"
    );
  }

  return "Usuario sin nombre";
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

type EstadoFiltro =
  | ""
  | "cuadrado"
  | "sobrante"
  | "faltante"
  | "cerrado";

type DatoGraficaCaja = {
  nombreCaja: string;
  totalVentas: number;
  totalEgresos: number;
  diferencia: number;
};

type DatoEstado = {
  nombre: string;
  cantidad: number;
  color: string;
};

type TooltipCajaProps = {
  active?: boolean;

  payload?: Array<{
    name?: string;
    value?: number;
    payload?: DatoGraficaCaja;
  }>;

  label?: string;
};

type TooltipEstadoProps = {
  active?: boolean;

  payload?: Array<{
    value?: number;
    payload?: DatoEstado;
  }>;
};

/* =====================================================
   TARJETA
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
      valor: "text-gray-900",
    },

    principal: {
      borde: "border-gray-900",
      icono: "bg-gray-900 text-white",
      valor: "text-gray-900",
    },

    positivo: {
      borde: "border-emerald-200",
      icono: "bg-emerald-100 text-emerald-700",
      valor: "text-emerald-700",
    },

    negativo: {
      borde: "border-red-200",
      icono: "bg-red-100 text-red-700",
      valor: "text-red-700",
    },

    advertencia: {
      borde: "border-amber-200",
      icono: "bg-amber-100 text-amber-700",
      valor: "text-amber-700",
    },

    informativo: {
      borde: "border-blue-200",
      icono: "bg-blue-100 text-blue-700",
      valor: "text-blue-700",
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
   ESTADO BADGE
===================================================== */

function EstadoCierreBadge({
  estado,
  diferencia,
}: {
  estado?: string;
  diferencia?: number;
}) {
  const valor =
    String(estado ?? "")
      .trim()
      .toLowerCase();

  const diferenciaNumero =
    convertirNumero(diferencia);

  if (
    valor === "cuadrado" ||
    diferenciaNumero === 0
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={13} />
        Cuadrado
      </span>
    );
  }

  if (
    valor === "sobrante" ||
    diferenciaNumero > 0
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        <TrendingUp size={13} />
        Sobrante
      </span>
    );
  }

  if (
    valor === "faltante" ||
    diferenciaNumero < 0
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        <TrendingDown size={13} />
        Faltante
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
      <MinusCircle size={13} />
      {normalizarEstado(estado)}
    </span>
  );
}

/* =====================================================
   TOOLTIPS
===================================================== */

function TooltipCaja({
  active,
  payload,
  label,
}: TooltipCajaProps) {
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

      <p className="mt-2 text-sm text-emerald-700">
        Ventas:{" "}
        <strong>
          {mostrarMoneda(
            item?.totalVentas
          )}
        </strong>
      </p>

      <p className="mt-1 text-sm text-red-700">
        Egresos:{" "}
        <strong>
          {mostrarMoneda(
            item?.totalEgresos
          )}
        </strong>
      </p>

      <p
        className={`
          mt-1 text-sm
          ${
            convertirNumero(
              item?.diferencia
            ) >= 0
              ? "text-blue-700"
              : "text-amber-700"
          }
        `}
      >
        Diferencia:{" "}
        <strong>
          {mostrarMoneda(
            item?.diferencia
          )}
        </strong>
      </p>
    </div>
  );
}

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
        {mostrarNumero(
          item?.cantidad
        )} cierres
      </p>
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function ReporteCierresCajaSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-80 max-w-full rounded bg-gray-200" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-100" />
      </div>

      <div className="h-44 rounded-2xl border bg-white" />

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

      <div className="h-[450px] rounded-2xl border bg-white" />
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function ReporteCierresCajaView() {
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
  ] = useState<EstadoFiltro>("");

  const [
    busqueda,
    setBusqueda,
  ] = useState("");

  const {
    data:
      reporteCierres,

    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<
    CierresCajaResponse,
    Error
  >({
    queryKey: [
      "reporte-cierres-caja",
      sucursalId,
      fechaDesde,
      fechaHasta,
      estado,
    ],

    queryFn: () =>
      getReporteCierresCaja({
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

  const cierres =
    reporteCierres
      ?.cierres ??
    [];

  const cierresFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      return cierres.filter(
        (cierre) => {
          if (!texto) {
            return true;
          }

          return (
            obtenerNombreCaja(
              cierre
            )
              .toLowerCase()
              .includes(texto) ||
            obtenerNombrePerfil(
              cierre
            )
              .toLowerCase()
              .includes(texto) ||
            obtenerNombreSucursal(
              cierre
            )
              .toLowerCase()
              .includes(texto) ||
            cierre.observacion
              ?.toLowerCase()
              .includes(texto) ||
            cierre.estado
              ?.toLowerCase()
              .includes(texto)
          );
        }
      );
    }, [
      cierres,
      busqueda,
    ]);

  /* =====================================================
     TOTALES SEGÚN FILTROS VISIBLES
  ===================================================== */

  const cantidadCierres =
    cierresFiltrados.length;

  const totalVentas =
    cierresFiltrados.reduce(
      (
        acumulado,
        cierre
      ) =>
        acumulado +
        convertirNumero(
          cierre.totalVentas
        ),
      0
    );

  const totalEgresos =
    cierresFiltrados.reduce(
      (
        acumulado,
        cierre
      ) =>
        acumulado +
        convertirNumero(
          cierre.totalEgresos
        ),
      0
    );

  const diferenciaTotal =
    cierresFiltrados.reduce(
      (
        acumulado,
        cierre
      ) =>
        acumulado +
        convertirNumero(
          cierre.diferencia
        ),
      0
    );

  const totalEsperado =
    cierresFiltrados.reduce(
      (
        acumulado,
        cierre
      ) =>
        acumulado +
        convertirNumero(
          cierre.totalEsperado
        ),
      0
    );

  const montoReal =
    cierresFiltrados.reduce(
      (
        acumulado,
        cierre
      ) =>
        acumulado +
        convertirNumero(
          cierre.montoReal
        ),
      0
    );

  const cuadrados =
    cierresFiltrados.filter(
      (cierre) =>
        cierre.estado ===
          "cuadrado" ||
        convertirNumero(
          cierre.diferencia
        ) === 0
    ).length;

  const sobrantes =
    cierresFiltrados.filter(
      (cierre) =>
        cierre.estado ===
          "sobrante" ||
        convertirNumero(
          cierre.diferencia
        ) > 0
    ).length;

  const faltantes =
    cierresFiltrados.filter(
      (cierre) =>
        cierre.estado ===
          "faltante" ||
        convertirNumero(
          cierre.diferencia
        ) < 0
    ).length;

  const porcentajeCuadrados =
    cantidadCierres > 0
      ? (
          cuadrados /
          cantidadCierres
        ) *
        100
      : 0;

  /* =====================================================
     GRÁFICA POR CAJA
  ===================================================== */

  const datosPorCaja =
    useMemo<
      DatoGraficaCaja[]
    >(() => {
      const mapa =
        new Map<
          string,
          DatoGraficaCaja
        >();

      cierresFiltrados.forEach(
        (cierre) => {
          const nombreCaja =
            obtenerNombreCaja(
              cierre
            );

          const actual =
            mapa.get(
              nombreCaja
            ) ?? {
              nombreCaja,
              totalVentas: 0,
              totalEgresos: 0,
              diferencia: 0,
            };

          actual.totalVentas +=
            convertirNumero(
              cierre.totalVentas
            );

          actual.totalEgresos +=
            convertirNumero(
              cierre.totalEgresos
            );

          actual.diferencia +=
            convertirNumero(
              cierre.diferencia
            );

          mapa.set(
            nombreCaja,
            actual
          );
        }
      );

      return Array.from(
        mapa.values()
      ).sort(
        (a, b) =>
          b.totalVentas -
          a.totalVentas
      );
    }, [
      cierresFiltrados,
    ]);

  const datosEstado =
    useMemo<
      DatoEstado[]
    >(
      () => [
        {
          nombre:
            "Cuadrados",
          cantidad:
            cuadrados,
          color:
            "#10b981",
        },

        {
          nombre:
            "Sobrantes",
          cantidad:
            sobrantes,
          color:
            "#2563eb",
        },

        {
          nombre:
            "Faltantes",
          cantidad:
            faltantes,
          color:
            "#ef4444",
        },
      ],
      [
        cuadrados,
        sobrantes,
        faltantes,
      ]
    );

  const cierreMayorDiferencia =
    [...cierresFiltrados].sort(
      (a, b) =>
        Math.abs(
          convertirNumero(
            b.diferencia
          )
        ) -
        Math.abs(
          convertirNumero(
            a.diferencia
          )
        )
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
      cierresFiltrados.length ===
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
      documento.internal.pageSize.getWidth();

    const altoPagina =
      documento.internal.pageSize.getHeight();

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
      "REPORTE DE CIERRES DE CAJA",
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
      "Control de ventas, egresos y diferencias de caja",
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
      "Resumen de cierres",
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
            "Cierres",
            "Ventas",
            "Egresos",
            "Esperado",
            "Monto real",
            "Diferencia",
            "Cuadrados",
            "Faltantes",
          ],
        ],

        body: [
          [
            mostrarNumero(
              cantidadCierres
            ),

            mostrarMoneda(
              totalVentas
            ),

            mostrarMoneda(
              totalEgresos
            ),

            mostrarMoneda(
              totalEsperado
            ),

            mostrarMoneda(
              montoReal
            ),

            mostrarMoneda(
              diferenciaTotal
            ),

            mostrarNumero(
              cuadrados
            ),

            mostrarNumero(
              faltantes
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
      ).lastAutoTable
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
      "Detalle de cierres",
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
            "Fecha cierre",
            "Caja",
            "Responsable",
            "Monto inicial",
            "Ventas",
            "Egresos",
            "Esperado",
            "Monto real",
            "Diferencia",
            "Estado",
          ],
        ],

        body:
          cierresFiltrados.map(
            (cierre) => [
              formatearFechaHora(
                cierre.fechaCierre
              ),

              obtenerNombreCaja(
                cierre
              ),

              obtenerNombrePerfil(
                cierre
              ),

              mostrarMoneda(
                cierre.montoInicial
              ),

              mostrarMoneda(
                cierre.totalVentas
              ),

              mostrarMoneda(
                cierre.totalEgresos
              ),

              mostrarMoneda(
                cierre.totalEsperado
              ),

              mostrarMoneda(
                cierre.montoReal
              ),

              mostrarMoneda(
                cierre.diferencia
              ),

              normalizarEstado(
                cierre.estado
              ),
            ]
          ),

        theme:
          "grid",

        styles: {
          font:
            "helvetica",
          fontSize:
            7.3,
          cellPadding:
            2.4,
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
          overflow:
            "linebreak",
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

        columnStyles: {
          0: {
            cellWidth:
              29,
          },
          1: {
            cellWidth:
              30,
          },
          2: {
            cellWidth:
              38,
          },
          3: {
            halign:
              "right",
          },
          4: {
            halign:
              "right",
          },
          5: {
            halign:
              "right",
          },
          6: {
            halign:
              "right",
          },
          7: {
            halign:
              "right",
          },
          8: {
            halign:
              "right",
          },
          9: {
            halign:
              "center",
          },
        },

        didParseCell: (
          hookData
        ) => {
          if (
            hookData.section !==
            "body"
          ) {
            return;
          }

          if (
            hookData.column.index ===
            8
          ) {
            const valor =
              convertirNumero(
                String(
                  hookData.cell.raw
                )
                  .replace(
                    /[^\d,.-]/g,
                    ""
                  )
                  .replace(
                    ",",
                    "."
                  )
              );

            hookData.cell.styles.fontStyle =
              "bold";

            if (valor < 0) {
              hookData.cell.styles.textColor = [
                185,
                28,
                28,
              ];
            }

            if (valor > 0) {
              hookData.cell.styles.textColor = [
                37,
                99,
                235,
              ];
            }
          }
        },
      }
    );

    const totalPaginas =
      documento.getNumberOfPages();

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
        `cierres_caja_${sucursalId}_${fechaDesde || "inicio"}_${fechaHasta || "actual"}`
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
              No se encontró el ID de la sucursal en la ruta.
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
          <ReporteCierresCajaSkeleton />
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
                  No se pudieron cargar los cierres de caja
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
                <WalletCards
                  size={24}
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Cierres de caja
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Control de ventas, egresos, montos reales y diferencias de caja.
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
                  cierresFiltrados.length ===
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
                  cierresFiltrados.length ===
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
                  Filtros de cierres
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Filtra por fechas, estado, caja o responsable.
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
                      event.target.value as EstadoFiltro
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
                >
                  <option value="">
                    Todos
                  </option>

                  <option value="cuadrado">
                    Cuadrados
                  </option>

                  <option value="sobrante">
                    Sobrantes
                  </option>

                  <option value="faltante">
                    Faltantes
                  </option>

                  <option value="cerrado">
                    Cerrados
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Buscar
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
                    placeholder="Caja, usuario o estado..."
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
                    cierresFiltrados.length
                  )}
                </strong>{" "}
                cierres.
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

          {/* INDICADORES */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TarjetaIndicador
              titulo="Total de ventas"
              valor={mostrarMoneda(
                totalVentas
              )}
              descripcion="Ventas acumuladas en los cierres mostrados."
              icono={CircleDollarSign}
              variante="positivo"
            />

            <TarjetaIndicador
              titulo="Total de egresos"
              valor={mostrarMoneda(
                totalEgresos
              )}
              descripcion="Egresos registrados durante los turnos."
              icono={Banknote}
              variante="negativo"
            />

            <TarjetaIndicador
              titulo="Diferencia acumulada"
              valor={mostrarMoneda(
                diferenciaTotal
              )}
              descripcion={
                diferenciaTotal >=
                0
                  ? "Resultado acumulado favorable."
                  : "Existe un faltante acumulado."
              }
              icono={
                diferenciaTotal >=
                0
                  ? TrendingUp
                  : TrendingDown
              }
              variante={
                diferenciaTotal > 0
                  ? "informativo"
                  : diferenciaTotal < 0
                    ? "advertencia"
                    : "normal"
              }
            />

            <TarjetaIndicador
              titulo="Cierres cuadrados"
              valor={`${mostrarNumero(
                cuadrados
              )} / ${mostrarNumero(
                cantidadCierres
              )}`}
              descripcion={`${porcentajeCuadrados.toFixed(
                2
              )}% de los cierres no presenta diferencia.`}
              icono={CheckCircle2}
              variante="principal"
            />
          </div>

          {/* ALERTA DESTACADA */}

          {cierreMayorDiferencia && (
            <article
              className={`
                rounded-2xl border p-5 shadow-sm
                ${
                  convertirNumero(
                    cierreMayorDiferencia.diferencia
                  ) < 0
                    ? "border-red-200 bg-red-50"
                    : "border-blue-200 bg-blue-50"
                }
              `}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                    Cierre con mayor diferencia
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    {obtenerNombreCaja(
                      cierreMayorDiferencia
                    )}
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Responsable:{" "}
                    {obtenerNombrePerfil(
                      cierreMayorDiferencia
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
                  <p className="text-xs text-gray-500">
                    Diferencia
                  </p>

                  <p
                    className={`
                      mt-1 text-xl font-bold
                      ${
                        convertirNumero(
                          cierreMayorDiferencia.diferencia
                        ) >= 0
                          ? "text-blue-700"
                          : "text-red-700"
                      }
                    `}
                  >
                    {mostrarMoneda(
                      cierreMayorDiferencia.diferencia
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
                Ventas y egresos por caja
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Comparación financiera acumulada por caja.
              </p>

              {datosPorCaja.length >
              0 ? (
                <div className="mt-5 h-[380px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={
                        datosPorCaja
                      }
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={
                          false
                        }
                      />

                      <XAxis
                        dataKey="nombreCaja"
                        tickLine={
                          false
                        }
                        axisLine={
                          false
                        }
                      />

                      <YAxis
                        tickLine={
                          false
                        }
                        axisLine={
                          false
                        }
                        width={85}
                        tickFormatter={(
                          valor
                        ) =>
                          `Bs ${formatoNumero.format(
                            convertirNumero(
                              valor
                            )
                          )}`
                        }
                      />

                      <Tooltip
                        content={
                          <TooltipCaja />
                        }
                      />

                      <Legend />

                      <Bar
                        dataKey="totalVentas"
                        name="Ventas"
                        fill="#10b981"
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                      />

                      <Bar
                        dataKey="totalEgresos"
                        name="Egresos"
                        fill="#ef4444"
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-5 flex h-[350px] items-center justify-center text-gray-500">
                  Sin información para graficar
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Estado de los cierres
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Distribución entre cierres cuadrados, sobrantes y faltantes.
              </p>

              {cantidadCierres >
              0 ? (
                <div className="relative mt-4 h-[350px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={
                          datosEstado
                        }
                        dataKey="cantidad"
                        nameKey="nombre"
                        innerRadius={65}
                        outerRadius={103}
                        paddingAngle={4}
                      >
                        {datosEstado.map(
                          (
                            item
                          ) => (
                            <Cell
                              key={
                                item.nombre
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
                        {cantidadCierres}
                      </p>

                      <p className="text-xs text-gray-500">
                        Cierres
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex h-[350px] items-center justify-center text-gray-500">
                  Sin cierres registrados
                </div>
              )}
            </article>
          </div>

          {/* TABLA */}

          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <FileBarChart
                    size={20}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Detalle de cierres
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Registro de montos esperados, reales y diferencias.
                  </p>
                </div>
              </div>
            </div>

            {cierresFiltrados.length >
            0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1450px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase text-gray-500">
                        Fecha
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase text-gray-500">
                        Caja
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase text-gray-500">
                        Responsable
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase text-gray-500">
                        Monto inicial
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase text-gray-500">
                        Ventas
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase text-gray-500">
                        Egresos
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase text-gray-500">
                        Esperado
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase text-gray-500">
                        Real
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase text-gray-500">
                        Diferencia
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase text-gray-500">
                        Estado
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {cierresFiltrados.map(
                      (
                        cierre
                      ) => (
                        <tr
                          key={
                            cierre._id
                          }
                          className="hover:bg-gray-50"
                        >
                          <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                            {formatearFechaHora(
                              cierre.fechaCierre
                            )}
                          </td>

                          <td className="px-5 py-4 font-semibold text-gray-900">
                            {obtenerNombreCaja(
                              cierre
                            )}
                          </td>

                          <td className="px-5 py-4 text-gray-700">
                            {obtenerNombrePerfil(
                              cierre
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            {mostrarMoneda(
                              cierre.montoInicial
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-bold text-emerald-700">
                            {mostrarMoneda(
                              cierre.totalVentas
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-bold text-red-700">
                            {mostrarMoneda(
                              cierre.totalEgresos
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-semibold">
                            {mostrarMoneda(
                              cierre.totalEsperado
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-semibold">
                            {mostrarMoneda(
                              cierre.montoReal
                            )}
                          </td>

                          <td
                            className={`
                              px-5 py-4 text-right font-bold
                              ${
                                convertirNumero(
                                  cierre.diferencia
                                ) > 0
                                  ? "text-blue-700"
                                  : convertirNumero(
                                        cierre.diferencia
                                      ) < 0
                                    ? "text-red-700"
                                    : "text-emerald-700"
                              }
                            `}
                          >
                            {mostrarMoneda(
                              cierre.diferencia
                            )}
                          </td>

                          <td className="px-5 py-4 text-center">
                            <EstadoCierreBadge
                              estado={
                                cierre.estado
                              }
                              diferencia={
                                cierre.diferencia
                              }
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>

                  <tfoot className="bg-gray-900 text-white">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-5 py-4 font-bold"
                      >
                        Totales
                      </td>

                      <td className="px-5 py-4 text-right">
                        -
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-emerald-400">
                        {mostrarMoneda(
                          totalVentas
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-red-400">
                        {mostrarMoneda(
                          totalEgresos
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold">
                        {mostrarMoneda(
                          totalEsperado
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold">
                        {mostrarMoneda(
                          montoReal
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-amber-300">
                        {mostrarMoneda(
                          diferenciaTotal
                        )}
                      </td>

                      <td className="px-5 py-4 text-center font-bold">
                        {cantidadCierres} cierres
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <WalletCards
                  size={44}
                  className="text-gray-300"
                />

                <p className="mt-4 font-semibold text-gray-600">
                  No se encontraron cierres
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

              Actualizando cierres...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
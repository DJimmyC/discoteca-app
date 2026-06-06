// src/views/movimiento/MovimientoDetailView.tsx

import {
  useMemo,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowLeft,
  ArrowUpCircle,
  Banknote,
  Box,
  Boxes,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileText,
  Hash,
  Landmark,
  Package,
  RefreshCcw,
  ShieldCheck,
  Store,
  Tag,
  UserRound,
  Warehouse,
} from "lucide-react";

import MenuList from "@/components/MenuList";

import {
  getMovimientoById,
} from "@/api/MovimientoApi";

import type {
  MovimientoType,
} from "@/types/MovimientoType";

/* =====================================================
    HELPERS
===================================================== */

function obtenerTextoRelacion(
  relacion: unknown,
  campos: string[],
  defecto = "-"
): string {

  if (
    typeof relacion === "string"
  ) {
    return relacion;
  }

  if (
    typeof relacion !== "object" ||
    relacion === null
  ) {
    return defecto;
  }

  const objeto =
    relacion as Record<
      string,
      unknown
    >;

  for (
    const campo
    of campos
  ) {

    const valor =
      objeto[campo];

    if (
      typeof valor === "string" &&
      valor.trim()
    ) {
      return valor;
    }
  }

  if (
    typeof objeto._id === "string"
  ) {
    return objeto._id;
  }

  return defecto;
}

function obtenerIdRelacion(
  relacion: unknown
): string {

  if (
    typeof relacion === "string"
  ) {
    return relacion;
  }

  if (
    typeof relacion === "object" &&
    relacion !== null &&
    "_id" in relacion
  ) {

    const id =
      (
        relacion as {
          _id?: unknown;
        }
      )._id;

    if (
      typeof id === "string"
    ) {
      return id;
    }
  }

  return "-";
}

function obtenerNombrePerfil(
  relacion: unknown
): string {

  if (
    typeof relacion === "string"
  ) {
    return relacion;
  }

  if (
    typeof relacion !== "object" ||
    relacion === null
  ) {
    return "-";
  }

  const perfil =
    relacion as Record<
      string,
      unknown
    >;

  const nombres =
    typeof perfil.nombres === "string"
      ? perfil.nombres
      : "";

  const apellidos =
    typeof perfil.apellidos === "string"
      ? perfil.apellidos
      : "";

  const nombreCompleto =
    `${nombres} ${apellidos}`
      .trim();

  if (nombreCompleto) {
    return nombreCompleto;
  }

  if (
    typeof perfil.email === "string"
  ) {
    return perfil.email;
  }

  return obtenerIdRelacion(
    relacion
  );
}

function numero(
  valor: unknown
): number {

  const resultado =
    Number(valor);

  return Number.isFinite(
    resultado
  )
    ? resultado
    : 0;
}

function dinero(
  valor: unknown
): string {

  return new Intl.NumberFormat(
    "es-BO",
    {
      style: "currency",
      currency: "BOB",
      minimumFractionDigits: 2,
    }
  ).format(
    numero(valor)
  );
}

function fechaHora(
  fecha?: string | null
): string {

  if (!fecha) {
    return "-";
  }

  const valor =
    new Date(fecha);

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
      dateStyle: "full",
      timeStyle: "medium",
    }
  );
}

function etiqueta(
  valor?: string | null
): string {

  if (!valor) {
    return "-";
  }

  return valor
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (
        letra
      ) =>
        letra.toUpperCase()
    );
}

function claseTipo(
  tipo?: string
): string {

  if (
    [
      "venta",
      "entrada_inventario",
      "apertura_caja",
      "solicitud_aprobada",
    ].includes(
      tipo || ""
    )
  ) {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }

  if (
    [
      "egreso",
      "salida_inventario",
      "venta_anulada",
      "solicitud_rechazada",
      "solicitud_anulada",
    ].includes(
      tipo || ""
    )
  ) {
    return "bg-rose-100 text-rose-700 border-rose-200";
  }

  if (
    [
      "transferencia_inventario",
      "solicitud",
      "cierre_caja",
    ].includes(
      tipo || ""
    )
  ) {
    return "bg-sky-100 text-sky-700 border-sky-200";
  }

  if (
    [
      "cortesia",
      "ajuste_inventario",
      "diferencia_caja",
      "diferencia_inventario",
    ].includes(
      tipo || ""
    )
  ) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function claseEstado(
  estado?: string | null
): string {

  const valor =
    estado?.toLowerCase() ||
    "";

  if (
    [
      "activo",
      "pagado",
      "aprobada",
      "atendida",
      "cerrado",
      "cuadrado",
    ].includes(valor)
  ) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (
    [
      "anulado",
      "rechazada",
      "eliminado",
      "faltante",
    ].includes(valor)
  ) {
    return "bg-rose-100 text-rose-700";
  }

  if (
    [
      "pendiente",
      "parcialmente_atendida",
      "sobrante",
    ].includes(valor)
  ) {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

function obtenerMontoPrincipal(
  movimiento:
    MovimientoType
): number {

  const candidatos = [
    movimiento.total,
    movimiento.subtotal,
    movimiento.montoEntrada,
    movimiento.montoSalida,
    movimiento.montoInicial,
    movimiento.montoReal,
    movimiento.montoFisico,
  ];

  for (
    const valor
    of candidatos
  ) {

    const convertido =
      numero(valor);

    if (
      convertido !== 0
    ) {
      return convertido;
    }
  }

  return 0;
}

function obtenerCantidadPrincipal(
  movimiento:
    MovimientoType
): number {

  const entrada =
    numero(
      movimiento.cantidadEntrada
    );

  if (
    entrada !== 0
  ) {
    return entrada;
  }

  const salida =
    numero(
      movimiento.cantidadSalida
    );

  if (
    salida !== 0
  ) {
    return salida;
  }

  return numero(
    movimiento.cantidad
  );
}

/* =====================================================
    SUBCOMPONENTES
===================================================== */

type DatoProps = {

  icono:
    React.ReactNode;

  titulo:
    string;

  valor:
    React.ReactNode;

  descripcion?:
    React.ReactNode;

};

function Dato({
  icono,
  titulo,
  valor,
  descripcion,
}: DatoProps) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-start gap-3">

        <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600">

          {
            icono
          }

        </div>

        <div className="min-w-0 flex-1">

          <p className="text-xs font-black uppercase tracking-wider text-slate-400">

            {
              titulo
            }

          </p>

          <div className="mt-1 break-words font-bold text-slate-800">

            {
              valor
            }

          </div>

          {
            descripcion && (

              <div className="mt-1 break-words text-xs text-slate-500">

                {
                  descripcion
                }

              </div>
            )
          }

        </div>

      </div>

    </div>
  );
}

type MetricaProps = {

  titulo:
    string;

  valor:
    string | number;

  icono:
    React.ReactNode;

  clase:
    string;

};

function Metrica({
  titulo,
  valor,
  icono,
  clase,
}: MetricaProps) {

  return (

    <article className={`rounded-3xl border p-5 shadow-sm ${clase}`}>

      <div className="flex items-center justify-between gap-4">

        <div>

          <p className="text-xs font-black uppercase tracking-widest opacity-70">

            {
              titulo
            }

          </p>

          <p className="mt-2 text-2xl font-black">

            {
              valor
            }

          </p>

        </div>

        <div className="rounded-2xl bg-white/70 p-3">

          {
            icono
          }

        </div>

      </div>

    </article>
  );
}

/* =====================================================
    VISTA
===================================================== */

export default function MovimientoDetailView() {

  const {
    movimientoId,
    sucursalId,
  } = useParams();

  const {
    data:
      movimiento,

    isLoading,

    isFetching,

    isError,

    error,

    refetch,
  } = useQuery({

    queryKey: [
      "movimiento",
      movimientoId,
    ],

    queryFn: () =>
      getMovimientoById(
        movimientoId!
      ),

    enabled:
      !!movimientoId,

  });

  const volverA =
    sucursalId
      ? `/sucursal/${sucursalId}/movimientos`
      : "/movimientos";

  const resumen =
    useMemo(() => {

      if (!movimiento) {

        return {
          montoPrincipal:
            0,
          cantidadPrincipal:
            0,
          esEntrada:
            false,
          esSalida:
            false,
        };
      }

      return {

        montoPrincipal:
          obtenerMontoPrincipal(
            movimiento
          ),

        cantidadPrincipal:
          obtenerCantidadPrincipal(
            movimiento
          ),

        esEntrada:
          numero(
            movimiento.montoEntrada
          ) > 0 ||
          numero(
            movimiento.cantidadEntrada
          ) > 0,

        esSalida:
          numero(
            movimiento.montoSalida
          ) > 0 ||
          numero(
            movimiento.cantidadSalida
          ) > 0,

      };

    }, [
      movimiento,
    ]);

  if (isLoading) {

    return (

      <div className="flex min-h-screen bg-slate-50">

        <MenuList />

        <main className="flex flex-1 items-center justify-center p-6">

          <div className="text-center">

            <RefreshCcw className="mx-auto h-10 w-10 animate-spin text-fuchsia-600" />

            <p className="mt-4 font-bold text-slate-600">

              Cargando detalle del movimiento...

            </p>

          </div>

        </main>

      </div>
    );
  }

  if (
    isError ||
    !movimiento
  ) {

    return (

      <div className="flex min-h-screen bg-slate-50">

        <MenuList />

        <main className="flex flex-1 items-center justify-center p-6">

          <div className="w-full max-w-xl rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-100 text-rose-600">

              <AlertTriangle className="h-8 w-8" />

            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-800">

              No se pudo cargar el movimiento

            </h1>

            <p className="mt-2 text-sm text-slate-500">

              {
                error instanceof Error
                  ? error.message
                  : "El movimiento no existe o no está disponible."
              }

            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() =>
                  refetch()
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-fuchsia-600 px-5 py-3 font-bold text-white transition hover:bg-fuchsia-700"
              >

                <RefreshCcw className="h-4 w-4" />

                Reintentar

              </button>

              <Link
                to={
                  volverA
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
              >

                <ArrowLeft className="h-4 w-4" />

                Volver

              </Link>

            </div>

          </div>

        </main>

      </div>
    );
  }

  return (

    <div className="flex min-h-screen bg-slate-50">

      {/* MENÚ LATERAL */}
      <MenuList />

      {/* CONTENIDO */}
      <main className="min-w-0 flex-1 p-4 md:p-8">

        <div className="mx-auto max-w-[1500px]">

          {/* ENCABEZADO */}
          <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-fuchsia-950 p-6 text-white shadow-xl md:p-8">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

              <div className="min-w-0">

                <div className="mb-3 flex flex-wrap items-center gap-2">

                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${
                    claseTipo(
                      movimiento.tipoMovimiento
                    )
                  }`}>

                    {
                      etiqueta(
                        movimiento.tipoMovimiento
                      )
                    }

                  </span>

                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                    claseEstado(
                      movimiento.estado
                    )
                  }`}>

                    {
                      etiqueta(
                        movimiento.estado
                      )
                    }

                  </span>

                </div>

                <h1 className="break-words text-3xl font-black md:text-4xl">

                  Detalle del movimiento

                </h1>

                <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-300">

                  <span className="inline-flex items-center gap-2">

                    <Hash className="h-4 w-4" />

                    {
                      movimiento._id ||
                      "-"
                    }

                  </span>

                  <span className="inline-flex items-center gap-2">

                    <Clock3 className="h-4 w-4" />

                    {
                      fechaHora(
                        movimiento.fecha
                      )
                    }

                  </span>

                </p>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={() =>
                    refetch()
                  }
                  disabled={
                    isFetching
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-60"
                >

                  <RefreshCcw className={`h-4 w-4 ${
                    isFetching
                      ? "animate-spin"
                      : ""
                  }`} />

                  Actualizar

                </button>

                <Link
                  to={
                    volverA
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
                >

                  <ArrowLeft className="h-4 w-4" />

                  Volver

                </Link>

              </div>

            </div>

          </section>

          {/* MÉTRICAS PRINCIPALES */}
          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <Metrica
              titulo="Monto principal"
              valor={
                dinero(
                  resumen.montoPrincipal
                )
              }
              icono={
                <CircleDollarSign className="h-6 w-6" />
              }
              clase="border-fuchsia-100 bg-fuchsia-50 text-fuchsia-800"
            />

            <Metrica
              titulo="Cantidad"
              valor={
                resumen.cantidadPrincipal
              }
              icono={
                <Boxes className="h-6 w-6" />
              }
              clase="border-sky-100 bg-sky-50 text-sky-800"
            />

            <Metrica
              titulo="Entrada"
              valor={
                resumen.esEntrada
                  ? "Sí"
                  : "No"
              }
              icono={
                <ArrowDownCircle className="h-6 w-6" />
              }
              clase="border-emerald-100 bg-emerald-50 text-emerald-800"
            />

            <Metrica
              titulo="Salida"
              valor={
                resumen.esSalida
                  ? "Sí"
                  : "No"
              }
              icono={
                <ArrowUpCircle className="h-6 w-6" />
              }
              clase="border-rose-100 bg-rose-50 text-rose-800"
            />

          </section>

          {/* DATOS GENERALES */}
          <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

            <div className="mb-5">

              <h2 className="text-xl font-black text-slate-800">

                Información general

              </h2>

              <p className="mt-1 text-sm text-slate-500">

                Identificación, clasificación y auditoría del movimiento.

              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              <Dato
                icono={
                  <Tag className="h-5 w-5" />
                }
                titulo="Tipo"
                valor={
                  etiqueta(
                    movimiento.tipoMovimiento
                  )
                }
              />

              <Dato
                icono={
                  <ShieldCheck className="h-5 w-5" />
                }
                titulo="Módulo"
                valor={
                  etiqueta(
                    movimiento.modulo
                  )
                }
              />

              <Dato
                icono={
                  <FileText className="h-5 w-5" />
                }
                titulo="Origen"
                valor={
                  etiqueta(
                    movimiento.origenMovimiento
                  )
                }
              />

              <Dato
                icono={
                  <CreditCard className="h-5 w-5" />
                }
                titulo="Método de pago"
                valor={
                  etiqueta(
                    movimiento.metodoPago
                  )
                }
              />

              <Dato
                icono={
                  <CalendarDays className="h-5 w-5" />
                }
                titulo="Fecha del movimiento"
                valor={
                  fechaHora(
                    movimiento.fecha
                  )
                }
              />

              <Dato
                icono={
                  <CalendarDays className="h-5 w-5" />
                }
                titulo="Fecha de creación"
                valor={
                  fechaHora(
                    movimiento.fechaCreacion
                  )
                }
              />

              <Dato
                icono={
                  <UserRound className="h-5 w-5" />
                }
                titulo="Creado por"
                valor={
                  movimiento.creadoPor ||
                  "sistema"
                }
              />

              <Dato
                icono={
                  <CheckCircle2 className="h-5 w-5" />
                }
                titulo="Estado"
                valor={
                  etiqueta(
                    movimiento.estado
                  )
                }
              />

            </div>

          </section>

          {/* RELACIONES */}
          <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

            <div className="mb-5">

              <h2 className="text-xl font-black text-slate-800">

                Relaciones del movimiento

              </h2>

              <p className="mt-1 text-sm text-slate-500">

                Sucursal, caja, responsable, almacenes y producto relacionados.

              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              <Dato
                icono={
                  <Store className="h-5 w-5" />
                }
                titulo="Sucursal"
                valor={
                  obtenerTextoRelacion(
                    movimiento.idSucursal,
                    [
                      "nombreSucursal",
                      "nombre",
                    ]
                  )
                }
                descripcion={
                  obtenerIdRelacion(
                    movimiento.idSucursal
                  )
                }
              />

              <Dato
                icono={
                  <Landmark className="h-5 w-5" />
                }
                titulo="Caja"
                valor={
                  obtenerTextoRelacion(
                    movimiento.idCaja,
                    [
                      "nombre",
                      "descripcion",
                    ],
                    "Sin caja"
                  )
                }
                descripcion={
                  obtenerIdRelacion(
                    movimiento.idCaja
                  )
                }
              />

              <Dato
                icono={
                  <UserRound className="h-5 w-5" />
                }
                titulo="Perfil responsable"
                valor={
                  obtenerNombrePerfil(
                    movimiento.idPerfil
                  )
                }
                descripcion={
                  obtenerIdRelacion(
                    movimiento.idPerfil
                  )
                }
              />

              <Dato
                icono={
                  <Warehouse className="h-5 w-5" />
                }
                titulo="Almacén"
                valor={
                  obtenerTextoRelacion(
                    movimiento.idAlmacen,
                    [
                      "nombre",
                      "tipo",
                    ],
                    "Sin almacén"
                  )
                }
                descripcion={
                  obtenerIdRelacion(
                    movimiento.idAlmacen
                  )
                }
              />

              <Dato
                icono={
                  <ArrowUpCircle className="h-5 w-5" />
                }
                titulo="Almacén origen"
                valor={
                  obtenerTextoRelacion(
                    movimiento.idAlmacenOrigen,
                    [
                      "nombre",
                      "tipo",
                    ],
                    "Sin origen"
                  )
                }
                descripcion={
                  obtenerIdRelacion(
                    movimiento.idAlmacenOrigen
                  )
                }
              />

              <Dato
                icono={
                  <ArrowDownCircle className="h-5 w-5" />
                }
                titulo="Almacén destino"
                valor={
                  obtenerTextoRelacion(
                    movimiento.idAlmacenDestino,
                    [
                      "nombre",
                      "tipo",
                    ],
                    "Sin destino"
                  )
                }
                descripcion={
                  obtenerIdRelacion(
                    movimiento.idAlmacenDestino
                  )
                }
              />

              <Dato
                icono={
                  <Package className="h-5 w-5" />
                }
                titulo="Producto"
                valor={
                  obtenerTextoRelacion(
                    movimiento.idProducto,
                    [
                      "nombre",
                      "marca",
                    ],
                    "Sin producto"
                  )
                }
                descripcion={
                  obtenerIdRelacion(
                    movimiento.idProducto
                  )
                }
              />

              <Dato
                icono={
                  <Box className="h-5 w-5" />
                }
                titulo="Inventario"
                valor={
                  obtenerIdRelacion(
                    movimiento.idInventario
                  )
                }
              />

              <Dato
                icono={
                  <FileText className="h-5 w-5" />
                }
                titulo="Referencia"
                valor={
                  movimiento.referenciaModelo ||
                  "Sin referencia"
                }
                descripcion={
                  movimiento.referenciaId ||
                  "-"
                }
              />

            </div>

          </section>

          {/* CANTIDADES Y COSTOS */}
          <section className="mb-6 grid gap-6 xl:grid-cols-2">

            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              <div className="mb-5">

                <h2 className="text-xl font-black text-slate-800">

                  Cantidades

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  Entradas, salidas, conteos y diferencias físicas.

                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <Dato
                  icono={
                    <Boxes className="h-5 w-5" />
                  }
                  titulo="Cantidad"
                  valor={
                    numero(
                      movimiento.cantidad
                    )
                  }
                />

                <Dato
                  icono={
                    <ArrowDownCircle className="h-5 w-5" />
                  }
                  titulo="Cantidad entrada"
                  valor={
                    numero(
                      movimiento.cantidadEntrada
                    )
                  }
                />

                <Dato
                  icono={
                    <ArrowUpCircle className="h-5 w-5" />
                  }
                  titulo="Cantidad salida"
                  valor={
                    numero(
                      movimiento.cantidadSalida
                    )
                  }
                />

                <Dato
                  icono={
                    <Boxes className="h-5 w-5" />
                  }
                  titulo="Cantidad inicial"
                  valor={
                    numero(
                      movimiento.cantidadInicial
                    )
                  }
                />

                <Dato
                  icono={
                    <Boxes className="h-5 w-5" />
                  }
                  titulo="Cantidad esperada"
                  valor={
                    numero(
                      movimiento.cantidadEsperada
                    )
                  }
                />

                <Dato
                  icono={
                    <Boxes className="h-5 w-5" />
                  }
                  titulo="Cantidad física"
                  valor={
                    numero(
                      movimiento.cantidadFisica
                    )
                  }
                />

                <Dato
                  icono={
                    <AlertTriangle className="h-5 w-5" />
                  }
                  titulo="Diferencia cantidad"
                  valor={
                    numero(
                      movimiento.diferenciaCantidad
                    )
                  }
                />

              </div>

            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              <div className="mb-5">

                <h2 className="text-xl font-black text-slate-800">

                  Importes y costos

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  Valores monetarios asociados al movimiento.

                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <Dato
                  icono={
                    <ArrowDownCircle className="h-5 w-5" />
                  }
                  titulo="Monto entrada"
                  valor={
                    dinero(
                      movimiento.montoEntrada
                    )
                  }
                />

                <Dato
                  icono={
                    <ArrowUpCircle className="h-5 w-5" />
                  }
                  titulo="Monto salida"
                  valor={
                    dinero(
                      movimiento.montoSalida
                    )
                  }
                />

                <Dato
                  icono={
                    <Banknote className="h-5 w-5" />
                  }
                  titulo="Monto inicial"
                  valor={
                    dinero(
                      movimiento.montoInicial
                    )
                  }
                />

                <Dato
                  icono={
                    <Banknote className="h-5 w-5" />
                  }
                  titulo="Monto esperado"
                  valor={
                    dinero(
                      movimiento.montoEsperado
                    )
                  }
                />

                <Dato
                  icono={
                    <Banknote className="h-5 w-5" />
                  }
                  titulo="Monto real"
                  valor={
                    dinero(
                      movimiento.montoReal
                    )
                  }
                />

                <Dato
                  icono={
                    <Banknote className="h-5 w-5" />
                  }
                  titulo="Monto físico"
                  valor={
                    dinero(
                      movimiento.montoFisico
                    )
                  }
                />

                <Dato
                  icono={
                    <AlertTriangle className="h-5 w-5" />
                  }
                  titulo="Diferencia monto"
                  valor={
                    dinero(
                      movimiento.diferenciaMonto
                    )
                  }
                />

                <Dato
                  icono={
                    <CircleDollarSign className="h-5 w-5" />
                  }
                  titulo="Costo unitario"
                  valor={
                    dinero(
                      movimiento.costoUnitario
                    )
                  }
                />

                <Dato
                  icono={
                    <CircleDollarSign className="h-5 w-5" />
                  }
                  titulo="Precio unitario"
                  valor={
                    dinero(
                      movimiento.precioUnitario
                    )
                  }
                />

                <Dato
                  icono={
                    <CircleDollarSign className="h-5 w-5" />
                  }
                  titulo="Subtotal"
                  valor={
                    dinero(
                      movimiento.subtotal
                    )
                  }
                />

                <Dato
                  icono={
                    <CircleDollarSign className="h-5 w-5" />
                  }
                  titulo="Descuento"
                  valor={
                    dinero(
                      movimiento.descuento
                    )
                  }
                />

                <Dato
                  icono={
                    <CircleDollarSign className="h-5 w-5" />
                  }
                  titulo="Total"
                  valor={
                    dinero(
                      movimiento.total
                    )
                  }
                />

              </div>

            </article>

          </section>

          {/* REFERENCIAS DEL SISTEMA */}
          <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

            <div className="mb-5">

              <h2 className="text-xl font-black text-slate-800">

                Referencias relacionadas

              </h2>

              <p className="mt-1 text-sm text-slate-500">

                Identificadores de los módulos que originaron el movimiento.

              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              <Dato
                icono={
                  <Hash className="h-5 w-5" />
                }
                titulo="ID venta"
                valor={
                  movimiento.idVenta ||
                  "-"
                }
              />

              <Dato
                icono={
                  <Hash className="h-5 w-5" />
                }
                titulo="ID comanda"
                valor={
                  movimiento.idComanda ||
                  "-"
                }
              />

              <Dato
                icono={
                  <Hash className="h-5 w-5" />
                }
                titulo="ID egreso"
                valor={
                  movimiento.idEgreso ||
                  "-"
                }
              />

              <Dato
                icono={
                  <Hash className="h-5 w-5" />
                }
                titulo="ID solicitud"
                valor={
                  movimiento.idSolicitud ||
                  "-"
                }
              />

              <Dato
                icono={
                  <Hash className="h-5 w-5" />
                }
                titulo="ID apertura de caja"
                valor={
                  movimiento.idAperturaCaja ||
                  "-"
                }
              />

              <Dato
                icono={
                  <Hash className="h-5 w-5" />
                }
                titulo="ID cierre de caja"
                valor={
                  movimiento.idCierreCaja ||
                  "-"
                }
              />

            </div>

          </section>

          {/* OBSERVACIÓN */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

            <div className="flex items-start gap-4">

              <div className="rounded-2xl bg-fuchsia-100 p-3 text-fuchsia-700">

                <FileText className="h-6 w-6" />

              </div>

              <div className="min-w-0 flex-1">

                <h2 className="text-xl font-black text-slate-800">

                  Observación

                </h2>

                <p className="mt-3 whitespace-pre-wrap break-words rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">

                  {
                    movimiento.observacion ||
                    "Este movimiento no tiene una observación registrada."
                  }

                </p>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

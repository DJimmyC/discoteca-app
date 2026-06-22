import {
  Calendar,
  ClipboardList,
  MapPin,
  PackageSearch,
  User,
  Warehouse,
  X,
} from "lucide-react";

import type {
  SolicitudPorSucursalType,
} from "@/types/SolicitudType";

type Props = {
  solicitud: SolicitudPorSucursalType | null;
  open: boolean;
  onClose: () => void;
};

function formatearFecha(fecha?: string | null): string {
  if (!fecha) return "Sin fecha";

  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return "Fecha inválida";
  }

  return valor.toLocaleString("es-BO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getEstadoTexto(estado?: string | null): string {
  const estados: Record<string, string> = {
    pendiente: "Pendiente",
    en_revision: "En revisión",
    aprobada: "Aprobada",
    rechazada: "Rechazada",
    en_proceso: "En proceso",
    en_transito: "En tránsito",
    atendida: "Atendida",
    anulada: "Anulada",
  };

  return estados[estado ?? ""] ?? estado ?? "Pendiente";
}

function getEstadoClass(estado?: string | null): string {
  if (estado === "pendiente") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400";
  }

  if (
    estado === "en_revision" ||
    estado === "en_proceso" ||
    estado === "en_transito"
  ) {
    return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400";
  }

  if (
    estado === "aprobada" ||
    estado === "atendida"
  ) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400";
  }

  if (
    estado === "rechazada" ||
    estado === "anulada"
  ) {
    return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400";
  }

  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

function getTipoSolicitud(
  solicitud: SolicitudPorSucursalType
): "Transferencia" | "Solicitud" {
  return solicitud.almacenOrigen &&
    solicitud.almacenDestino
    ? "Transferencia"
    : "Solicitud";
}

function getTipoClass(tipo: string): string {
  return tipo === "Transferencia"
    ? "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
    : "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400";
}

function obtenerSolicitante(
  solicitud: SolicitudPorSucursalType
): string {
  const nombre = [
    solicitud.perfil?.nombres,
    solicitud.perfil?.apellidos,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return nombre ||
    solicitud.creadoPor ||
    "Sin usuario";
}

export default function SolicitudDetalleModal({
  solicitud,
  open,
  onClose,
}: Props) {
  if (!open || !solicitud) {
    return null;
  }

  const detalles = solicitud.detalles ?? [];
  const tipo = getTipoSolicitud(solicitud);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-3 py-6 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950">
              <ClipboardList size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Detalle de solicitud
              </p>

              <h2 className="mt-1 truncate text-xl font-bold text-slate-900 dark:text-white">
                {solicitud.almacenDestino?.nombre || "Sin destino"}
              </h2>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getTipoClass(tipo)}`}>
                  {tipo}
                </span>

                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getEstadoClass(solicitud.estado)}`}>
                  {getEstadoTexto(solicitud.estado)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto p-5">
          <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
            {/* INFORMACIÓN GENERAL */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Información general
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <User
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                  />

                  <div>
                    <p className="font-semibold text-slate-500 dark:text-slate-400">
                      Solicitado por
                    </p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                      {obtenerSolicitante(solicitud)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Warehouse
                    size={18}
                    className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
                  />

                  <div>
                    <p className="font-semibold text-slate-500 dark:text-slate-400">
                      Origen
                    </p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                      {solicitud.almacenOrigen?.nombre || "Compra externa"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                  />

                  <div>
                    <p className="font-semibold text-slate-500 dark:text-slate-400">
                      Destino
                    </p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                      {solicitud.almacenDestino?.nombre || "Sin destino"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Calendar
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                  />

                  <div>
                    <p className="font-semibold text-slate-500 dark:text-slate-400">
                      Fecha
                    </p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                      {formatearFecha(
                        solicitud.fechaCreacion ||
                          solicitud.fechaSolicitud
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <PackageSearch
                    size={18}
                    className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
                  />

                  <div>
                    <p className="font-semibold text-slate-500 dark:text-slate-400">
                      Total productos
                    </p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                      {solicitud.totalProductos ?? detalles.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Observación
                </p>

                <p className="mt-2 break-words text-sm text-slate-800 dark:text-slate-200">
                  {solicitud.observacion || "Sin observaciones"}
                </p>
              </div>
            </section>

            {/* DETALLES DE PRODUCTOS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Productos solicitados
              </h3>

              {detalles.length === 0 ? (
                <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Sin productos registrados.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        <th className="py-3 pr-4">Producto</th>
                        <th className="py-3 pr-4">Marca</th>
                        <th className="py-3 pr-4">Solicitada</th>
                        <th className="py-3 pr-4">Aprobada</th>
                        <th className="py-3 pr-4">Unidad</th>
                        <th className="py-3 pr-4">Observación</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {detalles.map((detalle, index) => (
                        <tr key={detalle._id ?? index}>
                          <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">
                            {detalle.producto?.nombre || "Producto sin nombre"}
                          </td>

                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                            {detalle.producto?.marca || "Sin marca"}
                          </td>

                          <td className="py-3 pr-4 font-semibold text-slate-700 dark:text-slate-200">
                            {detalle.cantidadSolicitada}
                          </td>

                          <td className="py-3 pr-4 font-semibold text-emerald-600 dark:text-emerald-400">
                            {detalle.cantidadAprobada ??
                              detalle.cantidadSolicitada}
                          </td>

                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                            {detalle.unidad || "unidades"}
                          </td>

                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                            {detalle.observacion || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
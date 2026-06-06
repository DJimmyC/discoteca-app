// src/views/cierreCaja/CreateCierreCajaView.tsx

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  motion,
} from "framer-motion";

import {
  ArrowLeft,
  Wallet,
} from "lucide-react";

import Swal from "sweetalert2";

import MenuList from "@/components/MenuList";
import CierreCajaForm from "@/components/cierrecaja/CierreCajaForm";

import {
  createCierreCaja,
} from "@/api/CierreCajaApi";

import {
  getAperturaActivaByCaja,
} from "@/api/AperturaCajaApi";

import type {
  CierreCajaForm as CierreCajaFormType,
} from "@/types/CierreCajaType";

import { useAuth } from "@/hooks/useAuth";

function obtenerFechaLocal(): string {

  const ahora =
    new Date();

  const compensacion =
    ahora.getTimezoneOffset() *
    60000;

  return new Date(
    ahora.getTime() -
    compensacion
  )
    .toISOString()
    .slice(0, 10);
}

function obtenerHoraLocal(): string {

  return new Date()
    .toTimeString()
    .slice(0, 5);
}

function fechaLocalDesdeIso(
  fechaIso: string
): string {

  const fecha =
    new Date(fechaIso);

  const compensacion =
    fecha.getTimezoneOffset() *
    60000;

  return new Date(
    fecha.getTime() -
    compensacion
  )
    .toISOString()
    .slice(0, 10);
}

export default function CreateCierreCajaView() {

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const {
    sucursalId,
    cajaId,
  } = useParams();

  const {
    data: perfil,
  } = useAuth();

  const {
    data: aperturaActiva,
    isLoading:
      cargandoApertura,
  } = useQuery({

    queryKey: [
      "apertura-activa",
      cajaId,
    ],

    queryFn: () =>
      getAperturaActivaByCaja(
        cajaId!
      ),

    enabled:
      Boolean(cajaId),

    retry:
      false,
  });

  const [
    formData,
    setFormData,
  ] = useState<CierreCajaFormType>({
    idPerfil: "",
    idCaja:
      cajaId || "",
    fecha:
      obtenerFechaLocal(),
    horaCierre:
      obtenerHoraLocal(),
    montoReal: 0,
    observacion: "",
    creadoPor: "",
  });

  useEffect(() => {

    if (!perfil?._id) {
      return;
    }

    setFormData(
      (actual) => ({
        ...actual,
        idPerfil:
          String(perfil._id),
        creadoPor:
          perfil.nombres ||
          "sistema",
      })
    );

  }, [
    perfil,
  ]);

  useEffect(() => {

    if (
      !aperturaActiva
        ?.fechaApertura
    ) {
      return;
    }

    /*
      Usamos como fecha de referencia
      el día en que comenzó la apertura.
      Si la hora de cierre es menor,
      el backend pasa al día siguiente.
    */
    setFormData(
      (actual) => ({
        ...actual,
        fecha:
          fechaLocalDesdeIso(
            aperturaActiva
              .fechaApertura
          ),
      })
    );

  }, [
    aperturaActiva,
  ]);

  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn:
      createCierreCaja,

    onSuccess:
      async (
        reporte
      ) => {

        await Promise.all([

          queryClient.invalidateQueries({
            queryKey: [
              "cierresCaja",
              cajaId,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "aperturasCaja",
              cajaId,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "apertura-activa",
              cajaId,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "cajas-sucursal",
              sucursalId,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "movimientos",
            ],
          }),

        ]);

        await Swal.fire({
          icon:
            reporte.resumen.estado ===
            "cuadrado"
              ? "success"
              : "warning",

          title:
            reporte.message,

          html: `
            <div style="text-align:left">
              <p><b>Ventas:</b> Bs. ${reporte.resumen.totalVentas.toFixed(2)}</p>
              <p><b>Egresos:</b> Bs. ${reporte.resumen.totalEgresos.toFixed(2)}</p>
              <p><b>Efectivo esperado:</b> Bs. ${reporte.resumen.totalEsperadoEfectivo.toFixed(2)}</p>
              <p><b>Efectivo contado:</b> Bs. ${reporte.resumen.montoReal.toFixed(2)}</p>
              <p><b>Diferencia:</b> Bs. ${reporte.resumen.diferencia.toFixed(2)}</p>
              <p><b>Estado:</b> ${reporte.resumen.estado}</p>
              <p><b>Duración:</b> ${reporte.jornada.duracionMinutos} minutos</p>
            </div>
          `,

          confirmButtonText:
            "Ver historial",
        });

        navigate(
          `/sucursal/${sucursalId}/caja/${cajaId}/cierre`
        );
      },

    onError:
      async (
        error: Error
      ) => {

        await Swal.fire({
          icon:
            "error",
          title:
            "No se pudo cerrar la caja",
          text:
            error.message,
        });
      },
  });

  const handleSubmit = (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    if (!aperturaActiva) {
      Swal.fire({
        icon:
          "error",
        title:
          "Caja sin apertura",
        text:
          "La caja no tiene una apertura activa.",
      });

      return;
    }

    mutate(formData);
  };

  if (cargandoApertura) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600" />
      </div>
    );
  }

  return (

    <div className="flex min-h-screen bg-slate-50">

      <MenuList />

      <main className="flex-1 p-4 md:p-8">

        <div className="mb-8">

          <Link
            to={`/sucursal/${sucursalId}/caja/${cajaId}/cierre`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-fuchsia-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>

        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8"
        >

          <div className="mb-8">

            <h1 className="flex items-center gap-3 text-3xl font-black text-slate-800">
              <Wallet className="h-8 w-8 text-fuchsia-600" />
              Cerrar caja
            </h1>

            <p className="mt-2 text-slate-500">
              El sistema calculará automáticamente el reporte de la jornada.
            </p>

          </div>

          {aperturaActiva ? (

            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">

              <p>
                <b>Apertura:</b>{" "}
                {new Date(
                  aperturaActiva.fechaApertura
                ).toLocaleString()}
              </p>

              <p>
                <b>Monto inicial:</b>{" "}
                Bs.{" "}
                {Number(
                  aperturaActiva.montoInicial
                ).toFixed(2)}
              </p>

            </div>

          ) : (

            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              La caja no tiene una apertura activa.
            </div>

          )}

          <CierreCajaForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={
              isPending ||
              !aperturaActiva
            }
            submitText="Cerrar caja y generar reporte"
          />

        </motion.div>

      </main>

    </div>
  );
}

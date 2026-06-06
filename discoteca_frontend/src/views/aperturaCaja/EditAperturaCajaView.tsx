// src/views/aperturaCaja/EditAperturaCajaView.tsx

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import Swal from "sweetalert2";

import MenuList from "@/components/MenuList";

import {
  getAperturaCajaById,
  updateAperturaCaja,
} from "@/api/AperturaCajaApi";

import type {
  UpdateAperturaCajaForm,
} from "@/types/AperturaCajaType";

import { useAuth } from "@/hooks/useAuth";

export default function EditAperturaCajaView() {

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const {
    sucursalId,
    cajaId,
    aperturaId,
  } = useParams();

  const {
    data: perfil,
  } = useAuth();

  const [
    formData,
    setFormData,
  ] = useState<UpdateAperturaCajaForm>({
    montoInicial: 0,
    observacion: "",
    actualizadoPor: "",
  });

  const {
    data: apertura,
    isLoading,
  } = useQuery({

    queryKey: [
      "aperturaCaja",
      aperturaId,
    ],

    queryFn: () =>
      getAperturaCajaById(
        aperturaId!
      ),

    enabled:
      Boolean(aperturaId),
  });

  useEffect(() => {

    if (!apertura) {
      return;
    }

    setFormData({
      montoInicial:
        apertura.montoInicial,
      observacion:
        apertura.observacion ||
        "",
      actualizadoPor:
        perfil?.nombres ||
        "sistema",
    });

  }, [
    apertura,
    perfil,
  ]);

  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn: () =>
      updateAperturaCaja({
        aperturaCajaId:
          aperturaId!,
        formData,
      }),

    onSuccess:
      async (
        respuesta
      ) => {

        await queryClient.invalidateQueries({
          queryKey: [
            "aperturasCaja",
            cajaId,
          ],
        });

        await Swal.fire({
          icon:
            "success",
          title:
            respuesta.message ||
            "Apertura actualizada",
        });

        navigate(
          `/sucursal/${sucursalId}/caja/${cajaId}/apertura`
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
            error.message,
        });
      },
  });

  if (isLoading) {

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

        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <h1 className="text-3xl font-black text-slate-800">
            Editar apertura
          </h1>

          <p className="mt-2 text-slate-500">
            Solo puedes corregir el monto inicial y la observación mientras la caja esté abierta.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              mutate();
            }}
            className="mt-8 space-y-6"
          >

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Monto inicial
              </label>

              <input
                type="number"
                min={0}
                step="0.01"
                value={
                  formData.montoInicial ||
                  0
                }
                onChange={(event) =>
                  setFormData(
                    (actual) => ({
                      ...actual,
                      montoInicial:
                        Number(
                          event.target.value
                        ),
                    })
                  )
                }
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Observación
              </label>

              <textarea
                rows={4}
                value={
                  formData.observacion ||
                  ""
                }
                onChange={(event) =>
                  setFormData(
                    (actual) => ({
                      ...actual,
                      observacion:
                        event.target.value,
                    })
                  )
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
              />

            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-2xl bg-fuchsia-600 px-6 py-4 font-black text-white disabled:opacity-50"
            >
              {isPending
                ? "Actualizando..."
                : "Actualizar apertura"}
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

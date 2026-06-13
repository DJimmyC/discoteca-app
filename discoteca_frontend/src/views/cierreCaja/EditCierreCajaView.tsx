// src/views/cierreCaja/EditCierreCajaView.tsx

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
  getCierreCajaById,
  updateCierreCaja,
} from "@/api/CierreCajaApi";

import type {
  UpdateCierreCajaForm,
} from "@/types/CierreCajaType";

import { useAuth } from "@/hooks/useAuth";

export default function EditCierreCajaView() {

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const {
    sucursalId,
    cajaId,
    cierreId,
  } = useParams();

  const {
    data: perfil,
  } = useAuth();

  const [
    formData,
    setFormData,
  ] = useState<UpdateCierreCajaForm>({
    observacion: "",
    actualizadoPor: perfil._id!,
  });

  const {
    data: cierre,
    isLoading,
  } = useQuery({

    queryKey: [
      "cierreCaja",
      cierreId,
    ],

    queryFn: () =>
      getCierreCajaById(
        cierreId!
      ),

    enabled:
      Boolean(cierreId),
  });

  useEffect(() => {

    if (!cierre) {
      return;
    }

    setFormData({
      observacion:
        cierre.observacion ||
        "",
      actualizadoPor:
        perfil?._id ||
        "sistema",
    });

  }, [
    cierre,
    perfil,
  ]);

  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn: () =>
      updateCierreCaja({
        cierreCajaId:
          cierreId!,
        formData,
      }),

    onSuccess:
      async (
        respuesta
      ) => {

        await queryClient.invalidateQueries({
          queryKey: [
            "cierresCaja",
            cajaId,
          ],
        });

        await Swal.fire({
          icon:
            "success",
          title:
            respuesta.message ||
            "Cierre actualizado",
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
            Editar observación del cierre
          </h1>

          <p className="mt-2 text-slate-500">
            Los montos financieros no pueden modificarse manualmente.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              mutate();
            }}
            className="mt-8 space-y-6"
          >

            <textarea
              rows={6}
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

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-2xl bg-fuchsia-600 px-6 py-4 font-black text-white disabled:opacity-50"
            >
              {isPending
                ? "Actualizando..."
                : "Actualizar observación"}
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

// src/components/cierrecaja/CierreCajaForm.tsx

import type {
  Dispatch,
  FormEvent,
  SetStateAction,
} from "react";

import type {
  CierreCajaForm,
} from "@/types/CierreCajaType";

type Props = {

  formData:
    CierreCajaForm;

  setFormData:
    Dispatch<
      SetStateAction<CierreCajaForm>
    >;

  onSubmit: (
    e: FormEvent
  ) => void;

  loading?: boolean;

  submitText?: string;

};

export default function
  CierreCajaForm({

    formData,

    setFormData,

    onSubmit,

    loading,

    submitText =
      "Guardar",

  }: Props) {

  return (

    <form
      onSubmit={onSubmit}
      className="space-y-8"
    >

      {/* FECHAS */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* FECHA APERTURA */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Fecha Apertura

          </label>

          <input

            type="datetime-local"

            value={
              formData.fechaApertura
            }

            onChange={(e) =>
              setFormData({

                ...formData,

                fechaApertura:
                  e.target.value,

              })
            }

            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-fuchsia-500
            "

            required

          />

        </div>

        {/* FECHA CIERRE */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Fecha Cierre

          </label>

          <input

            type="datetime-local"

            value={
              formData.fechaCierre
            }

            onChange={(e) =>
              setFormData({

                ...formData,

                fechaCierre:
                  e.target.value,

              })
            }

            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-fuchsia-500
            "

            required

          />

        </div>

      </div>

      {/* MONTOS */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* MONTO INICIAL */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Monto Inicial

          </label>

          <input

            type="number"

            value={
              formData.montoInicial
            }

            onChange={(e) =>
              setFormData({

                ...formData,

                montoInicial:
                  +e.target.value,

              })
            }

            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-fuchsia-500
            "

            required

          />

        </div>

        {/* TOTAL VENTAS */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Total Ventas

          </label>

          <input

            type="number"

            value={
              formData.totalVentas
            }

            onChange={(e) =>
              setFormData({

                ...formData,

                totalVentas:
                  +e.target.value,

              })
            }

            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-fuchsia-500
            "

            required

          />

        </div>

        {/* TOTAL EGRESOS */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Total Egresos

          </label>

          <input

            type="number"

            value={
              formData.totalEgresos
            }

            onChange={(e) =>
              setFormData({

                ...formData,

                totalEgresos:
                  +e.target.value,

              })
            }

            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-fuchsia-500
            "

            required

          />

        </div>

        {/* MONTO REAL */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">

            Monto Real

          </label>

          <input

            type="number"

            value={
              formData.montoReal
            }

            onChange={(e) =>
              setFormData({

                ...formData,

                montoReal:
                  +e.target.value,

              })
            }

            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-fuchsia-500
            "

            required

          />

        </div>

      </div>

      {/* OBSERVACION */}
      <div>

        <label className="mb-2 block text-sm font-bold text-slate-700">

          Observación

        </label>

        <textarea

          value={
            formData.observacion || ""
          }

          onChange={(e) =>
            setFormData({

              ...formData,

              observacion:
                e.target.value,

            })
          }

          rows={5}

          className="
            w-full
            rounded-2xl
            border
            border-slate-300
            px-4
            py-3
            outline-none
            transition
            focus:border-fuchsia-500
          "

        />

      </div>

      {/* BUTTON */}
      <button

        type="submit"

        disabled={loading}

        className="
          w-full
          rounded-2xl
          bg-fuchsia-600
          py-4
          text-lg
          font-bold
          text-white
          shadow-xl
          transition
          hover:scale-[1.01]
          hover:bg-fuchsia-700
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >

        {

          loading

            ? "Guardando..."

            : submitText

        }

      </button>

    </form>

  );

}
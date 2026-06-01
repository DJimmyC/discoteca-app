
// src/components/aperturacaja/AperturaCajaForm.tsx

import type {
  AperturaCajaForm,
} from "@/types/AperturaCajaType";

type Props = {

  formData:
    AperturaCajaForm;

  setFormData:
    React.Dispatch<
      React.SetStateAction<
        AperturaCajaForm
      >
    >;

  onSubmit:
    (
      e: React.FormEvent
    ) => void;

  loading:
    boolean;

  submitText:
    string;

};

export default function
AperturaCajaForm({

  formData,

  setFormData,

  onSubmit,

  loading,

  submitText,

}: Props) {

  return (

    <form

      onSubmit={
        onSubmit
      }

      className="
        space-y-8
      "
    >

      {/* =========================
          FECHA
      ========================= */}

      <div>

        <label
          className="
            mb-2
            block
            text-sm
            font-bold
            text-slate-700
          "
        >

          Fecha

        </label>

        <input

          type="date"

          value={
            formData.fecha
              ?.split("T")[0]
          }

          onChange={(
            e
          ) =>

            setFormData(
              (
                prev
              ) => ({

                ...prev,

                fecha:
                  e.target.value,

              })
            )

          }

          className="
            w-full
            rounded-2xl
            border
            border-slate-300
            bg-white
            px-4
            py-3
            outline-none
            transition
            focus:border-fuchsia-500
          "
        />

      </div>

      {/* =========================
          HORA
      ========================= */}

      <div>

        <label
          className="
            mb-2
            block
            text-sm
            font-bold
            text-slate-700
          "
        >

          Hora Apertura

        </label>

        <input

          type="time"

          value={
            formData.horaApertura
          }

          onChange={(
            e
          ) =>

            setFormData(
              (
                prev
              ) => ({

                ...prev,

                horaApertura:
                  e.target.value,

              })
            )

          }

          className="
            w-full
            rounded-2xl
            border
            border-slate-300
            bg-white
            px-4
            py-3
            outline-none
            transition
            focus:border-fuchsia-500
          "
        />

      </div>

      {/* =========================
          MONTO
      ========================= */}

      <div>

        <label
          className="
            mb-2
            block
            text-sm
            font-bold
            text-slate-700
          "
        >

          Monto Inicial

        </label>

        <input

          type="number"

          min={0}

          value={
            formData.montoInicial
          }

          onChange={(
            e
          ) =>

            setFormData(
              (
                prev
              ) => ({

                ...prev,

                montoInicial:
                  Number(
                    e.target.value
                  ),

              })
            )

          }

          placeholder="
            Ingrese monto inicial
          "

          className="
            w-full
            rounded-2xl
            border
            border-slate-300
            bg-white
            px-4
            py-3
            outline-none
            transition
            focus:border-fuchsia-500
          "
        />

      </div>

      {/* =========================
          OBSERVACION
      ========================= */}

      <div>

        <label
          className="
            mb-2
            block
            text-sm
            font-bold
            text-slate-700
          "
        >

          Observación

        </label>

        <textarea

          value={
            formData.observacion ||
            ""
          }

          onChange={(
            e
          ) =>

            setFormData(
              (
                prev
              ) => ({

                ...prev,

                observacion:
                  e.target.value,

              })
            )

          }

          placeholder="
            Observaciones de apertura
          "

          rows={4}

          className="
            w-full
            rounded-2xl
            border
            border-slate-300
            bg-white
            px-4
            py-3
            outline-none
            transition
            focus:border-fuchsia-500
          "
        />

      </div>

      {/* =========================
          ESTADO
      ========================= */}

      <div className="flex items-center gap-3">

        <input

          type="checkbox"

          checked={
            formData.estado ||
            false
          }

          onChange={(
            e
          ) =>

            setFormData(
              (
                prev
              ) => ({

                ...prev,

                estado:
                  e.target.checked,

              })
            )

          }

          className="
            h-5
            w-5
          "
        />

        <label
          className="
            text-sm
            font-semibold
            text-slate-700
          "
        >

          Apertura Activa

        </label>

      </div>

      {/* =========================
          BUTTON
      ========================= */}

      <button

        type="submit"

        disabled={
          loading
        }

        className="
          w-full
          rounded-2xl
          bg-fuchsia-600
          px-6
          py-4
          text-lg
          font-bold
          text-white
          transition
          hover:bg-fuchsia-700
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >

        {loading
          ? "Guardando..."
          : submitText}

      </button>

    </form>

  );

}

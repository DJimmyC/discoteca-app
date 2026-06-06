// src/components/aperturacaja/AperturaCajaForm.tsx

import type {
  Dispatch,
  FormEvent,
  SetStateAction,
} from "react";

import type {
  AperturaCajaForm,
} from "@/types/AperturaCajaType";

type Props = {
  formData: AperturaCajaForm;

  setFormData:
    Dispatch<
      SetStateAction<AperturaCajaForm>
    >;

  onSubmit:
    (event: FormEvent<HTMLFormElement>) => void;

  loading?: boolean;
  submitText?: string;
};

export default function AperturaCajaForm({
  formData,
  setFormData,
  onSubmit,
  loading = false,
  submitText = "Abrir caja",
}: Props) {

  return (

    <form
      onSubmit={onSubmit}
      className="space-y-6"
    >

      <div>

        <label className="mb-2 block text-sm font-bold text-slate-700">
          Fecha y hora de apertura
        </label>

        <input
          type="datetime-local"
          value={formData.fechaApertura}
          onChange={(event) =>
            setFormData(
              (actual) => ({
                ...actual,
                fechaApertura:
                  event.target.value,
              })
            )
          }
          required
          disabled={loading}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-fuchsia-500 disabled:bg-slate-100"
        />

        <p className="mt-2 text-xs text-slate-500">
          La hora se guardará con la zona horaria de Bolivia.
        </p>

      </div>

      <div>

        <label className="mb-2 block text-sm font-bold text-slate-700">
          Monto inicial
        </label>

        <input
          type="number"
          min={0}
          step="0.01"
          value={formData.montoInicial}
          onChange={(event) =>
            setFormData(
              (actual) => ({
                ...actual,
                montoInicial:
                  Number(event.target.value),
              })
            )
          }
          required
          disabled={loading}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-fuchsia-500 disabled:bg-slate-100"
        />

      </div>

      <div>

        <label className="mb-2 block text-sm font-bold text-slate-700">
          Observación
        </label>

        <textarea
          value={formData.observacion || ""}
          onChange={(event) =>
            setFormData(
              (actual) => ({
                ...actual,
                observacion:
                  event.target.value,
              })
            )
          }
          disabled={loading}
          rows={4}
          placeholder="Ejemplo: Inicio de jornada nocturna"
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-fuchsia-500 disabled:bg-slate-100"
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-fuchsia-600 px-6 py-4 font-black text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Guardando..."
          : submitText}
      </button>

    </form>
  );
}

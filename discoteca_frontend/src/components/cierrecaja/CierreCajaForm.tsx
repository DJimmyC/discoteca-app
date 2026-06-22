// // src/components/cierrecaja/CierreCajaForm.tsx

// import type {
//   Dispatch,
//   FormEvent,
//   SetStateAction,
// } from "react";

// import type {
//   CierreCajaForm,
// } from "@/types/CierreCajaType";

// type Props = {
//   formData: CierreCajaForm;

//   setFormData:
//     Dispatch<
//       SetStateAction<CierreCajaForm>
//     >;

//   onSubmit:
//     (event: FormEvent<HTMLFormElement>) => void;

//   loading?: boolean;
//   submitText?: string;
// };

// export default function CierreCajaForm({
//   formData,
//   setFormData,
//   onSubmit,
//   loading = false,
//   submitText = "Cerrar caja",
// }: Props) {

//   return (

//     <form
//       onSubmit={onSubmit}
//       className="space-y-6"
//     >

//       <div>

//         <label className="mb-2 block text-sm font-bold text-slate-700">
//           Fecha de referencia
//         </label>

//         <input
//           type="date"
//           value={formData.fecha || ""}
//           onChange={(event) =>
//             setFormData(
//               (actual) => ({
//                 ...actual,
//                 fecha:
//                   event.target.value,
//               })
//             )
//           }
//           required
//           disabled={loading}
//           className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500 disabled:bg-slate-100"
//         />

//         <p className="mt-2 text-xs text-slate-500">
//           Para una jornada que abrió el día 23 a las 19:00 y cierra a las 04:00, conserva la fecha 23. El backend moverá automáticamente el cierre al día 24.
//         </p>

//       </div>

//       <div>

//         <label className="mb-2 block text-sm font-bold text-slate-700">
//           Hora de cierre
//         </label>

//         <input
//           type="time"
//           value={formData.horaCierre || ""}
//           onChange={(event) =>
//             setFormData(
//               (actual) => ({
//                 ...actual,
//                 horaCierre:
//                   event.target.value,
//               })
//             )
//           }
//           required
//           disabled={loading}
//           className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500 disabled:bg-slate-100"
//         />

//       </div>

//       <div>

//         <label className="mb-2 block text-sm font-bold text-slate-700">
//           Efectivo contado físicamente
//         </label>

//         <input
//           type="number"
//           min={0}
//           step="0.01"
//           value={formData.montoReal}
//           onChange={(event) =>
//             setFormData(
//               (actual) => ({
//                 ...actual,
//                 montoReal:
//                   Number(event.target.value),
//               })
//             )
//           }
//           required
//           disabled={loading}
//           className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500 disabled:bg-slate-100"
//         />

//       </div>

//       <div>

//         <label className="mb-2 block text-sm font-bold text-slate-700">
//           Observación
//         </label>

//         <textarea
//           rows={4}
//           value={formData.observacion || ""}
//           onChange={(event) =>
//             setFormData(
//               (actual) => ({
//                 ...actual,
//                 observacion:
//                   event.target.value,
//               })
//             )
//           }
//           disabled={loading}
//           placeholder="Observaciones del cierre"
//           className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500 disabled:bg-slate-100"
//         />

//       </div>

//       <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
//         El backend calculará automáticamente ventas, egresos, efectivo esperado, diferencia y estado del cierre.
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full rounded-2xl bg-fuchsia-600 px-6 py-4 font-black text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
//       >
//         {loading
//           ? "Generando reporte..."
//           : submitText}
//       </button>

//     </form>
//   );
// }

// src/components/cierrecaja/CierreCajaForm.tsx

import type {
  Dispatch,
  FormEvent,
  SetStateAction,
} from "react";

import {
  Eye,
  LockKeyhole,
} from "lucide-react";

import type {
  CierreCajaForm,
} from "@/types/CierreCajaType";

type Props = {
  formData: CierreCajaForm;

  setFormData:
    Dispatch<
      SetStateAction<CierreCajaForm>
    >;

  onSubmit:
    (event: FormEvent<HTMLFormElement>) => void;

  onPreview?: () => void;

  loading?: boolean;
  previewLoading?: boolean;
  submitText?: string;
};

export default function CierreCajaForm({
  formData,
  setFormData,
  onSubmit,
  onPreview,
  loading = false,
  previewLoading = false,
  submitText = "Cerrar caja",
}: Props) {
  const disabled =
    loading || previewLoading;

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Fecha de referencia
        </label>

        <input
          type="date"
          value={formData.fecha || ""}
          onChange={(event) =>
            setFormData(
              (actual) => ({
                ...actual,
                fecha:
                  event.target.value,
              })
            )
          }
          required
          disabled={disabled}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500 disabled:bg-slate-100"
        />

        <p className="mt-2 text-xs text-slate-500">
          Para una jornada que abrió el día 23 a las 19:00 y cierra a las 04:00, conserva la fecha 23. El backend moverá automáticamente el cierre al día 24.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Hora de cierre
        </label>

        <input
          type="time"
          value={formData.horaCierre || ""}
          onChange={(event) =>
            setFormData(
              (actual) => ({
                ...actual,
                horaCierre:
                  event.target.value,
              })
            )
          }
          required
          disabled={disabled}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Monto real verificado
        </label>

        <input
          type="number"
          min={0}
          step="0.01"
          value={formData.montoReal}
          onChange={(event) =>
            setFormData(
              (actual) => ({
                ...actual,
                montoReal:
                  Number(
                    event.target.value
                  ),
              })
            )
          }
          required
          disabled={disabled}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500 disabled:bg-slate-100"
        />

        <p className="mt-2 text-xs text-slate-500">
          Este monto se comparará contra: monto inicial + ventas pagadas - egresos registrados.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Observación
        </label>

        <textarea
          rows={4}
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
          disabled={disabled}
          placeholder="Observaciones del cierre"
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500 disabled:bg-slate-100"
        />
      </div>

      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        Primero puedes generar un reporte preliminar. Después de revisar ventas por mesero, egresos, cortesías y diferencia, confirmas el cierre definitivo.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={onPreview}
          disabled={
            disabled ||
            !onPreview
          }
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-fuchsia-200 bg-fuchsia-50 px-6 py-4 font-black text-fuchsia-700 transition hover:bg-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Eye className="h-5 w-5" />

          {previewLoading
            ? "Generando preview..."
            : "Ver reporte preliminar"}
        </button>

        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-fuchsia-600 px-6 py-4 font-black text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LockKeyhole className="h-5 w-5" />

          {loading
            ? "Cerrando caja..."
            : submitText}
        </button>
      </div>
    </form>
  );
}
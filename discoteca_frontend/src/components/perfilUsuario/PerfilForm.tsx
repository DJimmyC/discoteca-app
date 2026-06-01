// src/components/perfil/PerfilForm.tsx

import {
  Save,
} from "lucide-react";

export type PerfilFormData = {

  nombres:
    string;

  apellidos:
    string;

  edad:
    number | "";

  sexo:
    string;

  ci:
    string;

  telefono:
    string;

  email:
    string;

};

type PerfilFormProps = {

  formData:
    PerfilFormData;

  setFormData:
    React.Dispatch<
      React.SetStateAction<PerfilFormData>
    >;

  isPending?:
    boolean;

  buttonText?:
    string;

  onSubmit:
    () => void;

};

export default function PerfilForm({

  formData,

  setFormData,

  isPending = false,

  buttonText = "Guardar cambios",

  onSubmit,

}: PerfilFormProps) {

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]:
        name === "edad"
          ? value === ""
            ? ""
            : Number(value)
          : value,

    }));

  };

  return (

    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-4xl font-black text-slate-900">
          Datos del Perfil
        </h2>

        <p className="mt-2 text-slate-500">
          Actualiza tu información personal.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Nombres
          </label>

          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Apellidos
          </label>

          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Edad
          </label>

          <input
            type="number"
            name="edad"
            min={0}
            value={formData.edad}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Sexo
          </label>

          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          >
            <option value="">
              Seleccione
            </option>

            <option value="Masculino">
              Masculino
            </option>

            <option value="Femenino">
              Femenino
            </option>

            <option value="Otro">
              Otro
            </option>
          </select>

        </div>

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            C.I.
          </label>

          <input
            type="text"
            name="ci"
            value={formData.ci}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Teléfono
          </label>

          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          />

        </div>

        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          />

        </div>

      </div>

      <div className="mt-10 flex justify-end">

        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-8 py-4 font-black text-white shadow-lg shadow-purple-500/20 transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Save className="h-5 w-5" />

          {isPending
            ? "Guardando..."
            : buttonText}
        </button>

      </div>

    </section>

  );

}
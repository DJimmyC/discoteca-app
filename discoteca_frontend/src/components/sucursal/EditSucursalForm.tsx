import { Link, useNavigate } from "react-router-dom";
import SucursalForm from "./SucursalForm";
import type { SucursalFormData, SucursalType } from "@/types/SucursalType";
import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateSucursal } from "@/api/SucursalApi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

type EditSucursalFormProps = {
  data: SucursalType; // 🔥 aquí debes usar el tipo completo
  sucursalId: SucursalType["_id"];
};

export default function EditSucursalForm({ data, sucursalId }: EditSucursalFormProps) {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* =========================
      SOLO CAMPOS DEL FORM
  ========================= */
  const initialValues: SucursalFormData = {
    nombreSucursal: data.nombreSucursal,
    ubicacionSucursal: data.ubicacionSucursal,
    us_creado: data.us_creado
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SucursalFormData>({
    defaultValues: initialValues
  });

  /* =========================
     🚀 MUTATION
  ========================= */
  const { mutate } = useMutation({
    mutationFn: updateSucursal,
    
    onError: async (error: any) => {
      await Swal.fire({
        icon: 'error',
        title: error.message,
        timer: 2000,
        showConfirmButton: false,
      });
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['sucursal'] });
      queryClient.invalidateQueries({ queryKey: ['editSucursal', sucursalId] });

      await Swal.fire({
        icon: 'success',
        title: 'Sucursal actualizada correctamente',
        timer: 2000,
        showConfirmButton: false,
      });

      toast.success("Actualizado correctamente");
      navigate('/');
    }
  });

  /* =========================
     📤 SUBMIT
  ========================= */
  const handleForm = (formData: SucursalFormData) => {
    mutate({
      sucursalId,
      formData: {
        ...formData,
        us_modificado: "admin", //  puedes usar useAuth aquí
        fecha_modificado: new Date().toISOString()
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-5xl font-black">
        Editar Discoteca
      </h1>

      <p className="text-2xl font-light text-gray-500 mt-5">
        Modifica los datos de la sucursal
      </p>

      <nav className="my-5">
        <Link
          className="bg-fuchsia-700 hover:bg-fuchsia-800 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          to="/"
        >
          Volver a sucursales
        </Link>
      </nav>

      <form
        className="mt-10 bg-white shadow-lg p-10 rounded-lg"
        onSubmit={handleSubmit(handleForm)}
        noValidate
      >
        <SucursalForm
          register={register}
          errors={errors}
        />

        <input
          type="submit"
          value="Guardar Cambios"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
        />
      </form>
    </div>
  );
}
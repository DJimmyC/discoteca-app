// src/views/inventario/EditInventarioView.tsx

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
} from "@tanstack/react-query";

import Swal from "sweetalert2";

import {
  ArrowLeft,
} from "lucide-react";

import MenuListDashboard from "@/components/MenuListDashboard";

import InventarioForm from "@/components/inventario/InventarioForm";

import {

  getInventarioById,

  updateInventario,

} from "@/api/InventarioApi";

import {
  getAlmacenes,
} from "@/api/AlmacenApi";

import {
  getProductos,
} from "@/api/ProductoApi";

import {
  getSucursalById,
} from "@/api/SucursalApi";

import type {
  InventarioFormData,
} from "@/types/InventarioType";

export default function EditInventarioView() {

  const navigate =
    useNavigate();

  const {
    inventarioId,
    sucursalId,
  } = useParams();

  /* =========================
      FORM DATA
  ========================= */

  const [
    formData,

    setFormData,

  ] = useState<InventarioFormData>({

    idAlmacen: "",

    idProducto: "",

    cantidad: 0,

    costoUnitario: 0,

    precioVenta: 0,

    stockMinimo: 0,

    estado: true,

    creadoPor: "admin",

  });

  /* =========================
      GET SUCURSAL
  ========================= */

  const {
    data: sucursal,
  } = useQuery({

    queryKey: [

      "sucursal",

      sucursalId,

    ],

    queryFn: () =>
      getSucursalById(
        sucursalId!
      ),

    enabled:
      !!sucursalId,

  });

  /* =========================
      GET INVENTARIO
  ========================= */

  const {
    data,
    isLoading,
  } = useQuery({

    queryKey: [

      "inventario",

      inventarioId,

    ],

    queryFn: () =>
      getInventarioById(
        inventarioId!
      ),

    enabled:
      !!inventarioId,

  });

  /* =========================
      GET ALMACENES
  ========================= */

  const {
    data: almacenes = [],
  } = useQuery({

    queryKey: [
      "almacenes"
    ],

    queryFn:
      getAlmacenes,

  });

  /* =========================
      FILTRAR ALMACENES
  ========================= */

  const almacenesSucursal =
    almacenes.filter(
      (almacen: any) => {

        if (
          typeof almacen.idSucursal === "string"
        ) {

          return (
            almacen.idSucursal ===
            sucursalId
          );

        }

        return (
          almacen.idSucursal?._id ===
          sucursalId
        );

      }
    );

  /* =========================
      GET PRODUCTOS
  ========================= */

  const {
    data: productos = [],
  } = useQuery({

    queryKey: [
      "productos"
    ],

    queryFn:
      getProductos,

  });

  /* =========================
      LOAD DATA
  ========================= */

  useEffect(() => {

    if (data) {

      setFormData({

        idAlmacen:

          typeof data.idAlmacen === "string"

            ? data.idAlmacen

            : data.idAlmacen?._id || "",

        idProducto:

          typeof data.idProducto === "string"

            ? data.idProducto

            : data.idProducto?._id || "",

        cantidad:
          data.cantidad || 0,

        costoUnitario:
          data.costoUnitario || 0,

        precioVenta:
          data.precioVenta || 0,

        stockMinimo:
          data.stockMinimo || 0,

        estado:
          data.estado ?? true,

        creadoPor:
          data.creadoPor || "admin",

      });

    }

  }, [data]);

  /* =========================
      UPDATE
  ========================= */

  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn:
      updateInventario,

    onSuccess: async (
      data
    ) => {

      await Swal.fire({

        icon: "success",

        title:
          data,

        timer: 2000,

        showConfirmButton: false,

      });

      navigate(

        `/sucursal/${sucursalId}/inventario`

      );

    },

    onError: async (
      error: any
    ) => {

      await Swal.fire({

        icon: "error",

        title:
          error.message,

      });

    },

  });

  /* =========================
      SUBMIT
  ========================= */

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    mutate({

      inventarioId:
        inventarioId!,

      formData,

    });

  };

  /* =========================
      LOADING
  ========================= */

  if (isLoading) {

    return (

      <div className="flex h-screen items-center justify-center bg-slate-50">

        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600"></div>

      </div>

    );

  }

  return (

    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <MenuListDashboard />

      {/* CONTENT */}
      <main className="flex-1 p-8">

        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-sm">

          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">

                <span>

                  {

                    sucursal?.nombreSucursal ||
                    "Sucursal"

                  }

                </span>

                <span>/</span>

                <span className="font-semibold text-fuchsia-600">

                  Editar Inventario

                </span>

              </div>

              <h1 className="text-4xl font-black text-slate-800">

                Editar Inventario

              </h1>

              <p className="mt-2 text-slate-500">

                Modifica información del inventario

              </p>

            </div>

            {/* BACK */}
            <Link

              to={`/sucursal/${sucursalId}/inventario`}

              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                border
                border-slate-300
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >

              <ArrowLeft className="h-5 w-5" />

              Volver

            </Link>

          </div>

          {/* FORM */}
          <InventarioForm

            formData={formData}

            setFormData={setFormData}

            onSubmit={handleSubmit}

            almacenes={almacenesSucursal}

            productos={productos}

            loading={isPending}

            submitText="Actualizar Inventario"

          />

        </div>

      </main>

    </div>

  );

}
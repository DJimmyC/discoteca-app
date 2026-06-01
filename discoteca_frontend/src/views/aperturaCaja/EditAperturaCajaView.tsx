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
    Pencil,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import MenuList from "@/components/MenuList";

import AperturaCajaForm from "@/components/aperturacaja/AperturaCajaForm";

import {

    getAperturaCajaById,

    updateAperturaCaja,

} from "@/api/AperturaCajaApi";

import type {

    AperturaCajaForm as AperturaCajaFormType,

} from "@/types/AperturaCajaType";
import Swal from "sweetalert2";

export default function EditAperturaCajaView() {

    const navigate =
        useNavigate();

    const queryClient =
        useQueryClient();

    const params =
        useParams();

    const aperturaCajaId =
        params.aperturaId!;

    const cajaId =
        params.cajaId!;

    const sucursalId =
        params.sucursalId!;


    /* =========================
        STATE
    ========================= */

    const [formData, setFormData] =
        useState<AperturaCajaFormType>({

            idPerfil: "",

            idCaja: "",

            fecha: "",

            horaApertura: "",

            montoInicial: 0,

            observacion: "",

            estado: true,

        });

    /* =========================
        QUERY
    ========================= */

    const {

        data,

        isLoading,

    } = useQuery({

        queryKey: [

            "aperturaCaja",

            aperturaCajaId,

        ],

        queryFn: () =>
            getAperturaCajaById(
                aperturaCajaId
            ),

        retry: false,

    });

    /* =========================
        LOAD DATA
    ========================= */

    useEffect(() => {

        if (data) {

            const apertura =
                Array.isArray(data)
                    ? data.find(
                        (item) =>
                            item._id ===
                            aperturaCajaId
                    )
                    : data;

            if (apertura) {

                setFormData({

                    idPerfil:
                        typeof apertura.idPerfil === "string"
                            ? apertura.idPerfil
                            : apertura.idPerfil?._id || "",

                    idCaja:
                        typeof apertura.idCaja === "string"
                            ? apertura.idCaja
                            : apertura.idCaja?._id || "",

                    fecha:
                        apertura.fecha || "",

                    horaApertura:
                        apertura.horaApertura || "",

                    montoInicial:
                        apertura.montoInicial || 0,

                    observacion:
                        apertura.observacion || "",

                    estado:
                        apertura.estado ?? true,

                });

            }

        }

    }, [
        data,
        aperturaCajaId,
    ]);

    /* =========================
        MUTATION
    ========================= */

    const {

        mutate,

        isPending,

    } = useMutation({

        mutationFn: () =>

            updateAperturaCaja({

                aperturaCajaId,

                formData,

            }),

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

            queryClient.invalidateQueries({

                queryKey: [

                    "aperturasCaja",

                    cajaId,

                ],

            });

            navigate(

                `/sucursal/${sucursalId}/caja/${cajaId}/apertura`

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

        mutate();

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
            <MenuList />

            {/* CONTENT */}
            <main className="flex-1 p-8">

                {/* HEADER */}

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <div className="mb-4">

                            <Link

                                to={`/sucursal/${sucursalId}/caja/${cajaId}/apertura`}

                                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-fuchsia-600"
                            >

                                <ArrowLeft className="h-4 w-4" />

                                Volver

                            </Link>

                        </div>

                        <h1 className="flex items-center gap-3 text-3xl font-black text-slate-800">

                            <Pencil className="h-8 w-8 text-fuchsia-600" />

                            Editar Apertura Caja

                        </h1>

                        <p className="mt-2 text-slate-500">

                            Actualice los datos
                            de la apertura

                        </p>

                    </div>

                </div>

                {/* CARD */}

                <motion.div

                    initial={{

                        opacity: 0,

                        y: 30,

                    }}

                    animate={{

                        opacity: 1,

                        y: 0,

                    }}

                    transition={{

                        duration: 0.4,

                    }}

                    className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
                >

                    <AperturaCajaForm

                        formData={formData}

                        setFormData={setFormData}

                        onSubmit={handleSubmit}

                        loading={isPending}

                        submitText="Actualizar Apertura"

                    />

                </motion.div>

            </main>

        </div>

    );

}
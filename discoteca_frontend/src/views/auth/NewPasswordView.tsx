
import NewPasswordForm from "@/components/Auth/NewPasswordForm"
export default function NewPasswordView() {

    return (<>
        <h1 className="text-5xl font-black text-white">Reestablecer Password</h1>
        <p className="text-2xl font-light text-white mt-5">

            {/* <span className=" text-fuchsia-500 font-bold">iniciando sesion en este formulario</span> */}
        </p>

        <NewPasswordForm/>
    </>
    )
}

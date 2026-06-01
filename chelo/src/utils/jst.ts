import jwt from 'jsonwebtoken'
import Types from 'mongoose'

type UsuarioPayload = {
    id: string,
    name:string
}
export const generateJWT = (payload: UsuarioPayload) => {

    const tokenjwt = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d'
    })
    return tokenjwt

}

// import { Request, Response, NextFunction } from "express";
// import jwt from 'jsonwebtoken'
// import Usuario, { PerfilUsuarioType } from "../models/PerfilUsuario";

// declare global{
//     namespace Express {
//         interface Request{
//             usuario?: PerfilUsuarioType
//         }
//     }
// }
// export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {


//     const bearer = req.headers.authorization
    
//     if (!bearer) {

//         const error = new Error("No autorizado")
//         res.status(401).json({ error: error.message })
//         return
//     }

//     const [, token] = bearer.split(" ")
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         if (typeof decoded === 'object' && decoded.id) {
//             const usuario = await Usuario.findById(decoded.id).select('_id nombres')

//             if (usuario) {
//                 req.usuario= usuario
//                 next()

//             } else {
//                 res.status(500).json({ error: 'token no valido ' })
//             }
//         }
//     } catch (error) {

//         res.status(500).json({ error: 'token no valido ' })
//     }

// }
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Usuario, { PerfilUsuarioType } from "../models/PerfilUsuario";

declare global {
  namespace Express {
    interface Request {
      usuario?: PerfilUsuarioType;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const bearer = req.headers.authorization;

  if (!bearer) {
    const error = new Error("No autorizado");

    res.status(401).json({
      error: error.message,
    });

    return;
  }

  const [, token] = bearer.split(" ");

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    if (
      typeof decoded === "object" &&
      decoded.id
    ) {

      const usuario = await Usuario.findById(
        decoded.id
      )
        .select("-password")
        .populate("idRol")
        .populate("idSucursal")

      if (usuario) {

        req.usuario = usuario;

        next();

      } else {

        res.status(401).json({
          error: "Token no válido",
        });

      }

    }

  } catch (error) {

    res.status(401).json({
      error: "Token no válido",
    });

  }

};
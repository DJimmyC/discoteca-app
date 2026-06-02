import { CorsOptions } from "cors";

const whitelist = [
  "http://localhost:5173",
  "http://localhost:4001",
  "https://discoteca-app.onrender.com",
  "https://discoteca-app-nine.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    console.log("🟡 Origin recibido:", origin);

    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
      return;
    }

    console.error("❌ Origin bloqueado:", origin);
    callback(new Error("Error de cors"));
  },
  credentials: true,
};
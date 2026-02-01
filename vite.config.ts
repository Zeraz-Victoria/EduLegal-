import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno desde process.env (Render) o .env (Local)
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Esto es CRUCIAL: Reemplaza 'process.env.API_KEY' en tu código 
      // con el valor real de la variable de entorno durante el "Build"
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
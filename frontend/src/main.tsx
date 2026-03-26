import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router.tsx'
import { Toaster } from 'sonner'
import { toastIcons, toastOptions } from './config/toastConfig.tsx'
import { SocketProvider } from './context/SocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <Toaster position="bottom-right" gap={8} toastOptions={toastOptions}icons={toastIcons} />
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </>
)

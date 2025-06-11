import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router/route'
import { RouterProvider } from 'react-router-dom'
import { UserProvider } from './context/UserContext'

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  </UserProvider>
) 

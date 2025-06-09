import { Button } from "@/components/ui/button"
import { Outlet } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import { Toaster } from "@/components/ui/sonner"

function App() {

  return (
    <>
      <div>
        <Sidebar />
        <div className="md:pl-64">
          <Outlet />
        </div>
        <Toaster />
      </div>
    </>

  )
}

export default App

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  ChevronDown,
  ChevronRight,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowRightLeft,
  Settings
} from "lucide-react"

export default function MenuListDashboard() {

  const location = useLocation()
  const [openSection, setOpenSection] = useState<string | null>("Inventario")

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const isActive = (path: string) =>
    location.pathname.includes(path)

  const menu = [
    {
      title: "Inventario",
      icon: Package,
      items: [
        // { to: "/almacen", text: "Almacenes" },
        { to: "/producto", text: "Productos" },
        { to: "/categoriaProducto/", text: "Categoria Producto" },
        // { to: "/inventario", text: "Inventario" },
      ]
    },
  
    {
      title: "Usuarios",
      icon: Users,
      items: [
        
        { to: "/rol", text: "Roles" },
        { to: "/perfilusuario", text: "Perfil Usuarios" },
      ]
    },
  
  ]

  return (
    <aside className="w-64 h-screen bg-white border-r p-4 overflow-y-auto">

      <h2 className="text-lg font-bold mb-6">
        Discoteca Manager
      </h2>

      <div className="space-y-2">

        {menu.map((section) => {
          const Icon = section.icon
          const isOpen = openSection === section.title

          return (
            <div key={section.title}>

              {/* HEADER */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="text-sm font-medium">
                    {section.title}
                  </span>
                </div>

                {isOpen ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
              </button>

              {/* SUBMENU */}
              {isOpen && (
                <div className="ml-6 mt-2 space-y-1">

                  {section.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`
                        block px-3 py-2 rounded-md text-sm
                        ${isActive(item.to)
                          ? "bg-black text-white"
                          : "text-gray-600 hover:bg-gray-100"
                        }
                      `}
                    >
                      {item.text}
                    </Link>
                  ))}

                </div>
              )}

            </div>
          )
        })}

      </div>

    </aside>
  )
}
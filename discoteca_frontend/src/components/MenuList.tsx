import { useState, useEffect } from "react"
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
    ClipboardList,
    Settings,
    Menu,
    X
} from "lucide-react"
import {
  ChartNoAxesCombined,
} from "lucide-react";
import {
  BanknoteArrowDown,
} from "lucide-react";
import {
  useParams,
} from "react-router-dom";

export default function MenuList() {

    const location = useLocation()
    const [openSidebar, setOpenSidebar] = useState(false)
    const [openSection, setOpenSection] = useState<string | null>("Inventario")

    const params = useParams()
    const sucursalId = params.sucursalId

    useEffect(() => {
        const saved = localStorage.getItem("sidebar")
        if (saved) setOpenSidebar(JSON.parse(saved))
    }, [])

    useEffect(() => {
        localStorage.setItem("sidebar", JSON.stringify(openSidebar))
    }, [openSidebar])

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

            {
                to: `/sucursal/${sucursalId}/almacen`,
                text: "Almacenes"
            },

            {
                to: `/sucursal/${sucursalId}/producto`,
                text: "Productos"
            },

            {
                to: `/sucursal/${sucursalId}/inventario`,
                text: "Inventario"
            },

        ]
    },

    {
        title: "Ventas",
        icon: ShoppingCart,

        items: [

            {
                to: `/sucursal/${sucursalId}/venta`,
                text: "Ventas"
            },

        ]
    },

    {
        title: "Caja",
        icon: DollarSign,

        items: [
            {
                to: `/sucursal/${sucursalId}/caja`,
                text: "Caja"
            },

            {
                to: `/sucursal/${sucursalId}/aperturacaja`,
                text: "Apertura"
            },

            {
                to: `/sucursal/${sucursalId}/cierre`,
                text: "Cierre"
            },

        ]
    },

    {
        title: "Usuarios",
        icon: Users,

        items: [

            {
                to: `/sucursal/${sucursalId}/usuarioDetalle`,
                text: "Usuarios"
            },

        ]
    },

    {
        title: "Logística",
        icon: ArrowRightLeft,

        items: [

            {
                to: `/sucursal/${sucursalId}/solicitud`,
                text: "Solicitudes"
            },

            {
                to: `/sucursal/${sucursalId}/transferencia`,
                text: "Transferencias"
            },

        ]
    },
     {
        title: "Reportes",
          icon: ChartNoAxesCombined,

        items: [

            {
                to: `/sucursal/${sucursalId}/solicitud`,
                text: "Reporte ---"
            },

            {
                to: `/sucursal/${sucursalId}/transferencia`,
                text: "Reporte ---"
            },

        ]
    },
     {
        title: "Egresos",
        icon: BanknoteArrowDown,

        items: [

            {
                to: `/sucursal/${sucursalId}/egreso`,
                text: "Egresos"
            },

           
        ]
    },

    {
        title: "Inicio",
        icon: Settings,

        items: [

            {
                to: `/`,
                text: "Sucursales"
            },

        ]
    }

]

    return (
        <>
            {/* BOTÓN MOBILE */}
            <button
                onClick={() => setOpenSidebar(true)}
                className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
            >
                <Menu />
            </button>

            {/* OVERLAY */}
            {openSidebar && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setOpenSidebar(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`
  fixed md:sticky top-0 left-0
  h-screen w-64
  bg-white border-r z-50

  transform transition-transform duration-300

  ${openSidebar ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0
`}>

                {/* HEADER */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-bold">Discoteca</h2>
                    <button onClick={() => setOpenSidebar(false)} className="md:hidden">
                        <X />
                    </button>
                </div>

                {/* MENU */}
                <nav className="p-4 space-y-2">
                    {menu.map((section) => {
                        const Icon = section.icon
                        const isOpen = openSection === section.title

                        return (
                            <div key={section.title}>

                                {/* TITULO */}
                                <button
                                    onClick={() => toggleSection(section.title)}
                                    className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} />
                                        <span className="text-sm font-medium">
                                            {section.title}
                                        </span>
                                    </div>

                                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>

                                {/* SUBMENU */}
                                {isOpen && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                className={`
                          block px-2 py-1 text-sm rounded-md
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
                </nav>

            </aside>
        </>
    )
}
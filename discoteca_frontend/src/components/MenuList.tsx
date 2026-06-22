
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useParams,
} from "react-router-dom";

import {
  ArrowRightLeft,
  BanknoteArrowDown,
  BarChart3,
  Boxes,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  DollarSign,
  FileBarChart,
  Landmark,
  LayoutDashboard,
  Menu,
  Package,
  PackageCheck,
  PackageSearch,
  ReceiptText,
  Settings,
  ShoppingCart,
  TrendingUp,
  UserRoundCheck,
  Users,
  WalletCards,
  Trophy,
  Warehouse,
  X,
} from "lucide-react";

type MenuItem = {
  to: string;
  text: string;
  icon?: React.ElementType;
  end?: boolean;
};

type MenuSection = {
  title: string;
  icon: React.ElementType;
  items: MenuItem[];
};

export default function MenuList() {
  const location = useLocation();
  const { sucursalId } = useParams<{
    sucursalId: string;
  }>();

  const [openSidebar, setOpenSidebar] =
    useState(false);

  const [openSection, setOpenSection] =
    useState<string | null>(null);

  const baseSucursal = sucursalId
    ? `/sucursal/${sucursalId}`
    : "";

  const menu: MenuSection[] = useMemo(
    () => [
      {
        title: "Inventario",
        icon: Package,
        items: [
          {
            to: `${baseSucursal}/almacen`,
            text: "Almacenes",
            icon: Warehouse,
          },
          // {
          //   to: `${baseSucursal}/producto`,
          //   text: "Productos",
          //   icon: PackageSearch,
          // },
          {
            to: `${baseSucursal}/inventario`,
            text: "Inventario",
            icon: Boxes,
          },
        ],
      },



      {
        title: "Caja",
        icon: DollarSign,
        items: [
          {
            to: `${baseSucursal}/caja`,
            text: "Cajas",
            icon: CircleDollarSign,
          },
        ],
      },

      {
        title: "Personal",
        icon: Users,
        items: [
          {
            to: `${baseSucursal}/personal`,
            text: "Personal",
            icon: Users,
          },
        ],
      },

      {
        title: "Logística",
        icon: ArrowRightLeft,
        items: [
          {
            to: `${baseSucursal}/solicitud`,
            text: "Solicitudes",
            icon: ClipboardList,
          },
        ],
      },

      {
        title: "Reportes",
        icon: ChartNoAxesCombined,
        items: [
          {
            to: `${baseSucursal}/reportes`,
            text: "Panel general",
            icon: LayoutDashboard,
            end: true,
          },
          {
            to: `${baseSucursal}/reportes/estado-resultados`,
            text: "Estado de resultados",
            icon: FileBarChart,
          },
          {
            to: `${baseSucursal}/reportes/ventas`,
            text: "Resumen de ventas",
            icon: TrendingUp,
          },
          // {
          //   to: `${baseSucursal}/reportes/productos`,
          //   text: "Productos más vendidos",
          //   icon: PackageCheck,
          // },
          {
            to: `${baseSucursal}/reportes/vendedores`,
            text: "Ventas por mesero",
            icon: UserRoundCheck,
          },
          {
            to: `${baseSucursal}/reportes/metodos-pago`,
            text: "Métodos de pago",
            icon: WalletCards,
          },
          {
            to: `${baseSucursal}/reportes/inventario`,
            text: "Inventario general",
            icon: Boxes,
          },
          {
            to: `${baseSucursal}/reportes/stock-bajo`,
            text: "Stock bajo y agotados",
            icon: PackageSearch,
          },
          // {
          //   to: `${baseSucursal}/reportes/valor-inventario`,
          //   text: "Valor del inventario",
          //   icon: Landmark,
          // },
          {
            to: `${baseSucursal}/reportes/kardex`,
            text: "Kardex de productos",
            icon: ClipboardList,
          },
          {
            to: `${baseSucursal}/reportes/flujo-efectivo`,
            text: "Flujo de efectivo",
            icon: DollarSign,
          },
          {
            to: `${baseSucursal}/reportes/cierres-caja`,
            text: "Cierres de caja",
            icon: CircleDollarSign,
          },
          {
            to: `${baseSucursal}/reportes/solicitudes`,
            text: "Resumen de solicitudes",
            icon: BarChart3,
          },
          {
            to: `${baseSucursal}/reportes/productos-mas-vendidos`,
            text: "Productos más vendidos",
            icon: Trophy,
          },
        ],
      },

      {
        title: "Egresos",
        icon: BanknoteArrowDown,
        items: [
          {
            to: `${baseSucursal}/egreso`,
            text: "Egresos",
            icon: BanknoteArrowDown,
          },
        ],
      },

      {
        title: "Inicio",
        icon: Settings,
        items: [
          {
            to: "/",
            text: "Sucursales",
            icon: Settings,
          },
        ],
      },
    ],
    [baseSucursal]
  );

  /*
   * Recuperar estado del menú móvil.
   */
  useEffect(() => {
    const savedSidebar =
      localStorage.getItem("sidebar");

    if (savedSidebar !== null) {
      try {
        setOpenSidebar(
          JSON.parse(savedSidebar)
        );
      } catch {
        localStorage.removeItem("sidebar");
      }
    }
  }, []);

  /*
   * Guardar estado del menú móvil.
   */
  useEffect(() => {
    localStorage.setItem(
      "sidebar",
      JSON.stringify(openSidebar)
    );
  }, [openSidebar]);

  /*
   * Abrir automáticamente la sección que contiene
   * la ruta actual.
   */
  useEffect(() => {
    const currentSection = menu.find(
      (section) =>
        section.items.some((item) => {
          if (item.end) {
            return (
              location.pathname === item.to
            );
          }

          return location.pathname.startsWith(
            item.to
          );
        })
    );

    if (currentSection) {
      setOpenSection(currentSection.title);
    }
  }, [location.pathname, menu]);

  const toggleSection = (
    sectionTitle: string
  ) => {
    setOpenSection((currentSection) =>
      currentSection === sectionTitle
        ? null
        : sectionTitle
    );
  };

  const closeMobileSidebar = () => {
    setOpenSidebar(false);
  };

  if (!sucursalId) {
    return (
      <aside className="w-64 border-r bg-white p-5">
        <p className="text-sm font-semibold text-red-600">
          No se encontró el identificador de la
          sucursal.
        </p>

        <Link
          to="/"
          className="mt-4 block rounded-lg bg-black px-4 py-2 text-center text-sm font-semibold text-white"
        >
          Volver a sucursales
        </Link>
      </aside>
    );
  }

  return (
    <>
      {/* BOTÓN PARA MÓVIL */}
      <button
        type="button"
        onClick={() =>
          setOpenSidebar(true)
        }
        className="
          fixed left-4 top-4 z-50
          rounded-lg border bg-white p-2
          shadow-md md:hidden
        "
        aria-label="Abrir menú"
      >
        <Menu size={22} />
      </button>

      {/* FONDO OSCURO EN MÓVIL */}
      {openSidebar && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="
            fixed inset-0 z-40
            bg-black/40 md:hidden
          "
          onClick={closeMobileSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-72 flex-col
          border-r bg-white
          transition-transform duration-300
          md:sticky md:translate-x-0

          ${openSidebar
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >
        {/* ENCABEZADO */}
        <div
          className="
            flex min-h-16 items-center
            justify-between border-b px-5
          "
        >
          <div>
            <h2 className="font-bold text-gray-900">
              Discoteca
            </h2>

            <p className="text-xs text-gray-500">
              Gestión de sucursal
            </p>
          </div>

          <button
            type="button"
            onClick={closeMobileSidebar}
            className="
              rounded-lg p-2
              hover:bg-gray-100 md:hidden
            "
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENÚ CON SCROLL */}
        <nav
          className="
            flex-1 space-y-2
            overflow-y-auto p-4
          "
        >
          {menu.map((section) => {
            const SectionIcon =
              section.icon;

            const isOpen =
              openSection === section.title;

            const hasActiveItem =
              section.items.some((item) => {
                if (item.end) {
                  return (
                    location.pathname ===
                    item.to
                  );
                }

                return location.pathname.startsWith(
                  item.to
                );
              });

            return (
              <div key={section.title}>
                {/* TÍTULO DE LA SECCIÓN */}
                <button
                  type="button"
                  onClick={() =>
                    toggleSection(
                      section.title
                    )
                  }
                  className={`
                    flex w-full items-center
                    justify-between rounded-xl
                    px-3 py-2.5
                    transition-colors

                    ${hasActiveItem
                      ? "bg-gray-100 text-black"
                      : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <SectionIcon size={19} />

                    <span className="text-sm font-semibold">
                      {section.title}
                    </span>
                  </div>

                  {isOpen ? (
                    <ChevronDown size={17} />
                  ) : (
                    <ChevronRight size={17} />
                  )}
                </button>

                {/* SUBMENÚ */}
                {isOpen && (
                  <div
                    className="
                      ml-4 mt-1 space-y-1
                      border-l pl-3
                    "
                  >
                    {section.items.map(
                      (item) => {
                        const ItemIcon =
                          item.icon;

                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={
                              closeMobileSidebar
                            }
                            className={({
                              isActive,
                            }) => `
                              flex items-center gap-2
                              rounded-lg px-3 py-2
                              text-sm transition-colors

                              ${isActive
                                ? "bg-black font-semibold text-white"
                                : "text-gray-600 hover:bg-gray-100 hover:text-black"
                              }
                            `}
                          >
                            {ItemIcon && (
                              <ItemIcon
                                size={16}
                              />
                            )}

                            <span>
                              {item.text}
                            </span>
                          </NavLink>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
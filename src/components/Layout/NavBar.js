import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import ThemeSelector from "../ThemeSelector";
import Title from "./Title/Title";

const NavBar = () => {
  const menuItems = [
    { label: "Nosotros", href: "/nosotros" },
    { label: "Anotador", href: "/anotador" },
    { label: "Reglas", href: "/reglas" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-base-200 shadow-md z-50 h-16 flex items-center">
      <div className="navbar w-full max-w-screen-xl mx-auto py-4">
        <div className="navbar-start flex items-center">
          <Title />
          <a
            className="ml-4 btn btn-ghost btn-sm rounded-lg hover:bg-primary hover:text-primary-content transition-colors"
            href="/sugerencias"
          >
            <ChatBubbleBottomCenterTextIcon
              className="h-6 w-6 text-base-content"
              aria-hidden="true"
            />
          </a>
        </div>

        <div className="navbar-center flex items-center">
          <ThemeSelector />
        </div>

        <div className="navbar-end flex items-center">
          {/* Menú desplegable para dispositivos móviles */}
          <div className="dropdown dropdown-left lg:hidden">
            <label
              tabIndex={0}
              className="btn btn-ghost rounded-lg hover:bg-primary hover:text-primary-content transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52"
            >
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="hover:bg-primary hover:text-primary-content transition-colors rounded"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Menú horizontal para pantallas más grandes */}
          <ul className="hidden lg:flex space-x-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="btn btn-ghost text-base-content hover:bg-primary hover:text-primary-content transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

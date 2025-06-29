import Drawer from "./Drawer.tsx";
import NavBar from "./NavBar.tsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer drawer-end">
      {/* Checkbox que controla el drawer */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* Contenido principal: NavBar fijo arriba y contenido con padding para no quedar debajo */}
      <div className="drawer-content flex flex-col min-h-svh">
        <NavBar />
        {/* pt-16 para que el contenido no quede oculto debajo del NavBar fijo (h-16) */}
        <main className="flex-1 ">{children}</main>
      </div>

      {/* Drawer lateral */}
      <div className="drawer-side z-[60]">
        <Drawer />
      </div>
    </div>
  );
}

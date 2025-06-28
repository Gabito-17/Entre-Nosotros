import Drawer from "./Drawer.tsx";
import NavBar from "./NavBar.tsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer drawer-end">
      {/* Checkbox que controla el drawer */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* Contenido principal */}
      <div className="drawer-content flex flex-col min-h-screen pt-16">
        <NavBar />
        <main className="flex-grow">{children}</main>
      </div>

      {/* Drawer lateral */}
      <div className="drawer-side z-[60]">
        <Drawer />
      </div>
    </div>
  );
}

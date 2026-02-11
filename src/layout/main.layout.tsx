import { Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar.layout";
import Header from "./components/header.layout";

export default function MainLayout() {
  return (
    <div className="grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] h-screen">
      <div className="col-span-2 border border-b">
        <Header />
      </div>
      <div className="hidden w-64 row-start-2 py-5 overflow-y-auto border-r bg-card lg:block">
        <Sidebar />
      </div>

      {/* Main Content - scrollable */}
      <div className="row-start-2 p-5 overflow-auto space-y-5">
        <Outlet />
      </div>
    </div>
  );
}

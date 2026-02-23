import { Outlet } from "react-router-dom";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1">
        <div className="">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

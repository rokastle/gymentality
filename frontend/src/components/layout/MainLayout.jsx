import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="gm-site">
      <Navbar />
      <main className="gm-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

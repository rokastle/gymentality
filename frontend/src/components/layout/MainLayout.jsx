import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthDrawer from "../auth/AuthDrawer";

export default function MainLayout() {
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);

  return (
    <div className="gm-site">
      <Navbar onUserMenuOpen={() => setIsAuthDrawerOpen(true)} />
      <main className="gm-main">
        <Outlet />
      </main>
      <Footer />
      <AuthDrawer
        open={isAuthDrawerOpen}
        onClose={() => setIsAuthDrawerOpen(false)}
      />
    </div>
  );
}
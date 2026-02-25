import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PublicLayout() {
  return (
    <div className="app-layout">
      <Header />
      <main className="container main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

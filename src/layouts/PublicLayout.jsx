import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-dvh bg-gray-100">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

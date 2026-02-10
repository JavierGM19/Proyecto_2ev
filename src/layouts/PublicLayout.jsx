import { Outlet } from "react-router-dom";
import Header from "../components/Header";


export default function PublicLayout() {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="container-page py-8">
        <Outlet />
      </main>
    </div>
  );
}

import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/Toast';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-montserrat">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

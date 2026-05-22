import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Catalogo } from './pages/Catalogo';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Confirmation } from './pages/Confirmation';
import { Tracking } from './pages/Tracking';
import { Offers } from './pages/Offers';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Account } from './pages/Account';
import { Orders } from './pages/Orders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:category" element={<Catalogo />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmacion/:orderNumber" element={<Confirmation />} />
          <Route path="/seguimiento" element={<Tracking />} />
          <Route path="/ofertas" element={<Offers />} />
          <Route path="/sobre-nosotros" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/cuenta" element={<Account />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center py-24 px-4">
              <h1 className="text-4xl font-montserrat font-bold text-luxe-black mb-4">404</h1>
              <p className="text-sm font-montserrat text-luxe-gray-medium mb-8">Pagina no encontrada</p>
              <a href="/" className="text-sm font-montserrat font-medium text-luxe-blue hover:underline">
                Volver al inicio
              </a>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

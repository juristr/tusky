import './styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import PastOrdersPage from './pages/PastOrdersPage';
import CreateOrderPage from './pages/CreateOrderPage';
import { ProductDetailPage } from '@tusky/feat-product-detail';

export function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/past" element={<PastOrdersPage />} />
            <Route path="/orders/create" element={<CreateOrderPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

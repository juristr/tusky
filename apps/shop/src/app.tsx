import './styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import PastOrdersPage from './pages/PastOrdersPage';
import CreateOrderPage from './pages/CreateOrderPage';
import { ProductDetailPage } from '@tusky/feat-product-detail';
import { AuthProvider, ProtectedRoute } from '@tusky/util-auth';
import { LoginPage } from '@tusky/feat-login';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/past"
                element={
                  <ProtectedRoute>
                    <PastOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/create"
                element={
                  <ProtectedRoute>
                    <CreateOrderPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

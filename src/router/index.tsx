import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import AppLayout from '../components/layout/AppLayout';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import PosPage from '../features/pos/PosPage';
import ProductsPage from '../features/products/ProductsPage';
import ProductDetailView from '../features/products/ProductDetailView';
import CategoriesPage from '../features/categories/CategoriesPage';
import ClientsPage from '../features/clients/ClientsPage';
import ClientDebtView from '../features/clients/ClientDebtView';
import SalesPage from '../features/sales/SalesPage';
import AddSalePage from '../features/sales/AddSalePage';
import ReportsPage from '../features/reports/ReportsPage';

function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function PublicRoute() {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/pos" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to="/pos" replace /> },
          { path: '/pos', element: <PosPage /> },
          { path: '/sales', element: <SalesPage /> },
          { path: '/sales/add', element: <AddSalePage /> },
          { path: '/clients', element: <ClientsPage /> },
          { path: '/clients/:id', element: <ClientDebtView /> },
          { path: '/products', element: <ProductsPage /> },
          { path: '/products/:id', element: <ProductDetailView /> },
          { path: '/categories', element: <CategoriesPage /> },
          { path: '/reports', element: <ReportsPage /> },
        ],
      },
    ],
  },
]);

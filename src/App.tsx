import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { About } from './pages/About';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Products } from './pages/Products';
import { Settings } from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:slug', element: <ProductDetail /> },
      { path: 'about', element: <About /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

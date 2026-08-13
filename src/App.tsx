import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { About } from './pages/About';
import { Resources } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Products } from './pages/Products';
import { engineRoutes } from './engine/Engine';

const router = createBrowserRouter([
  engineRoutes,
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:slug', element: <ProductDetail /> },
      { path: 'resources', element: <Resources /> },
      { path: 'blog', element: <Navigate to="/resources" replace /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: 'about', element: <About /> },
      { path: 'settings', element: <Navigate to="/" replace /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

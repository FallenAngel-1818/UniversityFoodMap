import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { MapView } from './pages/MapView';
import { Rankings } from './pages/Rankings';
import { Profile } from './pages/Profile';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { GroupOrders } from './pages/GroupOrders';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'map', element: <MapView /> },
      { path: 'rankings', element: <Rankings /> },
      { path: 'profile', element: <Profile /> },
      { path: 'restaurant/:id', element: <RestaurantDetail /> },
      { path: 'group-orders', element: <GroupOrders /> },
    ],
  },
]);
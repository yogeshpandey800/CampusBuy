import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Dummy from './page/Dummy';
import Register from './page/Register';
import Home from './page/Home';
import Login from './page/Login.jsx';
import Otp from './page/Otp.jsx';
import Error from './page/Error.jsx';
import appstore from './utils/appstore.jsx';
import { Provider } from 'react-redux';
import UserProfile from './page/UserProfile.jsx';
import ListProductForm from './page/ListProductForm.jsx';
import Feedback from './page/Feedback.jsx';
import Footer from './Component/Footer.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import Notification from './Component/Notification.jsx';
import AuthInitializer from './utils/AuthInitializer.jsx';
import Chatpage from './page/Chatpage.jsx';
import History from './page/History.jsx';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from './page/ForgotPassword.jsx';
import Wishlist from './page/Wishlist.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import AdminDashboard from './page/AdminDashboard.jsx';
import AdminRoute from './utils/AdminRoute.jsx';
import LostFound from './page/LostFound.jsx';
import ProductDetail from './page/ProductDetail.jsx';

function App() {
  return (
    <Provider store={appstore}>
      <ThemeProvider>
        <WishlistProvider>
          <AuthInitializer>
            <Notification />
            <Outlet />
            <Footer />
          </AuthInitializer>
        </WishlistProvider>
      </ThemeProvider>
    </Provider>
  );
}

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'history',
        element: (
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        ),
      },
      {
        index: true,
        element: <Dummy />,
      },
      {
        path: 'dummy',
        element: <Dummy />,
      },
      {
        path: 'signup',
        element: <Register />,
      },
      {
        path: 'otp',
        element: <Otp />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'feedback',
        element: (
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        ),
      },
      {
        path: 'chat',
        element: (
          <ProtectedRoute>
            <Chatpage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'home',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: 'wishlist',
        element: (
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: 'sell',
        element: (
          <ProtectedRoute>
            <ListProductForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'lost-found',
        element: (
          <ProtectedRoute>
            <LostFound />
          </ProtectedRoute>
        ),
      },
      {
        path: 'product/:id',
        element: (
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <Error />,
      },
    ],
    errorElement: <Error />,
  },
]);

function root() {
  return <RouterProvider router={appRouter} />;
}

export default root;

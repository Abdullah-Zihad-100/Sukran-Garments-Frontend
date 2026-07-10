import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import ProductForm from "./pages/Admin/ProductForm";
import Dashboard from "./pages/Admin/Dashboard";
import Order from "./pages/Admin/Order";
import ProductList from "./pages/Admin/ProductList";
import Navbar from "./Components/Navbar";
import Favorites from "./pages/Favorites";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AdminLayout from "./admin/AdminLayout";
import { useAdmin } from "@/context/AdminContext";
import TrackOrder from "./pages/TrackOrder";
import { useEffect } from "react";

function AdminRoute() {
  const { token } = useAdmin();
  return token ? <Outlet /> : <Navigate to="/admin/login" />;
}

// Public layout — Navbar + Footer শুধু এখানে
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/track-order" element={<TrackOrder/>} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        {/* Admin Routes — Navbar/Footer নেই */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Order />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

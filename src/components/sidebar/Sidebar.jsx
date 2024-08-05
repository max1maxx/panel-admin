import { useContext, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoWWW from "../../assets/images/www.svg";
import {
  MdOutlineClose,
  MdOutlineLogout,
  MdOutlinePeople,
  MdOutlineSettings,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const { logout, user } = useAuth();
  const location = useLocation(); // Obtener la ubicación actual
  // Función para determinar si el enlace está activo
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="navbar-brand">
          <img src={LogoWWW} alt=""/>
          <span className="sidebar-brand-text p-2">power admin</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="menu-item nav-item">
              <Link to="/dispositivos" className={`menu-link ${isActive('/dispositivos')}`}>
                <span className="menu-link-icon">
                  <MdOutlineSettings size={20} />
                </span>
                <span className="menu-link-text">Dispositivos</span>
              </Link>
            </li>
            {user?.isAdmin && (
              <li className={`menu-item ${isActive('/usuarios')}`}>
                <Link to="/usuarios" className="menu-link">
                  <span className="menu-link-icon">
                    <MdOutlinePeople size={20} />
                  </span>
                  <span className="menu-link-text">Usuarios</span>
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="menu-item">
              <div className="menu-link" onClick={logout}>
                <Link className="menu-link">
                  <span className="menu-link-icon">
                    <MdOutlineLogout size={20} />
                  </span>
                  <span className="menu-link-text">Cerrar sesión</span>
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;

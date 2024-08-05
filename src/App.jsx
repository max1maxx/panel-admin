import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound } from "./screens";
import Login from "./screens/login/LoginScreen";
import ConfigScreen from "./screens/config/ConfigScreen";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes";
import { ConfigProvider } from "./context/ConfigContext";
import EditarScreen from "./screens/edit/EditarScreen";
import UsersScreen from "./screens/users/UsersScreen";
function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // adding dark-mode class if the dark mode is set on to the body tag
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <AuthProvider>
      <ConfigProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/login" element={<Login />} /> */}
            <Route element={<BaseLayout />}>
              <Route element={<ProtectedRoute />}>
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                <Route path="/dispositivos" element={<ConfigScreen />} />
                <Route path="/usuarios" element={<UsersScreen />} />
                <Route path="/editar/:id" element={<EditarScreen />} />
                <Route path="*" element={<PageNotFound />} />
              </Route>
            </Route>
          </Routes>

          {/* <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
          >
            <img
              className="theme-icon"
              src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
            />
          </button> */}
        </Router>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;

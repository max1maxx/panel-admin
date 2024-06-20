import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";

const AreaTableAction = ({ id }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Fix typo: removeEventListener instead of addEventListener
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="action-dropdown-btn"
        onClick={handleDropdown}
      >
        <HiDotsHorizontal size={18} />
        {showDropdown && (
          <div className="action-dropdown-menu" ref={dropdownRef}>
            <ul className="navbar-nav">
              <li className="dropdown-item">
                <Link to={`/informacion/${id}`} className="dropdown-menu-link">
                  Ver
                </Link>
              </li>
              <li className="dropdown-item">
                <Link to={`/editar/${id}`} className="dropdown-menu-link">
                  Editar
                </Link>
              </li>
              <li className="dropdown-item">
                <Link to={`/eliminar/${id}`} className="dropdown-menu-link">
                  Eliminar
                </Link>
              </li>
            </ul>
          </div>
        )}
      </button>
    </>
  );
};

export default AreaTableAction;

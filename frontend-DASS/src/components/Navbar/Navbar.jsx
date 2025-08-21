import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import pfp from "../../assets/pfp.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(loggedIn);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);

    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  return (
    <header className="navbar-container">
      <Link to="/" className="logo-container">
        <img src={logo} alt="DASS Logo" className="logo" />
        <span className="site-title">Dynamic Academic Submission System</span>
      </Link>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </div>

      <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a href="/" className="nav-button">Home</a>

        {/* Show Dashboard only if user is logged in and not an admin */}
        {isLoggedIn && userRole !== "admin" && (
          <a href="/dashboard" className="nav-button">Dashboard</a>
        )}

        {/* Only show Publications if user is not admin */}
        {userRole !== "admin" && (
          <a href="/publications" className="nav-button">Publications</a>
        )}

        <a href="/conference" className="nav-button">Conferences</a>
        <a href="/aboutus2" className="nav-button">About Us</a>

        {isLoggedIn ? (
          <div className="profile-container">
            <img
              src={pfp}
              alt="Profile"
              className="profile-img"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="profile-dropdown">
                <a href="/profile" className="dropdown-item">Profile</a>
                {userRole === "admin" && (
                  <a href="/admin" className="dropdown-item admin-item">Admin Page</a>
                )}
                <button className="dropdown-item logout" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <a href="/login" className="nav-button">Login</a>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

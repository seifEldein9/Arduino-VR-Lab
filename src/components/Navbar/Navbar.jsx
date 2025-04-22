import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Menu, MenuItem, IconButton, useMediaQuery } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../../Assets/imgs/Untitled-1-11.png";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // التحقق من وجود التوكين عند تحميل الصفحة
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    handleCloseUserMenu();
  };

  const handleProfileRedirect = () => {
    navigate("/Profile");
    handleCloseUserMenu();
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <AppBar
      position="sticky"
      style={{
        zIndex: 1100,
        background: "none",
        boxShadow: "none",
        color: "#fff",
      }}
    >
      <Toolbar
        style={{
          minHeight: "45px",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="logo-container">
          <Link to="/" style={{ textDecoration: "none", marginRight: "20px" }}>
            <img src={logo} alt="logo" width={100} height={100} />
          </Link>
          {isMobile ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
              style={{ color: "#2E3289" }}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          ) : (
            <div className="nav-links">
              {["/Store", "/commentary", "/contact"].map((path, index) => (
                <Button
                  key={index}
                  component={Link}
                  to={path}
                  className={location.pathname === path ? "active" : ""}
                  style={{ color: "#fff", marginRight: "10px" }}
                >
                  {path.slice(1) || "Home"}
                </Button>
              ))}
            </div>
          )}
        </div>

      
        <div className="auth-options" style={{ display: "flex", alignItems: "center" }}>
          {isLoggedIn ? (
            <>
              <IconButton
                id="user-button"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                style={{ color: "#fff", marginRight: "10px"  }}
                onClick={handleOpenUserMenu}
              >
        <PersonIcon style={{ fontSize: 40 }} />  
        </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleProfileRedirect}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Sign out</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to="/Login"
              style={{ color: "#fff", marginRight: "10px" }}
            >
              Login
            </Button>
          )}
        </div>
      </Toolbar>

      {/* القائمة الجانبية عند الأجهزة الصغيرة */}
      {isMobile && isMobileMenuOpen && (
        <div className="mobile-nav-links">
          {["/Store", "/commentary", "/contact"].map((path, index) => (
            <Button
              key={index}
              component={Link}
              to={path}
              className={location.pathname === path ? "active" : ""}
              style={{ color: "#2E3289", marginRight: "10px" }}
              onClick={handleMobileMenuToggle}
            >
              {path.slice(1).toUpperCase() || "HOME"}
            </Button>
          ))}
        </div>
      )}
    </AppBar>
  );
}

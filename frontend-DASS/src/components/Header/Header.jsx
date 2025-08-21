import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Good Afternoon! Welcome to</h1>
        <h2 className="hero-subtitle">DASS</h2>
        <p className="hero-description">
          The all-in-one platform for managing research submissions and conferences
        </p>
        <a href="#features" className="hero-button">Explore Features</a>
      </div>
    </section>
  );
};

export default Header;
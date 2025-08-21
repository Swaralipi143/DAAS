import React from "react";
import "./footer.css";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Services Section */}
        <div className="footer-section">
          <h3>SERVICES</h3>
          <ul>
            <li><a href="#">Conference Management</a></li>
            <li><a href="#">Registration</a></li>
            <li><a href="#">Publishing</a></li>

          </ul>
        </div>

        {/* About Section */}
        <div className="footer-section">
          <h3>ABOUT US</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Testimonials</a></li>
            <li><a href="#">Policy for Conferences</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        {/* Conferences Section */}
        <div className="footer-section">
          <h3>CONFERENCES</h3>
          <ul>
            <li><a href="#">Create Conference</a></li>
            <li><a href="#">Licenses & Pricing</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        {/* Contact Us Section */}
        <div className="footer-section contact-section">
          <h3>CONTACT US</h3>
          <div className="social-icons">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="footer-bottom">
        <p>© 2024 DASS. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

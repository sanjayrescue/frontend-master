import Home from './Home'
import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone, Mail, Clock } from "lucide-react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const MainLayout = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Channel Partner", href: "/channel-partner" },
    { name: "Documents", href: "/documents" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <>
      {/* Top Info Bar */}
      <div className="sticky top-0 z-50 w-full bg-white shadow-md">
        <div className="hidden lg:block bg-gray-900 text-gray-200 text-[11px] sm:text-xs md:text-sm w-full font-inter">
          <div className="w-full px-3 sm:px-4 lg:px-8 py-2.5 flex flex-col sm:flex-wrap sm:flex-row items-center gap-2 sm:gap-3 md:gap-4 sm:justify-center md:justify-end">

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 justify-center">

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#12B99C]" />
                <p className="font-semibold">
                  Opening Hour :
                  <span className="text-gray-400"> Mon - Fri, 9:00 AM - 6:00 PM</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#12B99C]" />
                <a href="tel:+918766681450" className="font-semibold hover:text-[#12B99C]">
                  Call Us : <span className="text-gray-400">+91 8766681450</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#12B99C]" />
                <a href="mailto:support@trustlinefintech.com" className="font-semibold hover:text-[#12B99C]">
                  Email Us : <span className="text-gray-400">support@trustlinefintech.com</span>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Navbar */}
        <header className="bg-white w-full font-inter border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#12B99C] to-[#0ea688] rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                  T
                </div>
                <div>
                  <div className="text-base sm:text-xl font-bold text-gray-800">Trustline Fintech</div>
                  <div className="text-[10px] sm:text-xs text-[#12B99C] font-medium">Financial Consultancy</div>
                </div>
              </div>

              <nav className="hidden lg:flex items-center space-x-6">
                {navItems.map((item, index) => {
                  const isActive =
                    (item.href === "/Home" && (currentPath === "/" || currentPath === "/Home")) ||
                    (item.href !== "/Home" && currentPath.startsWith(item.href));

                  return (
                    <div key={index} className="relative group">
                      <a
                        href={item.href}
                        className={`px-2 py-1 rounded-lg font-medium transition-all ${
                          isActive
                            ? "text-[#12B99C] bg-[#12B99C]/10"
                            : "text-gray-700 hover:text-[#12B99C] hover:bg-[#12B99C]/5"
                        }`}
                      >
                        {item.name}
                      </a>
                    </div>
                  );
                })}
              </nav>

              <div className="flex items-center gap-3">

                <button
                  className="hidden lg:inline-flex px-4 py-2 border border-[#12B99C] text-[#12B99C] rounded-full hover:bg-[#12B99C]/10 transition"
                  onClick={() => navigate('/PartnerRegistrationForm')}
                >
                  Become Partner
                </button>

                <button
                  className="hidden lg:inline-flex px-4 py-2 bg-gradient-to-r from-[#12B99C] to-[#0ea688] text-white rounded-full hover:shadow-lg hover:-translate-y-0.5 transition"
                  onClick={() => navigate("/LoginPage")}
                >
                  Login
                </button>

                <button
                  onClick={toggleMenu}
                  className="lg:hidden p-2 rounded-md text-gray-700 hover:text-[#12B99C] hover:bg-gray-100"
                >
                  {isMenuOpen ? <X /> : <Menu />}
                </button>

              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-white z-50 lg:hidden transform transition-transform ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={toggleMenu}
        >
          <div
            className="fixed right-0 top-0 w-64 h-full bg-white shadow-lg p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Navigation</h2>
              <button className="p-2" onClick={toggleMenu}><X /></button>
            </div>

            <nav className="flex flex-col space-y-4 flex-grow">
              {navItems.map((item, index) => {
                const isActive =
                  (item.href === "/Home" &&
                    (currentPath === "/" || currentPath === "/Home")) ||
                  (item.href !== "/Home" && currentPath.startsWith(item.href));

                return (
                  <a
                    key={index}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      isActive
                        ? "text-[#12B99C] bg-[#12B99C]/10"
                        : "text-gray-700 hover:text-[#12B99C] hover:bg-[#12B99C]/5"
                    }`}
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </a>
                );
              })}
            </nav>

            <button
              className="w-full px-4 py-2 bg-[#0ea688] text-white rounded-full hover:shadow-lg"
              onClick={() => {
                navigate("/LoginPage");
                toggleMenu();
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white pt-12 pb-6 px-4 sm:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* About Us */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#12B99C]">About Us</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Trustline Fintech brings to you the easiest & most optimized online portal for effective financial consultation and services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#12B99C]">Quick Links</h2>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="/" className="hover:text-[#12B99C]">Home</a></li>
              <li><a href="/Contact" className="hover:text-[#12B99C]">Contact Us</a></li>
              <li><a href="/PartnerRegistrationForm" className="hover:text-[#12B99C]">Apply Channel Partner</a></li>
            </ul>
          </div>

 <div>
 <h2 className="text-xl font-bold mb-4 text-[#12B99C]">Social Links</h2>
 <div className="mt-6">
             
              <div className="flex items-center gap-4">

                <a
                  href="https://www.facebook.com/profile.php?id=61578373723382"
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 hover:border-[#12B99C] hover:text-[#12B99C] transition"
                >
                  <FaFacebookF size={18} />
                </a>

                <a
                  href="https://www.instagram.com/trustline_fintech"
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 hover:border-[#12B99C] hover:text-[#12B99C] transition"
                >
                  <FaInstagram size={20} />
                </a>

                <a
                  href="https://wa.me/918766681450"
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 hover:border-[#12B99C] hover:text-[#12B99C] transition"
                >
                  <FaWhatsapp size={20} />
                </a>

              </div>
            </div>
 </div>
          {/* Legal */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#12B99C]">Documents & Legal</h2>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="/Documents" className="hover:text-[#12B99C]">Documents List</a></li>
              <li><a href="/TermsConditions" className="hover:text-[#12B99C]">Terms & Conditions</a></li>
              <li><a href="/PrivacyPolicy" className="hover:text-[#12B99C]">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact + Social Media */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#12B99C]">Contact & Address</h2>

            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <FaEnvelope className="mt-1 text-[#12B99C]" />
                <a href="mailto:support@trustlinefintech.com" className="hover:text-[#12B99C]">support@trustlinefintech.com</a>
              </li>

              <li className="flex items-start gap-3">
                <FaPhoneAlt className="mt-1 text-[#12B99C]" />
                <a href="tel:+918766681450" className="hover:text-[#12B99C]">+91 8766681450</a>
              </li>

              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-[#12B99C]" />
                <span>
                  SR.No.53/2A/1, Office No. 014,<br />
                  A Wing, 3rd Floor,<br />
                  City Vista Fountain Road,<br />
                  Ashoka Nagar,<br />
                  Kharadi, Pune - 411014
                </span>
              </li>
            </ul>

            {/* ⭐ SOCIAL MEDIA SECTION */}
            {/* <div className="mt-6">
              <h2 className="text-xl font-bold mb-4 text-[#12B99C]">Follow Us</h2>

              <div className="flex items-center gap-4">

                <a
                  href="https://www.facebook.com/profile.php?id=61578373723382"
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 hover:border-[#12B99C] hover:text-[#12B99C] transition"
                >
                  <FaFacebookF size={18} />
                </a>

                <a
                  href="https://www.instagram.com/trustline_fintech"
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 hover:border-[#12B99C] hover:text-[#12B99C] transition"
                >
                  <FaInstagram size={20} />
                </a>

                <a
                  href="https://wa.me/918766681450"
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 hover:border-[#12B99C] hover:text-[#12B99C] transition"
                >
                  <FaWhatsapp size={20} />
                </a>

              </div>
            </div> */}

          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
          © 2025 Trustline Fintech. All Rights Reserved.
        </div>
      </footer>
    </>
  );
};

export default MainLayout;

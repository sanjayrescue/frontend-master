import Home from './Home'
import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone, Mail, Clock } from "lucide-react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const MainLayout = () => {

    const navigate = useNavigate();



    const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/"); // State to hold the current path
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Channel Partner", href: "/channel-partner" },
    { name: "Documents", href: "/documents" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact", href: "/contact" },
    
  ];

  // Effect to set the current path on component mount
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);


  return (


    





<>

<div className="fixed top-0 left-0 z-50 w-full">

<div className="bg-gray-900 text-gray-200 text-sm  w-full shadow-lg font-inter">
  <div className="w-full px-5 mx-auto py-4 flex flex-col md:flex-row items-center justify-end">
    {/* Right Section: Info */}
    <div className="flex flex-wrap md:flex-nowrap items-center gap-6">
      {/* Opening Hours */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#12B99C]" />
        <p className="font-semibold">
          Opening Hour : 
          <span className="text-gray-400"> Mon - Fri, 9:00 AM - 6:00 PM</span>
        </p>
      </div>

      {/* Call Us */}
      <div className="flex items-center gap-2">
        <span>&nbsp;&nbsp;</span>
        <Phone className="w-4 h-4 text-[#12B99C]" />
        <p className="font-semibold">
       
          Call Us :
          <span className="text-gray-400"> +91 8766681450 &nbsp;&nbsp;</span>
        </p>
      </div>

      {/* Email Us */}
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-[#12B99C]" />
        <p className="font-semibold">
          Email Us :
          <span className="text-gray-400">  support@trustlinefintech.com</span>
        </p>
      </div>
    </div>
  </div>
</div>

{/* Navbar */}
<header className="bg-white shadow-lg  w-full z-40 font-inter">
  <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center py-2">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#12B99C] to-[#0ea688] rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg">
          T
        </div>
        <div className="hidden sm:block">
          <div className="text-xl font-bold text-gray-800">Trustline Fintech</div>
          <div className="text-xs text-[#12B99C] font-medium">
            Financial Consultancy
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-6">
        {navItems.map((item, index) => {
          const isActive =
            (item.href === "/Home" &&
              (currentPath === "/" || currentPath === "/Home")) ||
            (item.href !== "/Home" && currentPath.startsWith(item.href));
          return (
            <div key={index} className="relative group nav-link">
          <a
            href={item.href}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "text-[#12B99C] bg-[#12B99C]/10"
                    : "text-gray-700 hover:text-[#12B99C] hover:bg-[#12B99C]/5"
                }`}
              >
                {item.name}
                {item.dropdown && <ChevronDown className="w-4 h-4" />}
              </a>
            </div>
          );
        })}
      </nav>

      {/* Right Buttons */}
      <div className="flex items-center gap-3">

        {/* Sign Up */}
        <button
          className="cursor-pointer hidden lg:inline-flex items-center px-4 py-2 border border-[#12B99C] text-[#12B99C] font-medium rounded-full hover:bg-[#12B99C]/10 transition-all duration-200"
          onClick={() => { navigate('/PartnerRegistrationForm'); }}
        >
          <h1>Become Partner</h1>
        </button>




        {/* Login */}
        <button
          className="cursor-pointer hidden lg:inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#12B99C] to-[#0ea688] text-white font-medium rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          onClick={() => {
            navigate("/LoginPage");
          }}
        >
          <h1>Login</h1>
        </button>

        {/* Mobile Menu */}
        <button
          onClick={toggleMenu}
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#12B99C] hover:bg-gray-100"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </div>
  </div>
</header>

{/* Mobile Menu Overlay */}
<div
  className={`fixed inset-0 bg-white/50 z-50 lg:hidden transform transition-transform duration-300 ease-in-out backdrop-blur-md ${
    isMenuOpen ? "translate-x-0" : "translate-x-full"
  }`}
  onClick={toggleMenu}
>
  <div
    className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg p-6 flex flex-col font-inter"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-800">Navigation</h2>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md text-gray-700 hover:text-[#12B99C] hover:bg-gray-100"
      >
        <X className="w-6 h-6" />
      </button>
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
            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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
    <div className="mt-6">
      <button
        className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#0ea688] text-white font-medium rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        onClick={() => {
          navigate("/LoginPage");
          toggleMenu();
        }}
      >
        <h1>Login</h1>
      </button>
    </div>
  </div>
</div>

</div>

<main>
<Outlet />
</main> 





      <footer className="bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white pt-12 pb-6 px-4 sm:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* About Us */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-[#12B99C]">About Us</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            Trustline Fintech brings to you the easiest & most optimized online portal for effective financial consultation and services. With our 24×7 service, we ensure top-notch support & astounding advantages.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-[#12B99C]">Quick Links</h2>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><a href="/Home" className="hover:text-[#12B99C] transition">Home</a></li>
            {/* <li><a href="/AboutUs" className="hover:text-[#12B99C] transition">About Us</a></li> */}
            <li><a href="/Contact" className="hover:text-[#12B99C] transition">Contact Us</a></li>
            <li><a href="/PartnerRegistrationForm" className="hover:text-[#12B99C] transition">Apply Channel Partner</a></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-[#12B99C]">Documents & Legal</h2>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><a href="/Documents" className="hover:text-[#12B99C] transition">Documents List</a></li>
            <li><a href="/TermsConditions" className="hover:text-[#12B99C] transition">Terms & Conditions</a></li>
            <li><a href="/PrivacyPolicy" className="hover:text-[#12B99C] transition">Privacy Policy</a></li>
            {/* <li><a href="#" className="hover:text-[#12B99C] transition">Disclaimer</a></li> */}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-[#12B99C]">Contact & Address</h2>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <FaEnvelope className="mt-1 text-[#12B99C]" />
              <a href="mailto:support@trustlinefintech.com" className="hover:text-[#12B99C] transition">support@trustlinefintech.com</a>
            </li>
            <li className="flex items-start gap-3">
              <FaPhoneAlt className="mt-1 text-[#12B99C]" />
              <a href="tel:+918766681450" className="hover:text-[#12B99C] transition">+91 8766681450</a>
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
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
        © 2025 Trustline Fintech. All Rights Reserved.
      </div>
    </footer>
</>
  )
}

export default MainLayout

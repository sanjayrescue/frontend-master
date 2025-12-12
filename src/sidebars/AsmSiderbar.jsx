import React, { useState, useEffect } from "react";

import {
  Users,
  UserCheck,
  Building2,
  Menu,
  Download,
  LayoutGrid,
  Bell,
  User,
  Settings,
  LogOut,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  FileText,
  LineChart,
  BarChart2,
  ClipboardList,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  MapPin,
  Edit,
  Lock, // ✅ add this
} from "lucide-react";
import axios from "axios"

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getAuthData, clearAuthData } from "../utils/localStorage";
import { useDispatch, useSelector } from "react-redux";
import { fetchAsmProfile } from "../feature/thunks/asmThunks";
import Profile from "./users/userProfile/Profile";
import logo from "../assets/logo.png";

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "success",
    title: "New Partner Registered",
    message: "ABC Financial Services has successfully registered as a partner.",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight at 2:00 AM.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Monthly Report Ready",
    message: "Your monthly analytics report is now available for download.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "error",
    title: "Failed Transaction Alert",
    message: "Multiple transaction failures detected in the system.",
    time: "5 hours ago",
    read: true,
  },
];

// Admin sidebar component
const AsmSiderbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [loadingPassChange, setLoading] = useState(false);
  const [errorPassChange, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [ChangePasswordModel, setChangePasswordModel] = useState(null);

  // Get Redux profile state
  const { loading, error, data } = useSelector((state) => state.asm.profile);

  // Fetch profile when component mounts or token changes
  useEffect(() => {
    const { asmToken } = getAuthData();
    if (asmToken) {
      dispatch(fetchAsmProfile(asmToken));
    }
  }, [dispatch]);

  // Get fallback user data from localStorage (for initial render before Redux loads)
  const getFallbackUser = () => {
    const authData = getAuthData();
    return authData?.asmUser || null;
  };

  const fallbackUser = getFallbackUser();



  // Sidebar navigation items with icons and routes

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutGrid, path: "/Asm/dashboard" },
    { name: "RM", icon: Users, path: "/Asm/RM" },
    { name: "Partners", icon: UserCheck, path: "/Asm/partners" },
    { name: "Customers", icon: Users, path: "/Asm/customers" },
    { name: "Applications", icon: FileText, path: "/Asm/applications" },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    clearAuthData();
    navigate("/");
  };

  const [formData, setFormData] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    setError("");
    setSuccess("");
  
    // Basic validation
    if (!formData.oldPassword || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      setLoading(true);
  
      const { asmToken} = getAuthData(); // or however you store JWT
  
      const response = await axios.post(
        `${backendurl}/auth/change-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${asmToken}`,
          },
        }
      );
  
  
      setSuccess(response.data.message);
      setFormData({ oldPassword: "", password: "", confirmPassword: "" });
  
      // Close modal if needed
      setChangePasswordModel(false);
    } catch (err) {
      console.error("API error:", err.response?.data || err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      console.log("handleSubmit finished, loading set to false");
    }
    
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-55" : "w-20"
        } bg-white shadow-xl transition-all duration-300 flex flex-col sticky top-0 h-screen border-r border-gray-200`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
          <div className="w-10 h-10  rounded-lg flex items-center justify-center ">
              <span className="text-white font-bold text-lg">
                <img src={logo} alt="logo" />
              </span>
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold text-gray-800 tracking-wide">
                TRUSTLINE
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 overflow-y-auto px-3">
          {sidebarItems.map((item, index) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-4 py-3 mb-2 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r bg-teal-500  text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <item.icon size={22} className={active ? "text-white" : ""} />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} className="text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                ASM Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="cursor-pointer relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Bell size={20} className="cursor-pointer text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="cursor-pointer flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold shadow-lg">
                    {(data?.fullName?.charAt(0) || data?.firstName?.charAt(0) || fallbackUser?.firstName?.charAt(0) || "U").toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-800">
                      {data?.fullName || (data?.firstName && data?.lastName ? `${data.firstName} ${data.lastName}` : null) || (fallbackUser?.firstName && fallbackUser?.lastName ? `${fallbackUser.firstName} ${fallbackUser.lastName}` : null) || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {data?.email || fallbackUser?.email || "N/A"}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Change Password */}

      {ChangePasswordModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative mx-4">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              onClick={() => setChangePasswordModel(false)}
            >
              <span className="text-2xl">&times;</span>
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Change Password
            </h2>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Old Password */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="oldPassword"
                >
                  Old Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                  placeholder="Enter old password"
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="password"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition duration-300"
              >
                Change Password

              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Side Panel */}
      {profileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
            onClick={() => setProfileOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
              <button
                onClick={() => setProfileOpen(false)}
                className=" p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="cursor-pointer text-gray-600" />
              </button>
            </div>

            <div className="">
              {/*  
              <Profile setProfileOpen={setProfileOpen} data={data} >
               
             </Profile> */}
              <div className="h-full w-full bg-white shadow-lg z-50 flex flex-col max-h-[90vh]">
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    {/* Avatar & Name */}
                    <div className="flex flex-col items-center text-center mb-8">
                      <div className="w-20 h-20 rounded-full bg-[#12B99C] flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                        {(data?.fullName?.charAt(0) || data?.firstName?.charAt(0) || fallbackUser?.firstName?.charAt(0) || "U").toUpperCase()}
                      </div>
                      <h2 className="text-2xl font-semibold text-[#111827] mb-2">
                        {data?.fullName || (data?.firstName && data?.lastName ? `${data.firstName} ${data.lastName}` : null) || (fallbackUser?.firstName && fallbackUser?.lastName ? `${fallbackUser.firstName} ${fallbackUser.lastName}` : null) || "Update your Name"}
                      </h2>
                    </div>

                    {/* Profile Information */}
                    <div className="space-y-6">
                      {/* Mobile No */}
                      <div className="flex items-start gap-4">
                        <Phone className="w-5 h-5 text-[#12B99C]" />
                        <div>
                          <p className="text-sm font-semibold text-gray-500">
                            Mobile No
                          </p>
                          <p className="text-[#111827]">
                            {data?.phone || "Update your Mobile No"}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-4">
                        <Mail className="w-5 h-5 text-[#12B99C]" />
                        <div>
                          <p className="text-sm font-semibold text-gray-500">
                            Email
                          </p>
                          <p className="text-[#111827]">
                            {data?.email || "Update your Email"}
                          </p>
                        </div>
                      </div>

                      {/* DOB */}
                      <div className="flex items-start gap-4">
                        <Calendar className="w-5 h-5 text-[#12B99C]" />
                        <div>
                          <p className="text-sm font-semibold text-gray-500">
                            Date of Birth
                          </p>
                          <p className="text-[#111827]">
                            {data?.dob
                              ? new Date(data?.dob).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "Update your DOB"}
                          </p>
                        </div>
                      </div>

                      {/* DOJ */}
                      <div className="flex items-start gap-4">
                        <Briefcase className="w-5 h-5 text-[#12B99C]" />
                        <div>
                          <p className="text-sm font-semibold text-gray-500">
                            Date of Joining
                          </p>
                          <p className="text-[#111827]">
                            {data?.JoiningDate
                              ? new Date(data?.JoiningDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "Update your DOJ"}
                          </p>
                        </div>
                      </div>

                      {/* Region */}
                      <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-[#12B99C]" />
                        <div>
                          <p className="text-sm font-semibold text-gray-500">
                            Region
                          </p>
                          <p className="text-[#111827]">
                            {data?.region || "Update your Region"}
                          </p>
                        </div>
                      </div>

                      {/* ASM Details */}
                    </div>

                    {/* Settings Section */}
                    <div className="mt-4 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-[#12B99C]" /> Settings
                      </h3>

                      {/* Change Password */}
                      <div className="flex items-center gap-3 cursor-pointer hover:text-[#12B99C]">
                        <Lock className="w-5 h-5" />
                        <button
                          className="text-[#111827]"
                          onClick={() => {
                            setChangePasswordModel(true);
                          }}
                        >
                          Change Password
                        </button>
                      </div>

                      {/* Logout */}
                      <div
                        className="flex items-center gap-3 cursor-pointer hover:text-red-500"
                        onClick={() => handleLogout()}
                      >
                        <LogOut className="w-5 h-5" />
                        <p className="text-[#111827]">Log Out</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notifications Side Panel */}
      {notificationOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
            onClick={() => setNotificationOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Notifications ({notifications.length})
              </h3>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="cursor-pointer text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setNotificationOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="cursor-pointer text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  !notification.read
                                    ? "text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {notification.time}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="p-1 hover:bg-red-100 rounded transition-colors ml-2"
                            >
                              <Trash2
                                size={14}
                                className="cursor-pointer text-red-500"
                              />
                            </button>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="cursor-pointer text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AsmSiderbar;

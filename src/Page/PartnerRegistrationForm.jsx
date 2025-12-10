import React, { useState, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  CreditCard,
  Lock,
  Upload,
  CheckCircle,
  Calendar,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { signupPartner } from "../feature/thunks/partnerThunks";
import { useDispatch } from "react-redux";

const PartnerRegistrationForm = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [successMessageType, setSuccessMessageType] = useState(""); // "success" or "error"
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const adharInputRef = useRef(null);
  const panInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    dob: "",
    aadharNumber: "",
    panNumber: "",
    region: "",
    rmCode: "",
    pincode: "",
    employmentType: "",
    address: "",
    homeType: "",
    addressStability: "",
    landmark: "",
    adharCard: null, // assign file via input later
    panCard: null, // assign file via input later
    selfie: null, // assign file via input later
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    password: "",
    confirmPassword: "",
  });

  const showError = (message) => {
    setSuccessMessageType("error");
    setSuccessMessage(message);
    setShowPopup(true);
    return false;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleRemoveFile = (name) => {
    setFormData({
      ...formData,
      [name]: null,
    });

    if (name === "adharCard" && adharInputRef.current) {
      adharInputRef.current.value = "";
    }
    if (name === "panCard" && panInputRef.current) {
      panInputRef.current.value = "";
    }
    if (name === "selfie" && selfieInputRef.current) {
      selfieInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation rules
    const requiredFields = [
      "firstName",
      "lastName",
      "phone",
      "email",
      "dob",
      "aadharNumber",
      "panNumber",
      "region",
      "address",
      "pincode",
      "homeType",
      "addressStability",
      "employmentType",
      "bankName",
      "accountNumber",
      "ifscCode",
      "password",
      "confirmPassword",
    ];

    for (const field of requiredFields) {
      if (!formData[field] || `${formData[field]}`.trim() === "") {
        return showError("Please fill all required fields.");
      }
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      return showError("Enter a valid 10-digit phone number");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return showError("Enter a valid email address");
    }

    if (!/^\d{12}$/.test(formData.aadharNumber)) {
      return showError("Enter a valid 12-digit Aadhar number");
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      return showError("Enter a valid PAN number (ABCDE1234F)");
    }

    if (formData.password.length < 6) {
      return showError("Password must be at least 6 characters long");
    }

    if (formData.password !== formData.confirmPassword) {
      return showError("Password and Confirm Password do not match");
    }

    // File validations
    if (!formData.adharCard || !formData.panCard || !formData.selfie) {
      return showError("Aadhaar, PAN and Selfie files are required");
    }

    const newFormData = {
      firstName: formData.firstName,
      middleName: formData.middleName || null,
      lastName: formData.lastName || null,
      phone: formData.phone,
      email: formData.email,
      dob: formData.dob || null,
      aadharNumber: formData.aadharNumber,
      panNumber: formData.panNumber,
      region: formData.region || null,
      rmcode: formData.rmCode || null,
      pincode: formData.pincode || null,
      employmentType: formData.employmentType || null,
      address: formData.address || null,
      homeType: formData.homeType || null,
      addressStability: formData.addressStability || null,
      landmark: formData.landmark || null,
      bankName: formData.bankName || null,
      accountNumber: formData.accountNumber || null,
      ifscCode: formData.ifscCode || null,
      password: formData.password,
    };

    // ✅ Build FormData
    const formDataToSend = new FormData();

    // Append JSON as a string
    formDataToSend.append("newFormData", JSON.stringify(newFormData));

    // Append files if present
    if (formData.adharCard) {
      formDataToSend.append("adharCard", formData.adharCard);
    }
    if (formData.panCard) {
      formDataToSend.append("panCard", formData.panCard);
    }
    if (formData.selfie) {
      formDataToSend.append("selfie", formData.selfie);
    }

    setIsLoading(true); // start spinner

    try {
      const response = await dispatch(signupPartner(formDataToSend)).unwrap();

      setSuccessMessageType("success");
      setSuccessMessage(
        response?.message || "Registration successful!"
      );
      setShowPopup(true);
      resetFields();
    } catch (err) {
      const backendMsg =
        err?.message ||
        err?.error ||
        err?.payload?.message ||
        "Registration failed. Please try again.";
      showError(backendMsg);
    } finally {
      setIsLoading(false); // stop spinner
    }
  };

  const resetFields = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      email: "",
      dob: "",
      aadharNumber: "",
      panNumber: "",
      region: "",
      rmCode: "",
      pincode: "",
      employmentType: "",
      address: "",
      homeType: "",
      addressStability: "",
      landmark: "",
      adharCard: null, // assign file via input later
      panCard: null, // assign file via input later
      selfie: null, // assign file via input later
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      password: "",
    confirmPassword: "",
    });
  };

  return (
    <>
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onClick={() => setShowPopup(false)} // closes popup when clicking outside
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                successMessageType === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {successMessageType === "success" ? "Success!" : "Error!"}
            </h2>
            <p className="mb-4">{successMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className={`px-4 py-2 rounded-lg text-white transition ${
                successMessageType === "success"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
              Partner Registration
            </h1>
            <p className="text-slate-600 text-lg max-w-md mx-auto">
              Join our network of trusted partners and grow your business with
              us
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
            {/* Personal Information Section */}
            <div className="p-8 space-y-8 bg-gray-50 rounded-2xl shadow-md">
              {/* Personal Information */}

              <section className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Personal Information
                  </h2>
                </div>

                <div className="grid gap-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                      <label className="block text-gray-700 font-semibold mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName || ""}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        name="middleName"
                        value={formData.middleName || ""}
                        onChange={handleChange}
                        placeholder="Enter middle name"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName || ""}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-500" /> Mobile
                        Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="relative">
                      <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-emerald-500" /> Email
                        Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Employment Type & DOB */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-500" />{" "}
                        Employment Type *
                      </label>
                      <select
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 transition-all duration-200"
                        required
                      >
                        <option value="">Select employment type</option>
                        <option value="Fulltime">Fulltime</option>
                        <option value="Parttime">Parttime</option>
                      </select>
                    </div>

                    <div className="relative">
                      <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-500" /> Date
                        of Birth *
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="relative">
                      <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        Aadhar Number *
                      </label>
                      <input
                        type="text"
                        name="aadharNumber"
                        value={formData.aadharNumber || ""}
                        onChange={handleChange}
                        placeholder="Enter your Aadhar number"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                        required
                        maxLength={12}
                        pattern="\d{12}"
                      />
                    </div>

                    <div className="relative">
                      <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        PAN Number *
                      </label>
                      <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber || ""}
                        onChange={handleChange}
                        placeholder="Enter your PAN number"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200 uppercase"
                        required
                        maxLength={10}
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      />
                    </div>

                    <div className="relative">
                      <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-500" /> RM Code{" "}
                        <span className="text-gray-400 text-xs font-normal ml-1">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="rmCode"
                        value={formData.rmCode || ""}
                        onChange={handleChange}
                        placeholder="Enter RM code (if any)"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        RM code is optional. If you have been referred by a
                        Relationship Manager, please enter their code here.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Address Details */}
              <section className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 space-y-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Address Details
                </h2>

                {/* Region */}
                <div className="relative">
                  <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" /> Region *
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region || ""}
                    onChange={handleChange}
                    placeholder="Enter your region"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 transition-all"
                    required
                  />
                </div>

                {/* Complete Address */}
                <div className="relative">
                  <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" /> Complete
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your complete address"
                    rows="4"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
                    required
                  />
                </div>

                {/* Pincode & Own/Rented */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" /> Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 transition-all"
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-500" /> Own /
                      Rented *
                    </label>
                    <select
                      name="homeType"
                      value={formData.homeType}
                      onChange={handleChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 transition-all"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Own">Own</option>
                      <option value="Rented">Rented</option>
                    </select>
                  </div>
                </div>

                {/* Address Stability & Landmark */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-500" /> Address
                      Stability *
                    </label>
                    <input
                      type="text"
                      name="addressStability"
                      value={formData.addressStability}
                      onChange={handleChange}
                      placeholder="e.g., 2 years"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 transition-all"
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" /> Landmark
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="Enter nearby landmark"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Document Upload Section */}
            <div className="p-8 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Document Upload
                </h2>
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full">
                  Required
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative group">
                  <label className=" text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Aadhaar Card
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="adharCard"
                      ref={adharInputRef}
                      onChange={handleChange}
                      className="w-full p-4 pr-24 bg-white/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-500 file:to-teal-600 file:text-white hover:file:from-emerald-600 hover:file:to-teal-700 text-transparent caret-transparent"
                      required
                    />
                    {formData.adharCard && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile("adharCard")}
                        className="absolute inset-y-0 right-12 flex items-center text-slate-500 hover:text-red-600"
                        title="Remove file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <Upload className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="mt-2 text-sm text-slate-600 flex items-center justify-between">
                    <span className="truncate max-w-[80%]">
                      {formData.adharCard
                        ? formData.adharCard.name
                        : "No file selected"}
                    </span>
                  </div>
                </div>
                <div className="relative group">
                  <label className=" text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    PAN Card
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="panCard"
                      ref={panInputRef}
                      onChange={handleChange}
                      className="w-full p-4 pr-24 bg-white/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-500 file:to-teal-600 file:text-white hover:file:from-emerald-600 hover:file:to-teal-700 text-transparent caret-transparent"
                      required
                    />
                    {formData.panCard && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile("panCard")}
                        className="absolute inset-y-0 right-12 flex items-center text-slate-500 hover:text-red-600"
                        title="Remove file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <Upload className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="mt-2 text-sm text-slate-600 flex items-center justify-between">
                    <span className="truncate max-w-[80%]">
                      {formData.panCard
                        ? formData.panCard.name
                        : "No file selected"}
                    </span>
                  </div>
                </div>
                <div className="relative group">
                  <label className=" text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-500" />
                    Selfie Photo
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="selfie"
                      ref={selfieInputRef}
                      onChange={handleChange}
                      className="w-full p-4 pr-24 bg-white/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-500 file:to-teal-600 file:text-white hover:file:from-emerald-600 hover:file:to-teal-700 text-transparent caret-transparent"
                      required
                    />
                    {formData.selfie && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile("selfie")}
                        className="absolute inset-y-0 right-12 flex items-center text-slate-500 hover:text-red-600"
                        title="Remove file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <Upload className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="mt-2 text-sm text-slate-600 flex items-center justify-between">
                    <span className="truncate max-w-[80%]">
                      {formData.selfie
                        ? formData.selfie.name
                        : "No file selected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank KYC Section */}
            <div className="p-8 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Bank KYC Details
                </h2>
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full">
                  Required
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <label className=" text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-500" />
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full p-4 bg-white/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300 placeholder-slate-400"
                    placeholder="Enter bank name"
                    required
                  />
                </div>
                <div className="relative">
                  <label className=" text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="w-full p-4 bg-white/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300 placeholder-slate-400"
                    placeholder="Enter account number"
                    required
                  />
                </div>
                <div className="relative">
                  <label className=" text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-500" />
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    className="w-full p-4 bg-white/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300 placeholder-slate-400"
                    placeholder="Enter IFSC code"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Security</h2>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              <div className="space-y-2">
                <label className=" text-slate-700 font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.password ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-4 pr-12 bg-white/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300 placeholder-slate-400"
                    placeholder="Enter a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        password: !prev.password,
                      }))
                    }
                    className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-slate-700"
                  >
                    {showPassword.password ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className=" text-slate-700 font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-4 pr-12 bg-white/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300 placeholder-slate-400"
                    placeholder="Re-enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      }))
                    }
                    className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-slate-700"
                  >
                    {showPassword.confirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            </div>

            <div className="px-8 pb-8">
              {/* <button
    type="submit"
    onClick={handleSubmit}
    disabled={isLoading}
    className={`w-full md:w-auto px-8 py-4 font-semibold rounded-2xl shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2 
      ${isLoading 
        ? "bg-gray-400 cursor-not-allowed" 
        : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:scale-[1.02]"}`}
  >
    {isLoading ? (
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    ) : (
      <>
        <CheckCircle className="w-5 h-5" />
        Submit Application
      </>
    )}
  </button> */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                type="button"
                className={`w-full md:w-auto px-8 py-4 font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all duration-300
    ${
      isLoading
        ? "bg-green-700 cursor-not-allowed text-white"
        : "bg-indigo-500 text-white hover:bg-indigo-600"
    }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="mr-3 w-5 h-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerRegistrationForm;

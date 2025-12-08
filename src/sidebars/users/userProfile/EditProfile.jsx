import React, { useState, useEffect } from "react";

import {

  User,

  Mail,

  Phone,

  Calendar,

  Home,

  Briefcase,

  MapPin,

  X,

  Save,

  ArrowLeft,

  CreditCard,

} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { getAuthData } from "../../../utils/localStorage";

import {

  fetchAsmProfile,

  updateAsmProfile,

} from "../../../feature/thunks/asmThunks";



export default function EditProfile({ setEditProfileOpen, onClose }) {

  const [open, setOpen] = useState(true);

  const navigate = useNavigate();



  const location = useLocation();

  const dispatch = useDispatch();



  // 👇 fix: location.state may be undefined, so use optional chaining

  const userType = location.state?.userType;
  const { loading, error, data } = useSelector((state) => state.asm.profile);

  const [formData, setFormData] = useState({

    fullName: "",

    email: "",

    phone: "",

    dob: "",

    address: "",

    experience: "0-1 Years",

    region: "",

    bankName: "",

    ifscCode: "",

    accountNumber: "",

    accountHolderName: "",

  });



  useEffect(() => {

    setFormData({

      fullName: data?.fullName || "",

      email: data?.email || "",

      phone: data?.phone || "",

      dob: data?.dob || "",

      address: data?.address || "",

      experience: data?.experience || "0-1 Years",

      region: data?.region || "",

      bankName: data?.bankName || "",

      ifscCode: data?.ifscCode || "",

      accountNumber: data?.accountNumber || "",

      accountHolderName: data?.accountHolderName || "",

    });

  }, [data]);


  useEffect(() => {

    // ✅ get both at once

    const { asmToken } = getAuthData();



    if (asmToken) {

      dispatch(fetchAsmProfile(asmToken)); // ✅ only dispatch if token exists

    }

  }, [dispatch]);



  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });

  };



  const [errors, setErrors] = useState({});



  const handleInputChange = (field, value) => {

    setFormData((prev) => ({

      ...prev,

      [field]: value,

    }));

    // Clear error when user starts typing

    if (errors[field]) {

      setErrors((prev) => ({

        ...prev,

        [field]: "",

      }));

    }

  };



  // Enhanced validation function with comprehensive checks

  const validateForm = () => {

    const newErrors = {};



    // Personal Information Validation

    if (!formData.fullName?.trim()) {

      newErrors.fullName = "Full name is required";

    } else if (formData.fullName.trim().length < 2) {

      newErrors.fullName = "Full name must be at least 2 characters";

    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {

      newErrors.fullName = "Full name should only contain letters and spaces";

    }



    if (!formData.email?.trim()) {

      newErrors.email = "Email is required";

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {

      newErrors.email = "Please enter a valid email address";

    }



    if (!formData.phone?.trim()) {

      newErrors.phone = "Phone number is required";

    } else {

      const phoneDigits = formData.phone.replace(/\D/g, "");

      if (phoneDigits.length !== 10) {

        newErrors.phone = "Please enter a valid 10-digit phone number";

      }

    }



    if (!formData.dob?.trim()) {

      newErrors.dob = "Date of birth is required";

    } else {

      const dobDate = new Date(formData.dob);

      const today = new Date();

      const age = today.getFullYear() - dobDate.getFullYear();

      if (age < 18) {

        newErrors.dob = "You must be at least 18 years old";

      } else if (age > 100) {

        newErrors.dob = "Please enter a valid date of birth";

      }

    }



    if (!formData.address?.trim()) {

      newErrors.address = "Address is required";

    } else if (formData.address.trim().length < 10) {

      newErrors.address = "Please enter a complete address (minimum 10 characters)";

    }



    if (!formData.experience?.trim()) {

      newErrors.experience = "Experience is required";

    }



    if (!formData.region?.trim()) {

      newErrors.region = "Region is required";

    } else if (formData.region.trim().length < 2) {

      newErrors.region = "Region must be at least 2 characters";

    }



    // Bank Details Validation

    if (!formData.bankName?.trim()) {

      newErrors.bankName = "Bank name is required";

    } else if (formData.bankName.trim().length < 2) {

      newErrors.bankName = "Bank name must be at least 2 characters";

    }



    if (!formData.ifscCode?.trim()) {

      newErrors.ifscCode = "IFSC code is required";

    } else {

      const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;

      if (!ifscPattern.test(formData.ifscCode.trim())) {

        newErrors.ifscCode = "Please enter a valid IFSC code (e.g., SBIN0123456)";

      }

    }



    if (!formData.accountNumber?.trim()) {

      newErrors.accountNumber = "Account number is required";

    } else {

      const accountNumber = formData.accountNumber.replace(/\D/g, "");

      if (accountNumber.length < 9 || accountNumber.length > 18) {

        newErrors.accountNumber = "Account number must be between 9-18 digits";

      }

    }



    if (!formData.accountHolderName?.trim()) {

      newErrors.accountHolderName = "Account holder name is required";

    } else if (formData.accountHolderName.trim().length < 2) {

      newErrors.accountHolderName = "Account holder name must be at least 2 characters";

    } else if (!/^[a-zA-Z\s]+$/.test(formData.accountHolderName.trim())) {

      newErrors.accountHolderName = "Account holder name should only contain letters and spaces";

    }



    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };



  const handleSave = () => {

    if (validateForm()) {

      // ✅ Make sure fullName is safe to split

      const fullName = formData.fullName?.trim() || "";

      const parts = fullName.split(/\s+/); // handles multiple spaces



      const firstName = parts[0] || "";

      const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";



      const payload = {

        firstName,

        lastName,

        email: formData?.email?.trim() || "",

        phone: formData?.phone?.trim() || "",

        dob: formData?.dob || "",

        address: formData?.address?.trim() || "",

        experience: formData?.experience || "",

        region: formData?.region?.trim() || "",

        bankName: formData?.bankName?.trim() || "",

        ifscCode: formData?.ifscCode?.trim().toUpperCase() || "",

        accountNumber: formData?.accountNumber?.trim() || "",

        accountHolderName: formData?.accountHolderName?.trim() || "",

      };



      dispatch(updateAsmProfile(payload));

    } else {

      // Scroll to first error field

      const firstErrorField = Object.keys(errors)[0];

      const element = document.querySelector(`[name="${firstErrorField}"]`);

      if (element) {

        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        element.focus();

      }

    }

  };



  const handleSubmit = (e) => {

    e.preventDefault();

    handleSave();

  };



  const handleClose = () => {

    if (typeof setEditProfileOpen === "function") {

      setEditProfileOpen(false);

    }

    if (typeof onClose === "function") {

      onClose();

    }

    setOpen(false);

  };



  // Close on Escape

  useEffect(() => {

    const onKey = (e) => e.key === "Escape" && handleClose();

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);

  }, []);



  if (!open) return null;



  return (

    <div className="min-h-screen bg-gray-50 p-4">

      {/* Page Header */}

      <div className="max-w-6xl mx-auto">

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Header */}

          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#12B99C] text-white">

            <div className="flex items-center gap-3">

              <button

                onClick={() => navigate("/asm/dashboard")}



                className="p-2 hover:bg-white/20 rounded-full transition-colors"

              >

                <ArrowLeft className="w-5 h-5" />

              </button>

              <User className="w-6 h-6" />

              <h1 className="text-2xl font-bold">Edit Profile</h1>

            </div>

         

          </div>



          {/* Content */}

          <form onSubmit={handleSubmit}>

            {/* Personal Information Section */}

            <div className="p-6">

              {/* Personal Information Section */}

              <div className="mb-8">

                <h3 className="text-xl font-semibold text-[#111827] mb-6 flex items-center gap-2">

                  <User className="w-5 h-5 text-[#12B99C]" />

                  Personal Information

                </h3>



                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  {/* Left Side */}

                  <div className="space-y-6">

                    {/* Full Name */}

                    <div>

                      <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-2">

                        <User className="w-4 h-4 text-[#12B99C]" />

                        Full Name *

                      </label>

                      <input

                        type="text"

                        name="fullName"

                        value={formData.fullName}

                        onChange={(e) =>

                          handleInputChange("fullName", e.target.value)

                        }

                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12B99C] transition ${

                          errors.fullName ? "border-red-500" : "border-gray-300"

                        }`}

                        placeholder="Enter your full name"

                      />

                      {errors.fullName && (

                        <p className="text-red-500 text-xs mt-1">

                          {errors.fullName}

                        </p>

                      )}

                    </div>



                    {/* Email */}

                    <div>

                      <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-2">

                        <Mail className="w-4 h-4 text-[#12B99C]" />

                        Email *

                      </label>

                      <input

                        type="email"

                        name="email"

                        value={formData.email}

                        onChange={(e) =>

                          handleInputChange("email", e.target.value)

                        }

                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12B99C] transition ${

                          errors.email ? "border-red-500" : "border-gray-300"

                        }`}

                        placeholder="Enter your email"

                      />

                      {errors.email && (

                        <p className="text-red-500 text-xs mt-1">

                          {errors.email}

                        </p>

                      )}

                    </div>



                    {/* Phone */}

                    <div>

                      <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-2">

                        <Phone className="w-4 h-4 text-[#12B99C]" />

                        Phone Number *

                      </label>

                      <input

                        type="tel"

                        name="phone"

                        value={formData.phone}

                        onChange={(e) =>

                          handleInputChange("phone", e.target.value)

                        }

                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12B99C] transition ${

                          errors.phone ? "border-red-500" : "border-gray-300"

                        }`}

                        placeholder="Enter your phone number"

                        maxLength={10}

                      />

                      {errors.phone && (

                        <p className="text-red-500 text-xs mt-1">

                          {errors.phone}

                        </p>

                      )}

                    </div>



                    {/* Date of Birth */}

                    <div>

                      <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-2">

                        <Calendar className="w-4 h-4 text-[#12B99C]" />

                        Date of Birth *

                      </label>

                      <input

                        type="date"

                        name="dob"

                        value={formData.dob}

                        onChange={(e) => handleInputChange("dob", e.target.value)}

                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12B99C] transition ${

                          errors.dob ? "border-red-500" : "border-gray-300"

                        }`}

                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}

                      />

                      {errors.dob && (

                        <p className="text-red-500 text-xs mt-1">

                          {errors.dob}

                        </p>

                      )}

                    </div>

                  </div>



                  {/* Right Side */}

                  <div className="space-y-6">

                    {/* Address */}

                    <div>

                      <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-2">

                        <Home className="w-4 h-4 text-[#12B99C]" />

                        Address *

                      </label>

                      <textarea

                        name="address"

                        value={formData.address}

                        onChange={(e) =>

                          handleInputChange("address", e.target.value)

                        }

                        rows={3}

                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12B99C] transition resize-none ${

                          errors.address ? "border-red-500" : "border-gray-300"

                        }`}

                        placeholder="Enter your complete address"

                      />

                      {errors.address && (

                        <p className="text-red-500 text-xs mt-1">

                          {errors.address}

                        </p>

                      )}

                    </div>



                    {/* Experience */}

                    <div>

                      <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-2">

                        <Briefcase className="w-4 h-4 text-[#12B99C]" />

                        Experience *

                      </label>

                      <select

                        name="experience"

                        value={formData.experience}

                        onChange={(e) =>

                          handleInputChange("experience", e.target.value)

                        }

                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12B99C] transition ${

                          errors.experience ? "border-red-500" : "border-gray-300"

                        }`}

                      >

                        <option value="">Select experience</option>

                        <option value="0-1 Years">0-1 Years</option>

                        <option value="1-2 Years">1-2 Years</option>

                        <option value="2-3 Years">2-3 Years</option>

                        <option value="3-5 Years">3-5 Years</option>

                        <option value="5+ Years">5+ Years</option>

                      </select>

                      {errors.experience && (

                        <p className="text-red-500 text-xs mt-1">

                          {errors.experience}

                        </p>

                      )}

                    </div>



                    {/* Region */}

                    <div>

                      <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-2">

                        <MapPin className="w-4 h-4 text-[#12B99C]" />

                        Region *

                      </label>

                      <input

                        type="text"

                        name="region"

                        value={formData.region}

                        onChange={(e) =>

                          handleInputChange("region", e.target.value)

                        }

                        placeholder="Enter Region"

                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12B99C] transition ${

                          errors.region ? "border-red-500" : "border-gray-300"

                        }`}

                      />

                      {errors.region && (

                        <p className="text-red-500 text-xs mt-1">

                          {errors.region}

                        </p>

                      )}

                    </div>

                  </div>

                </div>

              </div>



              {/* Bank Details Section */}

              <div className="mb-8">

                <h3 className="text-xl font-semibold text-[#111827] mb-6 flex items-center gap-2">

                  <CreditCard className="w-5 h-5 text-[#12B99C]" />

                  Bank Details

                </h3>



                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  {/* Left Side - Bank Details */}

                  <div className="space-y-6">

                    {/* Bank Name */}

                    <div>

                      <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-2">

                        <CreditCard className="w-4 h-4 text-[#12B99C]" />

                        Bank Name *

                      </label>

                      <input

                        type="text"

                        name="bankName"

                        value={formData.bankName}

                        onChange={(e) =>

                          handleInputChange("bankName", e.target.value)

                        }

                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12B99C] transition ${

                          errors.bankName ? "border-red-500" : "border-gray-300"

                        }`}

                        placeholder="Enter bank name"

                      />

                      {errors.bankName && (

                        <p className="text-red-500 text-xs mt-1">

                          {errors.bankName}

                        </p>

                      )}

                    </div>



                    {/* IFSC Code */}

                    <div>

                      <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-2">

                        <CreditCard className="w-4 h-4 text-[#12B99C]" />

                        IFSC Code *

                      </label>

                      <input

                        type="text"

                        name="ifscCode"

                        value={formData.ifscCode}

                        onChange={(e) =>

                          handleInputChange(

                            "ifscCode",

                            e.target.value.toUpperCase()

                          )

                        }

                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12B99C] transition ${

                          errors.ifscCode ? "border-red-500" : "border-gray-300"

                        }`}

                        placeholder="Enter IFSC code (e.g., SBIN0123456)"

                        maxLength={11}

                      />

                      {errors.ifscCode && (

                        <p className="text-red-500 text-xs mt-1">

                          {errors.ifscCode}

                        </p>

                      )}

                    </div>

                  </div>



                  {/* Right Side - Account Details */}

                  <div className="space-y-6">

                    {/* Account Number */}

                    <div>

                      <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-2">

                        <CreditCard className="w-4 h-4 text-[#12B99C]" />

                        Account Number *

                      </label>

                      <input

                        type="text"

                        name="accountNumber"

                        value={formData.accountNumber}

                        onChange={(e) =>

                          handleInputChange("accountNumber", e.target.value)

                        }

                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12B99C] transition ${

                          errors.accountNumber

                            ? "border-red-500"

                            : "border-gray-300"

                        }`}

                        placeholder="Enter account number"

                        maxLength={18}

                      />

                      {errors.accountNumber && (

                        <p className="text-red-500 text-xs mt-1">

                          {errors.accountNumber}

                        </p>

                      )}

                    </div>



                    {/* Account Holder Name */}

                    <div>

                      <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-2">

                        <CreditCard className="w-4 h-4 text-[#12B99C]" />

                        Account Holder Name *

                      </label>

                      <input

                        type="text"

                        name="accountHolderName"

                        value={formData.accountHolderName}

                        onChange={(e) =>

                          handleInputChange("accountHolderName", e.target.value)

                        }

                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12B99C] transition ${

                          errors.accountHolderName

                            ? "border-red-500"

                            : "border-gray-300"

                        }`}

                        placeholder="Enter account holder name"

                      />

                      {errors.accountHolderName && (

                        <p className="text-red-500 text-xs mt-1">

                          {errors.accountHolderName}

                        </p>

                      )}

                    </div>

                  </div>

                </div>

              </div>

            </div>



            {/* Footer */}

            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">

              <button

                type="button"

                onClick={() => navigate("/asm/dashboard")}



                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"

              >

                Cancel

              </button>

              <button

                type="submit"

                className="px-6 py-3 bg-[#12B99C] text-white rounded-lg hover:bg-[#0EA688] transition-colors font-medium flex items-center gap-2"

              >

                <Save className="w-4 h-4" />

                Save Changes

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );

}
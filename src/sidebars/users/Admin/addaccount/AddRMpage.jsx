import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Save,
  ArrowLeft,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Users,
  Check,
  Search,
  Calendar,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuthData } from "../../../../utils/localStorage";
import { createRm, fetchAsms } from "../../../../feature/thunks/adminThunks";
import { resetCreateRmState } from "../../../../feature/slices/adminSlice";

const AddRMPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector(
    (state) => state.admin.createRmAdmin
  );
  const { data: asmList, loading: asmLoading } = useSelector(
    (state) => state.admin.asm
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    region: "",
    email: "",
    password: "",
    confirmPassword: "",
    assignedAsm: null, // New field for assigned ASM
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAsmModal, setShowAsmModal] = useState(false); // New state for ASM modal
  const [asmSearchTerm, setAsmSearchTerm] = useState(""); // New state for ASM search

  const [message, setMessage] = useState("");

 

  const colors = {
    primary: "#12B99C",
    background: "#F8FAFC",
    text: "#111827",
  };

  // ✅ Load ASM list when component mounts
  useEffect(() => {
    const { adminToken } = getAuthData() || {};
    if (adminToken) {
      dispatch(fetchAsms(adminToken));
    }
  }, [dispatch]);

  // ✅ Filter ASM list based on search term
  const filteredAsmList =
    asmList?.filter((asm) => {
      if (!asmSearchTerm.trim()) return true;

      const searchLower = asmSearchTerm.toLowerCase();
      const fullName = `${asm.firstName} ${asm.lastName}`.toLowerCase();
      const employeeId = (asm.employeeId || "").toLowerCase();
      const email = (asm.email || "").toLowerCase();

      return (
        fullName.includes(searchLower) ||
        employeeId.includes(searchLower) ||
        email.includes(searchLower)
      );
    }) || [];

  // ✅ Handle ASM search input change
  const handleAsmSearchChange = (e) => {
    setAsmSearchTerm(e.target.value);
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // New validation for ASM assignment
    if (!formData.assignedAsm) {
      newErrors.assignedAsm = "Please assign an ASM";
    }

    if (formData?.dob && getAgeFromDOB(formData?.dob) < 18) {
      alert("You must be at least 18 years old to proceed.");
      return;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function getAgeFromDOB(dobString) {
    if (!dobString) return null; // handle empty or invalid input

    const dob = new Date(dobString);
    if (isNaN(dob)) return null; // handle invalid date format

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // If birthday hasn't occurred yet this year, subtract one
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear field-specific error + API error
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) dispatch(resetCreateRmState());
  };

  // ✅ Handle ASM selection
  const handleAsmSelection = (asm) => {
    setFormData((prev) => ({ ...prev, assignedAsm: asm }));
    setErrors((prev) => ({ ...prev, assignedAsm: "" }));
    setShowAsmModal(false);
  };

// ✅ Handle form submit
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const { adminToken } = getAuthData() || {};
  if (!adminToken) {
    alert("Unauthorized. Please login again.");
    return;
  }

  const requestData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: formData.phone,
    region: formData.region,
    dob: formData.dob,
    email: formData.email,
    password: formData.password,
    assignedAsmId: formData.assignedAsm?._id, // MongoDB ID (optional chaining)
    token: adminToken,
  };

  try {
    // ✅ Await dispatch to handle async correctly
    await dispatch(createRm(requestData)).unwrap();

    // ✅ Show success message only after RM is created
    setMessage(
      "Relationship Manager has been added successfully to your team."
    );

    handleAddASM(); // call after success
    resetFields();  // reset form
  } catch (error) {
    console.error("Failed to create RM:", error);
    setMessage(error?.message || "Failed to create RM. Please try again.");
  }
};


  const inputClassName = (fieldName) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
      errors[fieldName]
        ? "border-red-300 focus:ring-red-200 focus:border-red-500"
        : "border-gray-300 focus:ring-primary/30 focus:border-primary/50"
    }`;

  const [showModal, setShowModal] = useState(false);

  const handleAddASM = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const resetFields = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      dob: "",
      region: "",
      email: "",
      password: "",
      confirmPassword: "",
      assignedAsm: null,
    });
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            {/* Modal Header */}
            <div className="relative p-6 pb-4">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 pb-8 text-center">
              {/* Success Icon */}
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                {message ===
                "Relationship Manager has been added successfully to your team." ? (
                  <CheckCircle size={32} className="text-green-500" />
                ) : (
                  <XCircle size={32} className="text-red-500" />
                )}
              </div>

              {/* Success Message */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {message ===
                "Relationship Manager has been added successfully to your team."
                  ? "Success!"
                  : "Something went wrong"}
              </h2>
              <p className="text-gray-600 mb-6">
                {message || "We couldn't process your request. Please try again or contact support."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.background }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
                type="button"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
            <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
              Add New Relationship Manager
            </h1>
            <p className="text-gray-600 mt-2">
              Fill in the details to add a new RM to your team
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`${inputClassName("firstName")} pl-10`}
                      placeholder="Enter first name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />{" "}
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`${inputClassName("lastName")} pl-10`}
                      placeholder="Enter last name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`${inputClassName("phone")} pl-10`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`${inputClassName("email")} pl-10`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className={`${inputClassName("dob")} pl-10`}
                    />
                  </div>
                  {errors.dob && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.dob}
                    </p>
                  )}
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="region"
                      value={formData.region || ""}
                      onChange={handleInputChange}
                      className={`${inputClassName("region")} pl-3`}
                      placeholder="Enter region"
                    />
                  </div>
                  {errors.region && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.region}
                    </p>
                  )}
                </div>

                {/* Assign ASM */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign ASM *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowAsmModal(true)}
                      className={`${inputClassName(
                        "assignedAsm"
                      )} pl-10 text-left cursor-pointer hover:bg-gray-50 transition-colors ${
                        formData.assignedAsm ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {formData.assignedAsm
                        ? `${formData.assignedAsm.firstName} ${
                            formData.assignedAsm.lastName
                          } (${formData.assignedAsm.employeeId || "No Emp ID"})`
                        : "Click to select ASM"}
                    </button>
                  </div>
                  {errors.assignedAsm && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />{" "}
                      {errors.assignedAsm}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`${inputClassName("password")} pl-10 pr-10`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`${inputClassName(
                        "confirmPassword"
                      )} pl-10 pr-10`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />{" "}
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Error from API */}
              {error && (
                <p className="mt-4 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 flex items-center disabled:opacity-70 hover:shadow-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding RM...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add RM
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ASM Selection Modal */}
        {showAsmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="bg-[#12B99C] p-3 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Select ASM</h3>
                  <button
                    onClick={() => setShowAsmModal(false)}
                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-white/90 text-sm mt-1">
                  Choose an Area Sales Manager to assign to this RM
                </p>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search ASM by name, employee ID, or email..."
                    value={asmSearchTerm}
                    onChange={handleAsmSearchChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12B99C]/30 focus:border-[#12B99C]/50 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Modal Content (scrollable) */}
              <div className="flex-1 p-6 overflow-y-auto">
                {asmLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#12B99C]"></div>
                    <span className="ml-3 text-gray-600">
                      Loading ASM list...
                    </span>
                  </div>
                ) : filteredAsmList.length > 0 ? (
                  <div className="space-y-3">
                    {filteredAsmList.map((asm) => (
                      <div
                        key={asm._id}
                        onClick={() => handleAsmSelection(asm)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                          formData.assignedAsm?._id === asm._id
                            ? "border-[#12B99C] bg-[#12B99C]/5"
                            : "border-gray-200 hover:border-[#12B99C]/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-[#12B99C]/10 rounded-full flex items-center justify-center">
                                <span className="text-[#12B99C] font-semibold text-sm">
                                  {asm.firstName?.charAt(0)}
                                  {asm.lastName?.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {asm.firstName} {asm.lastName}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Employee ID:{" "}
                                  {asm.employeeId || "Not assigned"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {asm.email} • {asm.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                          {formData.assignedAsm?._id === asm._id && (
                            <div className="w-6 h-6 bg-[#12B99C] rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : asmSearchTerm.trim() ? (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      No ASM found matching "{asmSearchTerm}"
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Try searching with different keywords
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No ASM records found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Please create ASM accounts first
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAsmModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddRMPage;

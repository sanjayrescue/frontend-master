import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Building2, User, Phone, CreditCard, Hash } from 'lucide-react';

const KYCDetails = () => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountHolderName: '',
    mobileNumber: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
      newErrors.accountNumber = 'Account number must be 9-18 digits';
    }

    if (!formData.confirmAccountNumber.trim()) {
      newErrors.confirmAccountNumber = 'Please confirm account number';
    } else if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }

    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      newErrors.ifscCode = 'Invalid IFSC code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitted(true);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      bankName: '',
      accountHolderName: '',
      mobileNumber: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border-2" style={{ borderColor: '#12B99C' }}>
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4" style={{ color: '#12B99C' }} />
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 px-2" style={{ color: '#111827' }}>
                  KYC Details Submitted Successfully!
                </h2>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 text-left">
                  <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: '#111827' }}>Submitted Details:</h3>
                  <div className="space-y-2 text-xs sm:text-sm" style={{ color: '#111827' }}>
                    <p className="break-words"><span className="font-medium">Bank Name:</span> {formData.bankName}</p>
                    <p className="break-words"><span className="font-medium">Account Holder:</span> {formData.accountHolderName}</p>
                    <p className="break-words"><span className="font-medium">Mobile Number:</span> {formData.mobileNumber}</p>
                    <p className="break-words"><span className="font-medium">Account Number:</span> {formData.accountNumber}</p>
                    <p className="break-words"><span className="font-medium">IFSC Code:</span> {formData.ifscCode}</p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-lg font-medium text-white transition-colors duration-200 text-sm sm:text-base"
                  style={{ backgroundColor: '#12B99C' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0EA589'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#12B99C'}
                >
                  Submit Another Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 px-2" style={{ color: '#111827' }}>
              KYC Details
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              Please provide your banking details for verification
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="space-y-4 sm:space-y-6">
              {/* Bank Name */}
              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: '#111827' }}>
                  <Building2 className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#12B99C' }} />
                  <span className="text-xs sm:text-sm">Bank Name</span>
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm sm:text-base ${
                    errors.bankName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{ 
                    focusRingColor: errors.bankName ? '#EF4444' : '#12B99C'
                  }}
                  placeholder="Enter your bank name"
                />
                {errors.bankName && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span>{errors.bankName}</span>
                  </p>
                )}
              </div>

              {/* Account Holder Name */}
              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: '#111827' }}>
                  <User className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#12B99C' }} />
                  <span className="text-xs sm:text-sm">Account Holder Name</span>
                </label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm sm:text-base ${
                    errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter account holder name"
                />
                {errors.accountHolderName && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span>{errors.accountHolderName}</span>
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: '#111827' }}>
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#12B99C' }} />
                  <span className="text-xs sm:text-sm">Registered Mobile Number</span>
                </label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value.replace(/\D/g, ''))}
                  maxLength="10"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm sm:text-base ${
                    errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit mobile number"
                />
                {errors.mobileNumber && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span>{errors.mobileNumber}</span>
                  </p>
                )}
              </div>

              {/* Account Number */}
              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: '#111827' }}>
                  <CreditCard className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#12B99C' }} />
                  <span className="text-xs sm:text-sm">Account Number</span>
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm sm:text-base ${
                    errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter account number"
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span>{errors.accountNumber}</span>
                  </p>
                )}
              </div>

              {/* Confirm Account Number */}
              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: '#111827' }}>
                  <CreditCard className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#F59E0B' }} />
                  <span className="text-xs sm:text-sm">Confirm Account Number</span>
                </label>
                <input
                  type="text"
                  value={formData.confirmAccountNumber}
                  onChange={(e) => handleInputChange('confirmAccountNumber', e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm sm:text-base ${
                    errors.confirmAccountNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Re-enter account number"
                />
                {errors.confirmAccountNumber && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span>{errors.confirmAccountNumber}</span>
                  </p>
                )}
                {!errors.confirmAccountNumber && formData.confirmAccountNumber && formData.accountNumber === formData.confirmAccountNumber && (
                  <p className="mt-1 text-xs sm:text-sm flex items-center" style={{ color: '#12B99C' }}>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span>Account numbers match</span>
                  </p>
                )}
              </div>

              {/* IFSC Code */}
              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: '#111827' }}>
                  <Hash className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#12B99C' }} />
                  <span className="text-xs sm:text-sm">IFSC Code</span>
                </label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                  maxLength="11"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm sm:text-base ${
                    errors.ifscCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter IFSC code (e.g., SBIN0001234)"
                />
                {errors.ifscCode && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span>{errors.ifscCode}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 sm:pt-6">
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 px-4 sm:px-6 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] text-sm sm:text-base"
                  style={{ backgroundColor: '#12B99C' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0EA589'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#12B99C'}
                >
                  Submit KYC Details
                </button>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 sm:mt-6 bg-white rounded-lg p-3 sm:p-4 border-l-4" style={{ borderLeftColor: '#F59E0B' }}>
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" style={{ color: '#F59E0B' }} />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm sm:text-base" style={{ color: '#111827' }}>Security Notice</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Your information is encrypted and secure. We follow industry-standard security practices to protect your financial data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCDetails;
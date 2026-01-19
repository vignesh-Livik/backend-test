import React, { useEffect, useState } from "react";
import {
  createPersonalDetails,
  getUserProfile,
  updatePersonalDetails,
} from "../services/personalDetailsService";
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar,
  FiHeart, FiDroplet, FiGlobe, FiX, FiSave,
  FiChevronDown, FiAlertCircle
} from "react-icons/fi";
import { FaVenusMars } from "react-icons/fa";

const UserPersonalForm = ({ userId: editUserId, onClose, onSaved }) => {
  // Define initial form data
  const initialFormData = {
    userId: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    personalEmail: "",
    phoneNumber: "",
    alternatePhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    maritalStatus: "",
    bloodGroup: "",
    nationality: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (editUserId) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const res = await getUserProfile(editUserId);
          if (res?.userPersonalDetails) {
            const userDetails = res.userPersonalDetails;
            setFormData({
              ...initialFormData,
              ...userDetails,
              dateOfBirth: userDetails.dateOfBirth?.split("T")[0] || "",
              userId: editUserId
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    } else {
      // Reset form when creating new user
      setFormData(initialFormData);
    }
    
    // Reset errors and touched fields
    setErrors({});
    setTouchedFields({});
  }, [editUserId]);

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.personalEmail && !emailRegex.test(formData.personalEmail)) {
      newErrors.personalEmail = "Invalid email format";
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone must be 10 digits";
    }
    
    // Pincode validation
    const pincodeRegex = /^[0-9]{6}$/;
    if (formData.pincode && !pincodeRegex.test(formData.pincode.toString())) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    
    // Required fields validation
    const requiredFields = [
      'userId', 'firstName', 'lastName', 'personalEmail', 'phoneNumber',
      'addressLine1', 'city', 'state', 'pincode', 'nationality'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]?.toString().trim()) {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  /* ================= HANDLE BLUR ================= */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate individual field on blur
    if (value?.toString().trim()) {
      let error = "";
      
      switch (name) {
        case 'personalEmail':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = "Invalid email format";
          }
          break;
        case 'phoneNumber':
          const phoneRegex = /^[0-9]{10}$/;
          if (!phoneRegex.test(value)) {
            error = "Phone must be 10 digits";
          }
          break;
        case 'pincode':
          const pincodeRegex = /^[0-9]{6}$/;
          if (!pincodeRegex.test(value.toString())) {
            error = "Pincode must be 6 digits";
          }
          break;
        default:
          break;
      }

      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all required fields as touched
    const requiredFields = [
      'userId', 'firstName', 'lastName', 'personalEmail', 'phoneNumber',
      'addressLine1', 'city', 'state', 'pincode', 'nationality'
    ];
    
    const newTouched = {};
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouchedFields(prev => ({ ...prev, ...newTouched }));

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (editUserId) {
        await updatePersonalDetails(editUserId, formData);
      } else {
        await createPersonalDetails(formData.userId, formData);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Submit failed:", error);
      setErrors({ submit: error.message || "Failed to save. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop with backdrop blur */}
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300" />
        
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with backdrop blur - Click to close */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10
                     animate-in fade-in-0 zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <FiUser className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {editUserId ? "Edit Personal Details" : "Create New User"}
                </h2>
                <p className="text-blue-100 text-sm">
                  {editUserId ? "Update user information" : "Fill in the details below to create a new user"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors backdrop-blur-sm"
              type="button"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-8 space-y-8">
            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mr-2">1</span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* User ID */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiUser className="h-5 w-5" />
                      <span>User ID<span className="text-red-500 ml-1">*</span></span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="userId"
                      value={formData.userId || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!!editUserId}
                      required
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 outline-none pl-11 backdrop-blur-sm
                        ${!!editUserId ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                        ${errors.userId ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400
                      `}
                      placeholder="Enter unique user ID"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiUser className="h-5 w-5" />
                    </div>
                  </div>
                  {errors.userId && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" />
                      {errors.userId}
                    </p>
                  )}
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiUser className="h-5 w-5" />
                      <span>First Name<span className="text-red-500 ml-1">*</span></span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 outline-none pl-11 backdrop-blur-sm
                        ${errors.firstName ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                      placeholder="Enter first name"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiUser className="h-5 w-5" />
                    </div>
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiUser className="h-5 w-5" />
                      <span>Last Name<span className="text-red-500 ml-1">*</span></span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 outline-none pl-11 backdrop-blur-sm
                        ${errors.lastName ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                      placeholder="Enter last name"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiUser className="h-5 w-5" />
                    </div>
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" />
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FaVenusMars className="h-5 w-5" />
                      <span>Gender<span className="text-red-500 ml-1">*</span></span>
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        appearance-none transition-all duration-200 outline-none cursor-pointer pl-11 backdrop-blur-sm
                        ${errors.gender ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaVenusMars className="h-5 w-5" />
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <FiChevronDown />
                    </div>
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" />
                      {errors.gender}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="h-5 w-5" />
                      <span>Date of Birth<span className="text-red-500 ml-1">*</span></span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 outline-none pl-11 backdrop-blur-sm
                        ${errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiCalendar className="h-5 w-5" />
                    </div>
                  </div>
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" />
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiHeart className="h-5 w-5" />
                      <span>Marital Status<span className="text-red-500 ml-1">*</span></span>
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        appearance-none transition-all duration-200 outline-none cursor-pointer pl-11 backdrop-blur-sm
                        ${errors.maritalStatus ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                    >
                      <option value="">Select marital status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiHeart className="h-5 w-5" />
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <FiChevronDown />
                    </div>
                  </div>
                  {errors.maritalStatus && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" />
                      {errors.maritalStatus}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mr-2">2</span>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiMail className="h-5 w-5" />
                      <span>Personal Email<span className="text-red-500 ml-1">*</span></span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="personalEmail"
                      value={formData.personalEmail || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 outline-none pl-11 backdrop-blur-sm
                        ${errors.personalEmail ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                      placeholder="user@example.com"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiMail className="h-5 w-5" />
                    </div>
                  </div>
                  {errors.personalEmail && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" />
                      {errors.personalEmail}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiPhone className="h-5 w-5" />
                      <span>Phone Number<span className="text-red-500 ml-1">*</span></span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      maxLength="10"
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 outline-none pl-11 backdrop-blur-sm
                        ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                      placeholder="10-digit mobile number"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiPhone className="h-5 w-5" />
                    </div>
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Alternate Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiPhone className="h-5 w-5" />
                      <span>Alternate Phone</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 outline-none pl-11 backdrop-blur-sm
                        ${errors.alternatePhone ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                      placeholder="Optional alternate number"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiPhone className="h-5 w-5" />
                    </div>
                  </div>
                  {errors.alternatePhone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" />
                      {errors.alternatePhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mr-2">3</span>
                Address Information
              </h3>
              <div className="space-y-6">
                {/* Address Line 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="h-5 w-5" />
                      <span>Address Line 1<span className="text-red-500 ml-1">*</span></span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1 || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 outline-none pl-11 backdrop-blur-sm
                        ${errors.addressLine1 ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                      placeholder="Street address, P.O. box"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiMapPin className="h-5 w-5" />
                    </div>
                  </div>
                  {errors.addressLine1 && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" />
                      {errors.addressLine1}
                    </p>
                  )}
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="h-5 w-5" />
                      <span>Address Line 2</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2 || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 outline-none pl-11 backdrop-blur-sm
                        ${errors.addressLine2 ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                      placeholder="Apartment, suite, unit, building, floor"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiMapPin className="h-5 w-5" />
                    </div>
                  </div>
                  {errors.addressLine2 && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" />
                      {errors.addressLine2}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span>City<span className="text-red-500 ml-1">*</span></span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 outline-none backdrop-blur-sm
                        ${errors.city ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="flex-shrink-0" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span>State<span className="text-red-500 ml-1">*</span></span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 outline-none backdrop-blur-sm
                        ${errors.state ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="flex-shrink-0" />
                        {errors.state}
                      </p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span>Pincode<span className="text-red-500 ml-1">*</span></span>
                    </label>
                    <input
                      type="number"
                      name="pincode"
                      value={formData.pincode || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      maxLength="6"
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 outline-none backdrop-blur-sm
                        ${errors.pincode ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                      placeholder="6-digit pincode"
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="flex-shrink-0" />
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mr-2">4</span>
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiDroplet className="h-5 w-5" />
                      <span>Blood Group</span>
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        appearance-none transition-all duration-200 outline-none cursor-pointer pl-11 backdrop-blur-sm
                        ${errors.bloodGroup ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                    >
                      <option value="">Select blood group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiDroplet className="h-5 w-5" />
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <FiChevronDown />
                    </div>
                  </div>
                  {errors.bloodGroup && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" />
                      {errors.bloodGroup}
                    </p>
                  )}
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiGlobe className="h-5 w-5" />
                      <span>Nationality<span className="text-red-500 ml-1">*</span></span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-200 outline-none pl-11 backdrop-blur-sm
                        ${errors.nationality ? 'border-red-300' : 'border-gray-300'}
                        hover:border-gray-400 bg-white/95
                      `}
                      placeholder="Enter nationality"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiGlobe className="h-5 w-5" />
                    </div>
                  </div>
                  {errors.nationality && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" />
                      {errors.nationality}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 backdrop-blur-sm bg-white/95">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Fields marked with <span className="text-red-500">*</span> are required
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 
                           transition-colors duration-200 font-medium flex items-center gap-2 backdrop-blur-sm"
                >
                  <FiX className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg 
                           hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium 
                           flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-lg hover:shadow-xl backdrop-blur-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="h-4 w-4" />
                      {editUserId ? "Update Details" : "Create User"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserPersonalForm;
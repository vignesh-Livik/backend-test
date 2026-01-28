import { useState } from "react";
import {
  BookOpen,
  Building2,
  Award,
  Calendar,
  Percent,
  Hash,
  Tag,
  GraduationCap,
  X,
  CheckCircle,
  User,
} from "lucide-react";

function EducationForm({
  initialData,
  onSubmit,
  onCancel,
  isEditMode = false,
  isViewMode = false,
}) {
  /* ===============================
     INITIAL STATE (NO useEffect)
     =============================== */
  const [formData, setFormData] = useState(() => ({
    userId: initialData?.userId || "",
    qualification: initialData?.qualification || "",
    specialization: initialData?.specialization || "",
    institution: initialData?.institution || "",
    boardOrUniversity: initialData?.boardOrUniversity || "",
    yearOfPassing: initialData?.yearOfPassing?.toString() || "",
    percentage: initialData?.percentage?.toString() || "",
  }));

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const qualifications = [
    "High School",
    "Diploma",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
    "Post-Doctorate",
    "Professional Certification",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  /* ===============================
     VALIDATION
     =============================== */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId?.trim()) newErrors.userId = "User ID is required";
    if (!formData.qualification.trim())
      newErrors.qualification = "Qualification is required";
    if (!formData.institution.trim())
      newErrors.institution = "Institution is required";
    if (!formData.boardOrUniversity.trim())
      newErrors.boardOrUniversity = "Board/University is required";

    if (!formData.yearOfPassing) {
      newErrors.yearOfPassing = "Year of passing is required";
    } else if (+formData.yearOfPassing > currentYear) {
      newErrors.yearOfPassing = "Year cannot be in the future";
    }

    if (formData.percentage) {
      const p = Number(formData.percentage);
      if (isNaN(p) || p < 0 || p > 100) {
        newErrors.percentage = "Percentage must be between 0 and 100";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ===============================
     HANDLERS
     =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        userId: formData.userId,
        qualification: formData.qualification,
        specialization: formData.specialization || null,
        institution: formData.institution,
        boardOrUniversity: formData.boardOrUniversity,
        yearOfPassing: Number(formData.yearOfPassing),
        percentage: formData.percentage ? Number(formData.percentage) : null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
     RENDER
     =============================== */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isViewMode
                ? "View Academic Record"
                : isEditMode
                  ? "Edit Academic Record"
                  : "Add New Education"}
            </h2>
            <p className="text-gray-600 text-sm">
              {isViewMode
                ? `Viewing record for User ID: ${formData.userId}`
                : isEditMode
                  ? `Updating record for User ID: ${formData.userId}`
                  : "Fill in the academic qualification details below"}
            </p>
          </div>
        </div>
      </div>

      {/* Form Grid - Reorganized layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* User ID Field - Half width */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <User className="h-4 w-4 text-blue-600" />
            User ID
          </label>
          <div className="relative">
            <input
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              disabled={isEditMode || isViewMode}
              placeholder="Enter User ID (e.g., 2)"
              className={`w-full px-4 py-2.5 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.userId
                  ? "border-red-500 ring-2 ring-red-500 ring-opacity-20"
                  : "border-gray-300 hover:border-gray-400"
              } ${
                isEditMode || isViewMode
                  ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                  : "bg-white"
              }`}
            />
            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.userId && (
            <p className="text-red-600 text-sm font-medium mt-1">
              {errors.userId}
            </p>
          )}
        </div>

        {/* Qualification Field - Right of User ID */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Award className="h-4 w-4 text-blue-600" />
            Qualification Level
          </label>
          <div className="relative">
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-4 py-2.5 pl-10 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                isViewMode
                  ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                  : "bg-white"
              } ${
                errors.qualification
                  ? "border-red-500 ring-2 ring-red-500 ring-opacity-20"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <option value="">Select qualification level</option>
              {qualifications.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
            <Award className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            {!isViewMode && (
              <div className="absolute right-3 top-2.5 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </div>
          {errors.qualification && (
            <p className="text-red-600 text-sm font-medium flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 bg-red-600 rounded-full"></span>
              {errors.qualification}
            </p>
          )}
        </div>

        {/* Institution Field - Left column */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Building2 className="h-4 w-4 text-blue-600" />
            Institution Name
          </label>
          <div className="relative">
            <input
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              disabled={isViewMode}
              placeholder="e.g., Massachusetts Institute of Technology"
              className={`w-full px-4 py-2.5 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.institution
                  ? "border-red-500 ring-2 ring-red-500 ring-opacity-20"
                  : "border-gray-300 hover:border-gray-400"
              } ${isViewMode ? "bg-gray-50 text-gray-600 cursor-not-allowed" : "bg-white"}`}
            />
            <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.institution && (
            <p className="text-red-600 text-sm font-medium flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 bg-red-600 rounded-full"></span>
              {errors.institution}
            </p>
          )}
        </div>

        {/* Board/University Field - Right column */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Board / University
          </label>
          <div className="relative">
            <input
              name="boardOrUniversity"
              value={formData.boardOrUniversity}
              onChange={handleChange}
              disabled={isViewMode}
              placeholder="e.g., Cambridge University, CBSE"
              className={`w-full px-4 py-2.5 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.boardOrUniversity
                  ? "border-red-500 ring-2 ring-red-500 ring-opacity-20"
                  : "border-gray-300 hover:border-gray-400"
              } ${isViewMode ? "bg-gray-50 text-gray-600 cursor-not-allowed" : "bg-white"}`}
            />
            <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.boardOrUniversity && (
            <p className="text-red-600 text-sm font-medium flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 bg-red-600 rounded-full"></span>
              {errors.boardOrUniversity}
            </p>
          )}
        </div>

        {/* Specialization Field - Left column */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Tag className="h-4 w-4 text-blue-600" />
            Specialization / Major
          </label>
          <input
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            disabled={isViewMode}
            placeholder="e.g., Computer Science, Business Administration"
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 ${
              isViewMode
                ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                : "bg-white"
            }`}
          />
          {!isViewMode && (
            <p className="text-gray-500 text-xs mt-1">Optional field</p>
          )}
        </div>

        {/* Year of Passing Field - Right column */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Calendar className="h-4 w-4 text-blue-600" />
            Year of Passing
          </label>
          <div className="relative">
            <select
              name="yearOfPassing"
              value={formData.yearOfPassing}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-4 py-2.5 pl-10 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                isViewMode
                  ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                  : "bg-white"
              } ${
                errors.yearOfPassing
                  ? "border-red-500 ring-2 ring-red-500 ring-opacity-20"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <option value="">Select passing year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            {!isViewMode && (
              <div className="absolute right-3 top-2.5 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </div>
          {errors.yearOfPassing && (
            <p className="text-red-600 text-sm font-medium flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 bg-red-600 rounded-full"></span>
              {errors.yearOfPassing}
            </p>
          )}
        </div>

        {/* Percentage Field - Full width at bottom */}
        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Percent className="h-4 w-4 text-blue-600" />
            Percentage / CGPA
          </label>
          <div className="relative max-w-md">
            <input
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              disabled={isViewMode}
              placeholder="e.g., 85.5 (leave empty if not applicable)"
              className={`w-3/4 px-4 py-2.5 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.percentage
                  ? "border-red-500 ring-2 ring-red-500 ring-opacity-20"
                  : "border-gray-300 hover:border-gray-400"
              } ${isViewMode ? "bg-gray-50 text-gray-600 cursor-not-allowed" : "bg-white"}`}
            />
            <Percent className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.percentage && (
            <p className="text-red-600 text-sm font-medium flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 bg-red-600 rounded-full"></span>
              {errors.percentage}
            </p>
          )}
          {!isViewMode && (
            <p className="text-gray-500 text-xs mt-1">
              Enter percentage between 0-100 or leave blank if not applicable
            </p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={`flex-1 px-5 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              isViewMode ? "bg-gray-100 font-bold border-gray-400" : ""
            }`}
          >
            {isViewMode ? (
              "Close"
            ) : (
              <>
                <X className="h-4 w-4" /> Cancel
              </>
            )}
          </button>
          {!isViewMode && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {isEditMode
                    ? "Update Education Record"
                    : "Add Education Record"}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default EducationForm;
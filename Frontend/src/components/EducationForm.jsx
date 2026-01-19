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
} from "lucide-react";

function EducationForm({
  initialData,
  onSubmit,
  onCancel,
  isEditMode = false,
}) {
  /* ===============================
     INITIAL STATE (NO useEffect)
     =============================== */
  const [formData, setFormData] = useState(() => ({
    id: initialData?.id?.toString() || "",
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

    if (!formData.id?.toString().trim()) newErrors.id = "ID is required";
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
    } else if (+formData.yearOfPassing < currentYear - 100) {
      newErrors.yearOfPassing = "Please enter a valid year";
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Academic Record" : "Add New Education"}
            </h2>
            <p className="text-gray-600 text-sm">
              {isEditMode
                ? "Update your qualification details"
                : "Fill in your academic qualification details below"}
            </p>
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ID Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Hash className="h-4 w-4 text-blue-600" />
            ID / Reference Number
          </label>
          <div className="relative">
            <input
              name="id"
              value={formData.id}
              onChange={handleChange}
              disabled={isEditMode}
              placeholder="Enter unique identifier"
              className={`w-full px-4 py-3 pl-11 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.id
                  ? "border-red-500 ring-2 ring-red-500 ring-opacity-20"
                  : "border-gray-300 hover:border-gray-400"
              } ${
                isEditMode
                  ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                  : "bg-white"
              }`}
            />
            <Hash className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.id && (
            <p className="text-red-600 text-sm font-medium flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 bg-red-600 rounded-full"></span>
              {errors.id}
            </p>
          )}
          {isEditMode && (
            <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
              <span className="h-1 w-1 bg-gray-400 rounded-full"></span>
              ID cannot be modified in edit mode
            </p>
          )}
        </div>

        {/* Qualification Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Award className="h-4 w-4 text-blue-600" />
            Qualification Level
          </label>
          <div className="relative">
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className={`w-full px-4 py-3 pl-11 border rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white ${
                errors.qualification
                  ? "border-red-500 ring-2 ring-red-500 ring-opacity-20"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <option value="">Select qualification level</option>
              {qualifications.map((q) => (
                <option key={q} value={q} className="py-2">
                  {q}
                </option>
              ))}
            </select>
            <Award className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <div className="absolute right-3 top-3.5 pointer-events-none">
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
          </div>
          {errors.qualification && (
            <p className="text-red-600 text-sm font-medium flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 bg-red-600 rounded-full"></span>
              {errors.qualification}
            </p>
          )}
        </div>

        {/* Specialization Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Tag className="h-4 w-4 text-blue-600" />
            Specialization / Major
          </label>
          <input
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="e.g., Computer Science, Business Administration"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-white"
          />
          <p className="text-gray-500 text-xs">Optional field</p>
        </div>

        {/* Institution Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            Institution Name
          </label>
          <div className="relative">
            <input
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="e.g., Massachusetts Institute of Technology"
              className={`w-full px-4 py-3 pl-11 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.institution
                  ? "border-red-500 ring-2 ring-red-500 ring-opacity-20"
                  : "border-gray-300 hover:border-gray-400"
              } bg-white`}
            />
            <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.institution && (
            <p className="text-red-600 text-sm font-medium flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 bg-red-600 rounded-full"></span>
              {errors.institution}
            </p>
          )}
        </div>

        {/* Board/University Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Board / University
          </label>
          <div className="relative">
            <input
              name="boardOrUniversity"
              value={formData.boardOrUniversity}
              onChange={handleChange}
              placeholder="e.g., Cambridge University, CBSE"
              className={`w-full px-4 py-3 pl-11 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.boardOrUniversity
                  ? "border-red-500 ring-2 ring-red-500 ring-opacity-20"
                  : "border-gray-300 hover:border-gray-400"
              } bg-white`}
            />
            <BookOpen className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.boardOrUniversity && (
            <p className="text-red-600 text-sm font-medium flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 bg-red-600 rounded-full"></span>
              {errors.boardOrUniversity}
            </p>
          )}
        </div>

        {/* Year of Passing Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            Year of Passing
          </label>
          <div className="relative">
            <select
              name="yearOfPassing"
              value={formData.yearOfPassing}
              onChange={handleChange}
              className={`w-full px-4 py-3 pl-11 border rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white ${
                errors.yearOfPassing
                  ? "border-red-500 ring-2 ring-red-500 ring-opacity-20"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <option value="">Select passing year</option>
              {years.map((y) => (
                <option key={y} value={y} className="py-2">
                  {y}
                </option>
              ))}
            </select>
            <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <div className="absolute right-3 top-3.5 pointer-events-none">
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
          </div>
          {errors.yearOfPassing && (
            <p className="text-red-600 text-sm font-medium flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 bg-red-600 rounded-full"></span>
              {errors.yearOfPassing}
            </p>
          )}
        </div>

        {/* Percentage Field */}
        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Percent className="h-4 w-4 text-blue-600" />
            Percentage / CGPA
          </label>
          <div className="relative max-w-md">
            <input
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              placeholder="e.g., 85.5 (leave empty if not applicable)"
              className={`w-full px-4 py-3 pl-11 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.percentage
                  ? "border-red-500 ring-2 ring-red-500 ring-opacity-20"
                  : "border-gray-300 hover:border-gray-400"
              } bg-white`}
            />
            <Percent className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            {formData.percentage && (
              <span className="absolute right-3 top-3.5 text-gray-500 font-medium">
                %
              </span>
            )}
          </div>
          {errors.percentage && (
            <p className="text-red-600 text-sm font-medium flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 bg-red-600 rounded-full"></span>
              {errors.percentage}
            </p>
          )}
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <span className="h-1 w-1 bg-gray-400 rounded-full"></span>
            Enter percentage between 0-100 or leave blank if not applicable
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3.5 text-gray-700 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        </div>
      </div>
    </form>
  );
}

export default EducationForm;

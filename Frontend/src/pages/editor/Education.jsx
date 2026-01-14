import { useEffect, useState } from "react";
import {
  getEducationByUser,
  addEducation,
  updateEducation,
  deleteEducation,
} from "../../services/educationAPI";
import EducationTable from "../../components/EducationTable";
import EducationForm from "../../components/EducationForm";
import {
  GraduationCap,
  Loader2,
  AlertCircle,
  PlusCircle,
} from "lucide-react";

function Education() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  const userId = "2"; // MUST exist in DB

  useEffect(() => {
    fetchEducationData();
  }, []);

  /* ================= FETCH ================= */
  const fetchEducationData = async () => {
    try {
      setLoading(true);
      const res = await getEducationByUser(userId);
      setEducation(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load data");
      setEducation([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD ================= */
  const handleAddEducation = async (formData) => {
    try {
      await addEducation(userId, {
        qualification: formData.qualification,
        specialization: formData.specialization || null,
        institution: formData.institution,
        boardOrUniversity: formData.boardOrUniversity,
        yearOfPassing: Number(formData.yearOfPassing),
        percentage: formData.percentage
          ? Number(formData.percentage)
          : null,
      });
      setIsModalOpen(false);
      fetchEducationData();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= EDIT ================= */
  const handleEditEducation = async (id, formData) => {
    try {
      await updateEducation(id, {
        qualification: formData.qualification,
        specialization: formData.specialization || null,
        institution: formData.institution,
        boardOrUniversity: formData.boardOrUniversity,
        yearOfPassing: Number(formData.yearOfPassing),
        percentage: formData.percentage
          ? Number(formData.percentage)
          : null,
      });

      closeModal();
      fetchEducationData();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= DELETE ================= */
  const handleDeleteEducation = async (id) => {
    if (!window.confirm("Delete this education record?")) return;
    try {
      await deleteEducation(id);
      fetchEducationData();
    } catch (err) {
      alert(err.message);
    }
  };

  const openEditModal = (edu) => {
    setEditingEducation(edu);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingEducation(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingEducation(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-7 w-7 text-blue-600" />
            <h1 className="text-3xl font-bold">Education</h1>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            <PlusCircle className="h-5 w-5" />
            Add
          </button>
        </div>

        {/* CONTENT */}
        <div className=" p-6 rounded-xl shadow bg-gray-100">
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" />
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-12 text-red-600">
              <AlertCircle className="mx-auto mb-2" />
              {error}
            </div>
          )}

          {!loading && !error && (
            <EducationTable
              data={education}
              onEdit={openEditModal}
              onDelete={handleDeleteEducation}
            />
          )}
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <EducationForm
                initialData={editingEducation}
                isEditMode={isEditMode}
                onSubmit={
                  isEditMode
                    ? (data) =>
                        handleEditEducation(editingEducation.id, data)
                    : handleAddEducation
                }
                onCancel={closeModal}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Education;

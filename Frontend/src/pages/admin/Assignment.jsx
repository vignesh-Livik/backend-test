import { useEffect, useState } from "react";
import { getAllAssignments,createAssignment,updateAssignment,deleteAssignment } from "../../services/assignmentService";
import { UserPlus, Edit2, Trash2, X, Loader2, Calendar, Mail, Users, UserCheck, PlusCircle } from "lucide-react";

export default function Assignment() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await getAllAssignments();
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id) => {
    await deleteAssignment(id);
    setDeleteId(null);
    fetchAssignments();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Assignment Details
            </h1>
            <p className="text-gray-600 mt-1">Manage editor and viewer assignments</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <UserPlus className="w-5 h-5" />
            Assign User +
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Assignments</p>
                <h2 className="text-3xl font-bold mt-2">{assignments.length}</h2>
              </div>
              <Users className="w-12 h-12 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100">Active Editors</p>
                <h2 className="text-3xl font-bold mt-2">
                  {[...new Set(assignments.map(a => a.editorId))].length}
                </h2>
              </div>
              <UserCheck className="w-12 h-12 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Active Viewers</p>
                <h2 className="text-3xl font-bold mt-2">
                  {[...new Set(assignments.map(a => a.user?.userId))].length}
                </h2>
              </div>
              <Users className="w-12 h-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">All Assignments</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Editor ID
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Viewer ID
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-gray-600">Loading assignments...</p>
                      </div>
                    </td>
                  </tr>
                ) : assignments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Users className="w-12 h-12 text-gray-300" />
                        <div>
                          <p className="text-gray-500 font-medium">No assignments found</p>
                          <p className="text-sm text-gray-400 mt-1">Create your first assignment to get started</p>
                        </div>
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Create First Assignment
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  assignments.map((row) => (
                    <tr 
                      key={row.id} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="p-4">
                        <span className="font-mono text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          #{row.id}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{row.editorId}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-500" />
                          <span className="font-medium">{row.user?.userId || "N/A"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{row.user?.email || "N/A"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {new Date(row.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {new Date(row.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditRow(row)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(row.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Assignment Modal */}
        {showCreateModal && (
          <CreateAssignmentModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchAssignments();
            }}
          />
        )}

        {/* Edit Modal */}
        {editRow && (
          <AssignmentModal
            row={editRow}
            onClose={() => setEditRow(null)}
            onSuccess={fetchAssignments}
          />
        )}

        {/* Delete Modal */}
        {deleteId && (
          <DeleteModal
            open={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={() => handleDelete(deleteId)}
          />
        )}
      </div>
    </div>
  );
}

// Create Assignment Modal Component
function CreateAssignmentModal({ onClose, onSuccess }) {
  const [editorId, setEditorId] = useState("");
  const [viewerId, setViewerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!editorId.trim() || !viewerId.trim()) {
      setError("Both editor ID and viewer ID are required");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await createAssignment({ editorId, viewerId });
      setSuccess(true);
      
      // Reset form and close modal after success
      setTimeout(() => {
        setEditorId("");
        setViewerId("");
        setSuccess(false);
        onSuccess();
      }, 1500);
      
    } catch (err) {
      if (err.response?.status === 409) {
        setError("This viewer already has an assignment. Please use a different viewer ID.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create assignment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New Assignment</h2>
            <p className="text-sm text-gray-500 mt-1">Assign a viewer to an editor</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assignment Created!</h3>
              <p className="text-gray-600">The assignment has been successfully created.</p>
              <div className="mt-6">
                <div className="animate-pulse flex space-x-1 justify-center">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Editor ID
                  </label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter editor ID"
                      value={editorId}
                      onChange={(e) => setEditorId(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Unique identifier for the editor</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Viewer ID
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter viewer ID"
                      value={viewerId}
                      onChange={(e) => setViewerId(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Each viewer can only have one assignment</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Assignment Rules
                  </h3>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>One editor can have multiple viewer assignments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Each viewer can only be assigned to one editor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Duplicate assignments will be rejected</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create Assignment"
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

// Edit Assignment Modal Component (Updated)
function AssignmentModal({ row, onClose, onSuccess }) {
  const [editorId, setEditorId] = useState(row.editorId);
  const [viewerId, setViewerId] = useState(row.viewerId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!editorId.trim() || !viewerId.trim()) {
      setError("Both fields are required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await updateAssignment(row.id, { editorId, viewerId });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Assignment</h2>
            <p className="text-sm text-gray-500 mt-1">Update editor and viewer information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={submit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Editor ID
              </label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter editor ID"
                  value={editorId}
                  onChange={(e) => setEditorId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Viewer ID
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter viewer ID"
                  value={viewerId}
                  onChange={(e) => setViewerId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Assignment Info</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Assignment ID</p>
                  <p className="font-medium">#{row.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{row.user?.email || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Modal Component
function DeleteModal({ open, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
            Delete Assignment?
          </h3>
          
          <p className="text-gray-600 text-center mb-6">
            This action cannot be undone. All data associated with this assignment will be permanently removed.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Assignment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


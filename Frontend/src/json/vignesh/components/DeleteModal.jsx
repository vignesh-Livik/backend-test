import { toast } from "react-toastify";
import { API } from "./Utils";

const DeleteModal = ({ userData, onClose, updateUI }) => {
  const handleDeleteUser = async () => {
    try {
      await API.delete(`/users/${userData.id}`);
      updateUI('delete', userData);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || 'Something went wrong';
      toast.error(message);
    } finally {
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
          ⚠️
        </div>

        <p className="text-sm text-gray-500">
          You are about to permanently delete the following user
        </p>
      </div>

      <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
        <strong>Warning:</strong> This action is irreversible. Once deleted,
        this user and all related data cannot be recovered.
      </div>

      <div className="flex justify-center gap-3 pt-3">
        <button
          onClick={onClose}
          className="flex-1 py-2 text-sm border rounded-md bg-gray-600 text-white hover:bg-gray-700">
          Cancel
        </button>

        <button
          onClick={handleDeleteUser}
          className="flex-1 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
          Yes, Delete User
        </button>
      </div>
    </div>
  );
};
export default DeleteModal
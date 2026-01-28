import React, { useState } from "react";
import UserPersonalTable from "../../../src/components/UserPersonalTable";
import UserPersonalForm from "../../../src/components/UserPersonalForm";

const Personal = () => {
  const [editingUserId, setEditingUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (userId) => {
    setEditingUserId(userId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingUserId(null);
    setShowForm(false);
  };

  const handleSaved = () => {
    // optionally refresh table or show toast
  };

  return (
    <div className="p-1">
      {showForm && (
        <UserPersonalForm
          userId={editingUserId}
          onClose={handleCloseForm}
          onSaved={handleSaved}
        />
      )}

      <UserPersonalTable onEdit={handleEdit} />
    </div>
  );
};

export default Personal;

import React, { useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Navigation, Trash, UserPen, UserPlus } from 'lucide-react';
import SearchBox from './components/SearchBox';
import DeleteModal from './components/DeleteModal';
import Modal from './components/Modal';
import Form from './components/Form';
import { API } from './components/Utils';

const heading = [
  'ID',
  'NAME',
  'EMAIL',
  'PHONE',
  'WEBSITE',
  'COMPANYNAME',
  'ACTIONS',
];

const currentUser = (users, id) => {
  if (!id || !users) {
    return null;
  } else {
    return users.find((user) => user.id === id) || null;
  }
};
const Table = () => {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await API.get('/users');
      console.log(res.data);
      setUsers(res.data);
      toast.success('Data Fetched Successfully!!');
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const term = searchTerm.toLowerCase();

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(term) ||
        user.website?.toLowerCase().includes(term) ||
        user.company?.name?.toLowerCase().includes(term)
      );
    });
  }, [users, searchTerm]);

  const userData = useMemo(() => {
    if (!modal) {
      return null;
    } else {
      return currentUser(users, modal.userId);
    }
  }, [modal, users]);

  const autoIdIncrement = useMemo(() => {
    if (!users || users.length === 0) return 1;

    const lastUser = users[users.length - 1];
    return Number(lastUser.id) + 1;
  }, [users]);

  const handleCrud = (e, id = null) => {
    e.stopPropagation();
    const { value } = e.currentTarget;

    switch (value) {
      case 'delete':
        setModal({ type: 'delete', userId: id });
        break;

      case 'view':
        setModal({ type: 'view', userId: id });
        break;

      case 'edit':
        setModal({ type: 'edit', userId: id });
        break;

      case 'add':
        setModal({ type: 'add', userId: null });
        break;

      default:
        setModal(null);
    }
  };

  const handleAfterUpdated = (type, payload) => {
    switch (type) {
      case 'edit':
        setUsers((prev) =>
          prev.map((user) => (user.id === payload.id ? payload : user)),
        );
        toast.success('User Profile Updated');
        break;

      case 'delete':
        setUsers((prev) => prev.filter((user) => user.id !== payload.id));
        toast.success('User Profile Deleted');
        break;

      case 'add':
        setUsers((prev) => [...prev, payload]);
        toast.success('User Profile Added');
        break;
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-center">Loading ...</p>
      </div>
    );
  }
  return (
    <div>
      <section className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold uppercase">User Details</h2>
        <div className="flex justify-between items-center gap-5">
          <SearchBox
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="px-2 py-1  rounded  font-medium bg-orange-400 text-white hover:bg-orange-500 "
            value="add"
            onClick={handleCrud}>
            <UserPlus size={22} />
          </button>
        </div>
      </section>
      {filteredUsers ? (
        <table className="table-auto w-full bg-white border border-gray-300 text-center">
          <thead>
            <tr className="text-sm bg-indigo-400 text-gray-800">
              {heading.map((head, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-4 py-3">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="text-sm font-normal hover:bg-cyan-50">
                <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.name}
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  {user.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.phone}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.website}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.company.name}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2 justify-center items-center">
                  <button
                    className="h-8 w-8 flex items-center justify-center border rounded hover:bg-gray-200"
                    value="edit"
                    onClick={(e) => handleCrud(e, user.id)}>
                    <UserPen
                      size={18}
                      color="violet"
                    />
                  </button>

                  <button
                    className="h-8 w-8 flex items-center justify-center border rounded hover:bg-gray-200"
                    value="view"
                    onClick={(e) => handleCrud(e, user.id)}>
                    <Navigation
                      size={18}
                      color="blue"
                    />
                  </button>

                  <button
                    className="h-8 w-8 flex items-center justify-center border rounded hover:bg-gray-200"
                    value="delete"
                    onClick={(e) => handleCrud(e, user.id)}>
                    <Trash
                      size={18}
                      color="red"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Data Found</p>
      )}
      {modal && (
        <Modal
          size={modal.type === 'delete' ? 'sm' : 'lg'}
          onClose={() => setModal(null)}>
          {modal.type !== 'delete' ? (
            <Form
              data={userData}
              formType={modal.type}
              onClose={() => setModal(null)}
              updateUI={handleAfterUpdated}
              autoId={autoIdIncrement}
            />
          ) : (
            <DeleteModal
              userData={userData}
              onClose={() => setModal(null)}
              updateUI={handleAfterUpdated}
            />
          )}
        </Modal>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};
export default Table;

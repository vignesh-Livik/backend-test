import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import SearchableUserMap from "./SearchableMap";
const emptyUser = {
  id: "",
  name: "",
  username: "",
  email: "",
  phone: "",
  website: "",
  address: {
    street: "",
    suite: "",
    city: "",
    zipcode: "",
    geo: {
      lat: "",
      lng: "",
    },
  },
  company: {
    name: "",
    catchPhrase: "",
    bs: "",
  },
  fileName: "",
};

function Userdata() {
  const API = axios.create({
    baseURL: "http://localhost:3001",
  });

  const getres = () => API.get("/users");
  const postres = (form) => API.post("/users", form);
  const updateres = (form, id) => API.put(`/users/${id}`, form);
  const deleteres = (id) => API.delete(`/users/${id}`);

  const [detail, setDetail] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyUser);
  const [isEdit, setIsEdit] = useState(false);
  const [isview, setIsview] = useState(false);
  const [selectedrecord, setSelectedrecord] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [driveFile, setDriveFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const CLIENT_ID =
    "354363872638-12bhs8srf8gsndlpvc25chj8lhpdo4iv.apps.googleusercontent.com";

  const tokenClientRef = React.useRef(null);
  const accessTokenRef = React.useRef(null);

  useEffect(() => {
    if (window.google) {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: (tokenResponse) => {
          accessTokenRef.current = tokenResponse.access_token;
        },
      });
    }
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await getres();
        setDetail(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchdata();
  }, []);

  const getNextId = () => {
    if (detail.length === 0) return "1";

    const maxId = Math.max(...detail.map((u) => Number(u.id)));

    return String(maxId + 1);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSave = async () => {
    try {
      if (selectedFile && !accessTokenRef.current) {
        tokenClientRef.current.requestAccessToken();
        return;
      }

      if (selectedFile && accessTokenRef.current) {
        const formData = new FormData();

        formData.append(
          "metadata",
          new Blob([JSON.stringify({ name: selectedFile.name })], {
            type: "application/json",
          }),
        );

        formData.append("file", selectedFile);

        const response = await fetch(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessTokenRef.current}`,
            },
            body: formData,
          },
        );
        const data = await response.json();

        const drivePreviewUrl = `https://drive.google.com/file/d/${data.id}/preview`;
        const driveViewUrl = `https://drive.google.com/file/d/${data.id}/view`;

        setDriveFile({
          id: data.id,
          name: data.name,
          previewUrl: drivePreviewUrl,
          viewUrl: driveViewUrl,
        });
        console.log("Google Drive upload success:", data);
      }
      let res;

      if (isEdit) {
        res = await updateres(form, form.id);
        setDetail((prev) =>
          prev.map((u) => (u.id === res.data.id ? res.data : u)),
        );
        toast.success("User updated successfully");
      } else {
        const newUser = { ...form, id: getNextId() };
        res = await postres(newUser);
        setDetail((prev) => [...prev, res.data]);
        toast.success("User added successfully");
      }

      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong or Google access cancelled");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setForm((prev) => {
      const updated = { ...prev };
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };
  const handleDelete = async (id) => {
    try {
      await deleteres(id);
      setDetail((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div
        className="mb-6 rounded-xl border border-slate-700 p-4 shadow-sm
                grid grid-cols-3 items-center"
      >
        <div />
        <h1 className="text-center font-bold text-2xl text-slate-800">
          USER DATA
        </h1>
        <div className="flex justify-end">
          <button
            onClick={() => {
              setIsEdit(false);
              setForm(emptyUser);
              setOpen(true);
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold 
                 text-white hover:bg-emerald-700 transition"
          >
            Add User
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b relative flex items-center justify-center">
              <h2 className="text-xl font-semibold">
                {isEdit ? "Edit User" : "Add User"}
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="absolute right-6 text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4 flex-1 overflow-y-auto overflow-x-hidden no-scroll">
              <form className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="h-28 w-28 rounded-full border bg-emerald-100 shadow-sm flex items-center justify-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-emerald-700">
                          {form.name ? form.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-700 shadow">
                      ✎
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      User Profile
                    </h3>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4 border-b pb-2">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Username"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Website"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4 border-b pb-2">
                    Address
                  </h4>
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">
                      Search & Pick Location
                    </h4>

                    <SearchableUserMap
                      lat={form.address.geo.lat}
                      lng={form.address.geo.lng}
                      onLocationChange={({
                        lat,
                        lng,
                        city,
                        street,
                        zipcode,
                      }) => {
                        setForm((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            city: city || prev.address.city,
                            street: street || prev.address.street,
                            zipcode: zipcode || prev.address.zipcode,
                            geo: {
                              lat: lat.toString(),
                              lng: lng.toString(),
                            },
                          },
                        }));
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Street"
                      name="address.street"
                      value={form.address.street}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Suite"
                      name="address.suite"
                      value={form.address.suite}
                      onChange={handleChange}
                    />
                    <InputField
                      label="City"
                      name="address.city"
                      value={form.address.city}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Zipcode"
                      name="address.zipcode"
                      value={form.address.zipcode}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Geo Latitude"
                      name="address.geo.lat"
                      value={form.address.geo.lat}
                      onChange={handleChange}
                      type="number"
                      min={-90}
                      max={90}
                    />

                    <InputField
                      label="Geo Longitude"
                      name="address.geo.lng"
                      value={form.address.geo.lng}
                      onChange={handleChange}
                      type="number"
                      min={-180}
                      max={180}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4 border-b pb-2">
                    Company
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Company Name"
                      name="company.name"
                      value={form.company.name}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Catch Phrase"
                      name="company.catchPhrase"
                      value={form.company.catchPhrase}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Business"
                      name="company.bs"
                      value={form.company.bs}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 rounded-xl border-t flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-300 bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2  bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700"
              >
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isview && selectedrecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b relative flex items-center justify-center">
              <h2 className="text-xl font-semibold">User Details</h2>

              <button
                onClick={() => setIsview(false)}
                className="absolute right-6 text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto flex-1 overflow-x-hidden no-scroll space-y-4">
              <h3 className="font-semibold text-xl mb-2">Basic Info</h3>

              <Info label="Name" value={selectedrecord.name} />
              <Info label="Username" value={selectedrecord.username} />
              <Info label="Email" value={selectedrecord.email} />
              <Info label="phone" value={selectedrecord.phone} />
              <Info label="Website" value={selectedrecord.website} />
              <h3 className="font-semibold text-lg mt-4 mb-2">Address</h3>
              <Info label="City" value={selectedrecord.address.city} />
              <Info label="Street" value={selectedrecord.address.street} />
              <Info label="Suite" value={selectedrecord.address.suite} />
              <Info label="Zipcode" value={selectedrecord.address.zipcode} />
              <Info
                label="Geo Latitude"
                value={selectedrecord.address.geo.lat}
              />
              <Info
                label="Geo Longitude"
                value={selectedrecord.address.geo.lng}
              />

              <h3 className="font-semibold text-lg mt-4 mb-2">Company</h3>
              <Info label="Companyname" value={selectedrecord.company.name} />
              <Info
                label="Catchpharse"
                value={selectedrecord.company.catchPhrase}
              />
              <Info label="Business" value={selectedrecord.company.bs} />

              <h3 className="font-semibold text-lg mt-4 mb-2">Location</h3>

              <SearchableUserMap
                lat={selectedrecord.address?.geo?.lat}
                lng={selectedrecord.address?.geo?.lng}
                readOnly={true}
              />
            </div>

            <div className="px-6 py-4 border-t flex justify-end bg-gray-50 rounded-xl">
              <button
                onClick={() => setIsview(false)}
                className="px-4 py-2 border rounded hover:bg-gray-300 bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-emerald-600 text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">phone</th>
              <th className="px-4 py-3 text-left font-semibold">Company</th>
              <th className="px-4 py-3 text-left font-semibold">Website</th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {detail.map((user, index) => (
              <tr
                key={user.id}
                className={`transition hover:bg-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {user.id}
                </td>

                <td className="px-4 py-3 font-medium text-gray-700">
                  {user.name}
                </td>

                <td className="px-4 py-3 font-medium text-gray-700">
                  {user.email}
                </td>

                <td className="px-4 py-3 font-medium text-gray-700">
                  {user.phone}
                </td>

                <td className="px-4 py-3 font-medium text-gray-700">
                  {user.company.name}
                </td>

                <td className="px-4 py-3 font-medium text-gray-700">
                  {user.website}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedrecord(user);
                        setIsview(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full
                  text-emerald-700
                 hover:bg-emerald-200 transition text-xl font-semibold"
                    >
                      <FaEye className="text-lg" />
                    </button>

                    <button
                      onClick={() => {
                        setIsEdit(true);
                        setForm(user);
                        setOpen(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full
                  text-amber-700
                 hover:bg-amber-200 transition text-xs font-semibold"
                    >
                      <FaEdit className="text-lg" />
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full
                 text-red-700
                 hover:bg-red-200 transition text-xs font-semibold"
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}

const InputField = ({ label, name, value, onChange, type = "text" }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border p-2 rounded "
      />
    </div>
  );
};

const Info = ({ label, value }) => {
  return (
    <div>
      <p>
        <span className="font-semibold">{label}: </span>
        {value || "NA"}
      </p>
    </div>
  );
};

export default Userdata;

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

const Vicky = () => {
  const [data, setData] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/users');
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const currentUser = useMemo(() => {
    if (page > 0) {
      return data[page - 1];
    } else {
      return null;
    }
  }, [page, data]);

  const handlePagination = (e) => {
    const { value } = e.target;
    console.log(value);
    if (value === 'prev') {
      setPage((prev) => prev - 1);
    } else {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="h-fit bg-linear-to-br  flex flex-col gap-3 justify-center items-center p-6">
      {currentUser ? (
        <>
          <Form data={currentUser} />
          <Pagination
            currentPage={page}
            setCurrentPage={handlePagination}
            totalUser={data.length}
          />
        </>
      ) : (
        <p>No data</p>
      )}
    </div>
  );
};

const Form = ({ data }) => {
  console.log('form', data);
  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
      <section>
        <h3 className="section-title mt-2">Main Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="User ID"
            value={data.id}
          />
          <Field
            label="Name"
            value={data.name}
          />
          <Field
            label="Username"
            value={data.username}
          />
          <Field
            label="Email"
            value={data.email}
          />
        </div>
      </section>

      <section>
        <h3 className="section-title">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Street"
            value={data.address.street}
          />
          <Field
            label="Suite"
            value={data.address.suite}
          />
          <Field
            label="City"
            value={data.address.city}
          />
          <Field
            label="Zipcode"
            value={data.address.zipcode}
          />
        </div>
      </section>

      <section>
        <h3 className="section-title">Geo Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Latitude"
            value={data.address.geo.lat}
          />
          <Field
            label="Longitude"
            value={data.address.geo.lng}
          />
        </div>
      </section>

      <section>
        <h3 className="section-title">Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Phone"
            value={data.phone}
          />
          <Field
            label="Website"
            value={data.website}
          />
        </div>
      </section>

      <section>
        <h3 className="section-title">Company</h3>
        <div className="grid grid-cols-1 gap-4">
          <Field
            label="Company Name"
            value={data.company.name}
          />
          <Field
            label="Catch Phrase"
            value={data.company.catchPhrase}
          />
          <Field
            label="Business Strategy"
            value={data.company.bs}
          />
        </div>
      </section>
    </div>
  );
};

const Field = ({ label, value }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        value={value || ''}
        readOnly
        className="px-3 py-2 border rounded-md bg-gray-100 text-gray-700 focus:outline-none"
      />
    </div>
  );
};

const Pagination = ({ currentPage, setCurrentPage, totalUser }) => {
  return (
    <div className="flex gap-4 justify-center items-center">
      <button
        className="px-4 py-2 bg-white rounded-md hover:bg-blue-600 hover:text-white"
        disabled={currentPage === 1}
        value="prev"
        onClick={setCurrentPage}>
        {'<<'}
      </button>
      <div className="flex gap-3 items-center justify-center border border-gray-700 rounded-md bg-cyan-100 p-2">
        <p className="bg-gray-400 text-white px-2">{currentPage}</p>
        <span className="text-emerald-600">/</span>
        <p>{totalUser}</p>
      </div>

      <button
        className="px-4 py-2 bg-white rounded-md hover:bg-blue-600 hover:text-white"
        value="next"
        onClick={setCurrentPage}
        disabled={currentPage === totalUser}>
        {'>>'}
      </button>
    </div>
  );
};

export default Vicky;

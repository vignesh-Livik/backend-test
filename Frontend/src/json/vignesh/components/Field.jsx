const Field = ({ name, label, value, readOnly, onChange = () => {} }) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        value={value}
        id={name}
        name={name}
        placeholder={
          name === 'landmark' ? 'Enter city and pincode' : `Enter ${label}`
        }
        onChange={onChange}
        readOnly={readOnly}
        className="px-3 py-2 border rounded-md  text-gray-700 focus:outline-none"
      />
    </div>
  );
};
export default Field
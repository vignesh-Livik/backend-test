const SearchBox = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search by name, website, company..."
      value={value}
      onChange={onChange}
      className="px-3 py-1 border rounded focus:outline-none focus:ring w-64"
    />
  );
};

export default SearchBox;

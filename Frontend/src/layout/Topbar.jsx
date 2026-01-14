import { useNavigate } from "react-router";

const Topbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header
      style={{
        height: "60px",
        background: "#fff",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <button className="px-5 py-2 border rounded-md" onClick={logout}>Logout</button>
    </header>
  );
};

export default Topbar;

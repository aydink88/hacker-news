import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [today] = useState(() => new Date().toLocaleDateString());
  const { user, setUser } = useAppContext();

  const logout = () => {
    setUser({} as any);
    localStorage.removeItem("hn_token");
    window.location.reload();
  };

  return (
    <div className="header">
      <nav>
        <a className="logo" href="/">
          <img src="/logo.png" width="18" height="18" alt="logo" />
        </a>
        <a href="/">News</a>
        <a href="/">Past</a>
        <a href="/">Comments</a>
        <a href="/">Ask</a>
        <a href="/">Show</a>
        <a href="/">Jobs</a>
        <NavLink to="/submit">Submit</NavLink>
        <span style={{ color: "#fff" }}>{today}</span>
      </nav>{" "}
      {user._id ? (
        <div>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <Link to="/auth">login</Link>
      )}
    </div>
  );
};

export default Navbar;

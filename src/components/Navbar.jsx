import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      {/* Navigation */}
      <NavLink
        to="/"
        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
      >
        Home
      </NavLink>
      {" | "}
      <NavLink
        to="/orders"
        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
      >
        Orders
      </NavLink>
      {" | "}
      <NavLink
        to="/contact"
        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
      >
        Contact
      </NavLink>
    </nav>
  );
}

export default Navbar;

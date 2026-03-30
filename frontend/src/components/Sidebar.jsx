import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Projects", path: "/projects" },
    { name: "Tasks", path: "/tasks" },
    { name: "Users", path: "/users" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8">ProjectManager</h1>

      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `p-2 my-1 rounded hover:bg-gray-700 ${
              isActive ? "bg-gray-700 font-semibold" : ""
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  );
}
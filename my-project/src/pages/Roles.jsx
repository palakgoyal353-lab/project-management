import { ShieldCheck, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AddRoleModal from "../components/AddRoleModal";
import EditRoleModal from "../components/EditRoleModal";
import RoleTable from "../components/RoleTable";

const defaultRoles = [
  {
    name: "ADMIN_IT",
    dashboard: true,
    projects: true,
    team: true,
    tasks: true,
    database: true,
  },
  {
    name: "MANAGER",
    dashboard: true,
    projects: true,
    team: true,
    tasks: true,
    database: false,
  },
  {
    name: "MEMBER",
    dashboard: true,
    projects: true,
    team: false,
    tasks: false,
    database: false,
  },
];

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const savedRoles = localStorage.getItem("roles");

    if (savedRoles) {
      setRoles(JSON.parse(savedRoles));
    } else {
      setRoles(defaultRoles);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("roles", JSON.stringify(roles));
  }, [roles]);

  const addRole = (newRole) => {
    setRoles([...roles, newRole]);
  };

  const updateRole = (updatedRole) => {
    setRoles(
      roles.map((role) =>
        role.name === updatedRole.name ? updatedRole : role
      )
    );
  };

  const deleteRole = (name) => {
    setRoles(roles.filter((role) => role.name !== name));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg,#1e3a5f 0%,#1e1b4b 40%,#312e81 70%,#4c1d95 100%)",
        }}
      >
        <div className="p-8">

          <div className="flex justify-between items-center">

            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="text-blue-200" />
                <span className="text-blue-200 text-sm">
                  Roles & Permissions
                </span>
              </div>

              <h1
                className="text-4xl font-bold text-white"
                style={{ fontFamily: "Outfit,Inter,sans-serif" }}
              >
                Roles Management
              </h1>

              <p className="text-blue-200/70 mt-2">
                Create and manage permissions for users.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus size={18} />
              Add New Role
            </button>

          </div>
        </div>
      </div>

      <RoleTable
        roles={roles}
        onEdit={(role) => {
          setSelectedRole(role);
          setShowEditModal(true);
        }}
        onDelete={deleteRole}
      />

      <AddRoleModal
        isOpen={showAddModal}
        setIsOpen={setShowAddModal}
        addRole={addRole}
      />

      <EditRoleModal
        isOpen={showEditModal}
        setIsOpen={setShowEditModal}
        role={selectedRole}
        updateRole={updateRole}
      />
    </div>
  );
};

export default Roles;
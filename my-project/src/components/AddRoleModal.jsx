import { useState } from "react";
import { XIcon } from "lucide-react";

const AddRoleModal = ({ isOpen, setIsOpen, addRole }) => {
  const [formData, setFormData] = useState({
    name: "",
    dashboard: false,
    projects: false,
    team: false,
    tasks: false,
    database: false,
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.name.trim()) return;

    addRole({
      ...formData,
      name: formData.name.toUpperCase(),
    });

    setFormData({
      name: "",
      dashboard: false,
      projects: false,
      team: false,
      tasks: false,
      database: false,
    });

    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md relative">

        <button
          className="absolute top-3 right-3"
          onClick={() => setIsOpen(false)}
        >
          <XIcon className="size-5 text-zinc-500" />
        </button>

        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-5">
          Add New Role
        </h2>

        <input
          type="text"
          placeholder="Role name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 mb-5"
        />

        <div className="space-y-3">

          {["dashboard", "projects", "team", "tasks", "database"].map(
            (permission) => (
              <label
                key={permission}
                className="flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={formData[permission]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [permission]: e.target.checked,
                    })
                  }
                />

                <span className="capitalize text-zinc-800 dark:text-zinc-200">
                  {permission}
                </span>
              </label>
            )
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Save
          </button>

        </div>
      </div>
    </div>
  );
};

export default AddRoleModal;
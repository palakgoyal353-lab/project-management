import { CheckCircle2, XCircle } from "lucide-react";

const RoleTable = ({ roles, onEdit, onDelete }) => {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700/50 bg-white dark:bg-zinc-800/60 p-6 shadow-sm">

      <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-6">
        Existing Roles
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="text-left py-3">Role</th>
              <th>Dashboard</th>
              <th>Projects</th>
              <th>Team</th>
              <th>Tasks</th>
              <th>Database</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {roles.map((role) => (
              <tr
                key={role.name}
                className="border-b border-zinc-100 dark:border-zinc-700"
              >
                <td className="py-4 font-medium text-zinc-800 dark:text-zinc-100">
                  {role.name}
                </td>

               <td className="text-center">
  {role.dashboard ? (
    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-medium">
      Allowed
    </span>
  ) : (
    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 text-xs font-medium">
      Denied
    </span>
  )}
</td>

<td className="text-center">
  {role.projects ? (
    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-medium">
      Allowed
    </span>
  ) : (
    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 text-xs font-medium">
      Denied
    </span>
  )}
</td>

<td className="text-center">
  {role.team ? (
    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-medium">
      Allowed
    </span>
  ) : (
    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 text-xs font-medium">
      Denied
    </span>
  )}
</td>

<td className="text-center">
  {role.tasks ? (
    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-medium">
      Allowed
    </span>
  ) : (
    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 text-xs font-medium">
      Denied
    </span>
  )}
</td>

<td className="text-center">
  {role.database ? (
    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-medium">
      Allowed
    </span>
  ) : (
    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 text-xs font-medium">
      Denied
    </span>
  )}
</td>
                <td className="text-center space-x-2">

                  <button
                    onClick={() => onEdit(role)}
                    className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(role.name)}
                    className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
};

export default RoleTable;
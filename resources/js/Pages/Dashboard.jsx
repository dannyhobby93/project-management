import { Head, Link } from "@inertiajs/react";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/utils/constants";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const taskTypes = [
  {
    label: "Pending Tasks",
    color: "amber-500",
    userKey: "userPendingTasks",
    totalKey: "pendingTasks",
  },
  {
    label: "In Progress Tasks",
    color: "blue-500",
    userKey: "userIn_progressTasks",
    totalKey: "in_progressTasks",
  },
  {
    label: "Completed Tasks",
    color: "green-500",
    userKey: "userCompletedTasks",
    totalKey: "completedTasks",
  },
];

function TaskOverview({ tasks }) {
  return (
    <>
      {taskTypes.map((task, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg"
        >
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <h3 className={`font-bold text-xl text-${task.color}`}>
                {task.label}
              </h3>
              <p className="mt-1 text-lg">
                <span className="mr-2">{tasks[task.userKey]}</span>|
                <span className="ml-2">{tasks[task.totalKey]}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default function Dashboard({ tasks, activeTasks }) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Dashboard
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-3 gap-4">
          <TaskOverview tasks={tasks} />
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-4">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 text-gray-900 dark:text-gray-100">
                <h3 className="font-bold text-xl text-gray-200">
                  My Active Tasks
                </h3>
                {activeTasks.data.length === 0 ? (
                  <div className="p-6 text-gray-900 dark:text-gray-100">
                    <p className="mt-1 text-lg">No active tasks found.</p>
                  </div>
                ) : (
                  <table className="w-full mt-4 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-3 py-3">Project</th>
                        <th className="px-3 py-3">Task</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-3 py-3">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTasks.data.map((task, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <td className="px-3 py-2">
                            <Link
                              href={route("project.show", task.project.id)}
                              className="hover:underline font-bold text-white"
                            >
                              {task.project.name}
                            </Link>
                          </td>
                          <td className="px-3 py-2">
                            <Link
                              href={route("task.show", task.id)}
                              className="hover:underline font-bold text-white"
                            >
                              {task.name}
                            </Link>
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-1 rounded-md text-white ${
                                TASK_STATUS_CLASS_MAP[task.status]
                              }`}
                            >
                              {TASK_STATUS_TEXT_MAP[task.status]}
                            </span>
                          </td>
                          <td className="px-3 py-2">{task.due_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

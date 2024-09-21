import { Link, router } from "@inertiajs/react";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/utils/constants";

import Pagination from "@/Components/Pagination";
import React from "react";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";

export default function TaskTable({
  tasks,
  queryParams = null,
  projectColumn = false,
}) {
  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }

    router.get(route("task.index"), queryParams, {
      replace: true,
      preserveState: true,
    });
  };

  const onKeyPress = (name, event) => {
    if (event.key === "Enter") {
      searchFieldChanged(name, event.target.value);
    }
  };

  const sortChanged = (name) => {
    if (queryParams.sort === name) {
      queryParams.order = queryParams.order === "asc" ? "desc" : "asc";
    } else {
      queryParams.sort = name;
      queryParams.order = "asc";
    }

    router.get(route("task.index"), queryParams, {
      replace: true,
      preserveState: true,
    });
  };
  return (
    <>
      <div className="overflow-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
            <tr className="text-nowrap">
              <TableHeading
                name="id"
                sort={queryParams.sort}
                order={queryParams.order}
                sortChanged={sortChanged}
              >
                ID
              </TableHeading>
              <TableHeading name="image">Image</TableHeading>
              {projectColumn && (
                <TableHeading
                  name="project"
                  sort={queryParams.sort}
                  order={queryParams.order}
                  sortChanged={sortChanged}
                >
                  Project
                </TableHeading>
              )}
              <TableHeading
                name="name"
                sort={queryParams.sort}
                order={queryParams.order}
                sortChanged={sortChanged}
              >
                Name
              </TableHeading>
              <TableHeading
                name="status"
                sort={queryParams.sort}
                order={queryParams.order}
                sortChanged={sortChanged}
              >
                Status
              </TableHeading>
              <TableHeading
                name="created_at"
                sort={queryParams.sort}
                order={queryParams.order}
                sortChanged={sortChanged}
              >
                Created Date
              </TableHeading>
              <TableHeading
                name="due_date"
                sort={queryParams.sort}
                order={queryParams.order}
                sortChanged={sortChanged}
              >
                Due Date
              </TableHeading>
              <TableHeading name="created_by">Created By</TableHeading>
              <TableHeading name="updated_by">Actions</TableHeading>
            </tr>
          </thead>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
            <tr className="text-nowrap">
              <th
                className="px-3 py-3"
                colSpan={projectColumn ? "3" : "2"}
              ></th>
              <th className="px-3 py-3">
                <TextInput
                  className="w-full"
                  placeholder="Task Name"
                  onBlur={(e) => searchFieldChanged("name", e.target.value)}
                  onKeyPress={(e) => onKeyPress("name", e)}
                  defaultValue={queryParams.name}
                />
              </th>
              <th className="px-3 py-3">
                <SelectInput
                  className="w-full"
                  onChange={(e) => searchFieldChanged("status", e.target.value)}
                  defaultValue={queryParams.status}
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </SelectInput>
              </th>
              <th className="px-3 py-3" colSpan="4"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.data.map((task) => (
              <tr
                key={task.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-3 py-2">{task.id}</td>
                <td className="px-3 py-2">
                  <img src={task.image} className="w-10 h-10" />
                </td>
                {projectColumn && (
                  <td className="px-3 py-2 hover:underline text-white">
                    <Link href={route("project.show", task.project.id)}>
                      {task.project.name}
                    </Link>
                  </td>
                )}
                <td className="px-3 py-2">{task.name}</td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded-md text-white ${
                      TASK_STATUS_CLASS_MAP[task.status]
                    }`}
                  >
                    {TASK_STATUS_TEXT_MAP[task.status]}
                  </span>
                </td>
                <td className="px-3 py-2 text-nowrap">{task.created_at}</td>
                <td className="px-3 py-2 text-nowrap">{task.due_date}</td>
                <td className="px-3 py-2 text-nowrap">
                  {task.created_by.name}
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={route("task.edit", task.id)}
                    className="text-blue-600 font-medium dark:text-blue-500 hover:underline mx-1"
                  >
                    Edit
                  </Link>
                  <Link
                    href={route("task.destroy", task.id)}
                    className="text-red-600 font-medium dark:text-red-500 hover:underline mx-1"
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination links={tasks.meta.links} />
    </>
  );
}

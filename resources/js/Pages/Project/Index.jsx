import { Head, Link, router } from "@inertiajs/react";
import {
  PROJECT_STATUS_CLASS_MAP,
  PROJECT_STATUS_TEXT_MAP,
} from "@/utils/constants";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";

export default function Index({ auth, projects, queryParams = null, success }) {
  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }

    router.get(route("project.index"), queryParams, {
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

    router.get(route("project.index"), queryParams, {
      replace: true,
      preserveState: true,
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Projects
          </h2>
          <Link
            href={route("project.create")}
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
          >
            Create Project
          </Link>
        </div>
      }
    >
      <Head title="Projects" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (
            <div
              className="bg-emerald-500 py-2 px-4 text-white rounded mb-4"
              role="alert"
            >
              <span className="font-medium">Success!</span> {success}
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
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
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          placeholder="Project Name"
                          onBlur={(e) =>
                            searchFieldChanged("name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("name", e)}
                          defaultValue={queryParams.name}
                        />
                      </th>
                      <th className="px-3 py-3">
                        <SelectInput
                          className="w-full"
                          onChange={(e) =>
                            searchFieldChanged("status", e.target.value)
                          }
                          defaultValue={queryParams.status}
                        >
                          <option value="">All</option>
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </SelectInput>
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.data.map((project) => (
                      <tr
                        key={project.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <td className="px-3 py-2">{project.id}</td>
                        <td className="px-3 py-2">
                          <img src={project.image} className="w-10 h-10" />
                        </td>
                        <td className="px-3 py-2 hover:underline text-white text-nowrap">
                          <Link href={route("project.show", project.id)}>
                            {project.name}
                          </Link>
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-1 rounded-md text-white ${
                              PROJECT_STATUS_CLASS_MAP[project.status]
                            }`}
                          >
                            {PROJECT_STATUS_TEXT_MAP[project.status]}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-nowrap">
                          {project.created_at}
                        </td>
                        <td className="px-3 py-2 text-nowrap">
                          {project.due_date}
                        </td>
                        <td className="px-3 py-2 text-nowrap">
                          {project.created_by.name}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Link
                            href={route("project.edit", project.id)}
                            className="text-blue-600 font-medium dark:text-blue-500 hover:underline mx-1"
                          >
                            Edit
                          </Link>
                          <Link
                            href={route("project.destroy", project.id)}
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
              <Pagination links={projects.meta.links} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

import { Head, Link, useForm } from "@inertiajs/react";
import {
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_TEXT_MAP,
} from "@/utils/constants";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import TextareaInput from "@/Components/TextareaInput";

export default function Create({ auth, projects, users }) {
  const { data, setData, post, processing, errors } = useForm({
    project_id: "",
    assigned_user_id: "",
    priority: "",
    image: "",
    name: "",
    description: "",
    due_date: "",
    status: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("task.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Create new Task
        </h2>
      }
    >
      <Head title="Create new Task" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              <div>
                <InputLabel htmlFor="project" value="Project" />
                <SelectInput
                  id="project_id"
                  name="project_id"
                  value={data.project_id}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("project_id", e.target.value)}
                >
                  <option value="">Select Project</option>
                  {projects.data.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </SelectInput>
                <InputError message={errors.project_id} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="assigned_user_id" value="Assigned User" />
                <SelectInput
                  id="assigned_user_id"
                  name="assigned_user_id"
                  value={data.assigned_user_id}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("assigned_user_id", e.target.value)}
                >
                  <option value="">Select User</option>
                  {users.data.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </SelectInput>
                <InputError
                  message={errors.assigned_user_id}
                  className="mt-2"
                />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="priority" value="Priority" />
                <SelectInput
                  id="priority"
                  name="priority"
                  value={data.priority}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("priority", e.target.value)}
                >
                  <option value="">Select Priority</option>
                  {Object.entries(TASK_PRIORITY_TEXT_MAP).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </SelectInput>
                <InputError message={errors.priority} className="mt-2" />
              </div>

              <hr className="mt-4" />

              <div className="mt-4">
                <InputLabel htmlFor="image" value="Image" />
                <TextInput
                  id="image"
                  name="image"
                  type="file"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("image", e.target.files[0])}
                />
                <InputError message={errors.image} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="name" value="Name" />
                <TextInput
                  id="name"
                  name="name"
                  type="text"
                  value={data.name}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData("name", e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="description" value="Description" />
                <TextareaInput
                  id="description"
                  name="description"
                  type="text"
                  value={data.description}
                  className="mt-1 block w-full resize-none"
                  onChange={(e) => setData("description", e.target.value)}
                  rows="5"
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="due_date" value="Due Date" />
                <TextInput
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={data.due_date}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("due_date", e.target.value)}
                />
                <InputError message={errors.due_date} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="status" value="Status" />
                <SelectInput
                  id="status"
                  name="status"
                  value={data.status}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("status", e.target.value)}
                >
                  <option value="">Select a Status</option>
                  {Object.entries(TASK_STATUS_TEXT_MAP).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </SelectInput>
                <InputError message={errors.status} className="mt-2" />
              </div>

              <div className="flex items-center justify-end mt-4">
                <Link
                  href={route("task.index")}
                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded-md shadow transition-all hover:bg-gray-300 mr-2"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="bg-emerald-500 py-1 px-3 text-white rounded-md shadow transition-all hover:bg-emerald-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

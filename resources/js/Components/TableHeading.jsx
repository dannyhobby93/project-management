import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";

export default function TableHeading({
  name,
  sort,
  order,
  sortChanged = () => {},
  children,
}) {
  return (
    <th onClick={(e) => sortChanged(name)}>
      <div
        className={
          `px-3 py-3 flex items-center justify-between gap-1` +
          (sort ? " cursor-pointer" : "")
        }
      >
        {children}
        {sort && (
          <div>
            {sort === name &&
              (order === "asc" ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              ))}
          </div>
        )}
      </div>
    </th>
  );
}

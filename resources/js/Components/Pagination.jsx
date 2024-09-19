import { Link } from "@inertiajs/react";
import React from "react";

export default function Pagination({ links }) {
  return (
    <div className="text-center mt-4">
      {links.map((link) => (
        <Link
          href={link.url ? link.url : "#"} // link.url will already contain query params from the backend
          key={link.label}
          dangerouslySetInnerHTML={{ __html: link.label }}
          className={
            "inline-block py-2 px-3 rounded-lg text-gray-500 dark:text-gray-200 text-xs" +
            (link.active ? " bg-gray-300 dark:bg-gray-700" : "") +
            (link.url === null
              ? " !text-gray-500 cursor-not-allowed"
              : " hover:bg-gray-900")
          }
          preserveScroll
        />
      ))}
    </div>
  );
}

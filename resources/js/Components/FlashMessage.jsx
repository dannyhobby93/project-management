import React from "react";

export default function FlashMessage({ message }) {
  if (!message) return null;
  return (
    <div
      className={
        message.type === "error"
          ? `py-2 px-4 text-red-700 bg-red-100 rounded mb-4`
          : message.type === "success"
          ? `py-2 px-4 text-green-700 bg-green-100 rounded mb-4`
          : `py-2 px-4 text-blue-700 bg-blue-100 rounded mb-4`
      }
      role="alert"
    >
      {message.text}
    </div>
  );
}

import React, { useState } from "react";

const Modal = ({ isOpen, onClose, buttonText, children }) => {
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-lg shadow-md p-8  max-w-md w-full mx-4">
        {children}

        <div className="flex justify-center mt-4">
          {" "}
          {/* Align the button to center */}
          <button
            className="mt-4 w-32 h-12 bg-[#407082] hover:bg-blue-600 text-black px-4 py-2 rounded focus:outline-none"
            onClick={onClose}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

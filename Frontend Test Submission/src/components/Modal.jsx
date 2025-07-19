import React from 'react';

const Modal = ({ onClose, title, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md max-w-lg w-full relative">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                {children}
                <button onClick={onClose} className="absolute top-2 right-3 text-gray-400 hover:text-gray-600">✕</button>
            </div>
        </div>
    );
};

export default Modal;
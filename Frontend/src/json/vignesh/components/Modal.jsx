const Modal = ({ children, onClose, size = 'lg' }) => {
  const sizeClass = size === 'sm' ? 'max-w-md' : 'max-w-4xl';

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div
        className={` max-h-[90vh] overflow-y-auto scroll w-full ${sizeClass} bg-white rounded-xl shadow-xl relative`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white z-10 bg-red-400 px-2 py-1 rounded hover:bg-red-500">
          ✕
        </button>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
export default Modal
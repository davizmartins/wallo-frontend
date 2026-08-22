import "./Modal.css";

function Modal({ isOpen, onClose, title, children }) {
  // Se não está aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    // O overlay é o fundo escuro. Clicar nele fecha o modal.
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation impede que clicar DENTRO do modal feche ele */}
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
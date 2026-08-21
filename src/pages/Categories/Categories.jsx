import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Categories.css";
import Modal from "../../components/Modal";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState("EXPENSE");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const response = await api.get("/categories");
      const data = response.data;
      const categoryList = Array.isArray(data) ? data : data?.content;
      setCategories(Array.isArray(categoryList) ? categoryList : []);
    } catch {
      setError("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      await api.post("/categories", { name, type });
      setName("");
      setType("EXPENSE");
      setError("");
      setIsModalOpen(false);  // fecha o modal
      loadCategories();
    } catch {
      setError("Erro ao criar categoria");
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/categories/${id}`);
      loadCategories();
    } catch {
      setError("Erro ao excluir categoria");
    }
  }

  return (
    <>
          <div className="page-header">
        <div>
          <h1 className="page-title">Categorias</h1>
          <p className="page-sub">Organize suas receitas e despesas</p>
        </div>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          + Nova categoria
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova categoria"
      >
        <form className="category-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Nome da categoria"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
          <button type="submit">Adicionar</button>
        </form>
      </Modal>

      { error && <p className="error-message">{error}</p> }
  { loading && <p className="muted">Carregando...</p> }

  {
    !loading && !error && categories.length === 0 && (
      <p className="muted">Nenhuma categoria cadastrada ainda.</p>
    )
  }

  {
    !loading && categories.length > 0 && (
      <div className="list">
        {categories.map((cat) => (
          <div key={cat.id} className="list-item">
            <span className="item-name">{cat.name}</span>
            <div className="item-right">
              <span className={`badge ${cat.type === "INCOME" ? "badge-income" : "badge-expense"}`}>
                {cat.type === "INCOME" ? "Receita" : "Despesa"}
              </span>
              <button className="delete-btn" onClick={() => handleDelete(cat.id)}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }
    </>
  );
}

export default Categories;
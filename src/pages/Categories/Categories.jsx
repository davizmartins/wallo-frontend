import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]); // lista de categorias
  const [loading, setLoading] = useState(true);      // se está carregando
  const [error, setError] = useState("");            // mensagem de erro

  // Busca as categorias assim que a tela carrega
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get("/categories");
        setCategories(response.data.content); // a lista vem dentro de "content"
      } catch (err) {
        setError("Erro ao carregar categorias");
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Categorias</h1>
          <p className="page-sub">Organize suas receitas e despesas</p>
        </div>
      </div>

      {loading && <p className="muted">Carregando...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && categories.length === 0 && (
        <p className="muted">Nenhuma categoria cadastrada ainda.</p>
      )}

      {!loading && categories.length > 0 && (
        <div className="list">
          {categories.map((cat) => (
            <div key={cat.id} className="list-item">
              <span className="item-name">{cat.name}</span>
              <span className={`badge ${cat.type === "INCOME" ? "badge-income" : "badge-expense"}`}>
                {cat.type === "INCOME" ? "Receita" : "Despesa"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;
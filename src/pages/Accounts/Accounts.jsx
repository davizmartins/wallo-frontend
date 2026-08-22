import { useState, useEffect } from "react";
import api from "../../services/api";
import Modal from "../../components/Modal/Modal";
import "./Accounts.css";
import { useToast } from "../../components/Toast/toast-context";

// Traduz o tipo da conta para exibição
const TYPE_LABELS = {
  CHECKING: "Conta corrente",
  SAVINGS: "Poupança",
  WALLET: "Carteira",
  INVESTMENT: "Investimento",
};

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showToast = useToast();

  // Campos do formulário
  const [name, setName] = useState("");
  const [type, setType] = useState("CHECKING");
  const [initialBalance, setInitialBalance] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      const response = await api.get("/accounts");
      const data = response.data;
      const list = Array.isArray(data) ? data : data?.content;
      setAccounts(Array.isArray(list) ? list : []);
    } catch {
      showToast("Erro ao carregar contas");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      await api.post("/accounts", {
        name,
        type,
        // Se vazio, envia null (o back assume zero)
        initialBalance: initialBalance ? parseFloat(initialBalance) : null,
      });
      setName("");
      setType("CHECKING");
      setInitialBalance("");
      showToast("Conta criada com sucesso!", "success");
      setIsModalOpen(false);
      loadAccounts();
    } catch {
      showToast("Erro ao criar conta");
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/accounts/${id}`);
      showToast("Conta excluída com sucesso!", "success");
      loadAccounts();
    } catch {
      showToast("Erro ao excluir conta");
    }
  }

  // Formata um número como moeda brasileira (R$)
  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Contas</h1>
          <p className="page-sub">Suas contas e saldos</p>
        </div>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          + Nova conta
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova conta"
      >
        <form className="account-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Nome da conta"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="CHECKING">Conta corrente</option>
            <option value="SAVINGS">Poupança</option>
            <option value="WALLET">Carteira</option>
            <option value="INVESTMENT">Investimento</option>
          </select>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Saldo inicial (opcional)"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
          />
          <button type="submit">Adicionar</button>
        </form>
      </Modal>

      {loading && <p className="muted">Carregando...</p>}

      {!loading && accounts.length === 0 && (
        <p className="muted">Nenhuma conta cadastrada ainda.</p>
      )}

      {!loading && accounts.length > 0 && (
        <div className="list">
          {accounts.map((acc) => (
            <div key={acc.id} className="list-item">
              <div className="account-info">
                <span className="item-name">{acc.name}</span>
                <span className="account-type">{TYPE_LABELS[acc.type] || acc.type}</span>
              </div>
              <div className="item-right">
                <span className="account-balance">{formatCurrency(acc.balance)}</span>
                <button className="delete-btn" onClick={() => handleDelete(acc.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Accounts;
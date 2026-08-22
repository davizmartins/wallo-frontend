import { useState, useEffect } from "react";
import api from "../../services/api";
import Modal from "../../components/Modal/Modal.jsx";
import "./Transactions.css";
import { useToast } from "../../components/Toast/toast-context";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showToast = useToast();

  // Campos do formulário
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [date, setDate] = useState("");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  // Carrega transações, contas e categorias de uma vez
  async function loadAll() {
    try {
      const [txRes, accRes, catRes] = await Promise.all([
        api.get("/transactions"),
        api.get("/accounts"),
        api.get("/categories"),
      ]);
      setTransactions(normalize(txRes.data));
      setAccounts(normalize(accRes.data));
      setCategories(normalize(catRes.data));
    } catch {
      showToast("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  // Garante que o retorno é sempre uma lista
  function normalize(data) {
    const list = Array.isArray(data) ? data : data?.content;
    return Array.isArray(list) ? list : [];
  }

  async function handleCreate(event) {
    event.preventDefault();
    if (!amount || !accountId || !categoryId || !date) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      await api.post("/transactions", {
        description,
        amount: parseFloat(amount),
        type,
        date,
        accountId: parseInt(accountId),
        categoryId: parseInt(categoryId),
      });
      // Limpa o formulário
      setDescription("");
      setAmount("");
      setType("EXPENSE");
      setDate("");
      setAccountId("");
      setCategoryId("");
      showToast("Transação criada com sucesso!", "success");
      setIsModalOpen(false);
      loadAll(); // recarrega (a lista e os saldos mudaram)
    } catch {
      showToast("Erro ao criar transação");
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/transactions/${id}`);
      loadAll();
    } catch {
      showToast("Erro ao excluir transação");
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Transações</h1>
          <p className="page-sub">Suas receitas e despesas</p>
        </div>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          + Nova transação
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova transação"
      >
        <form className="transaction-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            <option value="">Selecione a conta</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Selecione a categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button type="submit">Adicionar</button>
        </form>
      </Modal>

      {error && <p className="error-message">{error}</p>}
      {loading && <p className="muted">Carregando...</p>}

      {!loading && !error && transactions.length === 0 && (
        <p className="muted">Nenhuma transação registrada ainda.</p>
      )}

      {!loading && transactions.length > 0 && (
        <div className="list">
          {transactions.map((tx) => (
            <div key={tx.id} className="list-item">
              <div className="tx-info">
                <span className="item-name">{tx.description || "Sem descrição"}</span>
                <span className="tx-meta">
                  {tx.categoryName} • {tx.accountName} • {formatDate(tx.date)}
                </span>
              </div>
              <div className="item-right">
                <span className={tx.type === "INCOME" ? "tx-income" : "tx-expense"}>
                  {tx.type === "INCOME" ? "+" : "-"} {formatCurrency(tx.amount)}
                </span>
                <button className="delete-btn" onClick={() => handleDelete(tx.id)}>
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

export default Transactions;
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useToast } from "../../components/Toast/toast-context";
import {
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b", "#8b5cf6", "#14b8a6", "#ec4899"];
const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const compactCurrencyFormatter = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });

function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

function formatCompactCurrency(value) {
  return `R$ ${compactCurrencyFormatter.format(Number(value) || 0)}`;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];

  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-label">{item.payload?.name || label}</span>
      <strong>{formatCurrency(item.value)}</strong>
    </div>
  );
}

function Dashboard() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [byCategory, setByCategory] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();

  useEffect(() => {
    async function loadDashboard() {
      const now = new Date();
      const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
      const end = now.toISOString().split("T")[0];

      try {
        const [incomeRes, expenseRes, catRes, monthlyRes] = await Promise.all([
          api.get(`/dashboard/total?type=INCOME&start=${start}&end=${end}`),
          api.get(`/dashboard/total?type=EXPENSE&start=${start}&end=${end}`),
          api.get(`/dashboard/by-category?type=EXPENSE&start=${start}&end=${end}`),
          api.get("/dashboard/monthly?type=EXPENSE"),
        ]);
        setTotalIncome(incomeRes.data || 0);
        setTotalExpense(expenseRes.data || 0);
        setByCategory(Array.isArray(catRes.data) ? catRes.data : []);
        setMonthly(Array.isArray(monthlyRes.data) ? monthlyRes.data : []);
      } catch {
        showToast("Erro ao carregar o dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [showToast]);

  const balance = totalIncome - totalExpense;
  const pieData = byCategory.map((item) => ({ name: item.categoryName, value: Number(item.total) }));
  const monthlyData = monthly.map((item) => ({ name: `${item.month}/${item.year}`, total: Number(item.total) }));

  if (loading) return <p className="muted">Carregando dashboard...</p>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Visão geral do mês atual</p>
        </div>
      </div>

      <div className="cards">
        <div className="card card-balance">
          <span className="card-label">Saldo do mês</span>
          <span className="card-value" style={{ color: "var(--accent)" }}>{formatCurrency(balance)}</span>
        </div>
        <div className="card card-income">
          <span className="card-label">Receitas</span>
          <span className="card-value" style={{ color: "var(--green)" }}>{formatCurrency(totalIncome)}</span>
        </div>
        <div className="card card-expense">
          <span className="card-label">Despesas</span>
          <span className="card-value" style={{ color: "var(--red)" }}>{formatCurrency(totalExpense)}</span>
        </div>
      </div>

      <div className="charts">
        <div className="chart-box">
          <div className="chart-heading">
            <h3 className="chart-title">Despesas por categoria</h3>
            <p className="chart-subtitle">Distribuição no mês atual</p>
          </div>
          {pieData.length === 0 ? <p className="muted">Sem despesas neste mês.</p> : (
            <div className="category-chart">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={62} outerRadius={92} paddingAngle={3} stroke="none">
                    {pieData.map((entry, index) => <Cell key={entry.name || index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="category-legend">
                {pieData.map((item, index) => (
                  <div className="category-item" key={item.name || index}>
                    <span className="category-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="category-name">{item.name}</span>
                    <strong>{formatCurrency(item.value)}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="chart-box">
          <div className="chart-heading">
            <h3 className="chart-title">Evolução de despesas</h3>
            <p className="chart-subtitle">Comparativo dos últimos meses</p>
          </div>
          {monthlyData.length === 0 ? <p className="muted">Sem dados mensais ainda.</p> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} tickFormatter={formatCompactCurrency} width={72} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.08)", radius: 8 }} />
                <Bar dataKey="total" fill="var(--accent)" radius={[7, 7, 2, 2]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

// src/components/dashboard/DashboardClient.tsx
import { useEffect, useState } from "react";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../api/orders";
import { useAuth } from "../context/auth/AuthContext";

interface Order {
  id: string;
  title: string;
  amount: number;
  status: "PENDING" | "VALIDATED" | "FAILED";
}

const DashboardClient = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [editId, setEditId] = useState<string | null>(null);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      loadOrders();
    }
  }, [loading, isAuthenticated]);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleSubmit = async () => {
    if (!title) return;

    if (editId) {
      const updated = await updateOrder(editId, title, amount);
      setOrders((prev) => prev.map((o) => (o.id === editId ? updated : o)));
      setEditId(null);
    } else {
      const created = await createOrder(title, amount);
      setOrders((prev) => [created, ...prev]);
    }

    setTitle("");
    setAmount(0);
  };

  const handleDelete = async (id: string) => {
    await deleteOrder(id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const startEdit = (order: Order) => {
    setEditId(order.id);
    setTitle(order.title);
    setAmount(order.amount);
  };

  return (
    <div className="container">
      <h2>Mes commandes</h2>

      <div className="form">
        <input
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Montant"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button onClick={handleSubmit}>
          {editId ? "Modifier" : "Ajouter"}
        </button>
      </div>

      <ul>
        {orders?.map((order) => (
          <li key={order.id} className="order-item">
            <div>
              <strong>{order.title}</strong>
              <div>{order.amount} €</div>
            </div>

            <div className="actions">
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
              <button onClick={() => startEdit(order)}>✏️</button>
              <button onClick={() => handleDelete(order.id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardClient;

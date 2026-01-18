// src/components/dashboard/DashboardAdmin.tsx
import { useEffect, useState } from "react";
import { getAllOrders, updateOrderAdmin, deleteOrderAdmin } from "../api/admin";

interface Order {
  id: string;
  title: string;
  amount: number;
  status: "PENDING" | "VALIDATED" | "FAILED";
}

interface User {
  id: string;
  email: string;
  orders: Order[];
}

const DashboardAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getAllOrders();
    setUsers(data);
  };

  const changeStatus = async (orderId: string, status: Order["status"]) => {
    const updated = await updateOrderAdmin(orderId, { status });

    setUsers((prev) =>
      prev.map((u) => ({
        ...u,
        orders: u.orders.map((o) => (o.id === orderId ? updated : o)),
      })),
    );
  };

  const removeOrder = async (orderId: string) => {
    await deleteOrderAdmin(orderId);
    setUsers((prev) =>
      prev.map((u) => ({
        ...u,
        orders: u.orders.filter((o) => o.id !== orderId),
      })),
    );
  };

  return (
    <div className="container">
      <h2>Administration</h2>

      {users.map((user) => (
        <div key={user.id} className="user-card">
          <h3>{user.email}</h3>

          {user.orders.map((order) => (
            <div key={order.id} className="order-item">
              <div>
                <strong>{order.title}</strong> – {order.amount} €
              </div>

              <select
                value={order.status}
                onChange={(e) =>
                  changeStatus(order.id, e.target.value as Order["status"])
                }
              >
                <option value="PENDING">EN ATTENTE</option>
                <option value="VALIDATED">VALIDER</option>
                <option value="FAILED">ANNULER</option>
              </select>

              <button onClick={() => removeOrder(order.id)}>🗑️</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DashboardAdmin;

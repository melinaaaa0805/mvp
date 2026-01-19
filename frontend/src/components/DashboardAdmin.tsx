import { useEffect, useState } from "react";
import { getAllOrders, updateOrderAdmin } from "../api/admin";
import { deleteOrder } from "../api/orders";
interface Order {
  id: string;
  title: string;
  amount: number;
  status: "PENDING" | "VALIDATED" | "FAILED";
  user: { email: string };
}

const DashboardAdmin = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getAllOrders();
    console.log("data :", data);
    setOrders(data);
  };

  const changeStatus = async (orderId: string, status: Order["status"]) => {
    const updated = await updateOrderAdmin(orderId, { status });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
  };

  const removeOrder = async (orderId: string) => {
    await deleteOrder(orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  return (
    <div className="container">
      <h2>Administration</h2>

      {orders?.map((order) => (
        <div key={order.id} className="order-item">
          <div>
            <strong>{order.title}</strong> – {order.amount} € –{" "}
            <em>{order.user.email}</em>
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
  );
};

export default DashboardAdmin;

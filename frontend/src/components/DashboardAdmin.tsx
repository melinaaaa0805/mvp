import { useEffect, useState } from "react";
import { getAllOrders, updateOrderAdmin } from "../api/admin";
import { deleteOrder } from "../api/orders";

interface Order
{
  id: string;
  title: string;
  amount: number;
  status: "PENDING" | "VALIDATED" | "FAILED";
  user: { email: string };
}

const DashboardAdmin = () =>
{
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() =>
  {
    void loadData();
  }, []);

  const loadData = async () =>
  {
    setIsLoading(true);

    try
    {
      const data = await getAllOrders();
      setOrders(data);
    }
    finally
    {
      setIsLoading(false);
    }
  };

  const changeStatus = async (orderId: string, status: Order["status"]) =>
  {
    setIsLoading(true);

    try
    {
      await updateOrderAdmin(orderId, { status });
      await loadData();
    }
    finally
    {
      setIsLoading(false);
    }
  };

  const removeOrder = async (orderId: string) =>
  {
    setIsLoading(true);

    try
    {
      await deleteOrder(orderId);
      await loadData(); // (optionnel) ✅ recharge aussi après suppression
    }
    finally
    {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Administration</h2>

      {orders.map((order) =>
      {
        return (
          <div key={order.id} className="order-item">
            <div>
              <strong>{order.title}</strong> – {order.amount} € –{" "}
              <em>{order.user.email}</em>
            </div>

            <select
              value={order.status}
              disabled={isLoading}
              onChange={(e) =>
              {
                void changeStatus(order.id, e.target.value as Order["status"]);
              }}
            >
              <option value="PENDING">EN ATTENTE</option>
              <option value="VALIDATED">VALIDER</option>
              <option value="FAILED">ANNULER</option>
            </select>

            <button
              disabled={isLoading}
              onClick={() =>
              {
                void removeOrder(order.id);
              }}
            >
              🗑️
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardAdmin;

// src/api/admin.ts
import api from "./api";

export const getAllOrders = async () => {
  const { data } = await api.get("/orders/admin");
  return data;
};

export const updateOrderAdmin = async (
  orderId: string,
  payload: {
    title?: string;
    amount?: number;
    status?: "PENDING" | "VALIDATED" | "FAILED";
  },
) => {
  const { data } = await api.patch(`/orders/${orderId}`, payload);
  return data;
};

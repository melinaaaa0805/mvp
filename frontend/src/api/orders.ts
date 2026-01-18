import api from "./api";

const getTokenHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getOrders = async () => {
  const res = await api.get(`/orders`, {
    headers: getTokenHeader(),
  });
  return res.data;
};

export const createOrder = async (name: string, amount: number) => {
  const res = await api.post(
    `/orders`,
    { title: name, amount: amount },
    { headers: getTokenHeader() },
  );
  return res.data;
};

export const updateOrder = async (id: string, name: string, amount: number) => {
  const res = await api.patch(
    `/orders/${id}`,
    { title: name, amount: amount },
    { headers: getTokenHeader() },
  );
  return res.data;
};

export const deleteOrder = async (id: string) => {
  await api.delete(`/orders/${id}`, {
    headers: getTokenHeader(),
  });
};

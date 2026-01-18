import React, { useState } from "react";

interface OrderFormProps {
  onSubmit: (name: string) => void;
  initialValue?: string;
  buttonText?: string;
}

const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  initialValue = "",
  buttonText = "Ajouter",
}) => {
  const [name, setName] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onSubmit(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Nom de la commande"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default OrderForm;

exports.calculateTotals = (items, tax = 0, discount = 0) => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice, 0
  );

  const totalAmount = subtotal + tax - discount;

  return { subtotal, totalAmount };
};
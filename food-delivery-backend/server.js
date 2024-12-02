const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

// In-memory storage
let menu = [];
let orders = [
    { id: 1, items: ['Pizza', 'Pasta'], status: 'Preparing' },
    { id: 2, items: ['Burger'], status: 'Out for delivery' },
];
let orderIdCounter = 1;

// Add Menu Item
app.post('/menu', (req, res) => {
  const { name, price, category } = req.body;
  if (!name || price <= 0 || !category) {
    return res.status(400).json({ error: "Invalid menu item data" });
  }
  menu.push({ id: menu.length + 1, name, price, category });
  res.json({ message: "Menu item added", menu });
});

// Get Menu
app.get('/menu', (req, res) => {
  res.json(menu);
});

// Place Order
app.post('/orders', (req, res) => {
  const { items } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: "Order must have items" });
  }

  const order = {
    id: orderIdCounter++,
    items,
    status: "Preparing",
  };
  orders.push(order);
  res.json({ message: "Order placed", order });
});

// Get Order
app.get('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const order = orders.find(o => o.id === orderId);
  
    if (order) {
      res.json(order);  // Return the order if found
    } else {
      res.status(404).json({ message: 'Order not found' });  // Return a 404 if not found
    }
  });

// Simulate Status Updates
const simulateStatusUpdate = () => {
  orders.forEach(order => {
    if (order.status === "Preparing") order.status = "Out for Delivery";
    else if (order.status === "Out for Delivery") order.status = "Delivered";
  });
};

// Update Order Status every 10 seconds
setInterval(simulateStatusUpdate, 10000);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());



let categories = [];
let products = [];
let orders = [];

app.post('/api/categories', (req, res) => {
  const { name } = req.body;

  const newCategory = {
    id: categories.length + 1,
    name: name
  };

  categories.push(newCategory);

  res.status(201).json(newCategory);
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.post('/api/products', (req, res) => {
  const { name, price, categoryId } = req.body;

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    categoryId
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/orders', (req, res) => {
  const { items } = req.body;

  let subtotal = 0;

  items.forEach(item => {
    const product = products.find(p => p.id === item.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    subtotal += product.price * item.quantity;
  });

  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const newOrder = {
    orderNumber: orders.length + 1,
    items,
    subtotal,
    tax,
    total,
    createdAt: new Date()
  };

  orders.push(newOrder);

  res.status(201).json(newOrder);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); //node index.js to run the server
});

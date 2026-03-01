const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const PORT = 3000;

app.use(express.json());

const sequelizer = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

const Category = sequelizer.define('Category', {
    Categoryname: {
        type: DataTypes.STRING,
         
    },
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Product = sequelizer.define('Product', {
    Productname: {
        type: DataTypes.STRING,
         
    },
    price: {
        type: DataTypes.FLOAT,
         
    },
    categoryId: {
        type: DataTypes.INTEGER,
         
        references: {
            model: Category,
            key: 'id'
        }
    }
});

const Order = sequelizer.define('Order', {
    orderNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    items: {
        type: DataTypes.JSON,
         
    },
    subtotal: {
        type: DataTypes.FLOAT,
         
    },
    tax: {
        type: DataTypes.FLOAT,
         
    },
    total: {
        type: DataTypes.FLOAT,
         
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
});

// Product.belongsTo(Category);
// Category.hasMany(Product);

sequelizer.sync({ force: true }).then(() => {
    console.log("Database & tables created!");
});

app.post('/api/categories', async (req, res) => {
  const { Categoryname } = req.body;

  const newCategory = {
    id: categories.length + 1,
    Categoryname
  };

  await Category.create({Categoryname});

  res.status(201).json(categories);
});

app.get('/api/categories', async  (req, res) => {
  const categories = await Category.findAll();
    res.json(categories);
});

app.post('/api/products', async (req, res) => {
  const { Productname, price, categoryId } = req.body;

  const newProduct = {
    id: products.length + 1,
    Productname,
    price,
    categoryId
  };

  Product.findByPk(item.productId)
  
  await Product.create({Productname, price, categoryId});
  
  res.status(201).json(newProduct);
});

app.get('/api/products', async (req, res) => {
  const products = await Product.findAll({ include: Category });
    res.json(products);
});

app.post('/api/orders', async (req, res) => {
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

  await Order.create({items, subtotal, tax, total});

  res.status(201).json(newOrder);
});

app.get('/api/orders', async (req, res) => {
  const orders = await Order.findAll();
  res.json(orders);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); //node index.js to run the server
});

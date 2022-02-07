const express = require('express');
const { products, users } = require('./data/data');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/products', (req, res) => {
  const { maxPrice, search } = req.query;
  let productsResponse = [...products];
  if (Object.keys(req.query).length > 0) {
    if (maxPrice) {
      if (isNaN(+maxPrice)) {
        return res.status(400).json({success: false, error: 'maxPrice must be a valid number'});
      }
      productsResponse = productsResponse.filter(product => product.price <= +maxPrice);
    }
    if (search) {
      productsResponse = productsResponse.filter(product => product.name.toLowerCase().startsWith(search.toLowerCase()))
    }
    return res.json({success: true, result: productsResponse });
  }
    return res.json({success: true, result: productsResponse });
});

app.get('/api/products/:productId', (req, res) => {
  const { productId } = req.params;
  const product = products.find(product => product.id === +productId);
  if (!product) {
    return res.status(404).json({ success: false, error: `Product with id: ${productId} does not exist!`});
  }
  return res.json({ success: true, result: product });
});

app.post('/api/products', (req, res) => {
  const { name, description, price, image } = req.body;
  if ( !name || !description || !price || !image) {
    return res.status(400).json({ succes: false, error: 'Wrong body format' });
  }
  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price,
    image
  };
  products.push(newProduct);
  return res.json({ success: true, result: newProduct });
});

app.put('/api/products/:productId', (req, res) => {
  const { params: { productId }, body: { name, description, price, image} } = req;
  if ( !name || !description || !price || !image) {
    return res.status(400).json({ success: false, error: 'Wrong body format' });
  };
  const productIndex = products.findIndex((product) => product.id === +productId);
  if (productIndex < 0) return res.status(404).json({ success: false, error: `Product with id: ${productId} does not exist!`});
  const newProduct = {
    ...products[productIndex],
    name,
    description,
    price,
    image
  };
  products[productIndex] = newProduct;
  return res.json({ success: true, result: newProduct});
});

app.delete('/api/products/:productId', (req, res) => {
  const { productId } = req.params;
  const productIndex = products.findIndex(product => product.id === +productId);
  if (productIndex < 0) return res.status(404).json({ success: false, error: `Product with id ${productId} does not exist!`});
  products.splice(productIndex, 1);
  return res.json({ success: true, result: 'product correctly eliminated' });
});

app.get('/api/users', (req,res) => {
  const { role, search } = req.query;
  let userResponse = [...users];
  if (Object.keys(req.query).length > 0) {
    if (role) {
      userResponse = userResponse.filter(user => user.role === role.toLowerCase());
    }
    if (search) {
      userResponse = userResponse.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.lastname.toLowerCase().includes(search.toLowerCase())
      );
    }
    return res.json({ success: true, result: userResponse });
  }
    return res.json({ success: true, result: userResponse });
});

app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  if (isNaN(+userId) || +userId < 0 || +userId % 1 !== 0) {
    return res.status(400).json({ success: false, error: 'userId must be a positive integer valid number' });
  }
  const user = users.find(user => user.id === +userId);
  if (!user) {
    return res.status(404).json({ success: false, error: `User with id ${userId} is not in our records!` }); 
  }
  return res.json({ success: true, result: user });
});

app.post('/api/users', (req,res) => {
  const { name, lastname, age, email, role } = req.body || {};
  if (!name || !lastname || !age || !email || !role) {
    let requiredFields = [];
    if (!name) requiredFields.push('name');
    if (!lastname) requiredFields.push('lastname');
    if (!age) requiredFields.push('age');
    if (!email) requiredFields.push('email');
    if (!role) requiredFields.push('role');
    return res.status(400).json({ success: false, error: `Following fields are required: ${requiredFields.join(', ')}`})
  }
  const newUser = {
    id: users[users.length - 1].id + 1,
    name,
    lastname,
    age,
    email,
    role
  };
  users.push(newUser);
  return res.json({ success: true, result: newUser});
});

app.put('/api/users/:userId', (req, res) => {
  const { params: { userId }, body: { name, lastname, age, email, role } } = req;
  if (isNaN(+userId) || +userId < 0 || +userId % 1 !== 0) {
    return res.status(400).json({ success: false, error: 'userId must be a positive integer valid number' });
  }
  const userIndex = users.findIndex( user => user.id === +userId);
  if (userIndex < 0) {
    return res.status(404).json({ success: false, error: `User with id ${userId} is not in our records!` });
  } 
  if (!name || !lastname || !age || !email || !role) {
    let requiredFields = [];
    if (!name) requiredFields.push('name');
    if (!lastname) requiredFields.push('lastname');
    if (!age) requiredFields.push('age');
    if (!email) requiredFields.push('email');
    if (!role) requiredFields.push('role');
    return res.status(400).json({ success: false, error: `Following fields are required: ${requiredFields.join(', ')}`})
  }
  const modifiedUser = {
    ...users[userIndex],
    name,
    lastname,
    age,
    email,
    role
  };
  users[userIndex] = modifiedUser;
  return res.json({ success: true, result: modifiedUser });
});

app.delete('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  if (isNaN(+userId) || +userId < 0 || +userId % 1 !== 0) {
    return res.status(400).json({ success: false, error: 'userId must be a positive integer valid number' });
  }
  const userIndex = users.findIndex( user => user.id === +userId);
  if (userIndex < 0) {
    return res.status(404).json({ success: false, error: `User with id ${userId} is not in our records!` });
  } 
  const eliminatedUser = users[userIndex];
  users.splice(userIndex, 1);
  return res.json({ success: true, result: eliminatedUser });
});

const connectedServer = app.listen(PORT, ()=> {
  console.log(`Server is up and running on port ${PORT}`);
});

connectedServer.on('error', (error) => {
  console.error('Error: ', error);
})

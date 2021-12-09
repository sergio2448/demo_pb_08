const express = require('express');
const { productos, usuarios } = require('./data/data');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/api/productos', (req, res) => {
  const { precioMaximo, search } = req.query;
  let respuestaProductos = [...productos];
  if (Object.keys(req.query).length > 0) {
    if (precioMaximo) {
      if (isNaN(+precioMaximo)) {
        return res.status(400).send('precioMaximo debe ser un número válido');
      }
      respuestaProductos = respuestaProductos.filter(producto => producto.precio <= +precioMaximo);
    }
    if (search) {
      respuestaProductos = respuestaProductos.filter(producto => producto.nombre.toLowerCase().startsWith(search.toLowerCase()))
    }
    return res.json(respuestaProductos);
  }
    return res.json(respuestaProductos);
});

app.get('/api/productos/:idProducto', (req, res) => {
  const { idProducto } = req.params;
  const producto = productos.find(producto => producto.id === +idProducto);
  if (!producto) {
    return res.status(404).send(`El producto con id: ${req.params.idProducto} no existe`);
  }
  return res.json(producto);
});

app.post('/api/productos', (req, res) => {
  const { nombre, descripcion, precio, imagen } = req.body;
  if ( !nombre || !descripcion || !precio || !imagen) {
    return res.status(400).send('El cuerpo tiene un formato incorrecto')
  }
  const nuevoProducto = {
    id: productos.length + 1,
    nombre,
    descripcion,
    precio,
    imagen
  };
  productos.push(nuevoProducto);
  return res.json(nuevoProducto);
});

app.put('/api/productos/:idProducto', (req, res) => {
  const { params: { idProducto }, body: { nombre, descripcion, precio, imagen} } = req;
  const indiceProducto = productos.findIndex((producto) => producto.id === +idProducto);
  if (indiceProducto < 0) return res.status(404).send(`El producto con id ${idProducto} no existe!`);
  const nuevoProducto = {
    ...productos[indiceProducto],
    nombre,
    descripcion,
    precio,
    imagen
  };
  productos[indiceProducto] = nuevoProducto;
  return res.json(nuevoProducto);
});

app.delete('/api/productos/:idProducto', (req, res) => {
  const { idProducto } = req.params;
  const indiceProducto = productos.findIndex(producto => producto.id === +idProducto);
  if (indiceProducto < 0) return res.status(404).send(`Producto con id ${idProducto} no existe!`);
  // productos = productos.filter(producto => producto.id !== +idProducto); mostrar error 500!!!
  productos.splice(indiceProducto, 1);
  return res.send('producto eliminado correctamente!');
});

app.get('/api/usuarios', (req,res) => {
  const { rol, search } = req.query;
  let respuestaUsuarios = [...usuarios];
  if (Object.keys(req.query).length > 0) {
    if (rol) {
      respuestaUsuarios = respuestaUsuarios.filter(usuario => usuario.rol === rol.toLowerCase());
    }
    if (search) {
      respuestaUsuarios = respuestaUsuarios.filter(usuario => 
        usuario.nombre.toLowerCase().includes(search.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(search.toLowerCase())
      );
    }
    return res.json(respuestaUsuarios);
  }
    return res.json(respuestaUsuarios);
});

app.get('/api/usuarios/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;
  if (isNaN(+idUsuario) || +idUsuario < 0 || +idUsuario % 1 !== 0) {
    return res.status(400).json({error: 'El parámetro debe ser un número entero mayor a cero'});
  }
  const usuario = usuarios.find(usuario => usuario.id === +idUsuario);
  if (!usuario) {
    return res.status(404).json({ error: `El usuario con id ${idUsuario} no se encuentra en nuestros registros`}); 
  }
  return res.json(usuario);
});

app.post('/api/usuarios', (req,res) => {
  const { nombre, apellido, edad, email, rol } = req.body || {};
  if (!nombre || !apellido || !edad || !email || !rol) {
    let camposRequeridos = [];
    if (!nombre) camposRequeridos.push('nombre');
    if (!apellido) camposRequeridos.push('apellido');
    if (!edad) camposRequeridos.push('edad');
    if (!email) camposRequeridos.push('email');
    if (!rol) camposRequeridos.push('rol');
    return res.status(400).json({ error: `Los siguientes campos son requeridos: ${camposRequeridos.join(', ')}`})
  }
  const nuevoUsuario = {
    id: usuarios[usuarios.length - 1].id + 1,
    nombre,
    apellido,
    edad,
    email,
    rol
  };
  usuarios.push(nuevoUsuario);
  return res.json({ exito: true, resultado: nuevoUsuario});
});

app.put('/api/usuarios/:idUsuario', (req, res) => {
  const { params: { idUsuario }, body: { nombre, apellido, edad, email, rol } } = req;
  if (isNaN(+idUsuario) || +idUsuario < 0 || +idUsuario % 1 !== 0) {
    return res.status(400).json({error: 'El parámetro debe ser un número entero mayor a cero'});
  }
  const indiceUsuario = usuarios.findIndex( usuario => usuario.id === +idUsuario);
  if (indiceUsuario < 0) {
    return res.status(404).send(`El usuario con id ${idProducto} no está en nuestros registros!`);
  } 
  if (!nombre || !apellido || !edad || !email || !rol) {
    let camposRequeridos = [];
    if (!nombre) camposRequeridos.push('nombre');
    if (!apellido) camposRequeridos.push('apellido');
    if (!edad) camposRequeridos.push('edad');
    if (!email) camposRequeridos.push('email');
    if (!rol) camposRequeridos.push('rol');
    return res.status(400).json({ error: `Los siguientes campos son requeridos: ${camposRequeridos.join(', ')}`})
  }
  const usuarioModificado = {
    ...usuarios[indiceUsuario],
    nombre,
    apellido,
    edad,
    email,
    rol
  };
  usuarios[indiceUsuario] = usuarioModificado;
  return res.json({ exito: true, resultado: usuarioModificado });
});

app.delete('/api/usuarios/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;
  if (isNaN(+idUsuario) || +idUsuario < 0 || +idUsuario % 1 !== 0) {
    return res.status(400).json({error: 'El parámetro debe ser un número entero mayor a cero'});
  }
  const indiceUsuario = usuarios.findIndex( usuario => usuario.id === +idUsuario);
  if (indiceUsuario < 0) {
    return res.status(404).send(`El usuario con id ${idProducto} no está en nuestros registros!`);
  } 
  const usuarioEliminado = usuarios[indiceUsuario];
  usuarios.splice(indiceUsuario, 1);
  return res.json({ exito: true, resultado: usuarioEliminado });
});

const connectedServer = app.listen(PORT, ()=> {
  console.log(`Servidor activo y escuchando en el puerto ${PORT}`);
});

connectedServer.on('error', (error) => {
  console.log(error.message);
})

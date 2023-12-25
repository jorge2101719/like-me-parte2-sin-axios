// para manejar variables de ambiente
import 'dotenv/config';

// importar manejador de errores y modulos propios
import { handleErrors } from './database/errors.js';
import { agregarPost, verPosts, mudarPost, borrarPost } from './database/consultas.js';

// importar express y cors con sus instancias
import express from 'express'
const app = express();

import cors from 'cors';
app.use(cors());

// middleware
app.use(express.json())

// levantamos el servidor USANDO UN PUERTO PREDETERMINADO
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Servidor listo en http://localhost:' + PORT);
})


// -------------------------------------
// RUTAS DEL SERVIDOR
// -------------------------------------

// rutas GET

// GET para ver la ruta raíz

app.get('/', (req, res) => {
    console.log('Estamos en la página principal')
    res.json({ok: true, result: 'Bienvenido(a) a nuestra página...'})
})

// GET de consulta para ver el contenido de la tabla 'POSTS'

app.get('/posts', async (req, res) => {
    try {
        console.log('Todo salió bien');
        const result = await verPosts();
        // return res.status(200).send(result)
        return res.status(200).json({ ok: true, message: 'Lista de posts registrados', result })
    } catch (error) {
        console.log(error)
        const { status, message } = handleErrors(error.code)
        return res.status(status).json({ ok: false, result: message })
    }
});

// rutas POST (agregar)

app.post('/posts', async (req, res) => {
    console.log('Entrando en el posts...');
    try {
        const post = {
            titulo: req.body.titulo,
            img: req.body.img,
            descripcion: req.body.descripcion
        }
        const result = await agregarPost(post);
        // return res.status(201).send('Post agregado con éxito')
        return res.status(201).json({ ok: true, message: 'Post agregado con éxito', result });
    } catch (error) {
        console.log('Se ha producido un error...', error.code);
        const { status, message } = handleErrors(error.code);
        return res.status(status).json({ ok: false, result: message })
    }
});

// rutas PUT
//  (cambiar la descripción)

app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.query;

    try {
        const result = await mudarPost(descripcion, id);
        return res.status(200).json({ ok: true,
            message: 'Modificado con éxito',
            result })
    } catch (error) {
        console.log(error);
        const { status, message } = handleErrors(error.code)
        return res.status(status).json({ok: false,
            result: message + ': ' + error.column })
    }
});

// rutas DELETE (borrar)

app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await borrarPost(id);
        return res.status(200).json({ ok: true,
            message: 'Post eliminado con éxito',
            id: result })
    } catch (error) {
        console.log(error);
        const { status, message } = handleErrors(error.code)
        return res.status(status).json({ok: false, result: message})
    }
});


// En caso de error

app.use('*', (req, res) => {
    res.json({ ok: false, result: '404 Página no encontrada...' })
});
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    host: 'localhost',
    user: 'jorge',
    password: '1234',
    database: 'likeme',
    allowExitOnIdle: true
});

// GET

const verPosts = async () => {
    const { rows } = await pool.query('SELECT * FROM posts');
    return rows;
};

// POST (agregar). Esta versión está basada en la tutoría

const agregarPost = async ({titulo, img, descripcion}) => {
    if(!titulo?.trim() || !img?.trim() || !descripcion?.trim()) {
        console.log('Debe completar todos los campos ');
    }

    const consulta = 'INSERT INTO posts values (DEFAULT, $1, $2, $3) RETURNING *';
    const values = [titulo, img, descripcion];
    const result = await pool.query(consulta, values);
    console.log('Post agregado con éxito');
    return result.rows[0];
};

// PUT (cambiar)

const mudarPost = async (descripcion, id) => {
    const consulta = 'UPDATE posts SET descripcion = $1 WHERE id = $2';
    const values = [descripcion, id];
    const result = await pool.query(consulta, values);

    if (result.rowCount === 0) {
        console.log('No se encontraron coincidencias...')
    }

    return { id, descripcion }
};

export const actualizarLike = async (likes, id) => {
    const consulta = 'UPDATE posts SET likes = $1 WHERE id = $2';
    const values = [likes, id];
    const result = await pool.query(consulta, values)

    console.log(result.rowCount)

    return { id, likes }
};


// DELETE (borrar)

const borrarPost = async (id) => {
    const consulta = 'DELETE FROM posts WHERE id = $1';
    const values = [id];
    const result = await pool.query(consulta, values);

    console.log('intrucción procesada', result.command);
    console.log('filas procesadas', result.rowCount);
    console.log('información eliminada', result.rows[0])

    if (result.rowCount === 0) {
        console.log('No se encontraron coicidencias...');
    }

    return id
};

export { verPosts, agregarPost, mudarPost, borrarPost }
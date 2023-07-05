const pool = require("../db/conexion");

const getUser = async (req, res) => {
  const { rows: usuarios } = await pool.query("SELECT * FROM usuarios");
  return usuarios;
};


const verificarUser = async (email, password) => {
  const consulta = "Select * from usuarios where email = $1 AND password = $2";
  const value = [email, password];
  const { rowCount } = await pool.query(consulta, value);
  if (!rowCount) {
    throw new Error("Usuario o contraseña incorrectos");
  }
}

const deleteEvento = async (id) => {
  const consulta = "DELETE FROM eventos WHERE id = $1";
  const values = [id];
  const { rowCount } = await pool.query(consulta, values);
  if (!rowCount)
    throw { code: 404, message: "No se encontró ningún evento con este ID" };
};


const actualizarEvento = async (titulo, descripcion, lugar, fecha, id) => {
  const consulta =
    "UPDATE eventos SET titulo = $1, descripcion = $2, lugar = $3, fecha = $4 WHERE id = $5";
  const values = [titulo, descripcion, lugar, fecha, id];
  const { rowCount } = await pool.query(consulta, values);
  if (!rowCount)
    throw { code: 404, message: "No se encontró ningún evento con este ID" };
};

module.exports = {
  getUser,
  verificarUser,
  deleteEvento,
  actualizarEvento,
};
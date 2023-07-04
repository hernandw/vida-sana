const pool = require("../db/conexion");

const getUser = async (req, res) => {
  const { rows: usuarios } = await pool.query("SELECT * FROM usuarios");
  return usuarios;
};


module.exports = {
  getUser,
  
};
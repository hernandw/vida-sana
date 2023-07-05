const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  getUser,
  verificarUser,
  deleteEvento,
  actualizarEvento,
} = require("../consultas/consultas");

router.get("/", (req, res) => {
  res.send("Hello World! desde router");
});

router.get("/users", async (req, res) => {
  try {
    const consulta = await getUser();
    res.json(consulta);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/token", async (req, res) => {
  const token = null;
  res.json({
    token,
  });
});

router.get("/public", async (req, res) => {
  res.send("Soy un sitio Publico");
});

router.get("/private", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //luego accedemos al paylod del token
    jwt.verify(token, process.env.SECRET_KEY);

    res.send("Soy un sitio Privado");
  } catch (error) {
    res.status(404).json({
      message: "sitio no autorizado",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarUser(email, password);
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1m",
    });
    res.send({ token });
  } catch (error) {
    res.status(500).send({
      message: "usuario o contraseña incorrecta",
    });
  }
});

router.delete("/evento/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.headers["authorization"].split(" ")[1];
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    const { email } = jwt.decode(token);
    await deleteEvento(id);
    res.send(`El usuario ${email} ha eliminado el evento de id ${id}`);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

router.put("/evento/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { titulo, descripcion, lugar, fecha } = req.body;
    const token = req.headers["authorization"].split(" ")[1];
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    const { email } = jwt.decode(token);
    await actualizarEvento(titulo, descripcion, lugar, fecha, id);
    res.send(`El usuario ${email} ha actualizado el evento de id ${id}`);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;

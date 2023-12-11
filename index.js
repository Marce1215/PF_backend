const express = require('express')
const app = express()

const jwt = require("jsonwebtoken")
const cors = require('cors')
const { getPpto, IngItem, consultaPresupuesto, verificarCredenciales, ActualizarEvento, registrarUsuario } = require('./consultas')

app.listen(4600, console.log("SERVER ON"))
app.use(cors())
app.use(express.json())
app.use(cors());

const { Pool } = require('pg')

app.get("/ppto", async (req, res) => {
    try {
        const ppto = await getPpto()
        res.json(ppto)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})



app.post("/usuarios", async (req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.send("Usuario creado con éxito")
    } catch (error) { 
        res.status(500).send(error)
    }
})
/*
app.post('/ingitem', async (req, res) => {
    try {
      //  const { id } = req.params;
        const authorizationHeader = req.header("Authorization");

        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            throw { code: 401, message: "Unauthorized: Token not provided" };
        }

        const token = authorizationHeader.split("Bearer ")[1];

        // Verificar y decodificar el token
        const decodedToken = await jwt.verify(token, "az_AZ");

        const { id_ppto_ingreso, fecha, monto_item } = req.body;

        // Llamar a la función IngItem con los datos proporcionados
        await IngItem(id_ppto_ingreso, fecha, monto_item); 

        res.status(200).send(`Presupuesto actualizado correctamente`);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);

        if (error.code === 404) {
            res.status(404).send(error.message);
        } else if (error.code === 401) {
            res.status(401).send(error.message);
        } else {
            res.status(error.code || 500).send(error.message || 'Error interno del servidor');
        }
    }
});*/

app.post('/ingitem', async (req, res) => {
    try {
      //  const { id } = req.params;
//        const authorizationHeader = req.header("Authorization");

  //      if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    //        throw { code: 401, message: "Unauthorized: Token not provided" };
      //  }

        //const token = authorizationHeader.split("Bearer ")[1];

        // Verificar y decodificar el token
    //    const decodedToken = await jwt.verify(token, "az_AZ");

        const { id_ppto_ingreso, fecha, monto_item, descripcion } = req.body;

        // Llamar a la función IngItem con los datos proporcionados
        await IngItem(id_ppto_ingreso, fecha, monto_item, descripcion); 

        res.status(200).send(`Presupuesto actualizado correctamente`);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);

        if (error.code === 404) {
            res.status(404).send(error.message);
        } else if (error.code === 401) {
            res.status(401).send(error.message);
        } else {
            res.status(error.code || 500).send(error.message || 'Error interno del servidor');
        }
    }
});



  
  app.get('/consultaPresupuesto/:ano/:mes', async (req, res) => {
    try {
      const { ano, mes } = req.params;
  
      const Authorization = req.header("Authorization")
      const token = Authorization.split("Bearer ")[1]
      jwt.verify(token, "az_AZ")
      const { email } = jwt.decode(token)
  
      const ppto = await consultaPresupuesto(ano, mes);
      res.json(ppto);
    } catch (error) {
      res.status(error.code || 500).send(error);
    }
  });


// Ruta para mostrar los datos de la tabla presupuesto
app.get('/mostrarPresupuesto', async (req, res) => {
    try {
        // Realizar una consulta a la base de datos
        const result = await pool.query('SELECT * FROM presupuesto');

        // Devolver los datos como respuesta
        res.json(result.rows);
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});
app.post("/login", async (req, res) => {
    try {
        const { login, clave } = req.body
        console.log(login, clave)
        await verificarCredenciales(login, clave)
        const token = jwt.sign({ login }, "az_AZ")
        res.send(token)
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})


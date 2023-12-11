const { Pool } = require('pg')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')



const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'marce1215',
  database: 'presupuesto',
  port: 5432, // El puerto predeterminado de PostgreSQL es 5432.
  allowExitOnIdle: true
})



const getPpto = async () => {
  const { rows: eventos } = await pool.query("SELECT * FROM presupuesto")
  return eventos
}

const deleteEvento = async (id) => {
  const consulta = "DELETE FROM presupuesto WHERE id = $1"
  const values = [id]
  const { rowCount } = await pool.query(consulta, values)
  if (!rowCount) throw { code: 404, message: "No se encontró ningún evento con este ID" }
}



const IngItem = async (id_ppto_ingreso, fecha, monto_item, descripcion) => {

  const consulta = "INSERT INTO presupuesto (id_ppto_ingreso, fecha, monto_item, descripcion) VALUES ($1, $2, $3, $4)"
  const values = [id_ppto_ingreso, fecha, monto_item, descripcion];
  const { rowCount } = await pool.query(consulta, values);


  if (!rowCount) throw { code: 404, message: "No se encontró ningún evento con este ID" };
}



// Función para realizar la consulta a la base de datos
const consultaPresupuesto = async (ano, mes) => {
  const result = await pool.query(`
      SELECT
        EXTRACT(YEAR FROM fecha) AS ano,
        EXTRACT(MONTH FROM fecha) AS mes,
        SUM(CASE WHEN monto_item >= 0 THEN monto_item ELSE 0 END) AS suma_montos_positivos,
        SUM(CASE WHEN monto_item < 0 THEN monto_item ELSE 0 END) AS suma_montos_negativos
      FROM
        presupuesto
      WHERE
        EXTRACT(YEAR FROM fecha) = $1 AND EXTRACT(MONTH FROM fecha) = $2
      GROUP BY
        ano, mes
      ORDER BY
        ano, mes;
    `, [ano, mes]);

  return result.rows;
};



const registrarUsuario = async (usuario) => {
  let { login, clave } = usuario
  const passwordEncriptada = bcrypt.hashSync(clave)
  clave = passwordEncriptada
  const values = [login, passwordEncriptada]
console.log(values)
  const consulta = "INSERT INTO ppto_ingreso values (DEFAULT, $1, $2)"
console.log(consulta)
  await pool.query(consulta, values)

}
/*
const verificarCredenciales = async (login, clave) => {
    const values = [login]
    const consulta = "SELECT * FROM ppto_ingreso WHERE login = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    const { clave: passwordEncriptada } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(clave, passwordEncriptada)
    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Login o contraseña incorrecta" }
}*/

const verificarCredenciales = async (login, clave) => {
  try {
    const values = [login];
    const consulta = "SELECT * FROM ppto_ingreso WHERE login = $1";
    const { rows, rowCount } = await pool.query(consulta, values);

    if (rowCount === 0) {
      throw { code: 401, message: "Usuario no encontrado" };
    }

    const [usuario] = rows;
    const { clave: passwordEncriptada } = usuario;
    const passwordEsCorrecta = bcrypt.compareSync(clave, passwordEncriptada);

    if (!passwordEsCorrecta) {
      throw { code: 401, message: "Contraseña incorrecta" };
    }

    // Resto del código si las credenciales son correctas
    // Puedes devolver el usuario u otro valor si es necesario.
    return usuario;

  } catch (error) {
    // Manejar otros errores aquí, si es necesario
    throw error;
  }
};




module.exports = { getPpto, consultaPresupuesto, IngItem, deleteEvento, verificarCredenciales, registrarUsuario, verificarCredenciales }


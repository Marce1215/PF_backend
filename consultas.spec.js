const request = require("supertest");
const server = require("./consultas");
const app = require('./consultas');

jest.mock('./consultas', () => {
    return {
      getPpto: jest.fn(),
      IngItem: jest.fn(),
      consultaPresupuesto: jest.fn(),
      verificarCredenciales: jest.fn(),
      ActualizarEvento: jest.fn(),
      registrarUsuario: jest.fn(),
    };
  });
  
  describe('GET /ppto', () => {
    it('debería responder con un JSON de presupuesto', async () => {
      const mockData = [{ /* datos de presupuesto simulados */ }];
      require('./consultas').getPpto.mockResolvedValueOnce(mockData);
  
      const response = await request(app).get('/ppto').expect(200);
  
      expect(response.body).toEqual(mockData);
    });
  });
  
  describe('POST /ingitem', () => {
    it('debería responder con un mensaje de éxito', async () => {
      const mockRequestBody = { id_ppto_ingreso: 1, fecha: '2023-11-01', monto_item: '333.00' };
      require('./consultas').IngItem.mockResolvedValueOnce();
  
      const response = await request(app)
        .post('/ingitem')
        .set('Authorization', 'Bearer tu_token_aqui')
        .send(mockRequestBody)
        .expect(200);
  
      expect(response.text).toBe('Presupuesto actualizado correctamente');
    });
  });

  
describe('GET /consultaPresupuesto/:ano/:mes', () => {
    it('debería responder con un JSON de presupuesto', async () => {
      // Supongamos que en tu base de datos hay datos simulados para el año 2023 y mes 11
      const ano = 2023;
      const mes = 11;
  
      const response = await request(app)
        .get(`/consultaPresupuesto/${ano}/${mes}`)
        .expect(200)
        .expect('Content-Type', /json/);
  
      // Verifica el formato de la respuesta según tu implementación
      expect(response.body).toHaveProperty('ano');
      expect(response.body).toHaveProperty('mes');
      expect(response.body).toHaveProperty('suma_montos_positivos');
      expect(response.body).toHaveProperty('suma_montos_negativos');
    });
  
    
  });

  describe('GET /consultaPresupuesto/:ano/:mes', () => {
    it('debería responder con un JSON de presupuesto', async () => {
      // Supongamos que en tu base de datos hay datos simulados para el año 2023 y mes 11
      const ano = 2023;
      const mes = 11;
  
      const response = await request(app)
        .get(`/consultaPresupuesto/${ano}/${mes}`)
        .expect(200)
        .expect('Content-Type', /json/);
  
      // Verifica el formato de la respuesta según tu implementación
      expect(response.body).toHaveProperty('ano');
      expect(response.body).toHaveProperty('mes');
      expect(response.body).toHaveProperty('suma_montos_positivos');
      expect(response.body).toHaveProperty('suma_montos_negativos');
    });
  
 
  });
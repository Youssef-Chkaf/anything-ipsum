// Mock des dépendances Angular SSR pour éviter les erreurs ESM dans Jest
jest.mock('@angular/ssr/node', () => ({
  AngularNodeAppEngine: class {
    handle() { return Promise.resolve(null); } 
  },
  createNodeRequestHandler: () => {},
  isMainModule: () => false,
  writeResponseToNodeResponse: () => {}
}), { virtual: true });

// Mock de fetch global pour éviter d'appeler l'API Mistral réelle
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      choices: [{ message: { content: 'Lorem ipsum generated content for testing...' } }]
    }),
  })
);

const request = require('supertest');
const { app } = require('../src/server');

describe('API Anything Ipsum', () => {

    test('GET /api/health doit retourner le statut healthy', async () => {
        const response = await request(app).get('/api/health');
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
    });

    test('GET /api/health doit contenir uptime et ai_connection', async () => {
        const response = await request(app).get('/api/health');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('uptime');
        expect(response.body).toHaveProperty('ai_connection');
    });
      
    test('POST /api/generate doit retourner du contenu', async () => {
        const response = await request(app)
            .post('/api/generate')
            .send({ 
                theme: 'Test', 
                paragraphs: 1, 
                paragraphLength: 'court',
                stream: false 
            });
        
        // On s'attend à ce que le endpoint existe (donc pas 404)
        expect(response.status).not.toBe(404);
    });

    test('POST /api/generate sans thème doit retourner 400', async () => {
        const response = await request(app)
            .post('/api/generate')
            .send({ 
                theme: '',
                paragraphs: 1, 
                stream: false 
            });
        
        expect(response.status).toBe(400);
    });
    
    test('POST /api/generate avec length «long» doit répondre', async () => {
        const response = await request(app)
            .post('/api/generate')
            .send({ 
                theme: 'Space pirates', 
                paragraphs: 1, 
                paragraphLength: 'long',
                stream: false 
            });
        
        expect(response.status).not.toBe(404);
    });
});

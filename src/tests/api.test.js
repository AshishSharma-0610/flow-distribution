const request = require('supertest');
const app = require('../index');

describe('API Endpoints', () => {
    test('GET /api/astrologers returns list of astrologers', async () => {
        const res = await request(app).get('/api/astrologers');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('GET /api/astrologers/:id returns a specific astrologer', async () => {
        const res = await request(app).get('/api/astrologers/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
    });

    test('POST /api/distribute assigns users to astrologers', async () => {
        const users = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const res = await request(app)
            .post('/api/distribute')
            .send({ users });
        expect(res.statusCode).toBe(200);
        expect(Object.keys(res.body).length).toBe(3);
    });

    test('PATCH /api/astrologers/:id/toggle-top-performer toggles top performer status', async () => {
        const res = await request(app).patch('/api/astrologers/1/toggle-top-performer');
        expect(res.statusCode).toBe(200);
        expect(res.body.isTopPerformer).toBe(true);
    });

    test('GET /api/status returns current distribution status', async () => {
        const res = await request(app).get('/api/status');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0]).toHaveProperty('currentFlow');
    });

    test('POST /api/reset-flow resets flow for all astrologers', async () => {
        const res = await request(app).post('/api/reset-flow');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('astrologers');
    });

    test('POST /api/astrologers creates a new astrologer', async () => {
        const newAstrologer = { name: 'New Astrologer', maxFlow: 15 };
        const res = await request(app)
            .post('/api/astrologers')
            .send(newAstrologer);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('name', 'New Astrologer');
    });

    test('PUT /api/astrologers/:id updates an astrologer', async () => {
        const updatedInfo = { name: 'Updated Name', maxFlow: 20 };
        const res = await request(app)
            .put('/api/astrologers/1')
            .send(updatedInfo);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'Updated Name');
    });

    test('DELETE /api/astrologers/:id deletes an astrologer', async () => {
        const res = await request(app).delete('/api/astrologers/2');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Astrologer deleted successfully');
    });

    test('GET /api/astrologers/:id returns 404 for non-existent astrologer', async () => {
        const res = await request(app).get('/api/astrologers/9999');
        expect(res.statusCode).toBe(404);
    });

    test('POST /api/distribute returns 400 for invalid input', async () => {
        const res = await request(app)
            .post('/api/distribute')
            .send({ users: 'invalid' });
        expect(res.statusCode).toBe(400);
    });
});
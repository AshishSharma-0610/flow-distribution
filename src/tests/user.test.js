const User = require('../models/user.js');

describe('User', () => {
    test('initialization without preference', () => {
        const user = new User(1);
        expect(user.id).toBe(1);
        expect(user.preference).toBeNull();
    });

    test('initialization with preference', () => {
        const user = new User(2, 5);
        expect(user.id).toBe(2);
        expect(user.preference).toBe(5);
    });
});
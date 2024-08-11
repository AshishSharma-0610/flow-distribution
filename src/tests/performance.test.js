const distributeUsers = require('../algorithms/flow.js');
const Astrologer = require('../models/astrologer.js');
const User = require('../models/user.js');

describe('Performance Tests', () => {
    test('handles 3000 users and 500 astrologers efficiently', () => {
        const astrologers = Array.from({ length: 500 }, (_, i) => new Astrologer(i + 1, `Astrologer ${i + 1}`, 10));
        const users = Array.from({ length: 3000 }, (_, i) => new User(i + 1, Math.floor(Math.random() * 500) + 1));

        const startTime = process.hrtime();

        const result = distributeUsers(users, astrologers);

        const endTime = process.hrtime(startTime);
        const duration = endTime[0] * 1000 + endTime[1] / 1e6; // Convert to milliseconds

        expect(Object.keys(result).length).toBe(3000);
        expect(duration).toBeLessThan(1000); // Expecting execution in less than 1 second
    });
});
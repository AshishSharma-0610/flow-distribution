const distributeUsers = require('../algorithms/flow.js');
const Astrologer = require('../models/astrologer.js');
const User = require('../models/user.js');

describe('Distribution Algorithm', () => {
    let astrologers;

    beforeEach(() => {
        astrologers = [
            new Astrologer(1, 'A', 10),
            new Astrologer(2, 'B', 10),
            new Astrologer(3, 'C', 10),
        ];
    });

    test('distributes users evenly when no preferences', () => {
        const users = [
            new User(1), new User(2), new User(3),
            new User(4), new User(5), new User(6),
        ];
        const result = distributeUsers(users, astrologers);
        const distributionCounts = Object.values(result).reduce((acc, astrologerId) => {
            acc[astrologerId] = (acc[astrologerId] || 0) + 1;
            return acc;
        }, {});
        expect(Object.values(distributionCounts)).toEqual([2, 2, 2]);
    });

    test('respects user preferences when possible', () => {
        const users = [
            new User(1, 1), new User(2, 2), new User(3, 3),
            new User(4, 1), new User(5, 2), new User(6, 3),
        ];
        const result = distributeUsers(users, astrologers);
        expect(result).toEqual({
            1: 1, 2: 2, 3: 3, 4: 1, 5: 2, 6: 3
        });
    });

    test('handles overflow correctly', () => {
        const users = Array.from({ length: 35 }, (_, i) => new User(i + 1));
        const result = distributeUsers(users, astrologers);
        const distributionCounts = Object.values(result).reduce((acc, astrologerId) => {
            acc[astrologerId] = (acc[astrologerId] || 0) + 1;
            return acc;
        }, {});

        // Expect 30 users to be assigned (10 to each astrologer) and 5 to be unassigned
        expect(distributionCounts).toEqual({ 1: 10, 2: 10, 3: 10, null: 5 });

        // Expect all 35 users to have an assignment (including null for unassigned)
        expect(Object.keys(result).length).toBe(35);

        // Check that each astrologer has exactly 10 users
        astrologers.forEach(astrologer => {
            expect(astrologer.currentFlow).toBe(10);
        });
    });

    test('handles top performers correctly', () => {
        astrologers[0].toggleTopPerformer();
        const users = Array.from({ length: 40 }, (_, i) => new User(i + 1));
        const result = distributeUsers(users, astrologers);
        const distributionCounts = Object.values(result).reduce((acc, astrologerId) => {
            acc[astrologerId] = (acc[astrologerId] || 0) + 1;
            return acc;
        }, {});
        expect(distributionCounts[1]).toBe(15);
        expect(distributionCounts[2]).toBe(10);
        expect(distributionCounts[3]).toBe(10);
    });
});
const Astrologer = require('../models/astrologer');

describe('Astrologer', () => {
    let astrologer;

    beforeEach(() => {
        astrologer = new Astrologer(1, 'Test Astrologer', 10);
    });

    test('initialization', () => {
        expect(astrologer.id).toBe(1);
        expect(astrologer.name).toBe('Test Astrologer');
        expect(astrologer.maxFlow).toBe(10);
        expect(astrologer.currentFlow).toBe(0);
        expect(astrologer.isTopPerformer).toBe(false);
    });

    test('canTakeMoreUsers', () => {
        expect(astrologer.canTakeMoreUsers()).toBe(true);
        astrologer.currentFlow = 10;
        expect(astrologer.canTakeMoreUsers()).toBe(false);
    });

    test('addUser', () => {
        expect(astrologer.addUser()).toBe(true);
        expect(astrologer.currentFlow).toBe(1);
        astrologer.currentFlow = 10;
        expect(astrologer.addUser()).toBe(false);
    });

    test('toggleTopPerformer', () => {
        astrologer.toggleTopPerformer();
        expect(astrologer.isTopPerformer).toBe(true);
        expect(astrologer.maxFlow).toBe(15);
        astrologer.toggleTopPerformer();
        expect(astrologer.isTopPerformer).toBe(false);
        expect(astrologer.maxFlow).toBe(10);
    });

    test('resetFlow', () => {
        astrologer.currentFlow = 5;
        astrologer.resetFlow();
        expect(astrologer.currentFlow).toBe(0);
    });
});
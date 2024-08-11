const express = require('express');
const router = express.Router();
const Astrologer = require('../models/astrologer.js');
const User = require('../models/user.js');
const distributeUsers = require('../algorithms/flow.js');

let astrologers = [
    new Astrologer(1, "Astrologer A", 10),
    new Astrologer(2, "Astrologer B", 10),
    new Astrologer(3, "Astrologer C", 10),
];

// Get all astrologers
router.get('/astrologers', (req, res) => {
    res.json(astrologers);
});

// Get a specific astrologer
router.get('/astrologers/:id', (req, res) => {
    const astrologer = astrologers.find(a => a.id === parseInt(req.params.id));
    if (!astrologer) {
        return res.status(404).json({ error: 'Astrologer not found' });
    }
    res.json(astrologer);
});

// Distribute users to astrologers
router.post('/distribute', (req, res) => {
    const { users } = req.body;
    if (!Array.isArray(users)) {
        return res.status(400).json({ error: 'Invalid users data. Expected an array.' });
    }

    const userObjects = users.map(u => new User(u.id, u.preference));
    const assignments = distributeUsers(userObjects, astrologers);

    res.json(assignments);
});

// Toggle top performer status for an astrologer
router.patch('/astrologers/:id/toggle-top-performer', (req, res) => {
    const astrologer = astrologers.find(a => a.id === parseInt(req.params.id));
    if (!astrologer) {
        return res.status(404).json({ error: 'Astrologer not found' });
    }
    astrologer.toggleTopPerformer();
    res.json(astrologer);
});

// Get current distribution status
router.get('/status', (req, res) => {
    const status = astrologers.map(a => ({
        id: a.id,
        name: a.name,
        currentFlow: a.currentFlow,
        maxFlow: a.maxFlow,
        isTopPerformer: a.isTopPerformer
    }));
    res.json(status);
});

// Reset flow for all astrologers (useful for testing or daily resets)
router.post('/reset-flow', (req, res) => {
    astrologers.forEach(a => a.resetFlow());
    res.json({ message: 'Flow reset for all astrologers', astrologers: astrologers });
});

// Add a new astrologer
router.post('/astrologers', (req, res) => {
    const { name, maxFlow } = req.body;
    if (!name || !maxFlow) {
        return res.status(400).json({ error: 'Name and maxFlow are required' });
    }
    const newId = Math.max(...astrologers.map(a => a.id)) + 1;
    const newAstrologer = new Astrologer(newId, name, maxFlow);
    astrologers.push(newAstrologer);
    res.status(201).json(newAstrologer);
});

// Update an astrologer's details
router.put('/astrologers/:id', (req, res) => {
    const astrologer = astrologers.find(a => a.id === parseInt(req.params.id));
    if (!astrologer) {
        return res.status(404).json({ error: 'Astrologer not found' });
    }
    const { name, maxFlow } = req.body;
    if (name) astrologer.name = name;
    if (maxFlow) astrologer.updateMaxFlow(maxFlow);
    res.json(astrologer);
});

// Delete an astrologer
router.delete('/astrologers/:id', (req, res) => {
    const index = astrologers.findIndex(a => a.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Astrologer not found' });
    }
    astrologers.splice(index, 1);
    res.json({ message: 'Astrologer deleted successfully' });
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Get distribution statistics
router.get('/statistics', (req, res) => {
    const stats = {
        totalUsers: astrologers.reduce((sum, a) => sum + a.currentFlow, 0),
        totalCapacity: astrologers.reduce((sum, a) => sum + a.maxFlow, 0),
        topPerformers: astrologers.filter(a => a.isTopPerformer).length
    };
    res.json(stats);
});

module.exports = router;
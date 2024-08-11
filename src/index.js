const express = require('express');
const bodyParser = require('body-parser');
const astrologersRoutes = require('./routes/astrologers');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/api', astrologersRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
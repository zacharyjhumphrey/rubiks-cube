const express = require('express');
const app = express();
const path = require('path');

app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
})

app.listen(3000);
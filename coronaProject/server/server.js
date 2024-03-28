const server = require('./db.js');
const cors = require('cors');
const express = require('express');
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}))

app.use(express.json());

app.listen(3366, () => {
    console.log('Server is running on port 3366');
});

app.post('/patients', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/json' });
    const body = req.body;
    server.addPatient(body)
        .then((data) => {
            res.status(200).end(JSON.stringify(data));
        })
        .catch((statusError) => {
            res.status(statusError).end()
        });
})

app.get('/patients', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/json' });
    server.getAllPatients()
        .then((data) => {
            res.status(200).end(JSON.stringify(data));
        })
        .catch((statusError) => {
            res.status(statusError).end()
        });
})

app.get('/patients/:id', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/json' });
    const id = req.params.id;
    server.getPatientById(id)
        .then((data) => {
            res.status(200).end(JSON.stringify(data));
        })
        .catch((statusError) => {
            res.status(statusError).end()
        });
})

app.delete('/patients/:id', (req, res) => {
    const id = req.params.id;
    server.deletePatientById(id)
        .then((data) => {
            res.status(200).end(JSON.stringify(data));
        })
        .catch((statusError) => {
            res.status(statusError).end()
        });
})

app.put('/patients/:id', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/json' });
    const id = req.params.id;
    const body = JSON.parse(req.body);
    server.updatePatientById(id, body)
        .then((data) => {
            res.status(200).end(JSON.stringify(data));
        })
        .catch((statusError) => {
            res.status(statusError).end()
        });
})



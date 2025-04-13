const express = require('express');
const cors = require('cors');
const http = require('http');
const ws = require('ws');
const uuidv4 = require('uuid').v4;
const app = express();

const server = http.createServer(app);
const wsServer = new ws.Server({ noServer: true });

const PORT = 3000;

let data = null;
let count = 0;

const interval = setInterval(() => {
    data = { message: `Notification ${count+1}`, timestamp: Date.now()};
}, 5000);

app.use(cors());

app.use(express.json());
const notifications = [];

// app.get('/', (req, res) => {
//     res.send('Welcome to Notifier API')
// })

// app.get('/notifications/shortpolling', (req, res) => {
//     const time = new Date().getTime();
//     const notifications = [
//         { message: 'Notification 1', timestamp: time },
//         { message: 'Notification 2', timestamp: time + 1 }
//     ];
//     res.json(notifications);
// })

// app.get('/notifications', (req, res) => {
//     if(data){
//         res.send(data);
//         data = null;
//     } else{
//         setTimeout(() => {
//             res.send('No new data')
//         }, 10000)
//     }
// })

app.post('/webhook/:source', (req, res) => {
    const { source } = req.params;
    const {eventType, message} = req.body;

    const notification = {
        source,
        eventType, 
        message,
        timestamp: Date.now()
    };

    notifications.push(notification);

    console.log('Webhook received from: ', source);
    console.log(notifications);

    res.status(200).json({ success: true})
})

server.on('upgrade', (req, socket, head) => {
    console.log('🧩 Upgrade request to:', req.url);
    const pathname = req.url.split('?')[0];

    if(pathname === '/ws'){
        wsServer.handleUpgrade(req, socket, head, (wss) => {
            wsServer.emit('connection', wss, req);
        });
    } else {
        socket.destroy();
    }
})

wsServer.on('connection', (wss, req) => {
    console.log('New client connected to /events');

    wss.send(JSON.stringify({ type: 'welcome', message: 'Connected to events'}));

    const interval = setInterval(() => {
        wss.send(JSON.stringify({ 
            type: 'notification',
            message: 'New Notification!',
            timeStamp: Date.now(),
        }))
    }, 5000);

    wss.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval);
        
    })
    
})

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendEvent = () => {
        const data = {
            message: 'New alert from server',
            timestamp: Date.now(),
        }
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    const intervalID = setInterval(sendEvent, 5000);

    req.on('close', () => {
        clearInterval(intervalID);
        res.end();
        console.log('Client disconnected')
    })

})

server.listen(PORT, () => {
    console.log('App running at port ', PORT);
})
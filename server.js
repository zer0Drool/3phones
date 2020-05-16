const express = require('express');
const os = require('os');
const geoip = require('geoip-lite');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const device = require('express-device');
app.use(device.capture());

app.use(express.static('./public'));

io.on('connection', (socket) => {

    console.log(socket.id);

    socket.on('joined', () => {
        socket.emit('hi', {message: 'fk u'});
    });

});

app.get('/snoop', (req, res) => {
    var data = {
        ip: req.headers['x-forwarded-for'] ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null),
        referrer: req.get('Referrer'),
        device: req.device.type
    }
    // console.log('HERE--------> 1 ', req.headers['x-forwarded-for'], ' 2 ', req.connection.remoteAddress)
    // if (req.connection.socket) {
    //     console.log(' 3 ', req.connection.socket.remoteAddress);
    // }
    data.ip2 = data.ip.split(":").pop();
    data.geo = geoip.lookup(data.ip2);
    res.json({data: data});
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('*', (req, res) => {
    res.redirect('/');
});

server.listen(process.env.PORT || 8080, () => console.log(`initializing 3phones bb...`));

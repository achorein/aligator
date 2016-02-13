'use strict';

var service = require('./component.service')
var url = require('url')

class ComponentController {
    constructor(wss) {
        wss.on("connection", function(ws){
            //var location = url.parse(ws.upgradeReq.url, true);
            ws.on('message', function incoming(message) {
                console.log('received: %s', message);
                let query = JSON.parse(message);
                if (query.call === 'list') {
                    ws.send(JSON.stringify({
                        type:'list', 
                        date: new Date(),
                        data: service.componentList()
                    }));
                } else if (query.call === 'action') {
                    ws.send(JSON.stringify({
                        type: 'component', 
                        date: new Date(),
                        data: service.action(query.data)
                    }));
                } else {
                    ws.send(JSON.stringify({error: 'bad request !'}));
                }
            });
        });
    }
    
    list(req, res) {
      res.json(service.componentList());
    }
    
    action(req, res) {
      res.json(service.action(req.body.id, req.body.action, req.body.value));
    }
}

module.exports = (wss) => { return new ComponentController(wss) };
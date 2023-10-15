
// const methods = require('methods')
// const events = require('events');
const ClientRequest = require('./request')
const ServerResponse = require('./response')
const serverListener  = require('../../serverListener')
const clientListener = require('../../../services/clientListener')
// export default {
//     localDB: new events.EventEmitter().on('localRequest', (event, listener) => {
//         console.log('event', event);
//         console.log('listener', listener);
//     })

    
// }



function LocalServer () {
    this.req = ClientRequest
    this.res = ServerResponse
    

}

LocalServer.sendResponse = function(res){
    clientListener.emit(res.header['Response-ID'], res)
}


// methods.forEach(method => {
//     LocalServer.prototype[method] = function (path, handler) {
//         this._router[method](path, handler)
//     }
// })



LocalServer.prototype.createServer = function (callback) {
    this.handler = callback
    return this
    //this._router.handle(req, res)
    
}

LocalServer.prototype.listen = function (arg, callback) {
    // console.log('arg1', arg[0]);
    this.serverListener = serverListener.localDB.on(arg[0], (event) => {
        console.log('The server received an event', event);
        
        Object.assign(this.req,event );
        // this.req = event

        // check the stream 
        // consider this for image and video
        this.req._readableState = {
            pipesCount: 0
        }
        this.handler(this.req, this.res)
    })
    callback
    return this
}


module.exports = LocalServer
// Author: Haochen Chiu
// Date: 2023/10/6
// Mimic the ServerResponse class in http modlue
// const localServer = require('./localServer')
const clientListener = require('../../../services/clientListener')

function ServerResponse () {
    this.header = new Object()

}

ServerResponse.prototype.end = function (data) {
    console.log('response end', data);
    this.data = data
    clientListener.localDB.emit(this.header['Response-ID'], this)
    // localServer.sendResponse(this)
    return data
}

ServerResponse.prototype.setHeader = function (name, value) {
    this.header[name] = value
}

ServerResponse.prototype.getHeader = function (name) {
    return this.header[name]
}

ServerResponse.prototype.removeHeader = function (name) {
    delete this.header[name]
}


module.exports = ServerResponse
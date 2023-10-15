
const Router = require('./router')
const methods = require('methods')

function App () {
    this._router = new Router()

}


methods.forEach(method => {
    App.prototype[method] = function (path, handler) {
        this._router[method](path, handler)
    }
})



App.prototype.listen = function (req, res) {
    this._router.handle(req, res)
    
}

module.exports = App
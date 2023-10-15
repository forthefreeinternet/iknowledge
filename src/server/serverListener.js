
const events = require('events');
module.exports = {
    localDB: new events.EventEmitter()

    
}


// export default {
//     localDB: new events.EventEmitter().on('localRequest', (event, listener) => {
//         console.log('event', event);
//         console.log('listener', listener);
//     })

    
// }

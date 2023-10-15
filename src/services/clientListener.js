
const events = require('events');
// export default {
//     localDB: new events.EventEmitter(),
    
// }

const localDB = new events.EventEmitter()
module.exports = {localDB}

//export const db = new Dexie(global.user.userId);
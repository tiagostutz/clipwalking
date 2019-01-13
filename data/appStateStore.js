import PouchDB from 'pouchdb-react-native'
import manuh from 'manuh'
import topics from '../config/topics'
import { reportError } from '../utils/reporter'

import { DB_APP_STATE, LAST_OPENED_TRACK } from '../config/variables'

// new PouchDB(DB_APP_STATE).destroy()
const storePlayerState = (playerState) => {
    
    const db = new PouchDB(DB_APP_STATE)
    
    db.get(LAST_OPENED_TRACK).then(doc => {        
        doc = Object.assign(doc, playerState)
        db.put(doc)
      }).catch((err) => {          
          if (err.status === 404) {
              
            db.put(Object.assign({_id: LAST_OPENED_TRACK}, playerState)).catch(function (err) {
                reportError(err);
            })

          }else{
              reportError("[storePlayerState] - " + err);
          }
    })
}

const getLastOpenedTrack = async (callback) => {
    const db = new PouchDB(DB_APP_STATE)
    
    try {        
        const doc = await db.get(LAST_OPENED_TRACK)
        return callback(doc)
    } catch (error) {
        if (error.status === 404) {
            return callback(null)
        }
        reportError("[getLastOpenedTrack] - " + error)
        return callback(null, error)
    }
}

module.exports.startSync = () => {
    manuh.subscribe(topics.episodes.list.select.set, "AppStateStore", async msg => {
        storePlayerState(msg)
    })
}

module.exports.getLastOpenedTrack = getLastOpenedTrack
module.exports.storePlayerState = storePlayerState
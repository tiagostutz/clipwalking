import PouchDB from 'pouchdb-react-native'
import manuh from 'manuh'
import topics from '../config/topics'
import { reportError } from '../utils/reporter'
import assets from './assets'
import { DB_APP_STATE, LAST_OPENED_TRACK } from '../config/variables'

// new PouchDB(DB_APP_STATE).destroy()
const storePlayerState = (playerState) => {
    
    const db = new PouchDB(DB_APP_STATE)
    
    
    db.get(LAST_OPENED_TRACK).then(async doc => {        

        if (!playerState) { //to reset, send null state
            db.remove(doc).catch(function (err) {
                reportError("[storePlayerState][remove][!playerState]:: " + err);
            })
            return
        }

        const audio = await assets.getAudioFileByTrackURL(doc.episode.url)
        if (!audio) { //check whether the audio file is downloaded. If not, doesn't persist state
            return null
        }
        
        doc = Object.assign(doc, playerState)
        try {            
            await db.put(doc)
        } catch (error) {
            reportError("[storePlayerState][put][update]:: " + err);
        }
      }).catch((err) => {          
          if (err.status === 404) {
              
            db.put(Object.assign({_id: LAST_OPENED_TRACK}, playerState)).catch(function (err) {
                reportError("[storePlayerState][put][new]:: " + err);
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
        const audio = await assets.getAudioFileByTrackURL(doc.episode.url)
        if (audio) { //check whether the audio file is downloaded
            return callback(doc)
        }else{
            return callback(null)
        }
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
    manuh.publish(topics.bootstrap.app.ready.set, { value: 1, module: "appStateStore" })
}

module.exports.getLastOpenedTrack = getLastOpenedTrack
module.exports.storePlayerState = storePlayerState
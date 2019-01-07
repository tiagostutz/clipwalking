import PouchDB from 'pouchdb-react-native'
import { DB_TRACK_POSITION } from '../config/variables'
import { reportError } from '../utils/reporter'

module.exports = {
    get: async(id) => {
        const dbTrackPosition = new PouchDB(DB_TRACK_POSITION)
        try {
            const doc = await dbTrackPosition.get(id)   
            return doc
        } catch (error) {
            if (error.status === 404) {
                return null
            }else{
                reportError(error)                
            }
        }
    },

    put: async(track) => {
        const dbTrackPosition = new PouchDB(DB_TRACK_POSITION)
        try {
            await dbTrackPosition.put(track)    
            return track
        } catch (error) {
            reportError(error)    
            return null            
        }
    }
}


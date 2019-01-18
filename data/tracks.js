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
                reportError("[dbTrackPosition][get]" + error)                
            }
        }
    },

    getAll: async() => {
        const dbTrackPosition = new PouchDB(DB_TRACK_POSITION)
        try {
            const docs = await dbTrackPosition.allDocs()   
            if (docs.total_rows === 0) {
                return []
            }
            return docs.rows

        } catch (error) {
            reportError("[dbTrackPosition][getAll]" + error)                
        }
    },

    put: async(track) => {
        const dbTrackPosition = new PouchDB(DB_TRACK_POSITION)
        try {
            await dbTrackPosition.put(track)    
            return track
        } catch (error) {
            reportError("[dbTrackPosition][put]:: " + error)    
            return null            
        }
    }
}


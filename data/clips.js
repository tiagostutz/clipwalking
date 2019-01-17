import PouchDB from 'pouchdb-react-native'
import { DB_CLIPS } from '../config/variables'
import { reportError } from '../utils/reporter'

const clipService = {
    getAll: async (callback) => {
        const dbClips = new PouchDB(DB_CLIPS)
        try {
            const docs = await dbClips.allDocs({include_docs: true})
            if (docs.total_rows === 0) {
                return callback([])
            }
            return callback(docs.rows.map(row => Object.assign(row.doc,{id: row.key})))
        } catch (error) {
            if (error.status === 404) {
                return null
            }else{
                reportError(error)                
            }
        }
    },

    get: async(id) => {
        const dbClips = new PouchDB(DB_CLIPS)
        try {
            const doc = await dbClips.get(id)   
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
        const dbClips = new PouchDB(DB_CLIPS)
        try {
            if (!track._id) {
                track._id = track.trackInfo.id + "-" + new Date().getTime()
            }
            await dbClips.put(track)    
            return track
        } catch (error) {
            reportError("[dbClips][put]:: " + error)       
            return null         
        }
    }
}

export default clipService
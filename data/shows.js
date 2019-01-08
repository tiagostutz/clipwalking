import PouchDB from 'pouchdb-react-native'
import { DB_SHOWS } from '../config/variables'
import { reportError } from '../utils/reporter'

// new PouchDB(DB_SHOWS).destroy()
const showData = {
    getAll: async (callback) => {
        const dbShows = new PouchDB(DB_SHOWS)
        try {
            const docs = await dbShows.allDocs({include_docs: true})
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
        const dbShows = new PouchDB(DB_SHOWS)
        try {            
            const docs = await dbShows.allDocs({include_docs: true})
            const doc = await dbShows.get(id)   
            return doc
        } catch (error) {
            if (error.status === 404) {
                return null
            }else{
                reportError(error)                
            }
        }
    },

    put: async(show) => {
        const dbShows = new PouchDB(DB_SHOWS)
        try {
            const res = await dbShows.put(show)    
            return show
        } catch (error) {
            reportError(error)       
            return null         
        }
    },

    delete: async(show) => {
        const dbShows = new PouchDB(DB_SHOWS)
        try {
            const res = await dbShows.remove(show)    
            return res
        } catch (error) {
            reportError(error)       
            return null         
        }
    }
}

export default showData
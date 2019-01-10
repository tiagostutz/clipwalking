import PouchDB from 'pouchdb-react-native'
import rssParser from 'react-native-rss-parser';
import manuh from 'manuh'
import topics from '../config/topics'
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
    resolveShowInfo: async (url, callback) => {      
        const currShow = await showData.get(url)        
        if (currShow) {
            return callback(currShow)
        }

        fetch(url)
        .then(response => response.text() )
        .then(responseData => rssParser.parse(responseData))
        .then( async (rss, err) => {
            if (err) {
                return callback(null, err)
            }            
            
            const rssURL = rss.links.length > 0 ? rss.links[0].url : null
            const normalizedResult = {
                _id: url,
                url: url,
                showURL: rssURL,
                title: rss.title,
                description: rss.description,
                language: rss.language,
                copyright: rss.copyright,
                lastUpdated: new Date(rss.items[0].published),
                imageURL: rss.image ? rss.image.url : null,
                authors: rss.itunes && rss.itunes.authors && rss.itunes.authors.length>0 ? rss.itunes.authors[0].name : null,
                categories: rss.itunes.categories,
                owner: rss.itunes.owner ? rss.itunes.owner : null
            }
            await showData.put(normalizedResult) //save the show info to local database
            manuh.publish(topics.shows.new.created.set, { value: 1, showRSS: rss }) //notify the world of the show creation
            return callback(normalizedResult, rss)
        });

    },

    put: async(show) => {
        const dbShows = new PouchDB(DB_SHOWS)
        try {
            const res = await dbShows.put(show)    
            return res
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
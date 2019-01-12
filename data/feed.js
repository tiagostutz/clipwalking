import rssParser from 'react-native-rss-parser';
import PouchDB from 'pouchdb-react-native'
import find from 'pouchdb-find'
import manuh from 'manuh'
import { DB_FEED_FULL, DB_FEED_WAITING } from '../config/variables'
import topics from '../config/topics'
import { httpsURL } from '../utils/text'
import { reportError } from '../utils/reporter'
PouchDB.plugin(find)

// new PouchDB(DB_FEED_FULL).destroy()

new PouchDB(DB_FEED_FULL).createIndex({
    index: {fields: ['showURL']}
}).catch(error => {
    reportError(error)    
})

const feedData = {
    fetch: (url) => {
        const urlDownload = httpsURL(url)

        fetch(urlDownload)
        .catch(err => reportError(err))
        .then(response => response.text())
        .then(responseData => rssParser.parse(responseData))
        .then((rss, err) => {
            rss.url = urlDownload
            if (err) {
                return callback(null, err)
            }
            rss.items.map(rssItem => feedData.prepareFeedItem(rss, rssItem))
            return true
        })

    },

    loadShowFeedItems: async (showFeed)  => {
        const dbFeedFull = new PouchDB(DB_FEED_FULL)
        const normalizedResult = showFeed.items.map(rssItem => feedData.prepareFeedItem(showFeed, rssItem))
        
        try {
            await dbFeedFull.bulkDocs(normalizedResult)
            manuh.publish(topics.shows.episodes.loaded.set, { value: 1, show: showFeed})
            return true

        } catch (error) {
            reportError(error)
            return false
        }
    },

    deleteShowFeedItems: async (showFeed)  => {
        const dbFeedFull = new PouchDB(DB_FEED_FULL)
        try {            
            const feeds = await dbFeedFull.find({
                selector: {
                    showURL: { $eq: showFeed.url }
                }
            })

            const deleteBulk = feeds.docs.map(f => { 
                return {
                    _id: f._id,
                    _rev: f._rev,
                    _deleted: true
                }
            })            
            
            await dbFeedFull.bulkDocs(deleteBulk)

            manuh.publish(topics.shows.episodes.deleted.set, { value: 1, show: showFeed })
            
        } catch (error) {
            reportError(error)
        }
    },

    prepareFeedItem: (feed, rssItem) => {        
        let durationSeconds = rssItem.itunes.duration
        
        if (rssItem.itunes.duration && rssItem.itunes.duration.match(":")) {
            // handle different duration types
            let durationArr = rssItem.itunes.duration.split(":")
            durationSeconds = 0
            if (durationArr.length == 3) {
                durationSeconds += parseInt(durationArr[2])
                durationSeconds += parseInt(durationArr[1])*60
                durationSeconds += parseInt(durationArr[0])*3600
            }
            if (durationArr.length == 2) {
                durationSeconds += parseInt(durationArr[1])
                durationSeconds += parseInt(durationArr[0])*60
            }
        }
        
        rssItem.image = httpsURL(rssItem.itunes.image)
        rssItem.author = rssItem.itunes.authors.map(a => a.name).join(' ')
        
        if (rssItem.enclosures[0]) {
            rssItem.url = rssItem.enclosures[0].url
            rssItem.mimeType = rssItem.enclosures[0].mimeType
            if (!rssItem.duration) {
                rssItem.duration = rssItem.enclosures[0].length
            }
        }
        rssItem.duration = durationSeconds
        rssItem.description = rssItem.description.replace(/<[^>]+>/g, '')
        rssItem.showName = feed.title
        rssItem.showURL = httpsURL(feed.url)
        rssItem.showImage = httpsURL(feed.image.url)
        
        rssItem._id = rssItem.id
        
        return rssItem
    },
    
    getLastUpdate: async (callback, skip=0, limit=30) => {
        // ** TEST PORPUSE ONLY
        // await new PouchDB(DB_FEED_FULL).destroy()
        // await new PouchDB(DB_FEED_WAITING).destroy()
        // -- ** TEST PORPUSE ONLY

        try {
            const dbFeedFull = new PouchDB(DB_FEED_FULL)
            const dbFeedWaiting = new PouchDB(DB_FEED_WAITING)
    
            // retrieve the last fetched feed items
            const feedDocsResp = await dbFeedFull.allDocs({"include_docs": true})        
            const waitingFeedsResp = await dbFeedWaiting.allDocs()
            
            let waitingFeeds = waitingFeedsResp.total_rows===0 ? [] : waitingFeedsResp.rows.map(i => i.id)
            
            if (feedDocsResp.total_rows === 0) {
                return callback([])
            }else{
                
                // remove from the result the items that are present on other lists (removed or waiting)
                const filteredFeed = feedDocsResp.rows.map(f => f.doc).filter(doc => waitingFeeds.indexOf(doc.id) == -1)
                
                filteredFeed.forEach(f => f.image = httpsURL(f.image))
                return callback(filteredFeed.filter(f => !f["_id"].match("_design")).sort((a,b) => new Date(b.published)-new Date(a.published)).splice(skip, limit))
            }
            
        } catch (error) {
            reportError(error)
        }

    },

    delete: async (feed) => {
        const dbFeedFull = new PouchDB(DB_FEED_FULL)
        try {
            const deletedRef = await dbFeedFull.remove(feed)
            return deletedRef //if the item is already removed, just return it
        } catch (error) {
            if (error.status === 404) {
                return null
            }
            reportError(error);                
        }
    },

    removeFromDeleted: async(feedId) => {
        const dbFeedRemoved = new PouchDB(DB_FEED_REMOVED)
        try {
            const doc = await dbFeedRemoved.get(feedId)
            const deletedRef = await dbFeedRemoved.remove(doc)
            return deletedRef.ok            

        } catch (error) {
            if (error.status === 404) {
                return null
            }
            reportError(error)
        }
    },


    moveToWaiting: async (feedId) => {
        const dbFeedWaiting = new PouchDB(DB_FEED_WAITING)
        try {
            const waitingRef = await dbFeedWaiting.get(feedId)
            return waitingRef //if the item is already removed, just return it
        } catch (error) {
            if (error.status === 404) {
                const waitingRef = {_id: feedId, id: feedId}
                await dbFeedWaiting.put(waitingRef) //add the item to removed database an return
                return waitingRef
            }else{
                reportError(error)
            }
        }
    },

    getWaitingList: async (callback) => {
        try {
            const dbFeedWaiting = new PouchDB(DB_FEED_WAITING)
            const dbFeedFull = new PouchDB(DB_FEED_FULL)
    
            const respWaitingIds = await dbFeedWaiting.allDocs()
            if (respWaitingIds.total_rows === 0) {
                return callback([])
            }
            const docsIds = respWaitingIds.rows.map(r => r.id)                        
            const respDocs = await dbFeedFull.allDocs({include_docs: true})        
            
            callback(respDocs.rows.map(r => r.doc)
                                .filter(d => docsIds.indexOf(d.id) != -1)
                                .sort((a,b) => new Date(b.published)-new Date(a.published)) )
            
        } catch (error) {
            reportError(error)
        }
    },

    removeFromWaiting: async(feedId) => {
        const dbFeedWaiting = new PouchDB(DB_FEED_WAITING)
        try {
            const doc = await dbFeedWaiting.get(feedId)
            const waitingRef = await dbFeedWaiting.remove(doc)
            return waitingRef.ok            

        } catch (error) {
            if (error.status === 404) {
                return null
            }
            reportError(error)
        }
    },

}

export default feedData
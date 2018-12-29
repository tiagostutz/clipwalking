import rssParser from 'react-native-rss-parser';
import PouchDB from 'pouchdb-react-native'
import { DB_FEED_FULL, DB_FEED_REMOVED, DB_FEED_WAITING } from '../config/variables'

const feedData = {
    fetch: (callback, skip=0, limit=10) => {
        fetch('https://www.npr.org/rss/podcast.php?id=510313')
        .then(response => response.text())
        .then(responseData => rssParser.parse(responseData))
        .then((rss, err) => {
            if (err) {
                return callback(null, err)
            }
            const normalizedResult = rss.items.map(item => {
                let durationSeconds = item.itunes.duration
                if (item.itunes.duration.match(":")) {
                    // handle different duration types
                    let durationArr = item.itunes.duration.split(":")
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
                
                item.image = item.itunes.image
                item.author = item.itunes.authors.map(a => a.name).join(' ')
                item.url = item.enclosures[0].url
                item.mimeType = item.enclosures[0].mimeType
                item.duration = durationSeconds
                item.description = item.description.replace(/<[^>]+>/g, '')
                item.showName = rss.title
                
                return item
            })
            return callback(normalizedResult.slice(skip, limit))
        });

    },
    getLastUpdate: async (callback) => {
        // ** TEST PORPUSE ONLY
        // await new PouchDB(DB_FEED_FULL).destroy()
        // await new PouchDB(DB_FEED_REMOVED).destroy()
        // await new PouchDB(DB_FEED_WAITING).destroy()
        // -- ** TEST PORPUSE ONLY

        const dbFeedFull = new PouchDB(DB_FEED_FULL)
        const dbFeedRemoved = new PouchDB(DB_FEED_REMOVED)
        const dbFeedWaiting = new PouchDB(DB_FEED_WAITING)

        // retrieve the last fetched feed items
        const feedDocsResp = await dbFeedFull.allDocs({include_docs: true})
        const removedFeedsResp = await dbFeedRemoved.allDocs()
        const waitingFeedsResp = await dbFeedWaiting.allDocs()

        let removedFeeds = removedFeedsResp.total_rows===0 ? [] : removedFeedsResp.rows.map(i => i.id)
        let waitingFeeds = waitingFeedsResp.total_rows===0 ? [] : waitingFeedsResp.rows.map(i => i.id)

        if (feedDocsResp.total_rows === 0) {
            // get last feed update and then remove from the result the items that are present on other lists (removed or waiting)
            feedData.syncFeed(rssItems => {
                const filteredFeed = rssItems.filter(rss => removedFeeds.indexOf(rss.id) == -1 && waitingFeeds.indexOf(rss.id) == -1)
                return callback(filteredFeed.sort((a,b) => new Date(b.published)-new Date(a.published)))
            })
        }else{
            
            // remove from the result the items that are present on other lists (removed or waiting)
            const filteredFeed = feedDocsResp.rows.map(f => f.doc).filter(doc => removedFeeds.indexOf(doc.id) == -1 && waitingFeeds.indexOf(doc.id) == -1)
            return callback(filteredFeed.sort((a,b) => new Date(b.published)-new Date(a.published)))
        }

    },

    syncFeed: (callback) => {
        const dbFeedFull = new PouchDB(DB_FEED_FULL)
        
        //fetches the full feed and checks whether the elements are present
        feedData.fetch(normalizedResult => {  

            // return the result and leave the database sync to be made in background
            callback(normalizedResult)
            
            normalizedResult.forEach(rssItem => {
                
                //if the ress item is no on the local store, insert it
                dbFeedFull.get(rssItem.id)
                    .catch(error => {
                        if (error.status === 404) {
                            rssItem._id = rssItem.id
                            dbFeedFull.put(rssItem).catch(error => {
                                console.error(error);                        
                            })
                        }
                    })
            })
                        
        })

    },

    moveToDeleted: async (feedId) => {
        const dbFeedRemoved = new PouchDB(DB_FEED_REMOVED)
        try {
            const deletedRef = await dbFeedRemoved.get(feedId)
            return deletedRef //if the item is already removed, just return it
        } catch (error) {
            if (error.status === 404) {
                const deletedRef = {_id: feedId, id: feedId}
                await dbFeedRemoved.put(deletedRef) //add the item to removed database an return
                return deletedRef
            }
        }
    },

    removeFromDeleted: async(feedId) => {
        const dbFeedRemoved = new PouchDB(DB_FEED_REMOVED)
        try {
            const doc = await dbFeedRemoved.get(feedId)
            const deletedRef = await dbFeedRemoved.remove(doc)
            return deletedRef.ok            

        } catch (error) {
            if (error.status !== 404) {
                console.error(error)
                return null
            }
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
            }
        }
    },

    getWaitingList: async (callback) => {
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
    },

    removeFromWaiting: async(feedId) => {
        const dbFeedWaiting = new PouchDB(DB_FEED_WAITING)
        try {
            const doc = await dbFeedWaiting.get(feedId)
            const waitingRef = await dbFeedWaiting.remove(doc)
            return waitingRef.ok            

        } catch (error) {
            if (error.status !== 404) {
                console.error(error)
                return null
            }
        }
    },

}

export default feedData
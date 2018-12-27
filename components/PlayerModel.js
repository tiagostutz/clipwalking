import { RhelenaPresentationModel } from 'rhelena';
import TrackPlayer from 'react-native-track-player';
import PouchDB from 'pouchdb-react-native'
import manuh from 'manuh'

import topics from '../config/topics'
import { DB_TRACK_POSITION } from '../config/variables'

export default class PlayerModel extends RhelenaPresentationModel {
    constructor() {
        super();

        this.currenTrackInfo = null
        this.playerReady = false
        
        // Initialize the player
        TrackPlayer.setupPlayer({playBuffer: 60}).then(async () => {
            this.playerReady = true
        });

        // listen for current track changed event
        manuh.unsubscribe(topics.episodes.list.select.set, "PlayModel")
        manuh.subscribe(topics.episodes.list.select.set, "PlayModel", async msg => {
            //if the current track set is the same that is playing, then pause it. Otherwise, load and play the new track set.
            if (this.currenTrackInfo && this.currenTrackInfo.id === msg.episode.id) {
                if (await TrackPlayer.getState() === TrackPlayer.STATE_PLAYING) { 
                    this.pause()
                }else{
                    this.play()
                }
            }else{
                
                this.currenTrackInfo = msg.episode
                const trackToPlay = {
                    "id": msg.episode.id,
                    "url": msg.episode.url,
                    "title": msg.episode.title,
                    "artist": msg.episode.author ? msg.episode.author : "Unknown artist",
                    "album": msg.episode.showName,
                    "artwork": msg.episode.image,
                    "description": msg.episode.description
                }
                
                this.play([trackToPlay])
            }
        })
    }
    
    async play(trackList) {
        
        const playAndPublish = async () => {
            
            manuh.publish(topics.player.actionBar.play.set, {
                value: 1,
                trackInfo: this.currenTrackInfo
            })
            return TrackPlayer.play()
        }

        if (!this.playerReady) {
            console.error("The player is not ready yet and hence cannot be used")            
            return
        }

        if (!trackList && !this.currenTrackInfo) {
            console.error("The `trackList` param cannot be empty. Please spicify a track to be played.")            
            return
        }else if(!trackList && this.currenTrackInfo){ //if it is just a "resume"
            return playAndPublish()
        }
        
        // before changing the track, pause the current track persisting the last position
        await this.pause()        
        // clear TrackPlayer queue
        await TrackPlayer.reset()
        // Adds tracks to the queue
        await TrackPlayer.add(trackList)
        
        const dbTrackPosition = new PouchDB(DB_TRACK_POSITION)
        try {
            const doc = await dbTrackPosition.get(trackList[0].id)                
            await playAndPublish()
            
            TrackPlayer.seekTo(doc.position) //resume from where it stopped
            
        } catch (error) {
            if (err.status === 404) { //if it is the first time this track is played
                dbTrackPosition.put({
                    "_id": trackList[0].id,
                    "position": 0
                })
                playAndPublish()              
            }else{
                console.error(err);                    
            }                
        }

    }

    async pause() {
        await TrackPlayer.pause()
        manuh.publish(topics.player.actionBar.play.set, {
            value: 0,
            trackInfo: this.currenTrackInfo
        })
        return this.persistCurrentTrackState()
    }

    async fastForwardByAmount(amount=15) {
        return this.seekTo(await TrackPlayer.getPosition()+amount)
    }
    async fastBackwardByAmount(amount=15) {
        return this.seekTo(await TrackPlayer.getPosition()-amount)
    }

    async persistCurrentTrackState() {
        const dbTrackPosition = new PouchDB(DB_TRACK_POSITION)
        const currentPlayerTrackID = await TrackPlayer.getCurrentTrack()    
        if (currentPlayerTrackID) {
            try {                
                const doc = await dbTrackPosition.get(currentPlayerTrackID)
                return dbTrackPosition.put({
                        "_id": currentPlayerTrackID,
                        "position": await TrackPlayer.getPosition(),
                        "_rev": doc._rev
                    });
            } catch (error) {
                if (error.status === 404) {
                    return dbTrackPosition.put({
                        "_id": currentPlayerTrackID,
                        "position": await TrackPlayer.getPosition(),
                    });
                }

                console.error(error);                
                return null
            }

        }
        return null
    }

    // NOT YET USED

    async next() {
        await this.persistCurrentTrackState()
        return TrackPlayer.skipToNext()
    }
    async previous() {
        await this.persistCurrentTrackState()
        return TrackPlayer.skipToPrevious()
    }
    async reset() {
        await this.persistCurrentTrackState()
        return TrackPlayer.reset()
    }

    async seekTo(position) {
        return TrackPlayer.seekTo(position)
    }
}
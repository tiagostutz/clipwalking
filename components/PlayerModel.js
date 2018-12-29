import { RhelenaPresentationModel } from 'rhelena';
import TrackPlayer from 'react-native-track-player';
import PouchDB from 'pouchdb-react-native'
import manuh from 'manuh'

import assetService from '../data/assets'
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
                try {                
                    if (await TrackPlayer.getState() === TrackPlayer.STATE_PLAYING) { 
                        this.pause()
                    }else{
                        this.play()
                    }
                } catch (error) {
                    console.error(error);                    
                }
            }else{
                
                this.currenTrackInfo = msg.episode
                assetService.storeAudio(msg.episode.url, audioPath => {
                    console.log('++++=== TRACK TO PLAY', audioPath);
                    
                    const trackToPlay = {
                        "id": msg.episode.id,
                        "url": audioPath,
                        "title": msg.episode.title,
                        "artist": msg.episode.author ? msg.episode.author : "Unknown artist",
                        "album": msg.episode.showName,
                        "artwork": msg.episode.image,
                        "description": msg.episode.description
                    }
                    
                    this.play([trackToPlay])
                })
                // notify that the buffer has started
                manuh.publish(topics.player.runtime.buffer.set, { value: 1, trackId: msg.episode.id})

            }
        })
    }

    clean() {
        manuh.unsubscribe(topics.episodes.list.select.set, "PlayModel")
    }
    
    async play(trackList) {
        try {
            const playAndPublish = async () => {
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
                if (error.status === 404) { //if it is the first time this track is played
                    dbTrackPosition.put({
                        "_id": trackList[0].id,
                        "position": 0
                    })
                    playAndPublish()              
                }else{
                    console.error(error);                    
                }                
            }
                        
        } catch (error) {
            console.error(error);                    
        }
    }

    async pause() {
        try {
            await TrackPlayer.pause()
            return this.persistCurrentTrackState()            
        } catch (error) {
            console.error(error);        
        }
    }

    async fastForwardByAmount(amount=15) {
        return this.seekTo(await TrackPlayer.getPosition()+amount)
    }
    async fastBackwardByAmount(amount=15) {
        return this.seekTo(await TrackPlayer.getPosition()-amount)
    }

    async persistCurrentTrackState() {
        try {
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
        } catch (error) {
            console.error(error);         
        }
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
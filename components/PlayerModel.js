import { RhelenaPresentationModel } from 'rhelena';
import TrackPlayer from 'react-native-track-player';
import PouchDB from 'pouchdb-react-native'
import manuh from 'manuh'

import { NativeModules } from 'react-native'

import assetService from '../data/assets'
import topics from '../config/topics'
import { DB_TRACK_POSITION } from '../config/variables'

const { clip } = NativeModules.AudioClipper

export default class PlayerModel extends RhelenaPresentationModel {
    constructor() {
        super();

        this.currenTrackInfo = null
        this.playerReady = false
        this.isPlaying = false
        this.isFloatingMode = false
        
        this.clipStartPosition = null        
        this.currentClip = null

        // Initialize the player
        TrackPlayer.setupPlayer({playBuffer: 60}).then(async () => {
            this.playerReady = true
        });

        manuh.unsubscribe(topics.player.runtime.play.set, "PlayModel")
        manuh.subscribe(topics.player.runtime.play.set, "PlayModel", async msg => {
            this.isPlaying = msg.value === 1            
        })

        // listen for current track changed event
        manuh.unsubscribe(topics.episodes.list.select.set, "PlayModel")
        manuh.subscribe(topics.episodes.list.select.set, "PlayModel", async msg => {
            //if the current track set is the same that is playing, then pause it. Otherwise, load and play the new track set.
            if (this.currenTrackInfo && this.currenTrackInfo.id === msg.episode.id) {
                try {                                 
                    const currentTrackState = await TrackPlayer.getState()   
                    if (currentTrackState === TrackPlayer.STATE_PLAYING || currentTrackState === TrackPlayer.STATE_BUFFERING) { 
                        this.pause()
                    }else{
                        this.play()
                    }
                } catch (error) {
                    console.error(error);                    
                }
            }else{
                
                this.currenTrackInfo = msg.episode
                
                assetService.storeAudio(msg.episode.url, ({audioPath, originalPath}) => {  
                    console.log('+++== Store Audio', audioPath, originalPath);
                    
                    this.currenTrackInfo.audioPath = audioPath  
                    this.currenTrackInfo.originalPath = originalPath                
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

    toggleMode() {
        this.isFloatingMode = !this.isFloatingMode
    }
    
    async play(trackList) {
        try {
            const playAndPublish = () => {
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

    async toggleCut() {
        if (!this.clipStartPosition && !this.currentClip) {
            this.clipStartPosition = await TrackPlayer.getPosition()
        }else if(this.clipStartPosition && !this.currentClip) {
            this.currentClip = {
                start: parseInt(Math.floor(this.clipStartPosition)-1),
                end: parseInt(Math.floor(await TrackPlayer.getPosition())+1)
            }            
        }else{
            this.clipStartPosition = null
            this.currentClip = null
        }
    }

    async playClip() {

    }

    async saveClip() {
        console.log('+++ === clips',this.currentClip.start, this.currentClip.end)
        
        clip(this.currenTrackInfo.audioPath, this.currentClip.start, this.currentClip.end, (error, response) => {
            console.log('++++====', error, response);            
        })
    }

    async discardClip() {

    }

    async shareClip() {
        if (!this.currentClip) {
            return
        }
    }
    // NOT YET USED


    async seekToByAmount(amount=15) {
        return this.seekTo(await TrackPlayer.getPosition()+amount)
    }
   
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
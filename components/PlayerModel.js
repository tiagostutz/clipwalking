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

        this.currentTrackInfo = null
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
            if (this.currentTrackInfo && this.currentTrackInfo.id === msg.episode.id) {
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
                
                this.playEpisode(msg.episode)
            }
        })
    }

    clean() {
        manuh.unsubscribe(topics.episodes.list.select.set, "PlayModel")
    }

    toggleMode() {
        this.isFloatingMode = !this.isFloatingMode
    }
    
    async playEpisode(episode) {
        this.currentTrackInfo = episode
                
        assetService.storeAudio(this.currentTrackInfo.url, ({audioPath, originalPath}) => {  
            console.log('+++== Store Audio', audioPath, originalPath);
            
            this.currentTrackInfo.audioPath = audioPath  
            this.currentTrackInfo.originalPath = originalPath                
            const trackToPlay = {
                "id": this.currentTrackInfo.id,
                "url": audioPath,
                "title": this.currentTrackInfo.title,
                "artist": this.currentTrackInfo.author ? this.currentTrackInfo.author : "Unknown artist",
                "album": this.currentTrackInfo.showName,
                "artwork": this.currentTrackInfo.image,
                "description": this.currentTrackInfo.description
            }
            
            this.play([trackToPlay])
        })
        // notify that the buffer has started
        manuh.publish(topics.player.runtime.buffer.set, { value: 1, trackId: episode.id})

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
    
            if (!trackList && !this.currentTrackInfo) {
                console.error("The `trackList` param cannot be empty. Please spicify a track to be played.")            
                return
            }else if(!trackList && this.currentTrackInfo){ //if it is just a "resume"
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
            const lastPosition = await TrackPlayer.getPosition()
            await TrackPlayer.pause()
            return this.persistCurrentTrackState(lastPosition-3)            
        } catch (error) {
            console.error(error);        
        }
    }

    async seekToByAmount(amount=15) {
        return TrackPlayer.seekTo(await TrackPlayer.getPosition()+amount)
    }

    async persistCurrentTrackState(lastPosition) {
        try {
            const dbTrackPosition = new PouchDB(DB_TRACK_POSITION)
            const currentPlayerTrackID = await TrackPlayer.getCurrentTrack()    
            if (currentPlayerTrackID) {
                try {                
                    const doc = await dbTrackPosition.get(currentPlayerTrackID)
                    return dbTrackPosition.put({
                            "_id": currentPlayerTrackID,
                            "position": lastPosition,
                            "_rev": doc._rev
                        });
                } catch (error) {
                    if (error.status === 404) {
                        return dbTrackPosition.put({
                            "_id": currentPlayerTrackID,
                            "position": lastPosition,
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

    async resetClipper() {
        this.clipStartPosition = null
        this.currentClip = null
    }

    async toggleCut() {
        if (!this.clipStartPosition && !this.currentClip) { //not cutting and not "cutted"
            this.clipStartPosition = await TrackPlayer.getPosition()
            this.clipStartPosition = this.clipStartPosition

        }else if(this.clipStartPosition && !this.currentClip) { //"cutted", can share, delete, save, etc
            await this.pause()
            const clipStopPosition = await TrackPlayer.getPosition()
            this.currentClip = {
                start: Math.floor(this.clipStartPosition),
                end: Math.floor(clipStopPosition + 1)
            }            

            clip(this.currentTrackInfo.audioPath, this.currentClip.start, this.currentClip.end, async (error, response) => {
                if (error) {
                    console.error(error);                
                    return
                }
                this.lastAudioClipFilePath = response.filePath
    
                await TrackPlayer.reset()
                // Adds tracks to the queue
                
                const trackToPlay = {
                    "id": "lastClip",
                    "url": "file://"+this.lastAudioClipFilePath,
                    "title": this.currentTrackInfo.title + " CLIP",
                    "artist": this.currentTrackInfo.author ? this.currentTrackInfo.author : "Unknown artist",
                    "album": this.currentTrackInfo.showName,
                    "artwork": this.currentTrackInfo.image,
                    "description": this.currentTrackInfo.description
                }
                console.log('++===', JSON.stringify(trackToPlay))
                
                await TrackPlayer.add([trackToPlay])
                await TrackPlayer.play()
                return TrackPlayer.pause()
            })

        }else{ //after
            this.resetClipper()
        }
    }

    async saveClip() {
        this.resetClipper()
        this.playEpisode(this.currentTrackInfo)
    }

    async discardClip() {
        this.resetClipper()
        this.playEpisode(this.currentTrackInfo)
    }

    async shareClip() {
        if (!this.currentClip) {
            return
        }
        this.resetClipper()
        this.playEpisode(this.currentTrackInfo)
    }

    
}
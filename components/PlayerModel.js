import { RhelenaPresentationModel } from 'rhelena';
import TrackPlayer from 'react-native-track-player';
import manuh from 'manuh'
import SplashScreen from 'react-native-splash-screen'

import { NativeModules, Share } from 'react-native'

import assetService from '../data/assets'
import trackService from '../data/tracks'
import clipService from '../data/clips'
import appStateStore from '../data/appStateStore'

import topics from '../config/topics'

import { reportError } from '../utils/reporter'
import t from '../locales';

const { clip } = NativeModules.AudioClipper

export default class PlayerModel extends RhelenaPresentationModel {
    constructor() {
        super();

        this.currentTrackInfo = null
        this.playerReady = false
        this.isPlaying = false
        this.isFloatingMode = false
        this.lastAudioClipFilePath = null
        
        this.clipStartPosition = null        
        this.currentClip = null

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
                    reportError(error);                    
                }
            }else{
                
                this.playEpisode(msg.episode)
            }
        })
    }

    //restore the Player state from the previous interaction
    restoreLastPlayerState() {
        this.playerReady = false
        appStateStore.getLastOpenedTrack(async state => {

            // Initialize the player
            TrackPlayer.setupPlayer({playBuffer: 60}).then(async () => {
                if (!state) {
                    this.playerReady = true
                    return SplashScreen.hide()
                }
                               
                this.isFloatingMode = state.isFloatingMode
                await this.loadEpisode(state.episode)
    
                //force a pause
                setTimeout(_ => { 
                    manuh.publish(topics.player.runtime.play.set, { trackId: state.episode.id, value: 0} )
                    this.playerReady = true
                    SplashScreen.hide()    
                }, 700)            
            });
        })
    }

    clean() {
        manuh.unsubscribe(topics.episodes.list.select.set, "PlayModel")
        manuh.unsubscribe(topics.player.runtime.play.set, "PlayModel")
    }

    publishPlayerUpdate() {
        manuh.publish(topics.player.runtime.seekTo.set, { currentTrackInfo: this.currentTrackInfo })
    }

    toggleMode() {
        this.isFloatingMode = !this.isFloatingMode
        appStateStore.storePlayerState({isFloatingMode: this.isFloatingMode})
    }
    
    async loadEpisode(episode) {
        this.currentTrackInfo = episode
            
        return new Promise(async (resolve, reject) => {            
            assetService.storeAudio(this.currentTrackInfo.url, async (result, err) => {  
                if (err) {
                    reportError(err)
                    return reject(err)
                }
                const { audioPath, originalPath } = result

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
                
                let doc = await trackService.get(trackToPlay.id)            
                if (!doc) {
                    doc = {
                        "_id": trackToPlay.id,
                        "position": 0
                    }
                    await trackService.put(doc)
                }
                await TrackPlayer.reset()                    
                await TrackPlayer.add([trackToPlay])
                await TrackPlayer.play()
                await TrackPlayer.pause()
                await TrackPlayer.seekTo(doc.position) //resume from where it stopped
                this.publishPlayerUpdate()                
                resolve(trackToPlay)                
            })
            // notify that the buffer has started
            manuh.publish(topics.player.runtime.buffer.set, { value: 1, trackId: episode.id})
        })
    }

    async playEpisode(episode) {
        this.pause()
        return new Promise(async (resolve, reject) => {
            try {
                await this.loadEpisode(episode)
                resolve(await this.play())
            } catch (error) {
                reportError(error)
                reject(error)
            }
        })
    }

    async play(loadedEpisode) {
        if (!loadedEpisode && !this.currentTrackInfo) {
            return reportError("The `loadedEpisode` param cannot be empty. Please spicify a track to be played.")            
        }
        if (!this.playerReady) {
            return reportError("The player is not ready yet and hence cannot be used")            
        }

        this.publishPlayerUpdate()
        return TrackPlayer.play()         
    }

    async pause() {
        try {
            const lastPosition = await TrackPlayer.getPosition()
            await TrackPlayer.pause()
            this.publishPlayerUpdate()
            return this.persistCurrentTrackState(lastPosition)            
        } catch (error) {
            reportError(error);        
        }
    }

    async seekToByAmount(amount=15) {
        await TrackPlayer.seekTo(await TrackPlayer.getPosition()+amount)
        this.publishPlayerUpdate()
    }

    async persistCurrentTrackState(lastPosition) {
        try {
            const currentPlayerTrackID = await TrackPlayer.getCurrentTrack()    
            if (currentPlayerTrackID) {
                let doc = await trackService.get(currentPlayerTrackID)
                if (doc) {
                    return trackService.put({
                        "_id": currentPlayerTrackID,
                        "position": lastPosition,
                        "_rev": doc._rev
                    })
                }else{
                    return trackService.put({
                        "_id": currentPlayerTrackID,
                        "position": lastPosition,
                    })
                }
    
            }
            return null            
        } catch (error) {
            reportError(error);         
        }
        
    }

    async resetClipper() {
        this.lastAudioClipFilePath = null
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
            this.publishIsWorking(1)
            clip(this.currentTrackInfo.audioPath, this.currentClip.start, this.currentClip.end, async (error, response) => {
                if (error) {
                    reportError(error);                
                    return
                }
                this.lastAudioClipFilePath = "file://"+response.filePath
    
                await TrackPlayer.reset()
                // Adds tracks to the queue
                
                const trackToPlay = {
                    "id": "lastClip",
                    "url": this.lastAudioClipFilePath,
                    "title": this.currentTrackInfo.title + " CLIP",
                    "artist": this.currentTrackInfo.author ? this.currentTrackInfo.author : "Unknown artist",
                    "album": this.currentTrackInfo.showName,
                    "artwork": this.currentTrackInfo.image,
                    "description": this.currentTrackInfo.description
                }
                
                await TrackPlayer.add([trackToPlay])
                await TrackPlayer.play()
                this.publishPlayerUpdate()
                this.publishIsWorking(0)
            })

        }else{ //after
            this.resetClipper()
        }
    }

    async saveClip() {
        let clip = clipService.put({
            trackInfo: this.currentTrackInfo,
            filePath: this.lastAudioClipFilePath
        })
        if (clip) {
            //saved!
            
        }else{
            //error saving

        }
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
        await Share.share({
            url: this.lastAudioClipFilePath,
            title: this.currentTrackInfo.title
        }, {
            // Android only:
            dialogTitle: this.currentTrackInfo.title,
        })
        this.resetClipper()
        await this.playEpisode(this.currentTrackInfo)
        this.pause()
    }

    publishIsWorking(value) {
        manuh.publish(topics.loader.activity.status.set, { value: value, text: t('clipping')})
    }
    
}
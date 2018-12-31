import { RhelenaPresentationModel } from 'rhelena';
import TrackPlayer from 'react-native-track-player'
import { formatElapsed } from '../utils/text'

export default class ProgressMarModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.isSliding = false
        this.loaded = false
        
        this.trackPositionRate = 0
        this.elapsed = 0
        this.remaining = 0

        setTimeout(() => {
            this.updateProgress()
        }, 100)
        this.updateHandler = setInterval(() => this.updateProgress(), 1000)
    }
    
    clean(){
        clearInterval(this.updateHandler)
    }

    async updateProgress() {
        const duration = await TrackPlayer.getDuration()
        if (isNaN(duration)) {
            this.trackPositionRate = 0   
            this.loaded = false         
            return
        }

        this.trackPositionRate = await TrackPlayer.getPosition() / duration
        if (isNaN(this.trackPositionRate)) {
            this.trackPositionRate = 0            
            this.loaded = false
            return
        }
        
        this.loaded = true
        

        this.elapsed = formatElapsed(duration*this.trackPositionRate)
        this.remaining = formatElapsed(duration*(1-this.trackPositionRate))

    }

    startSliding() {
        this.isSliding = true
    }

    stopSliding() {
        this.isSliding = false
    }

    async setTrackPosition(ratio) {
        this.trackPositionRate = ratio
        const duration = await TrackPlayer.getDuration()
        TrackPlayer.seekTo(duration * ratio)
    }
}
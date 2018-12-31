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
            this.loaded = true
        }, 100)
        setInterval(() => this.updateProgress(), 1000)
    }

    async updateProgress() {
        const duration = await TrackPlayer.getDuration()
        this.trackPositionRate = await TrackPlayer.getPosition() / duration
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
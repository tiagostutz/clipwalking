import { RhelenaPresentationModel } from 'rhelena';
import manuh from 'manuh'
import topics from '../config/topics'

export default class NowPlayingSignModel extends RhelenaPresentationModel {

    constructor({episode}) {
        super();

        this.episode = episode
        this.isPlaying = false
        this.isBuffering = false

        // listen for play/pause events
        manuh.unsubscribe(topics.player.runtime.play.set,`NowPlayingSignModel-${this.episode.id}`)
        manuh.subscribe(topics.player.runtime.play.set, `NowPlayingSignModel-${this.episode.id}`, msg => {
            if (msg.trackId === episode.id) {
                this.isPlaying = msg.value == 1 // 1 = play turned on, 0 = play turned off (pause)
            }else{
                this.isPlaying = false
            }
        })

        // listen for buffering events
        manuh.unsubscribe(topics.player.runtime.buffer.set,`NowPlayingSignModel-${this.episode.id}`)
        manuh.subscribe(topics.player.runtime.buffer.set, `NowPlayingSignModel-${this.episode.id}`, msg => {
            if (msg.trackId === episode.id) {
                this.isBuffering = msg.value == 1 // 1 = play turned on, 0 = play turned off (pause)
            }else{
                this.isBuffering = false
            }
        })
    }

    clean() {
        manuh.unsubscribe(topics.player.runtime.play.set,`NowPlayingSignModel-${this.episode.id}`)
        manuh.unsubscribe(topics.player.runtime.buffer.set,`NowPlayingSignModel-${this.episode.id}`)
    }
}
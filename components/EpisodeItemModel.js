import { RhelenaPresentationModel, globalState } from 'rhelena';
import manuh from 'manuh'
import topics from '../config/topics'
import feedService from '../data/feed';

export default class EpisodeItemModel extends RhelenaPresentationModel {
    constructor({episode}) {
        super();
        this.episode = episode
    }

    selectEpisode() {
        globalState.playerOpened = true
        manuh.publish(topics.episodes.list.select.set, { episode: this.episode })
    }

    removeEpisode() {
        const res = feedService.delete(this.episode)
        if (res) {
            manuh.publish(topics.episodes.list.remove.set, { episode: this.episode })
            this.episode = null
        }
    }

    moveEpisodeToWaitingList() {
        const res = feedService.moveToWaiting(this.episode.id)
        if (res) {
            manuh.publish(topics.waiting.list.add.set, { episode: this.episode })
            this.episode = null
        }
    }
}
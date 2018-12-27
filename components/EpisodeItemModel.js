import { RhelenaPresentationModel } from 'rhelena';
import manuh from 'manuh'
import topics from '../config/topics'

export default class EpisodeItemModel extends RhelenaPresentationModel {
    constructor({episode}) {
        super();
        this.episode = episode
    }

    selectEpisode() {
        manuh.publish(topics.episodes.list.select.set, { episode: this.episode })
    }
}
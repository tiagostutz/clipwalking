import { RhelenaPresentationModel } from 'rhelena';
import manuh from 'manuh'

import feedService from '../../data/feed';
import topics from '../../config/topics'


export default class WaitingScreenModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.waitingData = []
        feedService.getWaitingList((result, err) => {
            if (err) {
                return console.error(err);                
            }
            this.waitingData = result
        })

        manuh.unsubscribe(topics.waiting.list.add.set, "WaitingScreenModel")
        manuh.subscribe(topics.waiting.list.add.set, "WaitingScreenModel", msg => {
            let newWaitingList = this.waitingData.slice()
            newWaitingList.push(msg.episode)
            this.waitingData = newWaitingList.sort((a,b) => new Date(b.published)-new Date(a.published))
        })

        manuh.unsubscribe(topics.episodes.list.remove.set, "WaitingScreenModel")
        manuh.subscribe(topics.episodes.list.remove.set, "WaitingScreenModel", msg => {
            feedService.removeFromWaiting(msg.episode.id)
        })
    }

    clean() {
        manuh.unsubscribe(topics.waiting.list.add, "WaitingScreenModel")
    }
}
import { RhelenaPresentationModel, globalState } from 'rhelena';
import manuh from 'manuh'

import feedService from '../../data/feed';
import topics from '../../config/topics'


export default class WaitingScreenModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.waitingData = []
        this.playerActive = globalState.playerOpened
        
        manuh.subscribe(topics.episodes.list.select.set, "WaitingScreenModel", _ => {
            this.playerActive = true
        })
                
        manuh.subscribe(topics.waiting.list.add.set, "WaitingScreenModel", msg => {
            let newWaitingList = this.waitingData.slice()
            newWaitingList.push(msg.episode)
            this.waitingData = newWaitingList.sort((a,b) => new Date(b.published)-new Date(a.published))
        })
                
        manuh.subscribe(topics.episodes.list.remove.set, "WaitingScreenModel", msg => {
            feedService.removeFromWaiting(msg.episode.id)
        })

        feedService.getWaitingList((result, err) => {
            if (err) {
                return reportError(err);                
            }
            this.waitingData = result
        })
    }
    
    clean() {
        manuh.unsubscribe(topics.episodes.list.select.set, "WaitingScreenModel")
        manuh.unsubscribe(topics.waiting.list.add.set, "WaitingScreenModel")
        manuh.unsubscribe(topics.episodes.list.remove.set, "WaitingScreenModel")
    }
}
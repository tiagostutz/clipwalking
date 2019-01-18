import { RhelenaPresentationModel, globalState } from 'rhelena';
import manuh from 'manuh'

import feedService from '../../data/feed'
import topics from '../../config/topics'
import appStateStore from '../../data/appStateStore'

import t from '../../locales'

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

        manuh.publish(topics.loader.activity.status.set, { value: 1, text: t('loading')})
        feedService.getWaitingList(async (result, err) => {
            if (err) {
                return reportError(err);                
            }              
                
            this.waitingData = result
            manuh.publish(topics.loader.activity.status.set, { value: 0 })
        })

        appStateStore.getLastOpenedTrack(async state => {
            if (state) {
                this.playerActive = true
            }
        })

    }
    
    clean() {
        manuh.unsubscribe(topics.episodes.list.select.set, "WaitingScreenModel")
        manuh.unsubscribe(topics.waiting.list.add.set, "WaitingScreenModel")
        manuh.unsubscribe(topics.episodes.list.remove.set, "WaitingScreenModel")
    }
}
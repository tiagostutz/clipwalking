import { RhelenaPresentationModel } from 'rhelena';
import manuh from 'manuh'
import topics from '../config/topics'

export default class LoadingModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.isWorking = false
        this.text = null

        manuh.subscribe(topics.loader.activity.status.set, "LoadingModel", msg => { 
            this.isWorking = msg.value == 1
            this.text = msg.text
        })
    }

    clean() {
        manuh.unsubscribe(topics.loader.activity.status.set, "LoadingModel")
    }
}
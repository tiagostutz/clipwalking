import { RhelenaPresentationModel, globalState } from 'rhelena';
import manuh from 'manuh'
import topics from '../config/topics'

export default class LoadingModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.isWorking = false
        this.text = null

        manuh.subscribe(topics.loader.activity.status.set, "LoadingModel", msg => {       
            globalState.isWorking = msg.value
            setTimeout(() => {
                if (globalState.isWorking === 1) {
                    this.isWorking = true
                    this.text = msg.text  
                }else{
                    this.isWorking = false
                }
            }, 200)            
        })
    }

    clean() {
        manuh.unsubscribe(topics.loader.activity.status.set, "LoadingModel")
    }
}
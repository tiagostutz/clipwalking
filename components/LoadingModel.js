import { RhelenaPresentationModel, globalState } from 'rhelena';
import manuh from 'manuh'
import topics from '../config/topics'
import { reportError } from '../utils/reporter'

export default class LoadingModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.isWorking = false
        this.text = null
        this.cancelHandler = null

        manuh.subscribe(topics.loader.activity.status.set, "LoadingModel", msg => {       
            globalState.isWorking = msg.value
            globalState.cancelHandler = msg.cancelHandler
            setTimeout(() => {
                if (globalState.isWorking === 1) {
                    this.isWorking = true
                    this.text = msg.text  
                    this.cancelHandler = globalState[msg.cancelHandler]
                }else{
                    this.isWorking = false
                }
            }, 200)            
        })
    }

    cancel() {
        this.cancelHandler.cancel(err => {
            if (err) {
                reportError("[LoadingModel][cancel]:: " + err)
            }
        })
    }

    clean() {
        manuh.unsubscribe(topics.loader.activity.status.set, "LoadingModel")
    }
}
import { RhelenaPresentationModel, globalState } from 'rhelena';
import manuh from 'manuh'
import showData from '../../data/shows'
import topics from '../../config/topics'

export default class ShowListItemModel extends RhelenaPresentationModel {
    constructor({show}) {
        super();

        this.show = show
    }

    selectShow() {
        globalState.currenShow = this.show
    }

    async removeShow() {        
        const res = await showData.delete(this.show)
        if (res) {
            manuh.publish(topics.shows.list.remove.set, { show: this.show })
            this.show = null
        }
    }
}
import { RhelenaPresentationModel, globalState } from 'rhelena';
import manuh from 'manuh'
import showData from '../../data/shows'
import topics from '../../config/topics'
import t from '../../locales'

export default class ShowListItemModel extends RhelenaPresentationModel {
    constructor({show}) {
        super();

        this.show = show
    }

    selectShow() {
        globalState.currenShow = this.show
    }

    async removeShow() { 
        manuh.publish(topics.loader.activity.status.set, { value: 1, text: t('removing show')})       
        const showClone  = JSON.parse(JSON.stringify(this.show))
        await showData.delete(this.show)
        this.show = null
        manuh.publish(topics.shows.list.remove.set, { show: this.show })
        manuh.publish(topics.loader.activity.status.set, { value: 0})
        
        manuh.publish(topics.shows.selected.deleted.set, { value: 1, showRSS: showClone })
    }
}
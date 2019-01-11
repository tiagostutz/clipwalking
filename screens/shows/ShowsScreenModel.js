import { RhelenaPresentationModel } from 'rhelena';
import manuh from 'manuh'
import showData from '../../data/shows';
import topics from '../../config/topics'
import t from '../../locales'

export default class ShowsScreenModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.shows = []

        showData.getAll(result => this.shows = result)        
    }

    async addNewShow(rssURL) {        

        const show = await showData.get(rssURL)

        if (!show) {
            manuh.publish(topics.loader.activity.status.set, { value: 1, text: t('fetching show info')})
            showData.resolveShowInfo(rssURL, async result => { //fetch the remote rss feed info
                showData.getAll(resultRefreshed => {  //refresh the show list
                    this.shows = resultRefreshed
                    manuh.publish(topics.loader.activity.status.set, { value: 0 })
                 })
            })
        }
        
    }

    async showAlreadyAdded(rssURL) {
        const show = await showData.get(rssURL)        
        return show
    }
}
import { RhelenaPresentationModel, globalState } from 'rhelena';
import manuh from 'manuh'
import showData from '../../data/shows';
import topics from '../../config/topics'
import t from '../../locales'
import { httpsURL } from '../../utils/text'

export default class ShowsScreenModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.shows = []
        this.playerActive = globalState.playerOpened
        
        manuh.subscribe(topics.episodes.list.select.set, "ShowsScreenModel", _ => {
            this.playerActive = true
        })
        
        manuh.subscribe(topics.shows.list.remove.set, "ShowsScreenModel", () => {
            showData.getAll(result => this.shows = result)        
        })

        showData.getAll(result => this.shows = result)        
    }

    clean() {
        manuh.unsubscribe(topics.episodes.list.select.set, "ShowsScreenModel")
        manuh.unsubscribe(topics.shows.list.remove.set, "ShowsScreenModel")
    }

    async addNewShow(rssURLParam) {        
        const rssURL = httpsURL(rssURLParam)
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

    async showAlreadyAdded(rssURLParam) {
        const rssURL = httpsURL(rssURLParam)

        const show = await showData.get(rssURL)        
        return show
    }
}
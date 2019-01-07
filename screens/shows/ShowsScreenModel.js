import { RhelenaPresentationModel } from 'rhelena';
import manuh from 'manuh'
import feedData from '../../data/feed';
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
            feedData.fetchShowInfo(rssURL, async result => {
                let resultEnhanced = result
                resultEnhanced._id = rssURL
                resultEnhanced.rssURL = rssURL
                await showData.put(result)
                await showData.getAll(result => this.shows = result) //refresh
                manuh.publish(topics.loader.activity.status.set, { value: 0 })
            })
        }
        
    }
}
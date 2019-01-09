import { RhelenaPresentationModel } from 'rhelena';
import feedService from '../../data/feed';
import manuh from 'manuh'
import topics from '../../config/topics'

export default class FeedScreenModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.feedData = []
        feedService.getLastUpdate((result, err) => {
            if (err) {
                return console.error(err)                
            }
            this.feedData = result
        })

        manuh.subscribe(topics.feed.sync.finished.set, "FeedScreenModel", ({value}) => {
            if (value === 1) {
                feedService.getLastUpdate((result, err) => {
                    if (err) {
                        return console.error(err)                
                    }
                    console.log('++++>>>>', this.result);
                    
                    this.feedData = result
                })
            }
        })
    }
}
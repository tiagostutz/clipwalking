import { RhelenaPresentationModel } from 'rhelena';
import feedService from '../../data/feed';

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
    }
}
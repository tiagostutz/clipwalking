import { RhelenaPresentationModel } from 'rhelena';
import feedService from '../../data/feed';

export default class FeedScreenModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.feedData = []
        feedService.load((result, err) => {
            if (err) {
                return console.error("Erro ao recuperar... panic!");                
            }
            this.feedData = result
        })
    }
}
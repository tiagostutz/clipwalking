import { RhelenaPresentationModel, globalState } from 'rhelena';
import topics from '../../config/topics'

export default class ShowEpisodesModel extends RhelenaPresentationModel {
    constructor() {
        super();

        this.show = globalState.currenShow
    }

}
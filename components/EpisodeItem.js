import React, { Component } from 'react'
import { attachModelToView } from 'rhelena'

import {
    RkText,
    RkCard,
    RkStyleSheet,
} from 'react-native-ui-kitten'
import Icon from 'react-native-vector-icons/Ionicons'
import { ICON_PREFIX } from '../config/variables'
import moment from 'moment'

import {
    Image,
    View,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';

import { formatDuration } from '../utils/text'
import t from '../locales'

import Swipeable from 'react-native-gesture-handler/Swipeable';

import manuh from 'manuh'
import topics from '../config/topics'

import NowPlayingSign from './NowPlayingSign'

import EpisodeItemModel from './EpisodeItemModel'

import { Colors } from '../config/theme'

import imageCacheHoc from 'react-native-image-cache-hoc';
const CacheableImage = imageCacheHoc(Image);
export default class EpisodeItem extends Component {

    constructor(props) {
        super(props)

        this.swipe = null
        manuh.subscribe(topics.episodes.list.scrolling.set, this.props.episode.id, ({value}) => {
            if (value === 1) {
                this.closeSwipe()
            }
        })
    }

    componentWillMount() {
        attachModelToView(new EpisodeItemModel(this.props), this)
    }

    onCardPress = () => {         
        if (!this.isRowOpened)  {
            this.viewModel.selectEpisode()
        } 
    }

    onShowSummaryPress = () => console.log('=+++==>')

    closeSwipe() {
        if (this.swipe) {
            this.swipe.close()
        }
    }
    
    render() { 

        if (!this.state.episode) return <View></View>

        const episodeImage = this.state.episode.image ? this.state.episode.image : this.state.episode.showImage

        let rightButtons = []
        if(!this.props.disableAddLater) {
            rightButtons.push(<TouchableOpacity key={1} style={[styles.backButton, styles.backAddButton]} onPress={() => this.viewModel.moveEpisodeToWaitingList()}>
                <View style={styles.innerButtonView}>
                    <Icon name={`${ICON_PREFIX}add`} size={25} color="white" style={{alignSelf: "center"}} />
                    <RkText style={styles.backButtonLabel}>{t('later')}</RkText>
                </View>
            </TouchableOpacity>)
        }

        if(!this.props.disableRemove) {
            rightButtons.push(<TouchableOpacity key={2} style={[styles.backButton, styles.backDeleteButton]} onPress={() => this.viewModel.removeEpisode()}>
                <View style={styles.innerButtonView}>
                    <Icon name={`${ICON_PREFIX}trash`} size={25} color="white" />
                    <RkText style={styles.backButtonLabel}>{t('delete')}</RkText>
                </View>
            </TouchableOpacity>)
        }

        const rightButtonsView = (
            <View style={{ width: 64*rightButtons.length, marginTop: 10, marginBottom: 10, flexDirection: 'row' }}>
                { rightButtons }
            </View>
        )
        
        return (
            <Swipeable renderRightActions={() => rightButtonsView} ref={ref => this.swipe = ref}>
                <View style={styles.card}>
                    <TouchableHighlight onPress={this.onCardPress}>
                        <RkCard rkType='horizontal'>
                            { episodeImage && <CacheableImage rkCardImg source={{uri: episodeImage.replace("http://","https://")}} permanent={false} /> }
                            <View rkCardContent  style={{flexDirection: "column", justifyContent: "space-between", flex: 1}}>
                                <View>
                                    <View style={styles.showDate}>
                                        <View style={{flexDirection: "row"}}>
                                            <RkText rkType='secondary6 hintColor'>
                                                {formatDuration(this.state.episode.duration)}      
                                            </RkText>
                                            <NowPlayingSign episode={this.state.episode} />
                                        </View>
                                        <RkText rkType='secondary6 hintColor'>
                                            {moment(this.state.episode.published).fromNow()}
                                        </RkText>
                                    </View>
                                    <RkText numberOfLines={3} rkType='header4'>{this.state.episode.title}</RkText>
                                    
                                    <TouchableOpacity onPress={this.onShowSummaryPress}>
                                        <View style={{flexDirection: "row"}}>
                                        <RkText style={{color: Colors.primary}} numberOfLines={1} rkType='secondary3'>{t('summary and notes')}</RkText>
                                        <Icon name={`${ICON_PREFIX}arrow-forward`} style={{marginLeft: 4, marginTop: 3}} size={12} color={Colors.primary} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    { this.props.displayShowName && <RkText style={styles.showName} numberOfLines={1} rkType='secondary6'>{this.state.episode.showName}</RkText> }     
                                    <View style={styles.separatorBorder}></View>
                                </View>
                            </View>
                        </RkCard>
                    </TouchableHighlight>  
                </View>
            </Swipeable>    
        )
    }
}


const styles = RkStyleSheet.create(theme => ({
    card: {
      marginVertical: 6,
    },
    post: {
      marginTop: 6,
    },
  
    backButton: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    backButtonLabel: {
        color: "white", 
        fontSize: 12,
    },
    innerButtonView: {
        alignItems: 'center', 
        justifyContent: 'center'
    },
    backAddButton: {
        backgroundColor: 'blue',
    },
    backDeleteButton: {
        backgroundColor: 'red',        
    },
    separatorBorder: {
      borderBottomWidth: 1, 
      marginTop: 8, 
      borderColor: "#C7C7C7"
    },
    showName: {
      marginTop: 6,
      color: "#999"
    },
    showDate: {
      marginBottom: 4,
      flexDirection: "row",
      justifyContent: "space-between"
    }
  
  }))
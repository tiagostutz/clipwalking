import React, { Component } from 'react'
import { attachModelToView } from 'rhelena'

import {
    RkText,
    RkCard,
    RkStyleSheet,
} from 'react-native-ui-kitten';
import { SwipeRow } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import {
    Image,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Text
} from 'react-native';
  
import { formatDuration } from '../utils/text'
import t from '../locales'
import { ICON_PREFIX } from '../config/variables'

import NowPlayingSign from './NowPlayingSign'

import EpisodeItemModel from './EpisodeItemModel'

export default class EpisodeItem extends Component {

    constructor(props) {
        super(props)
        this.isRowOpened = false
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

    render = () => (
        
        <SwipeRow
            onRowDidOpen={() => this.isRowOpened = true}
            onRowDidClose={() => this.isRowOpened = false}
            rightOpenValue={-150}
            previewOpenDelay={3000}
            disableRightSwipe={true}
            preview={false}
            directionalDistanceChangeThreshold={0}
            swipeToOpenPercent={20}
        >
            <View style={styles.rowBack}>
            <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                <View style={{display: "flex", flexDirection:"column", alignItems: "center", justifyContent: "center"}}>
                <Icon name={`${ICON_PREFIX}-add`} size={25} color="white" />
                <Text style={styles.backRightBtnLabel}>{t('later')}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]}>
                <Icon name={`${ICON_PREFIX}-trash`} size={25} color="white" />
                <Text style={styles.backRightBtnLabel}>{t('delete')}</Text>
            </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <TouchableHighlight onPress={this.onCardPress}>
                    <RkCard rkType='horizontal'>
                        <Image rkCardImg source={{uri: this.state.episode.image}} />
                        <View rkCardContent>
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
                            <RkText numberOfLines={3} rkType='header6'>{this.state.episode.title}</RkText>
                            
                            <TouchableOpacity onPress={this.onShowSummaryPress}>
                                <View style={{flexDirection: "row"}}>
                                <RkText style={{color: "tomato"}} numberOfLines={1} rkType='secondary3'>{t('summary and notes')}</RkText>
                                <Icon name={`${ICON_PREFIX}-arrow-forward`} style={{marginLeft: 4, marginTop: 3}} size={12} color="tomato" />
                                </View>
                            </TouchableOpacity>
                            { this.props.displayShowName && <RkText style={styles.showName} numberOfLines={1} rkType='secondary7'>{this.state.episode.showName}</RkText> }     
                            <View style={styles.separatorBorder}></View>
                        </View>
                    </RkCard>
                </TouchableHighlight>  
            </View>  
            
        </SwipeRow>
        
    )
}


const styles = RkStyleSheet.create(theme => ({
    card: {
      marginVertical: 6,
    },
    post: {
      marginTop: 6,
    },
  
    rowBack: {
          alignItems: 'center',
          backgroundColor: '#DDD',
          flexDirection: 'row',
          justifyContent: 'space-between',
      paddingLeft: 15,
      height: 130,
      marginVertical: 8,
    },
    backRightBtn: {
          alignItems: 'center',
          bottom: 0,
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          width: 75
      },
      backRightBtnLeft: {
          backgroundColor: 'blue',
          right: 75
    },
    backRightBtnRight: {
          backgroundColor: 'red',
          right: 0
    },
    backRightBtnLabel: {
      textAlign: "center", 
      margin:10, 
      marginTop: 0, 
      color: "white", 
      fontSize: 12
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
import React, { Component } from 'react'

import { playerStyles } from '../config/styles'

import { attachModelToView } from 'rhelena'
import {
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Animated,
    Easing,
    Modal,
    ActivityIndicator
} from 'react-native'

import {
    RkText
} from 'react-native-ui-kitten'

import Ionicon from 'react-native-vector-icons/Ionicons'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import TextTicker from 'react-native-text-ticker'

import { ICON_PREFIX } from '../config/variables'
import t from '../locales'

import ProgressBarMini from './ProgressBarMini'
import ProgressBar from './ProgressBar'
import PlayerModel from './PlayerModel'

import imageCacheHoc from 'react-native-image-cache-hoc';
const CacheableImage = imageCacheHoc(Image);


export default class Player extends Component {

    constructor() {
        super()
        this.blinkOpacityValue = new Animated.Value(0)
    }

    blinkOff() {
        this.blinkOpacityValue.setValue(1)
        Animated.timing(
          this.blinkOpacityValue,
          {
            toValue: .1,
            duration: 500,
            easing: Easing.linear
          }
        ).start(() => this.blinkOn())
    }
    blinkOn() {
        this.blinkOpacityValue.setValue(0)
        Animated.timing(
          this.blinkOpacityValue,
          {
            toValue: 1,
            duration: 500,
            easing: Easing.linear
          }
        ).start(() => setTimeout(()=>this.blinkOff(), 200))
    }

    componentWillMount() {
        attachModelToView(new PlayerModel(this.props), this)
    }
    componentDidMount() {
        this.blinkOn()
    }
    componentWillUnmount() {
        this.viewModel.clean()
    }

    render() {
        const iconPlay = !this.state.isPlaying ? `${ICON_PREFIX}play` : `${ICON_PREFIX}pause`
        const playIconAction = !this.state.isPlaying ? () => this.viewModel.play() : () => this.viewModel.pause()
        
        let playerComponent = <View></View>

        const cutIconColor = this.state.clipStartPosition && !this.state.currentClip ? "#FF4141" : "black"
        const shareCutIconColor = this.state.currentClip ? "black" : "#C0C0C0"

        if (this.state.currentTrackInfo) {
            if (this.state.isFloatingMode) {
                playerComponent = (
                    this.state.currentTrackInfo &&                    
                    <View style={playerStyles.floating.container}>
                        <ProgressBarMini />
                        <View style={playerStyles.floating.body}>                                
                            <TouchableWithoutFeedback onPress={() => this.viewModel.toggleMode()}>
                                <SimpleLineIcon name={`arrow-up`}  size={21} color="black" />
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.viewModel.toggleMode()}>
                                <View style={playerStyles.floating.trackInfo}>
                                    <RkText numberOfLines={1} rkType='secondary6'>{this.state.currentTrackInfo.title}</RkText>
                                    <RkText numberOfLines={1} rkType='secondary7' style={{color: "#999"}}>{this.state.currentTrackInfo.author}</RkText>
                                </View>
                            </TouchableWithoutFeedback>    
                            <TouchableOpacity onPress={playIconAction}>
                                <Ionicon name={iconPlay} size={36} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.viewModel.seekToByAmount(30)}>
                                <MaterialIcon name="forward-30" size={32} />
                            </TouchableOpacity>
                        </View>
                    </View>        
                )
            }else{
                playerComponent = (
                    this.state.currentTrackInfo &&
                    <View style={playerStyles.maximized.container}>
                        <View style={playerStyles.maximized.body}>
                            <TouchableWithoutFeedback onPress={() => this.viewModel.toggleMode()}>
                                <View style={{flexDirection: "row", flex: 1, width: "100%", justifyContent: "space-between"}}>
                                        <SimpleLineIcon name={`arrow-down`}  size={21} color="black" />
                                    <RkText rkType='secondary5'>{this.state.currentTrackInfo.showName}</RkText>
                                    <View></View>
                                </View>
                            </TouchableWithoutFeedback>
                            <View>
                                <CacheableImage style={playerStyles.maximized.cover} source={{uri: this.state.currentTrackInfo.image}} permanent={false} />
                            </View>
                            <View style={playerStyles.maximized.trackInfo}>
                                <TextTicker style={{ fontSize: 21 }}
                                    duration={8000}
                                    loop
                                    repeatSpacer={100}
                                    marqueeDelay={4000}
                                >
                                    {this.state.currentTrackInfo.title}
                                </TextTicker>
                                <RkText numberOfLines={1} rkType='secondary3' style={{color: "#999"}}>{this.state.currentTrackInfo.author}</RkText>
                            </View>                            
                            
                            <View style={{width: "100%", flex: 1, marginTop: 10}}>
                                <ProgressBar />
                                <View style={{width: "100%", flexDirection: "row", justifyContent: "space-evenly", flex: 1}}>                                    
                                    {!this.state.lastAudioClipFilePath &&
                                        <TouchableOpacity onPress={() => this.viewModel.toggleCut()}>
                                            <Animated.View style={{
                                                opacity: this.state.clipStartPosition && !this.state.currentClip ? this.blinkOpacityValue : (this.state.currentClip ? 0.1 : 1)
                                            }}>
                                                <Ionicon name={`${ICON_PREFIX}cut`} size={36} color={cutIconColor} />
                                            </Animated.View>
                                        </TouchableOpacity>
                                    }
                                    {this.state.lastAudioClipFilePath &&
                                        <TouchableOpacity onPress={() => this.viewModel.saveClip()} disabled={!this.state.currentClip}>
                                            <View style={playerStyles.maximized.secondaryActionButton}>
                                                <Ionicon name={`${ICON_PREFIX}save`} size={32} color={shareCutIconColor} />                                        
                                                <RkText rkType="subtitle2">{t('save')}</RkText>
                                            </View>
                                        </TouchableOpacity>
                                    }                       
                                    {this.state.lastAudioClipFilePath &&
                                        <TouchableOpacity onPress={() => this.viewModel.discardClip()} disabled={!this.state.currentClip}>
                                            <View style={playerStyles.maximized.secondaryActionButton}>
                                                <Ionicon name={`${ICON_PREFIX}trash`} size={32} color={shareCutIconColor} />                                        
                                                <RkText rkType="subtitle2">{t('discard')}</RkText>
                                            </View>
                                        </TouchableOpacity>
                                    }                       
                                    {this.state.lastAudioClipFilePath &&
                                        <TouchableOpacity onPress={() => this.viewModel.shareClip()} disabled={!this.state.currentClip}>
                                            <View style={playerStyles.maximized.secondaryActionButton}>
                                                <Ionicon name={`${ICON_PREFIX}share`} size={32} color={shareCutIconColor} />                                        
                                                <RkText rkType="subtitle2">{t('share')}</RkText>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                            
                            <View style={{width: "100%", flexDirection: "row", justifyContent: "space-evenly", flex: 1, marginTop: 20}}>
                                <TouchableOpacity onPress={() => this.viewModel.seekToByAmount(-10)}>
                                { !this.state.lastAudioClipFilePath && <MaterialIcon name="replay-10" size={48} /> }
                                </TouchableOpacity>
                                <TouchableOpacity onPress={playIconAction}>
                                    <View style={{justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
                                        <Ionicon name={iconPlay} size={56} color="black" />
                                        { this.state.lastAudioClipFilePath && <RkText rkType="subtitle2">{t('preview clip')}</RkText>}
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.viewModel.seekToByAmount(30)}>
                                { !this.state.lastAudioClipFilePath && <MaterialIcon name="forward-30" size={48} /> }
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                    </View>            
                )
            }
        }

        return playerComponent
    }
}
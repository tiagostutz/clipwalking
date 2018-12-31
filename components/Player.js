import React, { Component } from 'react'

import { playerStyles } from '../config/styles'

import { attachModelToView } from 'rhelena'
import {
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Animated,
    Easing
} from 'react-native'

import {
    RkText
} from 'react-native-ui-kitten'

import Ionicon from 'react-native-vector-icons/Ionicons'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import TextTicker from 'react-native-text-ticker'

import { ICON_PREFIX } from '../config/variables'
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

        const cutIconColor = this.state.clipStartPosition ? "tomato" : "black"
        const shareCutIconColor = this.state.currentClip ? "black" : "#C0C0C0"

        if (this.state.currenTrackInfo) {
            if (this.state.isFloatingMode) {
                playerComponent = (
                    this.state.currenTrackInfo &&                    
                    <View style={playerStyles.floating.container}>
                        <ProgressBarMini />
                        <View style={playerStyles.floating.body}>                                
                            <TouchableWithoutFeedback onPress={() => this.viewModel.toggleMode()}>
                                <SimpleLineIcon name={`arrow-up`}  size={21} color="black" />
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.viewModel.toggleMode()}>
                                <View style={playerStyles.floating.trackInfo}>
                                    <RkText numberOfLines={1} rkType='secondary6'>{this.state.currenTrackInfo.title}</RkText>
                                    <RkText numberOfLines={1} rkType='secondary7' style={{color: "#999"}}>{this.state.currenTrackInfo.author}</RkText>
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
                    this.state.currenTrackInfo &&
                    <View style={playerStyles.maximized.container}>
                        <View style={playerStyles.maximized.body}>
                            <TouchableWithoutFeedback onPress={() => this.viewModel.toggleMode()}>
                                <View style={{flexDirection: "row", flex: 1, width: "100%", justifyContent: "space-between"}}>
                                        <SimpleLineIcon name={`arrow-down`}  size={21} color="black" />
                                    <RkText rkType='secondary5'>{this.state.currenTrackInfo.showName}</RkText>
                                    <View></View>
                                </View>
                            </TouchableWithoutFeedback>
                            <View>
                                <CacheableImage style={playerStyles.maximized.cover} source={{uri: this.state.currenTrackInfo.image}} permanent={false} />
                            </View>
                            <View style={playerStyles.maximized.trackInfo}>
                                <TextTicker style={{ fontSize: 21 }}
                                    duration={8000}
                                    loop
                                    repeatSpacer={100}
                                    marqueeDelay={4000}
                                >
                                    {this.state.currenTrackInfo.title}
                                </TextTicker>
                                <RkText numberOfLines={1} rkType='secondary3' style={{color: "#999"}}>{this.state.currenTrackInfo.author}</RkText>
                            </View>                            
                            <View style={{width: "100%", flex: 1, marginTop: 20}}>
                                <ProgressBar />
                                <View style={{width: "100%", flexDirection: "row", justifyContent: "space-evenly", flex: 1}}>                                    
                                    <TouchableOpacity onPress={() => this.viewModel.toggleCut()}>
                                        <Animated.View style={{opacity: this.state.clipStartPosition ? this.blinkOpacityValue : 1}}>
                                            <Ionicon name={`${ICON_PREFIX}cut`} size={32} color={cutIconColor} />
                                        </Animated.View>
                                    </TouchableOpacity>
                                    {this.state.currentClip &&
                                        <TouchableOpacity onPress={() => this.viewModel.shareClip()} disabled={!this.state.currentClip}>
                                            <Ionicon name={`${ICON_PREFIX}trash`} size={32} color={shareCutIconColor} />                                        
                                        </TouchableOpacity>
                                    }                       
                                    {this.state.currentClip &&
                                        <TouchableOpacity onPress={() => this.viewModel.shareClip()} disabled={!this.state.currentClip}>
                                            <Ionicon name={`${ICON_PREFIX}share`} size={32} color={shareCutIconColor} />                                        
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                            <View style={{width: "100%", flexDirection: "row", justifyContent: "space-evenly", flex: 1, marginTop: 20}}>
                                <TouchableOpacity onPress={() => this.viewModel.seekToByAmount(-30)}>
                                    <MaterialIcon name="replay-30" size={48} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={playIconAction}>
                                    <Ionicon name={iconPlay} size={56} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.viewModel.seekToByAmount(30)}>
                                    <MaterialIcon name="forward-30" size={48} />
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
import React, { Component } from 'react'

import { playerStyles } from '../config/styles'

import { attachModelToView } from 'rhelena'
import {
    View,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native'

import {
    RkText
} from 'react-native-ui-kitten'

import Ionicon from 'react-native-vector-icons/Ionicons'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { ICON_PREFIX } from '../config/variables'

import ProgressBar from './ProgressBar'
import PlayerModel from './PlayerModel'

export default class Player extends Component {

    componentWillMount() {
        attachModelToView(new PlayerModel(this.props), this)
    }
    componentWillUnmount() {
        this.viewModel.clean()
    }

    render() {
        const iconPlay = !this.state.isPlaying ? `${ICON_PREFIX}play` : `${ICON_PREFIX}pause`
        const playIconAction = !this.state.isPlaying ? () => this.viewModel.play() : () => this.viewModel.pause()
        
        let playerComponent = <View></View>

        if (this.state.currenTrackInfo) {
            if (this.state.isFloatingMode) {
                playerComponent = (
                    this.state.currenTrackInfo &&                    
                    <View style={playerStyles.floating.container}>
                        <ProgressBar />
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
                            <TouchableOpacity onPress={() => this.viewModel.fastForwardByAmount(30)}>
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
                            <View style={playerStyles.floating.trackInfo}>
                                <RkText numberOfLines={1} rkType='secondary6'>{this.state.currenTrackInfo.title}</RkText>
                                <RkText numberOfLines={1} rkType='secondary7' style={{color: "#999"}}>{this.state.currenTrackInfo.author}</RkText>
                            </View>                            
                        </View>
                    </View>            
                )
            }
        }

        return playerComponent
    }
}
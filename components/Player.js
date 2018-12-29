import React, { Component } from 'react'

import { playerStyles } from '../config/styles'

import { attachModelToView } from 'rhelena'
import {
    View,
    TouchableOpacity
} from 'react-native'

import {
    RkText
} from 'react-native-ui-kitten'

import Icon from 'react-native-vector-icons/Ionicons'
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
        const iconSize = 24
        const iconPlay = !this.state.isPlaying ? `${ICON_PREFIX}-play` : `${ICON_PREFIX}-pause`
        return (
            this.state.currenTrackInfo &&
            <View style={playerStyles.floating.container}>
                <ProgressBar />
                <View style={playerStyles.floating.body}>
                    <TouchableOpacity>
                        <Icon name={`${ICON_PREFIX}-arrow-up`}  size={iconSize} color="grey" />
                    </TouchableOpacity>
                    <View style={playerStyles.floating.trackInfo}>
                        <RkText numberOfLines={1} rkType='secondary6'>{this.state.currenTrackInfo.title}</RkText>
                        <RkText numberOfLines={1} rkType='secondary7' style={{color: "#999"}}>{this.state.currenTrackInfo.author}</RkText>
                    </View>
                    <TouchableOpacity>
                        <Icon name={iconPlay} size={iconSize} color="grey" />
                    </TouchableOpacity>
                </View>
            </View>
            
        )
    }
}
import React, { Component } from 'react'
import { attachModelToView } from 'rhelena'
import { View, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { ICON_PREFIX } from '../config/variables'

import NowPlayingSignModel from './NowPlayingSignModel'

export default class NowPlayingSign extends Component {

    componentWillMount() {
        attachModelToView(new NowPlayingSignModel(this.props), this)
    }
    componentWillUnmount() {
        this.viewModel.clean()
    }

    render() {
        return (
            <View>
                { this.state.isPlaying && <Icon name={`${ICON_PREFIX}-play-circle`} style={{marginLeft: 5}} size={15}/> }                
                { this.state.isBuffering &&  <ActivityIndicator style={{marginLeft: 5, marginTop: -4}} size="small"/> }
            </View>
        )
    }
}
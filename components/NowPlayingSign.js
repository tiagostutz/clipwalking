import React, { Component } from 'react'
import { attachModelToView } from 'rhelena'

import { ICON_PREFIX } from '../config/variables'
import Icon from 'react-native-vector-icons/Ionicons'

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
            this.state.isPlaying && <Icon name={`${ICON_PREFIX}-play-circle`} style={{marginLeft: 6}} size={14}/>
        )
    }
}
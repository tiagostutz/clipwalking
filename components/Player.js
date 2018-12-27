


// var track = {
//     id: 'unique track id',
    
//     url: 'http://traffic.libsyn.com/marketingcompanion/MarkNov9Final.mp3', // Load media from the network

//     title: 'Avaritia',
//     artist: 'deadmau5',
//     album: 'while(1<2)',
//     genre: 'Progressive House, Electro House',
//     date: '2014-05-20T07:00:00+00:00', // RFC 3339
    
//     artwork: 'http://static.libsyn.com/p/assets/c/b/7/3/cb737d72e2215635/marketingcompanion3.jpg', // Load artwork from the network
// }

import React, { Component } from 'react'
import { attachModelToView } from 'rhelena'
import {
    View
} from 'react-native'
import PlayerModel from './PlayerModel'

export default class Player extends Component {

    componentWillMount() {
        attachModelToView(new PlayerModel(this.props), this)
    }
    componentWillUnmount() {
        this.viewModel.clean()
    }

    render() {
        return (
            <View></View>
        )
    }
}
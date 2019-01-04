import React from 'react'
import {
    View
} from 'react-native'

import { ProgressComponent } from 'react-native-track-player'

export default class ProgressBarMini extends ProgressComponent {

  render() {
    
    return (
      <View style={{left: 0, height: 2, flexDirection: 'row'}}>
        <View style={{ flex: this.getProgress(), backgroundColor: '#FF4141' }} />
        <View style={{ flex: 1 - this.getProgress(), backgroundColor: '#F0F0F0' }} />
      </View>

    )
  }
}
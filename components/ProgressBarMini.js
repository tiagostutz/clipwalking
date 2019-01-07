import React from 'react'
import {
    View
} from 'react-native'

import { ProgressComponent } from 'react-native-track-player'
import { Colors } from '../config/theme';

export default class ProgressBarMini extends ProgressComponent {

  render() {
    
    return (
      <View style={{left: 0, height: 2, flexDirection: 'row'}}>
        <View style={{ flex: this.getProgress(), backgroundColor: Colors.primary }} />
        <View style={{ flex: 1 - this.getProgress(), backgroundColor: Colors.neutralBackground }} />
      </View>

    )
  }
}
import React from 'react'
import {
    View
} from 'react-native'

import { ProgressComponent } from 'react-native-track-player'

export default class ProgressBar extends ProgressComponent {
    render() {
      return (
        <View style={{left: 0, height: 1, flexDirection: 'row'}}>
          <View style={{ flex: this.getProgress(), backgroundColor: 'tomato' }} />
          <View style={{ flex: 1 - this.getProgress(), backgroundColor: '#F0F0F0' }} />
        </View>
      );
    }
  }
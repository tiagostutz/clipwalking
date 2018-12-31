import React from 'react'
import { attachModelToView } from 'rhelena'
import { View } from "react-native"

import {
  RkText
} from 'react-native-ui-kitten'
import Slider from "react-native-slider";
import { ProgressComponent } from 'react-native-track-player'
import ProgressMarModel from './ProgressBarModel';

import t from '../locales'

export default class ProgressBar extends ProgressComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    attachModelToView(new ProgressMarModel(this.props), this)
  }

  componentWillUnmount() {
    this.viewModel.clean()
  }

  render() {

    if (!this.state.loaded) {
      return <View style={{flex: 1, flexDirection: "row", justifyContent:"center"}}><RkText rkType='secondary1'>{t('loading').toUpperCase()}...</RkText></View>
    }

    const thumbDimension = this.state.isSliding ? 16 : 8
    const trackColor = this.state.isSliding ? "tomato" : "#777"
    return (
      <View style={{flexDirection: "column"}}>
        <View style={{flexDirection: "row", justifyContent:"space-between"}}>
          <RkText rkType='secondary7'>{this.state.elapsed}</RkText>
          <RkText rkType='secondary7'>-{this.state.remaining}</RkText>
        </View>
        <Slider
          style={{height: 20}}
          thumbStyle={{
            width: thumbDimension,
            height: thumbDimension,
            backgroundColor: trackColor,
            borderRadius: thumbDimension / 2,
            shadowColor: trackColor,
            shadowOffset: {width: 0, height: 0},
            shadowRadius: 2,
            shadowOpacity: .4
          }}
          trackStyle={{
            backgroundColor: "#D0D0D0",
            height: 2
          }}
          minimumTrackTintColor={trackColor}
          thumbTouchSize={{width: 32, height: 32}}
          
          value={this.state.trackPositionRate}
          onSlidingStart={() => this.viewModel.startSliding()}
          onSlidingComplete={() => this.viewModel.stopSliding()}
          onValueChange={(val) => this.viewModel.setTrackPosition(val)}
          maximumValue={1}
        />
      </View>
    )
  }
}
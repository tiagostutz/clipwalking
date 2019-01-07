import React from 'react';

import {
  View,
  FlatList
} from 'react-native';

import {
  RkText,
} from 'react-native-ui-kitten';
 
import Icon from 'react-native-vector-icons/Ionicons'
import { attachModelToView } from 'rhelena'
import SplashScreen from 'react-native-splash-screen'


import { listScreenStyle } from '../../config/styles'

import EpisodeItem from '../../components/EpisodeItem'
import t from '../../locales'
import { ICON_PREFIX } from '../../config/variables'

import WaitingScreenModel from './WaitingScreenModel'

export default class WaitingScreen extends React.Component {

    static navigationOptions = {
        title: t('waiting'),
        tabBarIcon: ({tintColor}) => <Icon name={`${ICON_PREFIX}time`} color={tintColor} size={25}/>
    }

    componentWillMount() {
        attachModelToView(new WaitingScreenModel(), this)
    }

    componentWillUnmount() {
      this.viewModel.clean()
    }
    
    componentDidMount() {
      SplashScreen.hide()    
      setTimeout(()=>SplashScreen.hide(), 3000)
    }
  

    render = () => (
      <View style={listScreenStyle.screen}>
        <View style={listScreenStyle.content}>

          <RkText style={listScreenStyle.title} rkType='header0'>{t('waiting')}</RkText>
          { this.state.waitingData && this.state.waitingData.length > 0 && 
            <FlatList
              data={this.state.waitingData}
              renderItem={({ item }) => <EpisodeItem episode={item} displayShowName disableAddLater />}
              keyExtractor={(item) => `${item.id}`}
              style={listScreenStyle.listContainer}
            />
          }
        </View>
        
        
      </View>
    )
}
import React from 'react';
import {
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

import t from '../locales'

export default class FeedScreen extends React.Component {

  static navigationOptions = {
    title: t('feed'),
    tabBarIcon: ({tintColor}) => <Icon name='ios-radio' color={tintColor} size={25}/>
  };

  render = () => (
    
    <View>
    </View>

  )
}
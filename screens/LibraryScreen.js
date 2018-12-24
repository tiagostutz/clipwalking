import React from 'react';
import {
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

import t from '../locales'

export default class LibraryScreen extends React.Component {
  
  static navigationOptions = {
    title: t('library'),
    tabBarIcon: ({tintColor}) => <Icon name='ios-albums' color={tintColor} size={25}/>
  };

  render = () => (

    <View>
    </View>

  )

}
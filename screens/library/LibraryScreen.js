import React from 'react';
import {
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

import { iconPrefix } from '../../config/variables'
import t from '../../locales'

export default class LibraryScreen extends React.Component {
  
  static navigationOptions = {
    title: t('library'),
    tabBarIcon: ({tintColor}) => <Icon name={`${iconPrefix}-albums`} color={tintColor} size={25}/>
  };

  render = () => (

    <View>
    </View>

  )

}
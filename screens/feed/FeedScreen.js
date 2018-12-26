import React from 'react';

import {
  View
} from 'react-native';

import {
  RkText,
  RkStyleSheet,
} from 'react-native-ui-kitten';
 
import Icon from 'react-native-vector-icons/Ionicons'
import { attachModelToView } from 'rhelena'

import FeedScreenModel from './FeedScreenModel'
import t from '../../locales'
import { iconPrefix } from '../../config/variables'
import EpisodesList from '../../components/EpisodesList';

export default class FeedScreen extends React.Component {

  static navigationOptions = {
    title: t('feed'),
    tabBarIcon: ({tintColor}) => <Icon name={`${iconPrefix}-radio`} color={tintColor} size={25}/>
  };

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    attachModelToView(new FeedScreenModel(), this)
  }

  render = () => (
    <View style={styles.screen}>
      <RkText style={styles.title} rkType='header0'>{t('feed')}</RkText>

      { this.state.feedData && this.state.feedData.length > 0 && 
        <EpisodesList
          episodes={this.state.feedData}
          displayShowName
        />
      }
    </View>
  );
}


const styles = RkStyleSheet.create(theme => ({
  screen: {
    marginTop: 40,
    paddingHorizontal: 14
  },
  title: {
    marginBottom: 12,
    marginTop: 8,
  }
}))
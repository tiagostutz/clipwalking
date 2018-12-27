import React from 'react';

import {
  View,
  FlatList
} from 'react-native';

import {
  RkText,
  RkStyleSheet,
} from 'react-native-ui-kitten';
 
import Icon from 'react-native-vector-icons/Ionicons'
import { attachModelToView } from 'rhelena'

import EpisodeItem from '../../components/EpisodeItem'
import FeedScreenModel from './FeedScreenModel'
import t from '../../locales'
import { ICON_PREFIX } from '../../config/variables'

import Player from '../../components/Player'
export default class FeedScreen extends React.Component {

  static navigationOptions = {
    title: t('feed'),
    tabBarIcon: ({tintColor}) => <Icon name={`${ICON_PREFIX}-radio`} color={tintColor} size={25}/>
  };

  componentWillMount() {
    attachModelToView(new FeedScreenModel(), this)
  }

  render = () => (
    <View style={styles.screen}>
      <RkText style={styles.title} rkType='header0'>{t('feed')}</RkText>

      { this.state.feedData && this.state.feedData.length > 0 && 
        <View>
          <FlatList
            data={this.state.feedData}
            renderItem={({ item }) => <EpisodeItem episode={item} displayShowName />}
            keyExtractor={(item) => `${item.id}`}
            style={styles.listContainer}
          />
        </View>
      }
      <Player />
    </View>
  );
}


const styles = RkStyleSheet.create(theme => ({
  listContainer: {
    backgroundColor: theme.colors.screen.scroll,
  },
  screen: {
    marginTop: 40,
    paddingHorizontal: 14
  },
  title: {
    marginBottom: 12,
    marginTop: 8,
  }
}))
import React from 'react';

import {
  FlatList,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

import {
  RkText,
  RkCard,
  RkStyleSheet,
} from 'react-native-ui-kitten';

import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import { attachModelToView } from 'rhelena'

import { formatDuration } from '../utils/text'
import FeedScreenModel from './FeedScreenModel'
import t from '../locales'

export default class FeedScreen extends React.Component {

  static navigationOptions = {
    title: t('feed'),
    tabBarIcon: ({tintColor}) => <Icon name='ios-radio' color={tintColor} size={25}/>
  };

  componentWillMount() {
    attachModelToView(new FeedScreenModel(), this)
  }
  
  extractItemKey = (item) => `${item.id}`;

  renderItem = ({ item }) => (
    <TouchableOpacity
      delayPressIn={70}
      activeOpacity={0.8}
      onPress={() =>{} }>
      <RkCard rkType='horizontal' style={styles.card}>
        <Image rkCardImg source={{uri: item.image}} />
        <View rkCardContent>
          <RkText numberOfLines={1} rkType='header6'>{item.title}</RkText>
          <RkText rkType='secondary6 hintColor'>
            {`${moment(item.published).fromNow()} ${formatDuration(item.duration)}`}
          </RkText>
          <RkText style={styles.post} numberOfLines={2} rkType='secondary1'>{item.description}</RkText>
        </View>
        <View rkCardFooter>
          
        </View >
      </RkCard>
    </TouchableOpacity>
  );

  render = () => (
    <View>
      { this.state.feedData && this.state.feedData.length > 0 && 
      <FlatList
        data={this.state.feedData}
        renderItem={this.renderItem}
        keyExtractor={this.extractItemKey}
        style={styles.container}
      />
      }
    </View>
  );
}


const styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.screen.scroll,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  card: {
    marginVertical: 8,
  },
  post: {
    marginTop: 13,
  },
}));
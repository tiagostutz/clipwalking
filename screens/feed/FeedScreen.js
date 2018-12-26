import React from 'react';

import {
  FlatList,
  Image,
  View,
  TouchableOpacity,
  Text
} from 'react-native';

import {
  RkText,
  RkCard,
  RkStyleSheet,
} from 'react-native-ui-kitten';
import { SwipeRow } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import { attachModelToView } from 'rhelena'

import { formatDuration } from '../../utils/text'
import FeedScreenModel from './FeedScreenModel'
import t from '../../locales'
import { iconPrefix } from '../../config/variables'

export default class FeedScreen extends React.Component {

  static navigationOptions = {
    title: t('feed'),
    tabBarIcon: ({tintColor}) => <Icon name={`${iconPrefix}-radio`} color={tintColor} size={25}/>
  };

  constructor(props) {
    super(props)
    this.rowSwipeAnimatedValues = {}
  }

  componentWillMount() {
    attachModelToView(new FeedScreenModel(), this)
  }
  
  extractItemKey = (item) => `${item.id}`;

  renderItem = ({ item }) => (
    
    <SwipeRow
        rightOpenValue={-150}
        previewOpenDelay={3000}
        disableRightSwipe={true}
        preview={false}
      >
        <View style={styles.rowBack}>
          <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]}>
            <View style={{display: "flex", flexDirection:"column", alignItems: "center", justifyContent: "center"}}>
              <Icon name={`${iconPrefix}-add`} size={25} color="white" />
              <Text style={styles.backRightBtnLabel}>{t('listen later')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]}>
            <Icon name={`${iconPrefix}-trash`} size={25} color="white" />
            <Text style={styles.backRightBtnLabel}>{t('delete')}</Text>
          </TouchableOpacity>
        </View>

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

      </SwipeRow>
    
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

  rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flexDirection: 'row',
		justifyContent: 'space-between',
    paddingLeft: 15,
    height: 110,
    marginVertical: 8,
  },
  backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75
	},
	backRightBtnLeft: {
		backgroundColor: 'blue',
		right: 75
  },
  backRightBtnRight: {
		backgroundColor: 'red',
		right: 0
  },
  backRightBtnLabel: {
    textAlign: "center", 
    margin:10, 
    marginTop: 2, 
    color: "white", 
    fontSize: 12
  },
  

}));
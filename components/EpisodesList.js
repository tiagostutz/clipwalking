import React from 'react';

import {
  FlatList,
  Image,
  View,
  TouchableOpacity,
  TouchableHighlight,
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

import { formatDuration } from '../utils/text'
import t from '../locales'
import { iconPrefix } from '../config/variables'

export default ({episodes, displayShowName}) => {

  extractItemKey = (item) => `${item.id}`;

  renderItem = ({ item }) => (
    
    <TouchableHighlight>
      <SwipeRow
          rightOpenValue={-150}
          previewOpenDelay={3000}
          disableRightSwipe={true}
          preview={false}
          directionalDistanceChangeThreshold={0}
          swipeToOpenPercent={20}
        >
          <View style={styles.rowBack}>
            <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]}>
              <View style={{display: "flex", flexDirection:"column", alignItems: "center", justifyContent: "center"}}>
                <Icon name={`${iconPrefix}-add`} size={25} color="white" />
                <Text style={styles.backRightBtnLabel}>{t('later')}</Text>
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
              <View style={styles.showDate}>
                <RkText rkType='secondary6 hintColor'>
                  {formatDuration(item.duration)}
                </RkText>
                <RkText rkType='secondary6 hintColor'>
                  {moment(item.published).fromNow()}
                </RkText>
              </View>
              <RkText numberOfLines={3} rkType='header6'>{item.title}</RkText>
              
              <View style={{flexDirection: "row"}}>
                <RkText style={{color: "tomato"}} numberOfLines={1} rkType='secondary3'>{t('summary and notes')}</RkText>
                <Icon name={`${iconPrefix}-arrow-forward`} style={{marginLeft: 4, marginTop: 3}} size={12} color="tomato" />
              </View>
              { displayShowName && <RkText style={styles.showName} numberOfLines={1} rkType='secondary7'>{item.showName}</RkText> }     
              <View style={styles.separatorBorder}></View>
            </View>
          </RkCard>
          
        </SwipeRow>
      </TouchableHighlight>
    
  );

  return (
    <View>
      { episodes && episodes.length > 0 && 
      <FlatList
        data={episodes}
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
  },
  card: {
    marginVertical: 6,
  },
  post: {
    marginTop: 6,
  },

  rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flexDirection: 'row',
		justifyContent: 'space-between',
    paddingLeft: 15,
    height: 130,
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
    marginTop: 0, 
    color: "white", 
    fontSize: 12
  },
  separatorBorder: {
    borderBottomWidth: 1, 
    marginTop: 8, 
    borderColor: "#C7C7C7"
  },
  showName: {
    marginTop: 6,
    color: "#999"
  },
  showDate: {
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between"
  }

}));
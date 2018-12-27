import React, { Component } from 'react'
import { attachModelToView } from 'rhelena'

import {
    View,
    FlatList
} from 'react-native';
import {
  RkText,
  RkStyleSheet,
} from 'react-native-ui-kitten';
 
import Icon from 'react-native-vector-icons/Ionicons'

import ListenLaterScreenModel from './ListenLaterScreenModel'

import EpisodeItem from '../../components/EpisodeItem'
import t from '../../locales'
import { ICON_PREFIX } from '../../config/variables'

export default class ListenLaterScreen extends Component {


    static navigationOptions = {
        title: t('waiting'),
        tabBarIcon: ({tintColor}) => <Icon name={`${ICON_PREFIX}-time`} color={tintColor} size={25}/>
    }

    componentWillMount() {
        attachModelToView(new ListenLaterScreenModel(), this)
    }

    render = () => (
        <View style={styles.screen}>
          <RkText style={styles.title} rkType='header0'>{t('waiting')}</RkText>
    
          { this.state.listenLaterData && this.state.listenLaterData.length > 0 && 
            <View>
              <FlatList
                data={this.state.listenLaterData}
                renderItem={({ item }) => <EpisodeItem episode={item} displayShowName />}
                keyExtractor={(item) => `${item.id}`}
                style={styles.listContainer}
              />
            </View>
          }
        </View>
      )
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
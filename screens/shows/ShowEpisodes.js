import React, { Component } from 'react'
import { attachModelToView } from 'rhelena'
import { RkText } from 'react-native-ui-kitten';
import {
    View,
    FlatList,
  } from 'react-native';

import { listScreenStyle } from '../../config/styles'
  
import ShowEpisodesModel from './ShowEpisodesModel'

export default class ShowEpisodes extends Component {
    static navigationOptions = {
        headerStyle: {
          backgroundColor: 'white',
          borderBottomWidth: 0
        },
        headerTintColor: 'black',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
    }

    componentWillMount() {
        attachModelToView(new ShowEpisodesModel(), this)
    }

    render() {
        if (!this.state.show) return <View></View>


        return (
            <View style={listScreenStyle.screen} style={{marginTop: 20}}>
      
              <View style={listScreenStyle.content}>
                <RkText style={listScreenStyle.title} rkType='header0'>{this.state.show.title}</RkText>
                { this.state.episodes && this.state.episodes.length > 0 && 
                    <FlatList
                        onScrollBeginDrag={() => this.onScroll()}
                        initialNumToRender={10}
                        data={this.state.episodes}
                        renderItem={({ item }) => <EpisodeItem episode={item} />}
                        keyExtractor={(item) => `${item.id}`}
                        style={styleCompiled}
                    />
                } 
              </View>
                      
            </View>
          )
    }
}
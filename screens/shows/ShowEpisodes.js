import React, { Component } from 'react'
import { attachModelToView } from 'rhelena'
import { RkText } from 'react-native-ui-kitten';
import {
    View,
    FlatList,
  } from 'react-native';
import { ActivityIndicator} from 'react-native'

import EpisodeItem from '../../components/EpisodeItem'
import { listScreenStyle } from '../../config/styles'
  
import ShowEpisodesModel from './ShowEpisodesModel'
import t from '../../locales';

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

        let contentStyle = [listScreenStyle.content]
        if (this.state.loading) {
            contentStyle.push({height: "100%"})
        }
        let styleCompiled = [listScreenStyle.listContainer]
        if (this.state.playerActive) {
          styleCompiled.push({ marginBottom: 190})
        }else{
          styleCompiled.push({ marginBottom: 140 })
        }

        return (
            <View style={listScreenStyle.screen} style={{marginTop: 20}}>
      
              <View style={contentStyle}>
                <RkText style={listScreenStyle.title} rkType='header0'>{this.state.show.title}</RkText>

                { this.state.loading && <View style={{flex:1, flexDirection: "column", justifyContent: "center"}}>
                    <ActivityIndicator size="large" />
                    <RkText style={{textAlign:"center"}} rkType='secondary2'>{ t('fetching episodes list') }</RkText>
                </View>}
                { !this.state.loading && this.state.episodes && this.state.episodes.length > 0 && 
                    <FlatList
                        initialNumToRender={10}
                        data={this.state.episodes}
                        renderItem={({ item }) => <EpisodeItem disableRemove episode={item} />}
                        keyExtractor={(item) => `${item.id}`}
                        style={styleCompiled}
                    />
                } 
              </View>
                      
            </View>
          )
    }
}
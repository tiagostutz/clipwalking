import React, { Component } from 'react'
import { attachModelToView } from 'rhelena'

import { Modal, View, ActivityIndicator} from 'react-native'
import { RkText } from 'react-native-ui-kitten'

import t from '../locales'

import LoadingModel from './LoadingModel'

export default class Loading extends Component {

    componentWillMount() {
        attachModelToView(new LoadingModel(), this)
    }

    render = () => ( 
        <Modal 
            visible={this.state.isWorking}
            transparent
            style={{height:"100%", width:"100%", flex: 1, flexDirection:"column", justifyContent: "center", alignItems: "center"}}
        >
        <View style={{flex: 1, backgroundColor: "rgba(255,255,255,0.8)", flexDirection:"column", justifyContent: "center", alignItems: "center"}}>
            <View style={{padding: 30, borderRadius: 20, backgroundColor: "#F4F4F4", flexDirection:"column", justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large" />
                <RkText  rkType='secondary1' style={{marginTop: 10, textAlign: "center", justifyContent: "center", alignItems:"center"}}>{this.state.text}</RkText>
            </View>
        </View>
    </Modal>

    )
}
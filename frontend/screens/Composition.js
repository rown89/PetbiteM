import React from "react";
import { TextInput, Text, StyleSheet, View, TouchableOpacity, Modal, FlatList, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import _ from "lodash";
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import MostUsed from "../components/MostUsed";

//Composition Tab Area
export default class CompositionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      searchQuery: null,
      modalVisible: false,
      modalStatus: "Ingredients",
      elementResults: null,
      productsArray: [],
      mostUsedElements: null,
      visibleMostUsedChild: true,
    };
  }

  setModalVisible(visible) {
    this.setState({
      modalVisible: visible
    });
  };

  setModalStatus(event) {
    this.setState({
      modalStatus: event
    },
      () => this.setModalVisible(false))
  };

  remoteRequest = _.debounce(() => {
    if (!!this.state.searchQuery && this.state.searchQuery.trim().length > 1) {
      this.setState({
        visibleMostUsedChild: false
      })
      axios.post("http://62.75.141.240:9001/searchElements" + this.state.modalStatus, {
        element: this.state.searchQuery
      })
        .then(response => {
          this.setState({
            isLoading: false,
            elementResults: response.data
          });
        })
        .catch(error => {
          console.log(error);
        });
    } else {this.setState({
      visibleMostUsedChild: true
    })}
  }, 250);

  handleSearch = searchedText => {
    this.setState({
      searchQuery: searchedText.toLowerCase(),
    }, () => this.remoteRequest());
  };

  handleSelectedItem = (itemId, itemName) => {
    axios.post("http://62.75.141.240:9001/selectedElements" + this.state.modalStatus, {
      elementID: itemId
    })
    .then(response => {
      this.setState({
        productsArray: response.data
      });
      this.props.navigation.navigate({
        routeName: 'productscompositionlist',
        params: { res: this.state.productsArray, title: itemName }
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: getStatusBarHeight() }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <View style={styles.searchForm}>
            <TextInput style={styles.searchInput}
              onChangeText={this.handleSearch}
              placeholder="Search Composition's"
              autoCapitalize="none" autoCorrect={false}
              underlineColorAndroid={"#FFFFFF"} placeholderTextColor={"#bfbfbf"} />
            <TouchableOpacity onPress={() => this.setModalVisible(true)}>
              <View style={styles.searchFilter}>
                <Icon name="ios-options" size={20} color={"#F3F3F3"} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={this.state.modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => { this.setModalVisible(false) }}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#00000080' }}>
            <View style={styles.modalContainer}>
              <View style={{ width: "100%", height: 40, marginTop: 0, paddingLeft: 10, paddingBottom: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Filter by Composition
              </Text>
              </View>
              <TouchableOpacity style={styles.modalTouchable1}
                onPress={() => this.setModalStatus(Aminoacids)}>
                <Text style={styles.modalItems}>
                  {Aminoacids = "Aminoacids"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalTouchable2}
                onPress={() => this.setModalStatus(Anal)}>
                <Text style={styles.modalItems}>
                  {Anal = "Analytical-Compositions"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalTouchable1}
                onPress={() => this.setModalStatus(Ingredients)}>
                <Text style={styles.modalItems}>
                  {Ingredients = "Ingredients"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalTouchable2}
                onPress={() => this.setModalStatus(Minerals)}>
                <Text style={styles.modalItems}>
                  {Minerals = "Minerals"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalTouchable1}
                onPress={() => this.setModalStatus(Vitamins)}>
                <Text style={styles.modalItems}>
                  {Vitamins = "Vitamins"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalTouchable2}
                onPress={() => this.setModalStatus(Plants)}>
                <Text style={styles.modalItems}>
                  {Plants = "Plants"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ paddingTop: 20, justifyContent: "center", alignItems: "center" }}
                onPress={() => { this.setModalVisible(!this.state.modalVisible) }}>
                <Text style={{ color: "#283B47", fontSize: 15, fontWeight: "bold" }}>
                  Close Modal
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={{ width: "100%", height: 20 }}>
          <View style={styles.filterStatus}>
            <Text style={styles.filterStatusText}>
              Filter status: {this.state.modalStatus}
            </Text>
          </View>
        </View>

        {this.state.visibleMostUsedChild && 
          <ScrollView>
          <MostUsed type={"Aminoacids"} 
            linkType={"Amino"} 
            navigation={this.props.navigation}
            visible={this.state.invisibleMostUsed}
            url={"mostUsedAminoAcids"} />
          <MostUsed type={"Analytical Comps"} 
            linkType={"Anal"} 
            navigation={this.props.navigation} 
            visible={this.state.invisibleMostUsed}
            url={"mostUsedAnalComps"} />
          <MostUsed type={"Ingredients"} 
            linkType={"Ingr"} 
            navigation={this.props.navigation}
            visible={this.state.invisibleMostUsed} 
            url={"mostUsedIngredients"} />
          <MostUsed type={"Minerals"} 
            linkType={"Mineral"} 
            navigation={this.props.navigation}
            visible={this.state.invisibleMostUsed}
            url={"mostUsedMinerals"} />
          <MostUsed type={"Vitamins"} 
            linkType={"Vitamin"} 
            navigation={this.props.navigation}
            visible={this.state.invisibleMostUsed}
            url={"mostUsedVitamins"} />
          <MostUsed type={"Plants"} 
            linkType={"Plant"} 
            navigation={this.props.navigation}
            visible={this.state.invisibleMostUsed}
            url={"mostUsedPlants"} />
        </ScrollView>}

        {!this.state.visibleMostUsedChild && 
        <FlatList
          data={this.state.elementResults}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) =>
            <View style={styles.compositionListContainer}>
              <View style={styles.productsContainer}>
                <TouchableOpacity
                  onPress={() => this.handleSelectedItem(item.id, item.name)}>
                  <Text style={{ color: "#283B47" }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchScreen: {
    backgroundColor: "#FEFEFE"
  },
  searchForm: {
    width: "100%",
    height: 60,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    flexGrow: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#191A1D",
    elevation: 4
  },
  searchInput: {
    flex: 4,
    height: 45,
    padding: 10,
    borderRadius: 3,
    fontFamily: "googlesans-regular",
    backgroundColor: "#FEFEFE"
  },
  searchFilter: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  filterStatus: {
    width: "100%",
    height: 20,
    paddingLeft: 15,
    marginBottom: 5
  },
  filterStatusText: {
    fontSize: 12,
    color: "grey",
    fontFamily: "googlesans-regular"
  },
  modalContainer: {
    width: 250,
    height: 370,
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#fff'
  },
  modalTouchable1: {
    height: 40,
    padding: 8,
    backgroundColor: "#FFFFFF"
  },
  modalTouchable2: {
    height: 40,
    padding: 8,
    backgroundColor: "#F2F2F2"
  },
  modalItems:{
    fontSize: 15
  },
  compositionListContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },
  productsContainer: {
    flex: 4,
    padding: 15
  }
});

import React from "react";
import { FlatList, TouchableOpacity, TextInput, Text, StyleSheet, View, Image, Modal, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import _ from "lodash";

export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      modalVisible: false,
      modalStatus: "All",
      searchQuery: null,
      searchResults: null,
      selectedProductID: []
      
    };
  }

  setModalVisible(visible) {
    this.setState({ 
      modalVisible: visible 
    });
  };

  setModalStatus(event){
    this.setState({
      modalStatus: event
    }, 
    () => this.setModalVisible(false))
  };

  remoteRequest = _.debounce(() => {
    if(this.state.searchQuery && this.state.searchQuery.length > 1){
      axios.post("http://62.75.141.240:9001/searchProducts" + this.state.modalStatus, {
        search: this.state.searchQuery,
      })
      .then((response) => {
        this.setState({
          isLoading: false,
          searchResults: response.data
        });
      })
      .catch(error => {
         console.log(error);
      });
  }
  }, 250);

  handleSearch = (searchedText) => {
    this.setState({ 
      searchQuery: searchedText.toLowerCase() 
    }, 
    () => this.remoteRequest())
  };

  handleSelectedItem = (itemID, productName) => {
    axios.post("http://62.75.141.240:9001/searchProductsAll", {
    productID: itemID
    })
    .then(response => {
      if(response){
        this.props.navigation.navigate({ routeName: 'productdetail', params: {productFromList: itemID, title: productName } });
      } else {
        console.log("Product not found")
      }
    })
    .catch(error => {
      console.log(error);
    });
  }
  
  render() {
    return (
      <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", marginTop: getStatusBarHeight() }}>
        <View style={styles.searchForm}>
          <TextInput style={styles.searchInput}
            onChangeText={this.handleSearch}
            placeholder="Search Product name"
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid={"#FFFFFF"}
            placeholderTextColor={"#bfbfbf"}
          />
          <TouchableOpacity 
            onPress={() => this.setModalVisible(true)}>
            <View style={styles.searchFilterIcon}>
              <Icon name="ios-options" size={20} color={"#F3F3F3"} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.filterStatus}>
          <Text style={styles.filterStatusText}>
            Filter status: {this.state.modalStatus}
          </Text>
        </View>

        <Modal
          visible={this.state.modalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          transparent={false}
          hardwareAccelerated={true}
          onRequestClose={() => this.setModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#00000080' }}>
            <View style={styles.modalContainer}>
              <View style={{ width: "100%", height: 40, marginTop: 0, paddingLeft: 10, paddingBottom: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Filter by Diets
                </Text>
              </View>
              <TouchableOpacity style={styles.modalTouchable1}
                onPress={() => { this.setModalStatus(All) }}>
                <Text>{All = "All"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalTouchable2}
                onPress={() => { this.setModalStatus(Standard) }}>
                <Text>{Standard = "Standard"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalTouchable1}
                onPress={() => { this.setModalStatus(Hepatic) }}>
                <Text>{Hepatic = "Hepatic"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalTouchable2}
                onPress={() => { this.setModalStatus(Urinary) }}>
                <Text>{Urinary = "Urinary"}</Text>
              </TouchableOpacity>
              <TouchableHighlight style={{paddingTop: 20, justifyContent: "center", alignItems: "center"}}
                onPress={() => { this.setModalVisible(false) }}>
                <Text style={{ color: "#283B47", fontSize: 15, fontWeight: "bold" }}>
                  Close Modal
                    </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <View style={styles.headerContainer}>
          <View style={styles.brandContainer}>
            <Text style={{fontFamily: "googlesans-bold", color: "#FFFFFF"}}>Brand</Text>
          </View>
          <View style={styles.productsContainer}>
            <Text style={{fontFamily: "googlesans-bold", color: "#FFFFFF"}}>Product</Text>
          </View>
        </View>

        <View style={styles.mainContainer}>
          <FlatList
            data={this.state.searchResults}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.flatListContainer}
                onPress={() => { this.handleSelectedItem(item.id, item.name) }}>
                <View style={styles.brandContainer}>
                  <Image source={{ uri: item.brand.image }} style={{ width: 40, height: 40 }} />
                </View>
                <View style={styles.productsContainer}>
                  <Text style={{ fontFamily: "googlesans-regular" }}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
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
  searchFilterIcon: {
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
    height: 290,
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
  headerContainer: {
    width: "100%",
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    backgroundColor: "#33B6C0"
  },
  mainContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#FFFFFF"
  },
  flatListContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },
  brandResults: {
    flex: 1,
    padding: 10
  },
  productResults: {
    flex: 4,
    padding: 10
  },
  brandContainer: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  productsContainer: {
    flex: 4,
    padding: 15
  }
});

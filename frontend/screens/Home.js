import React from "react";
import { Text, StyleSheet, View, TextInput, KeyboardAvoidingView, FlatList, ActivityIndicator, Image, TouchableOpacity, AsyncStorage } from "react-native";
import { NavigationActions } from 'react-navigation';
import axios from "axios";
import _ from "lodash";
import { getStatusBarHeight } from 'react-native-status-bar-height';

//Home Tab Area
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      brand: [],
      searchResults: [],
      selectedBrand: null,
      isBrandSelected: false,
      searchQuery: null,
      visibleBrandsList: true,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('id_token').then((token) => {
      axios.defaults.headers.common['Authorization'] = "Bearer " + token
      axios.post("http://62.75.141.240:9001/home", {
      })
        .then(response => {
          this.setState({
            isLoading: false,
            brand: response.data,
            visibleBrandsList: true
          });
        })
        .catch(error => {
          console.log(error)
        });
    })
  };

  remoteRequest = _.debounce(() => {
    if (!!this.state.searchQuery && this.state.searchQuery.trim().length > 1) {
      this.setState({
        visibleBrandsList: false
      })
      axios.post("http://62.75.141.240:9001/brandSearch", {
        search: this.state.searchQuery
      })
        .then(response => {
          this.setState({
            isLoading: false,
            searchResults: response.data
          });
        })
        .catch(error => {
          console.log(error);
        });
    } else {this.setState({
      visibleBrandsList: true
    })}
  }, 250);

  handleSearch = searchedText => {
    this.setState({
      searchQuery: searchedText.toLowerCase(),
    }, () => this.remoteRequest());
  };

  setBrandToNavigator = (id, name)=> {
    console.log("ID del brand selezionato ", id);
    this.props.navigation.navigate({ routeName: 'products', params: {idBrand: id, title: name} });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.mainContainer}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <View style={styles.searchForm}>
            <TextInput style={styles.searchInput}
              onChangeText={this.handleSearch}
              placeholder="Search Composition's"
              autoCapitalize="none" autoCorrect={false}
              underlineColorAndroid={"#FFFFFF"} placeholderTextColor={"#bfbfbf"}
            />
          </View>
        </View>

      {this.state.visibleBrandsList &&
        <FlatList
          data={this.state.brand}
          horizontal={false}
          numColumns={2}
          columnWrapperStyle={{ flex: 1, marginTop: 2.5, marginLeft: 5, marginRight: 5 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            <TouchableOpacity
              style={styles.card}
              onPress={() => { this.setBrandToNavigator(item.id, item.name) }}
            >
              <View style={styles.cardArrowContainer}>
                <Image source={{ uri: "http://www.danilomongelli.it/pgb/assets/img/arrowTR.png" }} style={styles.cardArrow} />
              </View>
              <View style={styles.cardTitle}>
                <Text style={{ fontSize: 12, fontFamily: "googlesans-regular" }}>{item.name}</Text>
              </View>
              <View style={styles.cardImageContainer}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
              </View>
              <View style={styles.cardPQuantity}>
                <Text style={{ fontSize: 12 }}>  </Text>
              </View>
              <View style={styles.cardBottomLine}></View>
            </TouchableOpacity>
          }
        />}

        {!this.state.visibleBrandsList && 
        <FlatList
          data={this.state.searchResults}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) =>
            <View style={styles.compositionListContainer}>
              <View style={styles.productsContainer}>
                <TouchableOpacity
                  onPress={() => { this.setBrandToNavigator(item.id, item.name) }}
                >
                  <Image source={{ uri: item.image }}/>
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
  mainContainer:{
    flex: 1,
    marginTop: getStatusBarHeight(),
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
  card: {
    height: 250,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "space-between",
    flexBasis: 1,
    flexGrow: 1,
    margin: 5
  },
  cardArrowContainer: {
    width: "100%",
    height: 15,
    alignItems: "flex-end"
  },
  cardArrow: {
    width: 15,
    height: 15,
  },
  cardTitle: {
    width: "100%",
    height: 12,
    paddingLeft: 15,
    justifyContent: "center",
    
  },
  cardImageContainer: {
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: 150,
    height: 150
  },
  cardPQuantity: {
    width: "100%",
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBottomLine: {
    width: "100%",
    height: 4,
    backgroundColor: "#191A1D"
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
  },
});
import React from "react";
import { Text, StyleSheet, View, TextInput, KeyboardAvoidingView, FlatList, ActivityIndicator, Image, TouchableOpacity, AsyncStorage } from "react-native";
import { NavigationActions } from 'react-navigation';
import axios from "axios";
import { getStatusBarHeight } from 'react-native-status-bar-height';

//Home Tab Area
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      brand: [],
      selectedBrand: null,
      isBrandSelected: false,
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
            brand: response.data
          });
        })
        .catch(error => {
          console.log(error)
        });
    })
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
      <KeyboardAvoidingView style={styles.mainContainer}>
        <View style={styles.searchForm}>
          <TextInput style={styles.SearchInput}
            placeholder="Search Brand's"
            underlineColorAndroid={"#FFFFFF"}
            placeholderTextColor={"#bfbfbf"}
          />
        </View>

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
        />
      </KeyboardAvoidingView>
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
    elevation: 3,
    backgroundColor: "#191A1D",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  SearchInput: {
    width: "95%",
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
});
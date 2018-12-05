import React from "react";
import { Text, StyleSheet, View, TouchableOpacity, FlatList, Image, ActivityIndicator } from "react-native";
import { NavigationActions } from 'react-navigation';
import axios from "axios";

export default class ProductsSelectedCompositionScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Products with ${navigation.state.params.title}`,
    });
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      products: []
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    const res = this.props.navigation.state.params.res;
    const mappedResponse = res.map((item)=>{ return item.product_id })
    console.log("\nmappedResponse: ", mappedResponse)

    axios.post("http://62.75.141.240:9001/productsList", {
      selectedProductsByComposition: mappedResponse
    })
      .then(response => {
        this.setState({
          isLoading: false,
          products: response.data
        })
      })
      .catch(error => {
        console.log(error)
      });
  }

  setProductToNavigator = (itemId, itemName) => {
    console.log("\nID Prodotto Selezionato: ", itemId);
    this.props.navigation.navigate({ routeName: 'productdetail', params: { productFromList: itemId, title: itemName } });
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
      <View>
        <FlatList
          data={this.state.products}
          horizontal={false}
          numColumns={2}
          columnWrapperStyle={{ flex: 1, marginTop: 2.5, marginLeft: 5, marginRight: 5 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            <TouchableOpacity
              style={styles.card}
              onPress={() => { this.setProductToNavigator(item.id, item.name) }}
            >
              <View style={styles.cardArrowContainer}>
                <Image source={{ uri: "http://www.danilomongelli.it/pgb/assets/img/arrowTR.png" }} style={styles.cardArrow} />
              </View>
              <View style={styles.cardTitle}>
                <Text style={{ fontSize: 11 }}>{item.name}</Text>
              </View>
              <View style={styles.cardImageContainer}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
              </View>
              <View style={styles.dietType}>
                <Text style={{ color: "#33B6C0", fontSize: 10 }}>{item.diet.name}</Text>
              </View>
              <View style={styles.cardBottomLine}></View>
            </TouchableOpacity>
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: "100%",
    backgroundColor: "#F2F2F2",
    justifyContent: "space-around"
  },
  card: {
    height: 260,
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
    margin: 10
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
    marginBottom: 10,
    justifyContent: "center",
  },
  cardImageContainer: {
    width: "100%",
    minHeight: 169,
    backgroundColor: "#F6F6F6",
    padding: 5,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  cardImage: {
    minWidth: 110,
    minHeight: 169
  },
  dietType: {
    width: "100%",
    height: 30,
    paddingLeft: 15,
    justifyContent: "center"
  },
  cardBottomLine: {
    width: "100%",
    height: 4,
    backgroundColor: "#283B47"
  },
});
import React from "react";
import { FlatList, Text, StyleSheet, View, Image, ActivityIndicator } from "react-native";
import axios from "axios";
import { NavigationActions } from "react-navigation";
import RecipeList from '../components/RecipeList';

export default class ProductDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
    });
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      productDetail: []
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    axios.post("http://62.75.141.240:9001/productDetail", {
      id: navigation.state.params.productFromList
    })
    .then(response => {
      this.setState({
        isLoading: false,
        productDetail: response.data
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{justifyContent: "center", alignContent: "center", alignItems: "center"}}>
          <ActivityIndicator />
        </View>
      );
    }
    
    return (
      <View>
        <FlatList
          data={this.state.productDetail}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
              <View style={styles.mainContainer1}>
                <View style={styles.mainContainer1LeftArrow} />
                <View style={styles.ImageContainer}>
                  <Image style={styles.images} source={{ uri: item.image }} />
                </View>
                <View style={styles.infoBox}>
                  <View style={styles.infoRows}>
                    <Text style={styles.info}>Type: </Text>
                    <Text style={{ fontSize: 11, color: "#33B6C0" }}>
                      {item.type.name}
                    </Text>
                  </View>
                  <View style={styles.infoRows}>
                    <Text style={styles.info}>Diet: </Text>
                    <Text style={{ fontSize: 11, color: "#33B6C0" }}>
                      {item.diet.name}
                    </Text>
                  </View>
                  <View style={styles.infoRows}>
                    <Text style={styles.info}>Cereal Free: </Text>
                    <Text style={{ fontSize: 11, color: "#33B6C0" }}>
                      {item.is_cereal_free.toString()}
                    </Text>
                  </View>
                  <View style={styles.infoRows}>
                    <Text style={styles.info}>For Puppy: </Text>
                    <Text style={{ fontSize: 11, color: "#33B6C0" }}>
                      {item.is_puppy.toString()}
                    </Text>
                  </View>
                  <View style={styles.infoRows}>
                    <Text style={styles.info}>Weight: </Text>
                    <Text style={{ fontSize: 11, color: "#33B6C0" }} />
                  </View>
                </View>
              </View>
              <View style={styles.mainContainer2}>
                <View style={styles.elementsBox}>
                  <View style={styles.analyticsTitle}>
                    <Text style={{ color: "#283B47", fontWeight: "bold" }}>
                      Ingredients
                    </Text>
                  </View>
                  <View style={styles.compositionSpecs}>
                    <RecipeList
                      id={this.props.navigation.state.params.productFromList}
                      url='productDetailIngredients'
                    />
                  </View>
                </View>
                <View style={styles.elementsBox}>
                  <View style={styles.analyticsTitle}>
                    <Text style={{ color: "#283B47", fontWeight: "bold" }}>
                      Aminoacids
                    </Text>
                  </View>
                  <View style={styles.compositionSpecs}>
                    <RecipeList
                      id={this.props.navigation.state.params.productFromList}
                      url="productDetailAminoacids"
                    />
                  </View>
                </View>
                <View style={styles.elementsBox}>
                  <View style={styles.analyticsTitle}>
                    <Text style={{ color: "#283B47", fontWeight: "bold" }}>
                      Analytical Composition
                    </Text>
                  </View>
                  <View style={styles.compositionSpecs}>
                    <RecipeList
                      id={this.props.navigation.state.params.productFromList}
                      url="productDetailAnalyticalcompositions"
                    />
                  </View>
                </View>
                <View style={styles.elementsBox}>
                  <View style={styles.analyticsTitle}>
                    <Text style={{ color: "#283B47", fontWeight: "bold" }}>
                      Minerals
                    </Text>
                  </View>
                  <View style={styles.compositionSpecs}>
                    <RecipeList
                      id={this.props.navigation.state.params.productFromList}
                      url="productDetailMinerals"
                    />
                  </View>
                </View>
                <View style={styles.elementsBox}>
                  <View style={styles.analyticsTitle}>
                    <Text style={{ color: "#283B47", fontWeight: "bold" }}>
                      Plants/Botanical
                    </Text>
                  </View>
                  <View style={styles.compositionSpecs}>
                    <RecipeList
                      id={this.props.navigation.state.params.productFromList}
                      url="productDetailPlants"
                    />
                  </View>
                </View>
                <View style={styles.elementsBox}>
                  <View style={styles.analyticsTitle}>
                    <Text style={{ color: "#283B47", fontWeight: "bold" }}>
                      Vitamins
                    </Text>
                  </View>
                  <View style={styles.compositionSpecs}>
                    <RecipeList
                      id={this.props.navigation.state.params.productFromList}
                      url="productDetailVitamins"
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer1: {
    width: "100%",
    height: 230,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    elevation: 3
  },
  mainContainer1LeftArrow: {
    width: 5,
    height: "100%",
    backgroundColor: "#33B6C0"
  },
  ImageContainer: {
    flex: 1,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  images: {
    minWidth: 130,
    minHeight: 200
  },
  infoBox: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  infoRows: {
    flexDirection: "row",
    marginBottom: 10
  },
  info: {
    fontSize: 11
  },
  mainContainer2: {
    flex: 1,
    padding: 10,
    margin: 5,
    flexWrap: "wrap",
    borderRadius: 3,
    backgroundColor: "white"
  },
  analyticsTitle: {
    flex: 1,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 25,
    
  },
  elementsBox: {
    flex: 1,
  },
  compositionSpecs: {
    flex: 1,
    padding: 10,
  }
});

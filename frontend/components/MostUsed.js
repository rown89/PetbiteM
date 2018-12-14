import React from "react";
import { Text,StyleSheet,View,TouchableOpacity,ActivityIndicator,ScrollView } from "react-native";
import { NavigationActions } from 'react-navigation';
import axios from "axios";

export default class MostUsed extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoading: true,
      dinamicUrl: this.props.url,
      mostUsedList: [],
      visible: this.props.visible
    };
  }

  componentDidMount () {
    axios.post("http://62.75.141.240:9001/" + this.state.dinamicUrl, {
    })
      .then((response) => {
        this.setState({
          mostUsedList: response.data,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  mostUsedReader () {
    if (this.props.type === "Aminoacids") {
      const x = this.state.mostUsedList.map((item, id) => {
        return (
          <View style={styles.mostUsedItem} key={id}>
            <TouchableOpacity key={id}
              onPress={() => this.onPressMostUsedItem(item.amino_acid.id, item.amino_acid.name)}>
              <Text style={styles.mostUsedText} key={id}>
                {" " + item.amino_acid.name + " "}
              </Text>
            </TouchableOpacity>
          </View>
        );
      });

      return x;
    }

    if (this.props.type === "Analytical Comps") {
      const x = this.state.mostUsedList.map((item, id) => {
        return (
          <View style={styles.mostUsedItem} key={id}>
            <TouchableOpacity key={id}
              onPress={() => this.onPressMostUsedItem(item.anal_comp.id, item.anal_comp.name)}>
              <Text style={styles.mostUsedText} key={id}>
                {" " + item.anal_comp.name + " "}
              </Text>
            </TouchableOpacity>
          </View>
        );
      });

      return x;
    }

    if (this.props.type === "Ingredients") {
      const x = this.state.mostUsedList.map((item, id) => {
        return (
          <View style={styles.mostUsedItem} key={id}>
            <TouchableOpacity key={id}
              onPress={() => this.onPressMostUsedItem(item.ingredient.id, item.ingredient.name)}>
              <Text style={styles.mostUsedText} key={id}>
                {" " + item.ingredient.name + " "}
              </Text>
            </TouchableOpacity>
          </View>
        );
      });

      return x;
    }

    if (this.props.type === "Minerals") {
      const x = this.state.mostUsedList.map((item, id) => {
        return (
          <View style={styles.mostUsedItem} key={id}>
            <TouchableOpacity key={id}
              onPress={() => this.onPressMostUsedItem(item.mineral.id, item.mineral.name)}>
              <Text style={styles.mostUsedText} key={id}>
                {" " + item.mineral.name + " "}
              </Text>
            </TouchableOpacity>
          </View>
        );
      });

      return x;
    }

    if (this.props.type === "Vitamins") {
      const x = this.state.mostUsedList.map((item, id) => {
        return (
          <View style={styles.mostUsedItem} key={id}>
            <TouchableOpacity key={id}
              onPress={() => this.onPressMostUsedItem(item.vitamin.id, item.vitamin.name)}>
              <Text style={styles.mostUsedText} key={id}>
                {" " + item.vitamin.name + " "}
              </Text>
            </TouchableOpacity>
          </View>
        );
      });

      return x;
    }

    if (this.props.type === "Plants") {
      const x = this.state.mostUsedList.map((item, id) => {
        return (
          <View style={styles.mostUsedItem} key={id}>
            <TouchableOpacity key={id}
              onPress={() => this.onPressMostUsedItem(item.plant.id, item.plant.name)}>
              <Text style={styles.mostUsedText} key={id}>
                {" " + item.plant.name + " "}
              </Text>
            </TouchableOpacity>
          </View>
        );
      });

      return x;
    }
  }

  onPressMostUsedItem (itemId, itemName) {
    const _this = this;
    axios.post("http://62.75.141.240:9001/selectedMostUsed" + this.props.linkType, {
        elementID: itemId
      })
      .then((response) => {
        this.setState({
          productsArray: response.data
        });
        _this.props.navigation.navigate({routeName: "productsmostusedlist", params: { res: this.state.productsArray, title: itemName }});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render () {
    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.mostUsed}>
          <View style={styles.mostUsedTitle}>
            <Text style={{ marginLeft: 15 }}>Most Used {this.props.type}</Text>
          </View>
          <View style={styles.mostUsedInner}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {this.mostUsedReader()}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  ActivityIndicator: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  mostUsed: {
    height: 190,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    elevation: 3
  },
  mostUsedTitle: {
    width: "100%",
    height: 57,
    justifyContent: "center"
  },
  mostUsedInner: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#33B6C0"
  },
  mostUsedText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10
  },
  mostUsedItem: {
    height: 100,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  }
});

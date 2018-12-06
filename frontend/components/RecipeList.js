import React from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { VictoryBar, VictoryChart, VictoryLabel, VictoryTheme, VictoryAxis } from "victory-native";
import axios from "axios";

export default class RecipeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      recipe: [],
      error: null,
      id: this.props.id,
      dinamicUrl: this.props.url,
    };
  }

  componentDidMount() {
    axios.post("http://62.75.141.240:9001/" + this.state.dinamicUrl, {
      id: this.state.id
    })
      .then((response) => {
        this.setState({
          recipe: response.data,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  recipeReader() {
    return this.state.recipe.map((element, id) => {
      amount = element.amount;
      unit = element.unit;
      if (this.state.recipe[0].additive ) { name = element.additive.name; }
      if (this.state.recipe[0].amino_acid ) { name = element.amino_acid.name; }
      if (this.state.recipe[0].anal_comp ) { name = element.anal_comp.name; }
      if (this.state.recipe[0].ingredient ) { name = element.ingredient.name; }
      if (this.state.recipe[0].mineral ) { name = element.mineral.name; }
      if (this.state.recipe[0].plant ) { name = element.plant.name; }
      if (this.state.recipe[0].vitamin ) { name = element.vitamin.name; }

      unitCheck = (unit) => {
        if (unit !== null) {
          return unit.name;
        }
        else {
          return '';
        }
      };

      return (
        <Text key={id} style={{ fontSize: 11, fontFamily: "googlesans-regular" }}>
          {name} {amount}{unitCheck(unit)},{" "}
        </Text>
      );
    });
  }

  chartReader() {
    return this.state.recipe.filter(item => {
      return item.amount >= 0.1
    })
      .map((element, id) => {
        amount = element.amount;
        unit = element.unit;
        
        unitCheck = (unit) => {
          if (unit !== null) { 
            return unit.name; 
          }
          else { 
            return ""; 
          }
        };

        if (this.state.recipe[0].additive ){ name = element.additive.name; }
        if (this.state.recipe[0].amino_acid ){ name = element.amino_acid.name; }
        if (this.state.recipe[0].anal_comp ){ name = element.anal_comp.name; }
        if (this.state.recipe[0].ingredient ){ name = element.ingredient.name; }
        if (this.state.recipe[0].mineral ){ name = element.mineral.name; }
        if (this.state.recipe[0].plant ){ name = element.plant.name; }
        if (this.state.recipe[0].vitamin ){ name = element.vitamin.name; }

        const Data = { x: name, y: amount, z: unitCheck(unit) };
        return Data
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View>
        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
          {this.recipeReader()}
        </View>
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
          <VictoryChart theme={VictoryTheme.material}
            padding={{ top: 30, bottom: 120, right: 30, left: 30 }}
            minDomain={0} 
            domainPadding={20}
          >
            <VictoryBar style={{ data: { fill: "#33B6C0" } }}
              data={this.chartReader()}
              horizontal={false}
              style={{
                data: {
                  fill: "#33B6C0",
                  fontFamily: "googlesans-regular"
                },
                labels: {
                  fontSize: 12,
                  fill: "black",
                  fontFamily: "googlesans-regular"
                }
              }}
              labels={d => d.y + d.z} 
              labelComponent={<VictoryLabel dx={2} />}
            />
            <VictoryAxis theme={VictoryTheme.material}
              label=""
              style={{
                tickLabels: {
                  fontFamily: "googlesans-regular", fontSize: 10, padding: 5, angle: 90, verticalAnchor: 'middle', textAnchor: 'start'
                }
              }}
            />
          </VictoryChart>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
});

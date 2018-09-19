import React, { Component } from "react";
import {
  AccessibilityInfo,
  Button,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonsWrapper: {
    flexDirection: "row"
  },
  button: {
    height: 48,
    width: 48,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center"
  },
  screensWrapper: {
    flex: 1,
    flexDirection: "row",
    width: Dimensions.get("window").width * 3
  },
  card: {
    flex: 1,
    padding: 10,
    paddingTop: 10,
    paddingBottom: 20,
    marginBottom: 5,
    width: "100%"
  },
  title: {
    fontSize: 15,
    fontWeight: "300",
    textAlign: "left"
  },
  active: {
    fontSize: 18,
    color: "red"
  },
  hidden: {
    display: "none"
  }
});

class Home extends Component {
  state = {
    activeIndex: 0,
    isScreenChanged: false,
    screenReaderEnabled: false
  };

  componentDidMount() {
    AccessibilityInfo.addEventListener(
      "change",
      this._handleScreenReaderToggled
    );

    AccessibilityInfo.fetch().then(isEnabled => {
      this.setState({
        screenReaderEnabled: isEnabled
      });
    });
  }

  componentWillUnmount() {
    AccessibilityInfo.removeEventListener(
      "change",
      this._handleScreenReaderToggled
    );
  }

  _handleScreenReaderToggled = isEnabled => {
    this.setState({
      screenReaderEnabled: isEnabled
    });
  };

  handlePress = index => {
    if (this.state.screenReaderEnabled && Platform.OS === "ios") {
      // announce when the screen has changed on ios devices
      // timeout added since voice was overridden during the on click event
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(
          `Changed to screen ${index + 1}`
        );
      }, 1000);
    }

    this.setState({
      activeIndex: index,
      isScreenChanged: true
    });
  };

  render() {
    const screenNumbers = ["1", "2", "3"];

    const screens = [
      {
        backgroundColor: "#DDDDDD",
        title: "Screen 1"
      },
      {
        backgroundColor: "#7FDBFF",
        title: "Screen 2"
      },
      {
        backgroundColor: "#2ECC40",
        title: "Screen 3"
      }
    ];

    return (
      <View style={styles.container}>
        <View style={styles.buttonsWrapper}>
          {/* Hidden text which is read by the screen reader when screen is changed (android only) */}
          <Text
            accessibilityLiveRegion={
              this.state.isScreenChanged ? "polite" : "none"
            }
            style={styles.hidden}
          >{`Changed to screen ${this.state.activeIndex + 1}`}</Text>
          {screenNumbers.map((num, i) => {
            return (
              <TouchableHighlight
                accessibilityLabel={`show screen ${num}`} // text read when button is in focus
                accessibilityRole="button" //  type of element
                accessibilityState={i === this.state.activeIndex && "selected"} // gives the current state of the button(selected or unselected)
                key={i}
                onPress={() => this.handlePress(i)}
                style={styles.button}
              >
                <Text
                  style={[
                    styles.title,
                    i === this.state.activeIndex && styles.active
                  ]}
                >
                  {num}
                </Text>
              </TouchableHighlight>
            );
          })}
        </View>
        <View
          style={[
            styles.screensWrapper,
            {
              transform: [
                {
                  translateX:
                    -this.state.activeIndex * Dimensions.get("window").width
                }
              ]
            }
          ]}
        >
          {screens.map((screen, index) => {
            return (
              <View
                accessibile={true} // make element accessibile
                accessibilityLabel={`screen ${this.state.activeIndex + 1}`} // text read when block element is focused on
                key={index}
                style={[
                  styles.card,
                  { backgroundColor: screen.backgroundColor }
                ]}
              >
                <Text style={styles.title}>{screen.title}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

export default Home;

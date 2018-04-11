/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Theme, { createTheme, createStyle, createThemedComponent } from 'react-native-theming';

const themes = [
  createTheme({
    backgroundColor: 'white',
    textColor: 'black',
    buttonColor: 'blue',
    buttonText: 'white',
    icon: require('./icons/default.png'),
    statusBar: 'dark-content',
  }, 'Light'),
  createTheme({
    backgroundColor: 'black',
    textColor: 'white',
    buttonColor: 'yellow',
    buttonText: 'black',
    icon: require('./icons/colorful.png'),
    statusBar: 'light-content',
  }, 'Dark'),
];

const styles = createStyle({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '@backgroundColor',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '@textColor',
  },
  instructions: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 5,
  },
  // The generic button and button can be one, only separated
  // here for testing purpose
  genericButton: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderRadius: 3,
  },
  button: {
    backgroundColor: '@buttonColor',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
  },
});

const Button = createThemedComponent(TouchableOpacity);
const Bar = createThemedComponent(StatusBar, ['barStyle', 'backgroundColor']);

export default class ThemeDemo extends Component {
  render() {
    return (
      <Theme.View style={styles.container}>
        <Bar barStyle="@statusBar" backgroundColor="@backgroundColor" />
        <Theme.Image source="@icon" />
        <Theme.Text style={styles.welcome}>
          React Native Theming Demo!
        </Theme.Text>
        <Theme.Text style={styles.instructions}>
          To experiment check app.js file
        </Theme.Text>
        <Text style={styles.instructions}>
          You can now create your themes using JSON. The styles declaration
          is directly compatible with StyleSheet.create. You just need to
          replace `StyleSheet.create` with `createStyle` and add your theme
          variables in the styles.
        </Text>
        <View style={{ flexDirection: 'row' }}>
          { themes.map(theme => (
            <Button key={theme.name} style={[styles.button, styles.genericButton]} onPress={() => theme.apply()}>
              <Theme.Text style={[styles.buttonText, { color: '@buttonText' }]}>{theme.name}</Theme.Text>
            </Button>
            ))
          }
        </View>
      </Theme.View>
    );
  }
}

AppRegistry.registerComponent('Foundation', () => ThemeDemo);

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
} from 'react-native';

import MutualFundConf from './src/components/MFConf';
import StocksConf from './src/components/StocksConf';
import MutualFundEdit from './src/components/MFEdit';

function App() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text>Below is MF Conf</Text>
      <MutualFundConf title="Configure Mututal Funds">
        This is Mutual fund editing section
      </MutualFundConf>
      <Text> From here stocks configurations</Text>
      <StocksConf title="Stocks configurations">
        This is stocks edition section
      </StocksConf>
      <Text> From here mutual fund edit/create new screen</Text>
      <MutualFundEdit></MutualFundEdit>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'dodgerblue',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default App;

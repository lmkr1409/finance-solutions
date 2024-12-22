/* Mututal Fund edit or create new screen
 */

import React from 'react';
import {View, StyleSheet, Button, Text, TouchableOpacity} from 'react-native';

function MutualFundEdit() {
  return (
    <View style={styles.MFEditContainer}>
      <Text>This is from MF Edit JSX</Text>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.button}
          onPress={console.log('Button clicked!')}>
          <Text> Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  MFEditContainer: {
    backgroundColor: '#e6ffff',
    flex: 1,
    padding: 8,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ff6600',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
});

export default MutualFundEdit;

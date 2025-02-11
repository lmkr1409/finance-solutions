// Required dependencies
// npm install @react-navigation/native @react-navigation/stack react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context react-native-vector-icons react-native-get-random-values axios

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  TextInput,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import axios from 'axios';

const Stack = createStackNavigator();

const fetchConfigData = async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const ScreenListMFConf = ({navigation}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchConfigData(
      'http://localhost:8000/wealth/get_investment_conf/?investment_source=MutualFunds',
    ).then(result => setData(result.mf_conf_data));
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('EditMFConf', {config: item})}>
      <Text>{item.fund_name}</Text>
      <Text>Category: {item.category}</Text>
      <Text>Current Value: {item.curr_val}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.conf_id.toString()}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('EditMFConf', {config: null})}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const ScreenEditMFConf = ({route, navigation}) => {
  const [formData, setFormData] = useState(
    route.params?.config || {
      conf_id: null,
      fund_name: '',
      fund_code: '',
      exchange: '',
      category: '',
      sub_category: '',
      market_cap: '',
      sector: '',
      curr_val: '',
      lock_in: '',
      goal_name: '',
    },
  );

  const handleSave = async () => {
    const url = 'http://localhost:8000/wealth/update_investment_conf/';
    try {
      await axios.post(url, formData);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Fund Name"
        value={formData.fund_name}
        onChangeText={text => setFormData({...formData, fund_name: text})}
      />
      {/* Add similar TextInputs for all fields in formData */}
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const ScreenListStockConf = ({navigation}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchConfigData(
      'http://localhost:8000/wealth/get_investment_conf/?investment_source=Stocks',
    ).then(result => setData(result.stock_conf_data));
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('EditStockConf', {config: item})}>
      <Text>{item.stock_name}</Text>
      <Text>Sector: {item.sector}</Text>
      <Text>Current Value: {item.curr_val}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.conf_id.toString()}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('EditStockConf', {config: null})}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const ScreenEditStockConf = ({route, navigation}) => {
  const [formData, setFormData] = useState(
    route.params?.config || {
      conf_id: null,
      stock_name: '',
      stock_code: '',
      exchange: '',
      market_cap: '',
      sector: '',
      ipo: false,
      curr_val: '',
      lock_in: '',
      goal_name: '',
    },
  );

  const handleSave = async () => {
    const url = 'http://localhost:8000/wealth/update_investment_conf/';
    try {
      await axios.post(url, formData);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Stock Name"
        value={formData.stock_name}
        onChangeText={text => setFormData({...formData, stock_name: text})}
      />
      {/* Add similar TextInputs for all fields in formData */}
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ListMFConf"
          component={ScreenListMFConf}
          options={{title: 'Mutual Funds'}}
        />
        <Stack.Screen
          name="EditMFConf"
          component={ScreenEditMFConf}
          options={{title: 'Edit Mutual Fund'}}
        />
        <Stack.Screen
          name="ListStockConf"
          component={ScreenListStockConf}
          options={{title: 'Stocks'}}
        />
        <Stack.Screen
          name="EditStockConf"
          component={ScreenEditStockConf}
          options={{title: 'Edit Stock'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ee',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
});

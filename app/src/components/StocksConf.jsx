/*
Stocks configuration view is defined here
Call Stocks configuration api and list down the data
*/

import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';
import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
};

const fetchConfigData = async url => {
  try {
    const response = await axios.get(url);
    console.log('Stocks data:', response.data);
    return response.data;
  } catch (error) {
    return [];
  }
};

function StocksConf() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchConfigData(
      'http://10.0.2.2:8000/wealth/get_investment_conf?investment_source=Stocks',
    ).then(result => setData(result.stock_conf_data));
  }, []);
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.opacityItem}
      onPress={console.log(item.stock_name)}>
      <View style={{flex: 1}}>
        <View>
          <Text>{item.stock_name}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Text style={{flex: 0.5, flexDirection: 'row'}}>
            MarketCap: {item.market_cap}
          </Text>
          <Text style={{flex: 0.5, flexDirection: 'row'}}>
            Current Value: {item.curr_val}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text> This is from Stocks JSX</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.conf_id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  opacityItem: {
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

export default StocksConf;

/*
Mutual Fund configuration view is defined here
Call Mutual funds configuration api and list down the data
*/

import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';
import axios from 'axios';

/* one tile contain below info
{
    "conf_id": 1,
    "fund_name": "EDELWEISS NIFTY LARGE MID CAP 250 INDEX FUND",
    "fund_code": "EDEL_NIFT_LRG_1HQ4SCM",
    "exchange": "MUTF_IN",
    "category": "Equity",
    "sub_category": "Index",
    "market_cap": "Large&Mid",
    "sector": null,
    "curr_val": 15.88,
    "lock_in": 0.0,
    "goal_name": "Retirement"
}
*/

const headers = {
  'Content-Type': 'application/json',
};

const fetchConfigData = async url => {
  console.log('Called fetchConfigdata');
  try {
    console.log('Before axios call');
    const response = await axios.get(url);
    console.log('FetchConfigData');
    console.log(response.status);

    return response.data;
  } catch (error) {
    console.log('Error fetching data:', error.response.data);
    console.error('Error fetching data:', error.response.data);
    return [];
  }
};

function MutualFundConf() {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log('Calling useEffetc');
    fetchConfigData(
      'http://10.0.2.2:8000/wealth/get_investment_conf?investment_source=MutualFunds',
    ).then(result => setData(result.mf_conf_data));
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.opacityItem}
      onPress={console.log(item.fund_name)}>
      <View style={{flex: 1}}>
        <View>
          <Text>{item.fund_name}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Text style={{flex: 0.5, flexDirection: 'row'}}>
            Category: {item.category}
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
      <Text> This is from MFConf JSX</Text>
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
    flex: 0.5,
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

export default MutualFundConf;

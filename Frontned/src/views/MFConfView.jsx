/*
Mutual Fund configuration view is defined here
Call Mutual funds configuration api and list down the data
*/

import {StyleSheet, View, Text} from 'react-native';
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

function MutualFundConf() {
  return (
    <View>
      <View>
        <Text>This is Mututla Fund Configuration screen</Text>
      </View>
      <View>
        <Text>"fund_name": "EDELWEISS NIFTY LARGE MID CAP 250 INDEX FUND"</Text>
        <Text>"exchange": "MUTF_IN",</Text>
      </View>
    </View>
  );
}

const mfConfStyles = StyleSheet.create({
  mfConfContainer: {
    flex: 1,
    alignContent: 'left',
  },
});

export default MutualFundConf;

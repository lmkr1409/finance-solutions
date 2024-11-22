# finance-solutions
OneStop Solutions for all finance applications I needed.

## Wealth App
Which calculates how much I am investing in each segment and tracks profits, losses and totals. This app should have following details
Currently my investments are PF, MF, Stocks, NPS. I may add PPF in future. And I am investing these in 2 accounts as of now and I will add my son account.
What this app should have
- Investment, profit and total progress based on filter(Weekly/Monthly/Yearly)
- Investment distribution over Segments(Equity, Debt, Gold, RealEstate) for total as well as filters(Weekly/Monthly/Yearly).
- Investment vs Profit distribution for each source and segment.
- TODO: add more chart details later

To have multiple details like these we need few configurations and transactions tables.

- iv_account
    - acc_id pk serial
    - acc_name varchar
- iv_goal
    - goal_id pk serial
    - goal_name varchar
- iv_source
    - source_id pk serial
    - source_name varchar
- iv_conf_stock
    - conf_id pk serial
    - stock_name varchar
    - stock_code varchar
    - market_cap varchar
    - sector varchar
    - ipo boolean
    - curr_val float
    - lock_in float
    - goal_id fk iv_goal
    - source_id fk iv_source
- iv_conf_mf
    - conf_id pk serial
    - fund_name varchar
    - fund_code varchar
    - category varchar
    - sub_category varchar
    - market_cap varchar
    - sector varchar
    - curr_val float
    - lock_in float
    - goal_id fk iv_goal
    - source_id fk iv_source
- iv_pf_conf
    - conf_id pk serial
    - pf_type varchar
    - lock_in float
- iv_conf_nps
    - conf_id pk serial
- iv_txn_stock
    - txn_id pk serial
    - account_id fk iv_account
    - record_date datetime without timezone
    - invested_amount float
    - quantity float
    - avg_price float
- iv_txn_mf
    - txn_id pk serial
    - account_id fk iv_account
    - record_date datetime without timezone
    - invested_amount float
    - units float
    - nav float
- iv_combined_txn
    - txn_id
    - record_date datetime without timezone
    - invested_amount float
    - current_amount float
    - pnl float
    - pnl_percent float
    - no_of_days int
    - free_units float

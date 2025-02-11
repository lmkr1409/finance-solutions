import "./styles.css";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  Home,
  Settings,
  CreditCard,
  BarChart2,
  DollarSign,
  Briefcase,
  Shield,
  Landmark,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <MainContent />
      </div>
    </Router>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <nav className="nav">
        <SidebarItem
          to="/"
          icon={<Home size={20} />}
          label="Dashboard"
          collapsed={collapsed}
        />
        <SidebarItem
          to="/configurations"
          icon={<Settings size={20} />}
          label="Configurations"
          collapsed={collapsed}
        >
          <SidebarItem
            to="/configurations/stocks"
            icon={<BarChart2 size={16} />}
            label="Stocks"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/configurations/mutualfunds"
            icon={<DollarSign size={16} />}
            label="Mutual Funds"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/configurations/pf"
            icon={<Briefcase size={16} />}
            label="PF"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/configurations/nps"
            icon={<Shield size={16} />}
            label="NPS"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/configurations/fd"
            icon={<Landmark size={16} />}
            label="FD"
            collapsed={collapsed}
          />
        </SidebarItem>
        <SidebarItem
          to="/transactions"
          icon={<CreditCard size={20} />}
          label="Transactions"
          collapsed={collapsed}
        >
          <SidebarItem
            to="/transactions/stocks"
            icon={<BarChart2 size={16} />}
            label="Stocks"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/transactions/mutualfunds"
            icon={<DollarSign size={16} />}
            label="Mutual Funds"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/transactions/pf"
            icon={<Briefcase size={16} />}
            label="PF"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/transactions/nps"
            icon={<Shield size={16} />}
            label="NPS"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/transactions/fd"
            icon={<Landmark size={16} />}
            label="FD"
            collapsed={collapsed}
          />
        </SidebarItem>
      </nav>
    </div>
  );
};

const SidebarItem = ({ to, icon, label, collapsed, children }) => (
  <div>
    <Link to={to} className="sidebar-item">
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
    {!collapsed && children && <div className="submenu">{children}</div>}
  </div>
);

const MainContent = () => {
  return (
    <div className="main-content">
      <Routes>
        <Route path="/" element={<Page title="Dashboard" />} />
        <Route
          path="/configurations"
          element={<Page title="Configurations" />}
        />
        <Route path="/configurations/stocks" element={<StockConfig />} />
        <Route path="/configurations/mutualfunds" element={<MFConfig />} />
        <Route path="/transactions" element={<Page title="Transactions" />} />
        <Route path="/configurations/edit/:id" element={<EditConfig />} />
        <Route path="/configurations/add" element={<EditConfig />} />
      </Routes>
    </div>
  );
};

const Page = ({ title }) => <div className="page-title">{title}</div>;

const EditConfig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState({ fund_name: "" });

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/wealth/investment/get_conf/${id}`)
        .then((response) => response.json())
        .then((data) => setConfig(data))
        .catch((error) => console.error("Error fetching config:", error));
    }
  }, [id]);

  const handleSave = () => {
    fetch(
      `${API_BASE_URL}/wealth/investment/${
        id ? `update_conf/${id}` : "add_conf"
      }`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      }
    )
      .then(() => navigate("/configurations"))
      .catch((error) => console.error("Error saving config:", error));
  };

  return (
    <div>
      <h2>{id ? "Edit" : "Add"} Configuration</h2>
      <label>Fund Name: </label>
      <input
        type="text"
        value={config.fund_name}
        onChange={(e) => setConfig({ ...config, fund_name: e.target.value })}
      />
      <button onClick={handleSave}>Save</button>
      <button
        onClick={() => navigate("/configurations")}
        className="cancel-button"
      >
        Cancel
      </button>
    </div>
  );
};

const StockConfig = () => {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/wealth/get_investment_conf?investment_source=Stocks`)
      .then((response) => response.json())
      .then((data) => setStockData(data.stock_conf_data))
      .catch((error) => console.error("Error fetching Stock data:", error));
  }, []);

  return (
    <div>
      <h2 className="section-title">Stocks Configuration</h2>
      <div className="grid-container">
        {stockData.map((stock) => (
          <div key={stock.conf_id} className="grid-item">
            <h3 className="item-title">{stock.stock_name}</h3>
            <p>Sector: {stock.sector}</p>
            <p>Current Value: ₹{stock.curr_val}</p>
            <Link
              to={`/configurations/edit/${stock.conf_id}`}
              className="edit-link"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const MFConfig = () => {
  const [mfData, setMFData] = useState([]);

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/wealth/get_investment_conf?investment_source=MutualFunds`
    )
      .then((response) => response.json())
      .then((data) => setMFData(data.mf_conf_data))
      .catch((error) => console.error("Error fetching MF data:", error));
  }, []);

  return (
    <div>
      <h2 className="section-title">Mutual Funds Configuration</h2>
      <div className="grid-container">
        {mfData.map((mf) => (
          <div key={mf.conf_id} className="grid-item">
            <h3 className="item-title">{mf.fund_name}</h3>
            <p>Category: {mf.category}</p>
            <p>Current Value: ₹{mf.curr_val}</p>
            <Link
              to={`/configurations/edit/${mf.conf_id}`}
              className="edit-link"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default App;

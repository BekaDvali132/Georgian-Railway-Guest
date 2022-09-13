import "./App.scss";
import AdminRoute from "./components/admin/adminRoute/AdminRoute";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddCountry from "./components/admin/countries/AddCountry";
import Countries from "./components/admin/countries/Countries";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AdminRoute />}>
            <Route exact path="/countries/add" element={<AddCountry />} />
            <Route exact path="/countries" element={<Countries />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

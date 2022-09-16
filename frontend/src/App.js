import "./App.scss";
import AdminRoute from "./components/admin/adminRoute/AdminRoute";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddCountry from "./components/admin/countries/AddCountry";
import Countries from "./components/admin/countries/Countries";
import EditCountry from "./components/admin/countries/EditCountry";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={<AdminRoute />}>
            <Route exact path="/admin/countries/add" element={<AddCountry />} />
            <Route exact path="/admin/countries/:id/edit" element={<EditCountry />} />
            <Route exact path="/admin/countries" element={<Countries />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

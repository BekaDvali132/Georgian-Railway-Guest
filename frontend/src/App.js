import "./App.scss";
import AdminRoute from "./components/admin/adminRoute/AdminRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddCountry from "./components/admin/countries/AddCountry";
import Countries from "./components/admin/countries/Countries";
import EditCountry from "./components/admin/countries/EditCountry";
import Login from "./components/admin/login/Login";
import {
  AdminContextProvider,
} from "./components/contexts/adminContext/adminContext";
import { TranslationContextProvider } from "./components/contexts/TranslationContext";
import Customers from "./components/admin/customers/Customers";
import AddCustomers from "./components/admin/customers/AddCustomers";

function App() {
  return (
    <Router>
      <TranslationContextProvider>
        <div className="App">
          <AdminContextProvider>
            <Routes>

              <Route path="/admin/login" element={<Login />} />

              <Route path="/admin" element={<AdminRoute />}>

                {/* Country routes */}
                
                <Route exact path="/admin/countries" element={<Countries />} />
                <Route
                  exact
                  path="/admin/countries/add"
                  element={<AddCountry />}
                />
                <Route
                  exact
                  path="/admin/countries/:id/edit"
                  element={<EditCountry />}
                />

                {/* Customer routes */}

                <Route exact path="/admin/customers" element={<Customers />} />
                <Route
                  exact
                  path="/admin/customers/add"
                  element={<AddCustomers />}
                />

              </Route>
            </Routes>
          </AdminContextProvider>
        </div>
      </TranslationContextProvider>
    </Router>
  );
}

export default App;

import "./App.scss";
import AdminRoute from "./components/admin/adminRoute/AdminRoute";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddCountry from "./components/admin/countries/AddCountry";
import Countries from "./components/admin/countries/Countries";
import EditCountry from "./components/admin/countries/EditCountry";
import Login from "./components/admin/login/Login";
import { useContext, useState } from "react";
import {
  AdminContext,
  AdminContextProvider,
} from "./components/contexts/adminContext/adminContext";
import axios from "axios";
import { TranslationContextProvider } from "./components/contexts/TranslationContext";

function App() {

  return (
    <Router>
      <TranslationContextProvider>
        <div className="App">
          <AdminContextProvider>
            <Routes>
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<AdminRoute />}>
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
                <Route exact path="/admin/countries" element={<Countries />} />
              </Route>
            </Routes>
          </AdminContextProvider>
        </div>
      </TranslationContextProvider>
    </Router>
  );
}

export default App;

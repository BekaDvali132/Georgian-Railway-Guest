import "./App.css";
import AdminRoute from "./components/admin/adminRoute/AdminRoute";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AdminRoute />}>
            <Route exact path='/' element={<div>hello</div>}/>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

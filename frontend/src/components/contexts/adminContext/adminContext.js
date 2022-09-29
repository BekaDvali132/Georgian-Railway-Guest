import { useState } from "react";
import { createContext } from "react";

export const AdminContext = createContext({
    user: localStorage.getItem("admin"),
    setUser: () => {

    }});

export const AdminContextProvider = (props) => {
    const [state, setState] = useState(JSON.parse(localStorage.getItem("admin")));
    const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem("adminAccessToken")));
  
    const setUser  = async (user, token) => {
      setState(user);
      localStorage.setItem("admin", JSON.stringify(user));
      localStorage.setItem('adminAccessToken', JSON.stringify(token));
    };
  
    const resetUser = () => {
      setState(null);
      localStorage.removeItem("admin");
      localStorage.removeItem('adminAccessToken');
      setAccessToken(null);
    };
  
    const hasRole = roles => {
      const user = JSON.parse(localStorage.getItem("admin"));
      const userRole = user?.role_id || null;
      return roles.some(r => r === userRole?.name);
    };
  
    return (
      <AdminContext.Provider value={{
        user: state,
        setUser: setUser,
        accessToken: accessToken,
        setAccessToken: setAccessToken,
        resetUser: resetUser,
        hasRole: hasRole,
      }}>
        {props.children}
      </AdminContext.Provider>
    );
  }
  
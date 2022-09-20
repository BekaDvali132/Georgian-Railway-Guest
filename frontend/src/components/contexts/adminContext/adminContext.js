import { useState } from "react";
import { createContext } from "react";

export const AdminContext = createContext({
    user: localStorage.getItem("user"),
    setUser: () => {

    }});

export const AdminContextProvider = (props) => {
    const [state, setState] = useState(JSON.parse(localStorage.getItem("user")));
    const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem("accessToken")));
  
    const setUser  = async (user, token) => {
      setState(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', JSON.stringify(token));
    };
  
    const resetUser = () => {
      setState(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      setAccessToken(null);
    };
  
    const hasRole = roles => {
      const user = JSON.parse(localStorage.getItem("user"));
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
  
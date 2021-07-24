import { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../Context/User.Context";

const Logout = (props) => {
  const { user, signOut } = useContext(UserContext);
  useEffect(() => {
    signOut();
  }, []);

  const LayoutJSX = user ? <></> : <Redirect to='/' />;

  return LayoutJSX;
};

export default Logout;

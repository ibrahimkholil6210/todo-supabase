import { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Container/Home";
import Auth from "./Container/Auth";
import Profile from "./Container/Profile";
import Logout from "./Container/Logout";
import { UserContext } from "./Context/User.Context";

const App = (props) => {
  const { user, session } = useContext(UserContext);
  console.log({ user, session });
  return (
    <Switch>
      <Route path='/auth' component={Auth} />
      <Route path='/profile' component={Profile} />
      <Route path='/logout' component={Logout} />
      <Route exact path='/' component={Home} />
    </Switch>
  );
};
export default App;

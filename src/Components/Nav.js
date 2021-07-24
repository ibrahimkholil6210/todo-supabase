import { useContext } from "react";
import { UserContext } from "../Context/User.Context";
import { Link } from "react-router-dom";

const Navigation = (props) => {
  const { user } = useContext(UserContext);
  return (
    <div>
      {!user && <Link to='/auth'>Auth</Link>}
      {<Link to='/'>Home</Link>}
      {user && (
        <>
          <Link to='/profile'>Profile</Link>
          <Link to='/logout'>Logout</Link>
        </>
      )}
    </div>
  );
};

export default Navigation;

import { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../Context/User.Context";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useContext(UserContext);

  const handleLoging = async () => {
    try {
      setLoading(true);
      const { error } = await signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (err) {
      console.log(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };
  if (user) return <Redirect to='/profile' />;
  return (
    <div>
      Sign to te access awesome features!
      <h1>Supabase + React</h1>
      <div>
        <input name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Your Email!' />
      </div>
      <button onClick={handleLoging} disabled={loading}>
        Send Me magic Link
      </button>
    </div>
  );
};

export default Auth;

import { useState, useContext, useEffect } from "react";
import { UserContext } from "../Context/User.Context";
import Layout from "../Layout/index";
import AddTodo from "../Components/AddTodo";
import TodoListAll from "../Components/TodoListAll";
import { supabase } from "../Utills/SupabaseClient";

const Home = (props) => {
  const { user, session } = useContext(UserContext);
  const [todos, setTodos] = useState([]);

  const fetchAllTodos = async () => {
    const { data, error, status } = await supabase.from("todos").select("*").eq("user_id", user.id).order("id", "asc");
    setTodos(data);
  };

  useEffect(() => {
    if (!user) return;
    fetchAllTodos();
    const todosSubscription = supabase
      .from("todos:user_id=eq." + user.id)
      .on("*", (payload) => {
        console.log("Change received!", payload);
        fetchAllTodos();
      })
      .subscribe();
    return () => {
      supabase.removeSubscription(todosSubscription);
    };
  }, [user]);

  useEffect(() => {
    console.log("Todos_length", todos);
  }, [todos]);
  return (
    <Layout>
      <div>
        Hello From Home
        <br />
        {user && (
          <>
            <AddTodo />
            <TodoListAll todos={todos} fetchAllTodos={fetchAllTodos} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;

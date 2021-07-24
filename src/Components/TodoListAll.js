import { useState, useEffect, useContext } from "react";
import { UserContext } from "../Context/User.Context";
import { supabase } from "../Utills/SupabaseClient";

const TodoListAll = (props) => {
  const { todos, fetchAllTodos } = props;
  const { user } = useContext(UserContext);

  const markAsDone = async (idx, status) => {
    try {
      const { data, error } = await supabase.from("todos").update({ status: !status }).eq("id", idx);
      if (error) throw error;
      fetchAllTodos();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>List Of All Todos</h2>
      <ul>
        {(todos || []).map((todo, index) => {
          return (
            <li key={todo + index} onClick={() => markAsDone(todo.id, todo.status)} style={{ textDecoration: todo.status ? "line-through" : "none" }}>
              {todo.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TodoListAll;

import { useState, useContext } from "react";
import { supabase } from "../Utills/SupabaseClient";
import { UserContext } from "../Context/User.Context";

const AddTodo = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useContext(UserContext);

  const handleAddTodo = async () => {
    const dataToBeInserted = {
      title,
      description,
      status: false,
      user_id: user.id,
    };
    const { data, error, status } = await supabase.from("todos").insert(dataToBeInserted);
    // console.log("Insert_Todo", { data, error, status });
    setTitle("");
    setDescription("");
  };
  return (
    <div>
      <h1>Add Todo</h1>
      <input name='todo' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Todo Title' />
      <br />
      <br />
      <textarea
        name='todo_description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='Todo Description'></textarea>
      <br />
      <br />
      <button onClick={handleAddTodo}>Add</button>
    </div>
  );
};

export default AddTodo;

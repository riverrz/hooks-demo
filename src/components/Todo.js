import React, { useState, useEffect } from "react";
import axios from "axios";

const Todo = props => {
  const [todoName, setTodoName] = useState("");
  const [todoList, setTodoList] = useState([]);
  // useEffect runs after every render cycle by default!
  useEffect(() => {
    axios
      .get("https://react-hooks-3a8b3.firebaseio.com/todos.json")
      .then(res => {
        console.log(res);
        const todoData = res.data;
        const todos = [];
        for (const key in todoData) {
          todos.push({ id: key, name: todoData[key].name });
        }
        setTodoList(todos);
      })
      .catch(err => {
        console.log(err);
      });

    // returning a function in useEffect can be used for cleanup.
    // when second argument to useEffect is [], then this return function will work as componentWillUnmount()
    return () => {
      console.log("Cleanup");
    };
  }, []);
  // [] here will contain the entities which needs to be checked
  // which when changed will cause useEffect to execute again
  // Empty [] implies only execute useEffect once!(componentDidMount)
  const inputChangeHandler = event => {
    setTodoName(event.target.value);
  };
  const todoAddHandler = () => {
    setTodoList(todoList.concat({ id: todoList.length, name: todoName }));
    axios
      .post("https://react-hooks-3a8b3.firebaseio.com/todos.json", {
        name: todoName
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <React.Fragment>
      <input
        type="text"
        name="todo"
        id="todo"
        placeholder="Todo"
        onChange={inputChangeHandler}
        value={todoName}
      />
      <button type="button" onClick={todoAddHandler}>
        Add
      </button>
      <ul>
        {todoList.map(todo => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default Todo;

import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

const Todo = props => {
  const [todoName, setTodoName] = useState("");
  // const [todoList, setTodoList] = useState([]);
  // const [submittedTodo, setSubmittedTodo] = useState(null);

  const todoListReducer = (state, action) => {
    switch (action.type) {
      case "ADD":
        return state.concat(action.payload);
      case "SET":
        return action.payload;
      case "REMOVE":
        return state.filter(todo => todo.id !== action.payload);

      default:
        return state;
    }
  };

  const [todoList, dispatch] = useReducer(todoListReducer, []);

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
        dispatch({ type: "SET", payload: todos });
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

  // useEffect(() => {
  //   if (submittedTodo) {
  //     dispatch({ type: "ADD", payload: submittedTodo });
  //   }
  // }, [submittedTodo]);

  const inputChangeHandler = event => {
    setTodoName(event.target.value);
  };
  const todoAddHandler = () => {
    axios
      .post("https://react-hooks-3a8b3.firebaseio.com/todos.json", {
        name: todoName
      })
      .then(res => {
        console.log(res);
        const todoItem = { id: res.data.name, name: todoName };
        dispatch({ type: "ADD", payload: todoItem });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const todoRemoveHandler = todoId => {
    axios
      .delete(`https://react-hooks-3a8b3.firebaseio.com/todos/${todoId}.json`)
      .then(res => {
        dispatch({ type: "REMOVE", payload: todoId });
      })
      .catch(console.log);
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
          <li key={todo.id} onClick={todoRemoveHandler.bind(this, todo.id)}>
            {todo.name}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default Todo;

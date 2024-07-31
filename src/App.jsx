import { XMarkIcon } from "@heroicons/react/16/solid";
import { stagger, useAnimate, motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [filterButton, setFilterButton] = useState(false);

  const inputRef = useRef(null);

  const [refDiv, animate] = useAnimate();

  useEffect(() => {
    setTodos(JSON.parse(localStorage.getItem("todos")));
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleSubmitTodo = (e) => {
    e.preventDefault();

    if (inputRef.current.value.trim().length) {
      console.log(todos.length);

      setTodos([
        ...todos,
        {
          id: todos.length <= 0 ? 1 : todos[todos.length - 1].id + 1,
          description: inputRef.current.value,
          checked: false,
        },
      ]);
    }

    inputRef.current.value = "";
  };

  const handleChecked = (id) => {
    let todosChecked = todos.map((item) => ({
      ...item,
      checked: item.id === id ? !item.checked : item.checked,
    }));

    setTodos(todosChecked);

    if (todosChecked.every((todo) => todo.checked)) {
      let lastCompletedTodo = todos.findIndex((todo) => !todo.checked);
      let random = Math.random();

      if (random < 1 / 3) {
        // bounce
        animate(
          "input",
          { scale: [1, 1.25, 1] },
          { duration: 0.35, delay: stagger(0.075, { from: lastCompletedTodo }) }
        );
      } else if (random < 2 / 3) {
        // shimmy
        animate(
          "input",
          { x: [0, 2, -2, 0] },
          { duration: 0.5, delay: stagger(0.075, { from: lastCompletedTodo }) }
        );
      } else {
        // shake
        animate(
          "input",
          { rotate: [0, 10, -10, 0] },
          { duration: 0.5, delay: stagger(0.1, { from: lastCompletedTodo }) }
        );
      }
    }
  };

  const handleRemoveTodo = (id) => {
    todos.splice(
      todos.findIndex((todo) => todo.id === id),
      1
    );
    setTodos([...todos]);
  };

  return (
    <main className="flex items-center justify-center w-screen h-screen bg-blue-500">
      <div className="w-8/12 max-w-lg px-4 py-4 bg-white rounded ">
        <form className="mb-4 ml-1" onSubmit={handleSubmitTodo}>
          <input
            type="text"
            name="todo"
            id="todo"
            className="rounded w-full border-blue-400 border-2"
            ref={inputRef}
          />
        </form>

        <motion.div
          className="max-h-[350px] overflow-y-auto overflow-x-hidden relative"
          ref={refDiv}
          layout
        >
          {todos.length > 0 && (
            <div className="sticky top-0 left-0 right-0 bg-white z-[2]">
              <span
                className={`px-2 py-1 text-gray-50 rounded-lg text-sm font-medium cursor-pointer ${
                  filterButton ? "bg-blue-900" : "bg-slate-900"
                }  `}
                onClick={() => setFilterButton(!filterButton)}
              >
                Selesai
              </span>
            </div>
          )}

          <AnimatePresence initial={false}>
            {todos.length > 0 ? (
              todos
                .filter((todo) => todo.checked === filterButton)
                .toReversed()
                .map((todo) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0 }}
                    transition={{ layout: { type: "spring", duration: 2 } }}
                    className="flex items-center justify-between "
                    key={todo.id}
                  >
                    <div className="flex items-center gap-x-2 pl-1 py-2 flex-1">
                      <input
                        type="checkbox"
                        id={`item-${todo.id}`}
                        onChange={() => handleChecked(todo.id)}
                        checked={todo.checked}
                        className="form-checkbox cursor-pointer rounded border-gray-400 text-blue-500 focus:ring-0 "
                      />
                      <label
                        htmlFor={`item-${todo.id}`}
                        className={`cursor-pointer flex-1 ${
                          todo.checked
                            ? "text-gray-400 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {todo.description}
                      </label>
                    </div>
                    <XMarkIcon
                      className="w-4 h-4 cursor-pointer text-gray-700"
                      onClick={() => handleRemoveTodo(todo.id)}
                    />
                  </motion.div>
                ))
            ) : (
              <div className="flex justify-center items-center h-full text-gray-400">
                Tambah Catatan
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}

export default App;

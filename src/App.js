import React from "react";
import Title from "./components/Title";
import Anotador from "./pages/Anotador";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="mb-4">
        <Title />
      </div>
      <div >
        <Anotador />
      </div>
    </div>
  );
};

export default App;

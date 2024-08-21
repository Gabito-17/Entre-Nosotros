import React from "react";
import Party from "./pages/Party";
import Title from "./Title";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-8">
      <div className="mb-4">
        <Title />
      </div>
      <div className="items-center w-full max-w-lg ">
        <Party />
      </div>
    </div>
  );
};

export default App;

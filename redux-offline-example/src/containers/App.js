import React from "react";
import Todos from "../components/Todos";

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Todos/>
      </div>
    );
  }
}

export default App

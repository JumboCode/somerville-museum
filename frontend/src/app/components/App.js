import React from "react";
import DisplayImage from "./components/DisplayImage";
import ReactDOM from "react-dom";

function App() {
  return (
    <div className="App">
      <DisplayImage />
    </div>
  );
}

ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );

export default App;
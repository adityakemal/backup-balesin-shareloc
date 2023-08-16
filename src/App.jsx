import { useState } from "react";
import "./App.css";
import GoogleMapCanvas from "./components/GoogleMapCanvas";

function App() {
  return (
    <div className="container">
      <GoogleMapCanvas />
    </div>
  );
}

export default App;

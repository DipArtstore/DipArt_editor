import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import Toast from "./components/main-panel/header/ToastMessage";
import {useSelector} from "react-redux";
import CertifierEditor from "./components/main-panel/DesignEditor";
import Header from "./components/main-panel/header/Header";

function App() {
const isOpen = useSelector(state => state.toast.open);

  return (
    <div className="App">
        <CertifierEditor/>
    </div>
  );
}

export default App;

import { BrowserRouter as Router } from "react-router-dom";
import {ToastContainer} from "react-toastify"
import AppProvider from "./AppProvider";
import AppRoutes from "./AppRoutes/index";
import "./styles.scss";

const App = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer />
    </AppProvider>
  );
};

export default App;

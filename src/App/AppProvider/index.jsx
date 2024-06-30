
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import appStore from "../../stores/appStore"
import updatedTheme from "./themeMuiProvider";

const AppProvider = ({ children }) => {
  return (
    <Provider store={appStore}>
      <ThemeProvider theme={updatedTheme}>{children}</ThemeProvider>
    </Provider>
  );
};

export default AppProvider;

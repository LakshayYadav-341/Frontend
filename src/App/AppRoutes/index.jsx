import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ResponsiveDrawer from "../../Shared/LayoutDesign";
import {Navigate} from "react-router-dom"
import AgentPreferences from "../../Features/AgentPreference";
import UserCreation from "../../Features/UserCreation";
import UserData from "../../Features/UserData";
import List from "../../List/List";

const Dashboard = lazy(() => import("../../Dashboard"));
const Login = lazy(()=> import("./../../Login"))

const ProtectedRoute=({children})=>{
  const isAuth=sessionStorage.getItem("user-token");
  if(!isAuth){
   return  <Navigate to="/" />
  }else{
    return children
  }
}

const AppRoutes = () => {
  return (
    <Suspense fallback={<Login />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
            <ResponsiveDrawer showSidebarAndHeader={true}>
              <Dashboard />
            </ResponsiveDrawer>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/preferences"
          element={
            <ProtectedRoute>
              <ResponsiveDrawer showSidebarAndHeader={true}>
                <AgentPreferences />
              </ResponsiveDrawer>
            </ProtectedRoute>
          }
        />
        
         <Route
          path="/createUser"
          element={
            <ProtectedRoute>
              <ResponsiveDrawer showSidebarAndHeader={true}>
                <UserCreation />
              </ResponsiveDrawer>
            </ProtectedRoute>
          }
        />
         <Route
          path="/dashboard/items/list"
          element={
            <ProtectedRoute>
              <ResponsiveDrawer showSidebarAndHeader={true}>
                <List />
              </ResponsiveDrawer>
            </ProtectedRoute>
          }
        />
         <Route
          path="/users"
          element={
            <ProtectedRoute>
              <ResponsiveDrawer showSidebarAndHeader={true}>
                <UserData />
              </ResponsiveDrawer>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

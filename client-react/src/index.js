import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Landing from "./screens/Landing.jsx";
import Login from "./screens/auth/Login.jsx";
import Register from "./screens/auth/Register.jsx";
import Activate from "./screens/auth/Activate.jsx";
import Dashboard from "./screens/Dashboard.jsx";
import ForgetPassword from "./screens/auth/ForgetPassword.jsx";
import ResetPassword from "./screens/auth/ResetPassword.jsx";

import PrivateRoute from "./Routes/PrivateRoute";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact render={(props) => <Landing {...props} />} />
      <Route path="/login" exact render={(props) => <Login {...props} />} />
      <Route
        path="/register"
        exact
        render={(props) => <Register {...props} />}
      />
      <Route
        path="/users/password/forget"
        exact
        render={(props) => <ForgetPassword {...props} />}
      />
      <Route
        path="/users/password/reset/:token"
        exact
        render={(props) => <ResetPassword {...props} />}
      />
      <Route
        path="/users/activate/:token"
        exact
        render={(props) => <Activate {...props} />}
      />
      <PrivateRoute path="/dashboard" exact component={Dashboard} />
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

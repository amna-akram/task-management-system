import { Route, Routes, Navigate } from "react-router-dom";

import "./App.css";
import Tasks from "./pages/tasks/tasks.component";
import Login from "./pages/login/login.component";
import Signup from "./pages/signup/signup.component";
import ProtectedRoute from "./routes/protected-route";

function App() {

  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/tasks" element={<ProtectedRoute element={Tasks} />} />
    </Routes>
  );
}

export default App;

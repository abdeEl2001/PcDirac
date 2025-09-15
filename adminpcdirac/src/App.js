import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HeaderAdmin from "./HeaderAdmin";
import Dashboard from "./pages/Dashboard";
import ListCours from "./pages/List-cours";
import Profil from "./pages/ProfileForm";
import AddCourseForm from "./pages/AddCourseForm";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import Inscription from "./pages/Inscription";
import EditCourseForm from "./pages/EditFormCourse";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import "./MenuStyle.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/forgotPassword" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>

        {/* Protected routes with layout */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="mainPage">
                {/* Sidebar */}
                <Navbar />

                {/* Right side: Header + content */}
                <div
                  className="rightContent"
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  {/* Header */}
                  <HeaderAdmin
                    profilePicture="/images/pic.jpg"
                    name="Hicham IMTKI"
                  />

                  {/* Page content */}
                  <div style={{ flex: 1, padding: "20px" }}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/list-cours" element={<ListCours />} />
                      <Route path="/profil" element={<Profil />} />
                      <Route path="/addCours" element={<AddCourseForm />} />
                      <Route path="/editCours/:id" element={<EditCourseForm />}/>                    </Routes>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

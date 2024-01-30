import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
 const token = localStorage.getItem('token');
 const user = JSON.parse(localStorage.getItem('user'));

 if (!token || !user) {
    return <Navigate to="/" />;
 }

 const { id } = user;

 // Check the user's id
 if (id === "admin" && window.location.pathname.startsWith("/admin")) {
    return children;
 } else if (id !== "admin" && window.location.pathname.startsWith("/student")) {
    return children;
 } else if (window.location.pathname === "/") {
    return <Navigate to={id === "admin" ? "/admin/home" : "/student/home"} />;
 } else {
    return <Navigate to="/" />;
 }
}

export default PrivateRoute;

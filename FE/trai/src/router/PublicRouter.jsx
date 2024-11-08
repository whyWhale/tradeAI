import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ element }) => {
    const token = useSelector((state) => state.auth.token);
    console.log("**********************************************");
    console.log(token);
    console.log("**********************************************");
    if (token) {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default PublicRoute;
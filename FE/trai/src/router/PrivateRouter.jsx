import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const token = useSelector((state) => state.auth.token);
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return element;
};

export default PrivateRoute;
import {useNavigate} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {instance} from "@api/axios.js";
import {clearToken} from "@store/reducers/authSlice.jsx";
import styled from 'styled-components';

const LogoutButton = () => {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const response = await instance.post('/api/users/logout', null, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                localStorage.removeItem('token');
                navigate("/login");
            }

        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return <StyledButton onClick={handleLogout}>로그아웃</StyledButton>;
}

const StyledButton = styled.button`
    padding: 0 20px;
    color: var(--trai-mint);
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        font-weight: 600; 
    }

    vertical-align: middle; 
`;

export default LogoutButton;

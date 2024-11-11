import {useForm} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import styled from "styled-components";
import {instance} from "@api/axios.js";
import {useState} from "react";
import {useDispatch} from "react-redux";
import { setToken, clearToken } from "../../store/reducers/authSlice"

const LoginPage = () => {

    const {register, handleSubmit, formState: {errors}} = useForm();
    let navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useState(null);
    const dispatch = useDispatch();

    const login = async (data) => {
        try {
            const response = await instance.post(
                '/api/users/login',
                new URLSearchParams({
                    username: data.email,
                    password: data.password
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }
            );

            if (response.status === 200) {
                const token = response.headers['access'];
                localStorage.setItem('token', token);
                dispatch(setToken(token));
                navigate("/");
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginStatus('아이디/비밀번호를 확인해주세요');
        }

    };

    return (
        <div className="flex w-full justify-between">
            <button className="flex flex-col ml-[150px] w-[370px] mt-20 p-10">
                <div className="font-helveticaBold text-trai-mint text-[28px] mb-1">Welcome Back</div>
                <div className="font-helveticaLight text-trai-greytext text-[16px] mb-8">로그인 후 TRAI 서비스를 이용해보세요</div>

                <form onSubmit={handleSubmit(login)} className="flex flex-col gap-6">
                    <div className="text-xs text-trai-error ml-2 h-2">
                        {loginStatus}
                    </div>
                    <InputGroup>
                        <Label className="ml-1">Email</Label>
                        <Input
                            type="email"
                            {...register(
                                "email",
                                {required: "Email is Required."}
                            )}
                            placeholder="Enter your email"
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label className="ml-1">Password</Label>
                        <Input
                            type="password"
                            {...register(
                                "password",
                                {required: "Password is Required."}
                            )}
                            placeholder="Enter your password"
                        />
                    </InputGroup>
                    <LoginButton>Login</LoginButton>
                    <div className="flex gap-2 justify-center mt-2 text-[12px]">
                        <div className="text-trai-greytext">계정이 없으신가요?</div>
                        <Link to='/signup' className="text-trai-mint">회원가입</Link>
                    </div>
                </form>
            </button>
            <div className="flex justify-end relative">
                <LoginImage className="flex flex-end w-[850px] h-[680px]" src="/images/trai_login_background.png"
                            alt="image"/>
                <div className="absolute inset-0 flex justify-center items-center text-[100px] text-trai-white">
                    T R A I
                </div>
            </div>
        </div>
    )
}

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    align-self: flex-start;
    margin-left: 10px;
    font-size: 16px;
`;

const Input = styled.input`
    padding: 12px;
    border: 1px solid var(--trai-disabled);
    border-radius: 15px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
        border-color: var(--trai-mint);
    }

    &::placeholder {
        color: var(--trai-disabled);
    }
`;

const LoginButton = styled.button`
    background-color: var(--trai-mint);
    font-family: 'HelveticaBold';
    color: var(--trai-white);
    padding: 12px;
    border-radius: 15px;
    margin-top: 30px;
`

const LoginImage = styled.img`

`

export default LoginPage;
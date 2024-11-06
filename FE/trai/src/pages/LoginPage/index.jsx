import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";
import styled from "styled-components";
import axios from 'axios';

const LoginPage = () => {

    const {register, handleSubmit, formState: {errors}} = useForm();

    const handleLoginWithAxios = async (data) => {
        try {
            const url = 'https://www.trai-ai.site/api/users/login';
            // const url = 'http://localhost:8080/api/users/login';
            const response = await axios.post(
                url,
                new URLSearchParams({
                    username: data.email,
                    password: data.password
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    withCredentials: true
                }
            );

            if (response.status === 200) {
                // 로그인 성공 처리
            } else {
                // 로그인 실패 처리
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('https://www.trai-ai.site/api/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include'
            });

            if (response.ok) {
            } else {
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const callAuth = async () => {
        const token ='eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoiYWRtaW5AbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3MzA4NzIwODIsImV4cCI6MTAxNzMwODcyMDgyfQ.saDJ6_TfVvQxS32DWE13k1tHt8Ong6uF5fLc3SXqLJ0'
        // let url = 'http://localhost:8080';
        let url = 'https://www.trai-ai.site';
        axios.get(url + '/api/assets/daily', {
            headers: {
                access: `${token}`
            },
            params: {
                year: 2024,
                month: 3,
                day: 1
            }
        })
            .then(response => {
                console.log('Response data:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    return (
        <div className="flex w-full justify-between">
            <div className="flex flex-col ml-[150px] w-[370px] mt-20 p-10">
                <div className="font-helveticaBold text-trai-mint text-[28px] mb-1">Welcome Back</div>
                <div className="font-helveticaLight text-trai-greytext text-[16px] mb-8">로그인 후 TRAI 서비스를 이용해보세요</div>

                <form onSubmit={handleSubmit(handleLoginWithAxios)} className="flex flex-col gap-6">
                    <InputGroup>
                        <label className="ml-1">Email</label>
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
                        <label className="ml-1">Password</label>
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
                </form>
                <div>
                    <button onClick={handleSubmit(callAuth)}> auth call</button>
                </div>
                <div className="flex gap-2 justify-center mt-2 text-[12px]">
                    <div className="text-trai-greytext">계정이 없으신가요?</div>
                    <Link to='/signup' className="text-trai-mint">회원가입</Link>
                </div>
            </div>

            <div className="flex justify-end relative">
                <LoginImage className="flex flex-end w-[800px] h-[700px]" src="/images/trai_login_background.png"
                            alt="image"/>
                <div className="absolute inset-0 flex justify-center items-center text-[100px] text-trai-white">T R A
                    I
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
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import styled from "styled-components";

const LoginPage = () => {

  const { register, handleSubmit, formState: {errors}} = useForm();

  // to: front , 로그아웃 url = http://localhost:8080/logout
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: 'admin@naver.com',
          password: '1'
        }),
        credentials: 'include'
      });

      if (response.ok) {
      } else {
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col ml-[150px] w-[370px] mt-20 p-10">
        <div className="font-helveticaBold text-trai-mint text-[28px] mb-1">Welcome Back</div>
        <div className="font-helveticaLight text-trai-greytext text-[16px] mb-8">로그인 후 TRAI 서비스를 이용해보세요</div>
        
        <form onSubmit={handleSubmit(handleLogin())} className="flex flex-col gap-6">
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

        <div className="flex gap-2 justify-center mt-2 text-[12px]">
          <div className="text-trai-greytext">계정이 없으신가요?</div>
          <Link to='/signup' className="text-trai-mint">회원가입</Link>
        </div>
      </div>

      <div className="flex justify-end relative">
        <LoginImage className="flex flex-end w-[800px] h-[700px]" src="/images/trai_login_background.png" alt="image" />
        <div className="absolute inset-0 flex justify-center items-center text-[100px] text-trai-white">T R A I</div>
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
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import styled from "styled-components";

const LoginPage = () => {

  const { register, handleSubmit, formState: {errors}} = useForm();

  const onSubmit = (data) => {
    console.log("로그인 성공: " , data);
  }

  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col border border-black w-[400px] mt-20 p-10">
        <div className="font-helveticaBold text-trai-mint text-3xl mb-2">Welcome Back</div>
        <div className="font-helveticaLight text-trai-greytext mb-4">Enter your email and password to sign in</div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <InputGroup>
            <label>Email</label>
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
            <label>Password</label>
            <Input
              type="password"
              {...register(
                "password", 
                {required: "Password is Required."}
              )}
              placeholder="Enter your password"
            />
          </InputGroup>
          <LoginButton>로그인</LoginButton>
        </form>

        <div className="flex gap-2 justify-center mt-2">
          <div className="text-trai-greytext">계정이 없으신가요?</div>
          <Link to='/signup' className="text-trai-mint">회원가입</Link>
        </div>
      </div>

      <div className="flex justify-end relative">
        <LoginImage className="flex flex-end w-[1000px] h-[800px]" src="/images/trai_login_background.png" alt="image" />
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
  border: 1px solid var(--trai-greytext);
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
  color: var(--trai-white);
  padding: 10px;
  border-radius: 15px;
  margin-top: 20px;
`

const LoginImage = styled.img`

`

export default LoginPage;
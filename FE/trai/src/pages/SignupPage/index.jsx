import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

const SignupPage = () => {

  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm({
    mode: "onChange"
  });

  const onSubmit = (data) => {
    console.log("회원가입 성공")
  }

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const selectedRole = watch("role");

  return(
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center relative">
        <img className="flex w-[1350px] h-[300px] mt-3" src="/images/trai_signup_background.png" alt="image" />
        <div className="absolute top-[22%] text-trai-white">
          <div className="flex justify-center text-2xl">Welcome!</div>
          <div className="flex justify-center">TRAI의 자동매매 서비스를 이용해보세요.</div>
        </div>
      </div>

      <div className="absolute top-[20%] bg-trai-white w-[450px] p-10 rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} >
          
          <div className="flex flex-col  mb-2">
            <label className="ml-1 text-[14px] mb-2">Email</label>
            <div className="flex gap-2 justify-between">
              <InputEmail
                type="email"
                {...register("email", {required: "이메일은 필수 입력값입니다."})}
                placeholder="Enter your email"  
                className="w-full h-12"
              />
              <DuplicateButton>중복확인</DuplicateButton>
            </div>
            <div className="text-[12px] ml-2">여기는 메시지 영역</div>
          </div>
          
          <div className="flex flex-col mb-2 gap-2"> 
            <label className="ml-1 text-[14px]">Password</label>
            <Input
              type="password"
              {...register("password", {
                required: "비밀번호는 필수 입력값입니다.",
                minLength: {
                  value: 4,
                  message: "비밀번호는 최소 4자 이상이어야 합니다."
                }
              })}
              placeholder="Enter your password"  
            />
            <div className="text-xs text-trai-error ml-2 h-2">
              {errors.password && <p>{errors.password.message}</p>}
            </div>
          </div>
          
          <div className="flex flex-col mb-4 gap-2"> 
            <label className="ml-1 text-[14px]">Confirm Password</label>
            <Input
              type="password"
              {...register("confirmPassword", {required: "비밀번호 재확인을 해주세요."})}
              placeholder="Enter your password again"
            />
            <div className="text-xs ml-2 h-5">
              {password && confirmPassword ? (
              confirmPassword === password ? 
              <p className="text-trai-success">비밀번호가 일치합니다.</p> : 
              <p className="text-trai-error">비밀번호가 일치하지 않습니다.</p>
              ) : null}
            </div>
          </div>
          
          <div className="flex flex-col mb-10 gap-2"> 
            <label className="ml-1 text-[14px]">Your Role</label>
            <div className="flex ml-2 gap-3 text-[14px]">
              <label className="flex">
                <input
                  type="radio"
                  value="investor"
                  {...register('role')}
                  disabled
                />
                <span className="ml-2 text-trai-greytext">투자자</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="observer"
                  {...register('role', { required: 'Role is required' })}
                />
                <span className="ml-2">관전자</span>
              </label>
            </div>
            {!selectedRole && (
              <div className="text-[12px] ml-2 text-trai-error">* 현재 관전자 모드만 가입 가능합니다.</div>
            )}
          </div>

          <SingupButton className="w-full">Sign Up</SingupButton>
          
        </form>

        <div className="flex justify-center gap-2 text-[12px]">
          <div>계정이 이미 있으신가요?</div>
          <Link to={'/login'} className="text-trai-mint">로그인</Link>
        </div>

      </div>

    </div>
  )
}

const InputEmail = styled.input`
  padding: 10px;
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
`

const Input = styled.input`
  padding: 10px;
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
`

const DuplicateButton = styled.button`
  background-color: var(--trai-mint);
  color: var(--trai-white);
  font-size: 14px;
  padding: 10px;
  width: 100px;
  border-radius: 15px;
`

const SingupButton = styled.button`
  background-color: var(--trai-mint);
  color: var(--trai-white);
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
`

export default SignupPage;
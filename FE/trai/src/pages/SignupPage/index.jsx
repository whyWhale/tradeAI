import {useState} from 'react';
import {useForm} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import styled from "styled-components";
import {instance} from '@api/axios';

const SignupPage = () => {

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors, getValues},
        watch,
    } = useForm({

        mode: "onChange"
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleAgreementChange = (e) => {
        setIsAgreed(e.target.checked);
    };

    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const selectedRole = watch("role");
    const checkedEmail = watch('email');
    const [checkEmailResult, setCheckEmailResult] = useState(null);

    const checkEmail = async () => {
        const email = checkedEmail;
        if (!email) {
            alert("이메일을 입력해 주세요.");
            return;
        }

        try {
            const response = await instance.get(`/api/users/check?email=${email}`);
            setCheckEmailResult(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("중복 확인 중 오류 발생:", error);
        }
    };

    const onSubmit = async (data) => {
        try {
            const response = await instance.post('/api/users/join', {
                username: data.email,
                password: data.password
            })

            if (response.status === 200) {
                navigate('/login')
            } else {

            }

        } catch (error) {
            console.error("회원가입 에러: ", error)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center relative">
                <img className="flex w-[1400px] h-[300px] mt-3" src="/images/trai_signup_background.png" alt="image"/>
                <div className="absolute top-[22%] text-trai-white">
                    <div className="flex justify-center text-2xl">Welcome!</div>
                    <div className="flex justify-center">TRAI의 자동매매 서비스를 이용해보세요.</div>
                </div>
            </div>

            <div className="absolute top-[20%] bg-trai-white w-[450px] p-10 rounded-2xl shadow-xl">
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="flex flex-col  mb-2">
                        <label className="ml-1 text-[14px] mb-2">이메일</label>
                        <div className="flex gap-2 justify-between">
                            <InputEmail
                                type="email"
                                {...register("email", {required: "이메일은 필수 입력값입니다."})}
                                placeholder="이메일을 입력해주세요"
                                className="w-full h-12"
                            />
                            <DuplicateButton onClick={checkEmail}>중복확인</DuplicateButton>
                        </div>
                        <div className="text-[12px] ml-2">
                            {checkEmailResult === true ? (
                                <p className="text-trai-success">사용 가능한 이메일 입니다.</p>
                            ) : checkEmailResult === false ? (
                                <p className="text-trai-error">사용이 불가합니다. 다른 이메일을 입력해주세요.</p>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex flex-col mb-4 gap-1">
                        <label className="ml-1 text-[14px]">비밀번호</label>
                        <Input
                            type="password"
                            {...register("password", {
                                required: "비밀번호는 필수 입력값입니다.",
                                minLength: {
                                    value: 4,
                                    message: "비밀번호는 최소 4자 이상이어야 합니다."
                                }
                            })}
                            placeholder="비밀번호를 입력해주세요"
                        />
                        <div className="text-xs text-trai-error ml-2 h-2">
                            {errors.password && <p>{errors.password.message}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col mb-2 gap-1">
                        <label className="ml-1 text-[14px]">비밀번호 확인</label>
                        <Input
                            type="password"
                            {...register("confirmPassword", {required: "비밀번호 재확인을 해주세요."})}
                            placeholder="비밀번호를 다시 입력해주세요"
                        />
                        <div className="text-xs ml-2 h-5">
                            {password && confirmPassword ? (
                                confirmPassword === password ?
                                    <p className="text-trai-success">비밀번호가 일치합니다.</p> :
                                    <p className="text-trai-error">비밀번호가 일치하지 않습니다.</p>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex flex-col mb-4 gap-2">
                        <label className="ml-1 text-[14px]">사용자 모드</label>
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
                                    {...register('role', {required: 'Role is required'})}
                                />
                                <span className="ml-2">관전자</span>
                            </label>
                        </div>
                        {!selectedRole && (
                            <div className="text-[12px] ml-2 text-trai-error">* 현재 관전자 모드만 가입 가능합니다.</div>
                        )}
                    </div>

                    <CheckboxContainer>
                        <input
                            type="checkbox"
                            id="terms"
                            checked={isAgreed}
                            onChange={handleAgreementChange}
                            className='mr-2'
                        />
                        <label htmlFor="terms">
                            이용약관 동의하기 (<TermsButton onClick={openModal}>전문보기</TermsButton>)
                        </label>
                    </CheckboxContainer>

                    <SingupButton type="submit" disabled={!isAgreed} className="w-full">회원가입</SingupButton>

                    {isModalOpen && (
                        <ModalOverlay onClick={closeModal}>
                            <ModalContent onClick={(e) => e.stopPropagation()}>
                                <h2 className='text-[20px] font-bold mb-4 text-center'>이용약관</h2>
                                <TermsContent>
                                    <p><strong>제1조 (목적)</strong></p>
                                    <p>
                                        이 약관은 본 서비스(이하 &quot;서비스&quot;)를 제공하는 TRAI(이하 &quot;회사&quot;)와
                                        서비스를 이용하고자 하는 사용자(이하 &quot;회원&quot;) 간의 권리, 의무,
                                        책임 사항 및 서비스 이용에 관한 조건을 규정함을 목적으로 합니다.
                                    </p><br/>
                                    <p><strong>제2조 (서비스 내용)</strong></p>
                                    <p>
                                        회사는 LLM(대규모 언어 모델)을 활용하여 실시간으로 비트코인
                                        거래를 자동으로 진행하는 서비스를 제공합니다. 본 서비스는 회원이
                                        설정한 거래 조건에 따라 자동으로 매수, 매도, 혹은 유지를
                                        결정하고, 이를 실행하기 위해 업비트 API를 사용합니다.
                                    </p><br/>
                                    <p><strong>제3조 (회원 가입)</strong></p>
                                    <p>
                                        회원 가입은 본 약관에 동의하고 필요한 정보를 입력하여 가입 신청을 완료한 후 회사가 이를 승인함으로써 성립됩니다.
                                        회원은 정확한 정보를 제공해야 하며, 허위 정보를 제공하여 발생하는 모든 불이익에 대한 책임은 회원에게 있습니다.
                                    </p><br/>
                                    <p><strong>제4조 (이용자의 의무)</strong></p>
                                    <p>
                                        회원은 서비스 이용 시 법령 및 본 약관의 규정을 준수해야 하며, 서비스 운영을 방해하거나 회사의 명예를 훼손하는 행위를 해서는 안 됩니다.
                                        회원은 본인의 계정 정보를 제3자에게 제공하거나 공유할 수 없습니다.
                                    </p><br/>
                                    <p><strong>제5조 (서비스 이용의 제한)</strong></p>
                                    <p>
                                        회사는 회원이 다음과 같은 행위를 할 경우 사전 통지 없이 서비스 이용을 제한할 수 있습니다.
                                        <br/>
                                        - 법령이나 약관을 위반하는 경우<br/>
                                        - 회사의 서비스 운영을 고의로 방해하는 경우<br/>
                                        - 허위 정보를 제공하여 가입한 경우
                                    </p><br/>
                                    <p><strong>제6조 (책임의 한계)</strong></p>
                                    <p>
                                        본 서비스는 자동 거래를 통해 수익을 보장하지 않으며, 거래 결과에 대한 책임은 회원에게 있습니다.
                                        회사는 거래 손실이나 데이터 오류 등으로 인한 손해에 대해 책임을 지지 않습니다.
                                        회사는 회원의 잘못된 설정으로 인해 발생한 손해에 대해 책임을 지지 않습니다.
                                    </p><br/>
                                    <p><strong>제7조 (개인정보의 보호)</strong></p>
                                    <p>
                                        회사는 회원의 개인정보를 적법하게 수집, 사용, 관리하며, 회원의 동의 없이 제3자에게 제공하지 않습니다.
                                    </p>

                                </TermsContent>
                                <div className='flex justify-end'>
                                    <CloseButton onClick={closeModal}>닫기</CloseButton>
                                </div>
                            </ModalContent>
                        </ModalOverlay>
                    )}

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

const CheckboxContainer = styled.div`
    margin-top: 1px;
`;

const TermsButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    border-radius: 8px;
    position: relative;
`;

const TermsContent = styled.div`
    max-height: 60vh;
    overflow-y: auto;
    padding: 20px;
`;

const CloseButton = styled.button`
    margin-top: 10px;
    padding: 5px 10px;
    cursor: pointer;
`;

const SingupButton = styled.button`
    background-color: var(--trai-mint);
    color: var(--trai-white);
    padding: 10px;
    border-radius: 10px;
    margin: 30px auto 10px;

    &:disabled {
        background-color: var(--trai-disabled);
    }
`

export default SignupPage;

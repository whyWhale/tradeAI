import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from "prop-types";
import Logout from '@components/Logout';

const MainPage = () => {


    return (
        <div className="w-full flex flex-col">
            <div className='flex justify-end pr-12 bg-trai-navy'>
                <StyledLink to={'/trade-settings'}>
                    거래 설정
                </StyledLink>
                <StyledLink to={'/investment-status'}>
                    투자 현황
                </StyledLink>
                <StyledLink to={'/asset-overview'}>
                    자산 현황
                </StyledLink>
                <StyledLink to={'/trade-details'}>
                    거래 상세 및 전략
                </StyledLink>
                <Logout/>
            </div>

            <FirstContainer className="flex gap-10">

                <div>
                    <div className='text-trai-white text-[60px] mt-[180px] font-bold'>TRAI</div>
                    <div className='text-trai-white text-[32px] font-bold'>Trade Smarter, Trade with AI</div>
                    <div className='flex mt-[100px] gap-10'>
                    </div>
                </div>
                <LoginImage className="flex flex-end w-[1200px] h-[1000px] relative top-[-20%]"
                            src="/images/trai_figma.png" alt="image"/>
            </FirstContainer>

            <SecondContainer>
                <h2 className='font-bold text-[32px] mb-8'>AI 에이전트 소개</h2>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {agentsData.map((agent, index) => (
                        <AgentCard key={index}>
                            <h3 className='font-bold mb-4 text-center text-[18px]'>{agent.name}</h3>
                            <div>{agent.description}</div>
                        </AgentCard>
                    ))}
                </div>
            </SecondContainer>

            <ThirdContainer>
                <h2 className='font-bold text-[40px] mb-8'>FAQ</h2>
                <FAQItem question="TRAI 서비스는 무엇인가요?"
                         answer="TRAI는 대규모 언어 모델(LLM)을 기반으로 가상화폐 시장을 분석하여 거래 전략을 제안하는 AI 서비스입니다. LLM을 활용하여 시장 데이터를 심층적으로 분석하고, 다양한 패턴과 트렌드를 포착하여 더 나은 거래 결정을 지원합니다."/>
                <FAQItem question="현재 왜 관전자 모드만 가능한가요?"
                         answer="TRAI는 가상화폐 시장의 리스크와 변동성을 고려하여, 사용자들에게 안전하게 거래 전략을 관찰하고 학습할 수 있는 환경을 제공하기 위해 설계되었습니다. TRAI의 핵심 목표는 거래에 대한 깊은 이해와 통찰을 제공하는 것이며, 사용자 자산을 직접 관리하는 것보다는 독립적인 분석과 전략을 지원하는 데 중점을 두고 있습니다."/>
                <FAQItem question="TRAI가 지원하는 가상화폐는 무엇인가요?"
                         answer="현재 TRAI는 비트코인에 대한 거래 전략 분석을 지원합니다. 다른 가상화폐는 지원하지 않습니다."/>
                <FAQItem question="TRAI를 사용하면 얼마나 수익을 기대할 수 있나요?"
                         answer="TRAI의 AI는 시장 데이터를 기반으로 최적의 거래 전략을 제시하지만, 수익을 보장하지는 않으며, 모든 투자에는 위험이 따릅니다."/>
                <FAQItem question="TRAI 사용 방법"
                         answer="TRAI를 사용하려면 회원가입 후 관전자 모드로 접속하여 AI가 제안하는 거래 전략을 확인할 수 있습니다. 이를 통해 가상화폐 시장에 대한 이해를 높이고, AI 기반의 거래 분석 과정을 경험해 보세요."/>

            </ThirdContainer>

        </div>
    );
};

const agentsData = [
    {
        name: "차트 분석 에이전트",
        description: "차트 데이터 분석 에이전트는 시장의 역사적 가격 움직임을 기반으로 시장 동향을 파악하고 예측합니다. 이를 통해 상승 및 하락 추세, 지지선과 저항선 등의 중요한 가격 패턴을 식별하여, 향후 가격 변동에 대한 초기 판단을 제공합니다. 이 에이전트는 주로 캔들 차트와 이동평균선 등의 지표를 활용하여 단기 및 장기 추세를 분석합니다."
    },
    {
        name: "패턴 분석 에이전트",
        description: "차트 패턴 분석 에이전트는 주가 및 가상화폐 가격 변동에서 반복적으로 나타나는 차트 패턴을 식별합니다. 주로 삼각형 패턴, 헤드 앤 숄더 패턴, 이중 바닥과 같은 기술적 패턴을 분석하여, 추세 전환이나 지속의 가능성을 예측합니다. 이를 통해 시장의 기술적 흐름을 파악하고, 보다 정밀한 거래 결정을 내리도록 돕습니다."
    },
    {
        name: "심리 분석 에이전트",
        description: "공포 탐욕 지수 판단 에이전트는 투자자들의 심리 상태를 나타내는 지표를 분석하여 시장의 공포와 탐욕 수준을 평가합니다. 공포가 높을 때는 매도 압력이 강해지고, 탐욕이 높을 때는 매수 압력이 증가하는 경향이 있습니다. 이 에이전트는 이러한 심리 지표를 통해 적절한 매수 및 매도 시점을 파악하는 데 도움을 줍니다."
    },
    {
        name: "뉴스 모니터 에이전트",
        description: "최신 뉴스 반영 에이전트는 실시간으로 제공되는 경제 및 산업 뉴스를 분석하여 시장에 미칠 잠재적 영향을 평가합니다. 주요 이벤트나 정책 변화, 기업의 발표 등 뉴스에 따른 급격한 시장 반응을 반영하여, 투자 전략을 세울 때 고려해야 할 중요한 외부 요인을 제공합니다."
    },
    {
        name: "마스터 에이전트",
        description: "마스터 에이전트는 각기 다른 에이전트들의 분석 결과를 종합하여 최종적인 거래 판단을 내립니다. 각 에이전트가 제공하는 정보의 중요도와 신뢰도를 고려하여 최적의 매수 및 매도 결정을 내리도록 설계되었습니다. 이 에이전트는 전체 전략을 통합하여 일관된 투자 전략을 제공합니다."
    },
    {
        name: "전략 학습 에이전트",
        description: "회고 에이전트는 과거의 거래 결정을 평가하고, 실패와 성공 요인을 분석하여 향후 개선 사항을 도출합니다. 이 에이전트는 학습을 통해 기존 전략의 효율성을 높이고, 반복적인 실수를 방지할 수 있도록 설계되었습니다. 이를 통해 지속적으로 진화하는 거래 전략을 유지합니다."
    },
];


const FAQItem = ({question, answer}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <FAQContainer>
            <Question onClick={() => setIsOpen(!isOpen)}>
                <div>{question}</div>
                <div className='text-[30px]'>{isOpen ? '-' : '+'}</div>
            </Question>
            {isOpen && <Answer>{answer}</Answer>}
        </FAQContainer>
    )
}


FAQItem.propTypes = {
    question: PropTypes.string,
    answer: PropTypes.string,
}


export default MainPage;


const StyledLink = styled(NavLink)`
    padding: 5px 10px;
    color: white;
    margin: 20px;
    text-decoration: none;
    border: 2px solid transparent;
    font-weight: bold;
    z-index: 10;

    &:hover {
        cursor: pointer;
        color: var(--trai-mint);
        border-bottom: 2px solid var(--trai-mint);
    }
`;

const StyledUserLink = styled(NavLink)`
    color: white;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 50px;
    border-radius: 15px;
    border: 2px solid white;
    text-decoration: none;
    font-weight: bold;

    &:hover {
        color: var(--trai-navy);
        background-color: var(--trai-white);
        transition: 0.5s ease;
    }
`;

const LoginImage = styled.img`
    display: none;

    @media (min-width: 1000px) {
        display: block;
    }
`


const FirstContainer = styled.div`
    background-color: var(--trai-navy);
    height: 700px;
    padding: 50px 150px;
`

const SecondContainer = styled.div`
    background-color: var(--trai-background);
    min-height: 700px;
    padding: 50px 150px;
`
const AgentCard = styled.div`
    background-color: var(--trai-white);
    transition: transform 0.3s;
    border: 2px solid var(--trai-navy);
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

    &:hover {
        transform: translateY(-10px);
    }
`


const ThirdContainer = styled.div`
    background-color: var(--trai-disabled);
    min-height: 700px;
    padding: 50px 150px;
`

const FAQContainer = styled.div`
    background-color: var(--trai-background);
    padding: 15px 20px;
    margin-bottom: 15px;
    border-radius: 10px;
`

const Question = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-weight: bold;
    font-size: 20px;
`

const Answer = styled.div`
    margin-top: 10px;
    padding: 15px;
    font-size: 16px;
    line-height: 2;
`




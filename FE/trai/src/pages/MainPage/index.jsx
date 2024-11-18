import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from "prop-types";
import CardThreeJS from '@components/CardThreeJS/CardThreeJS';
import Logout from '@components/Logout';
import FireworkButton from '@components/FireworkButton';

const MainPage = () => {

    const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);

    const handleAgentSelect = (index) => {
        setSelectedAgentIndex(index);
    };
    

    return (
        <div className="w-full h-screen flex flex-col" style={{overflowX: 'hidden'}}>
            <div className='w-full flex justify-end bg-trai-navy'>
                
                <StyledLink to={'/trade-settings'}>
                    거래 설정
                </StyledLink>
                <StyledLink to={'/asset-overview'}>
                    자산 현황
                </StyledLink>
                <StyledLink to={'/investment-status'}>
                    투자 내역
                </StyledLink>
                <StyledLink to={'/trade-details'}>
                    거래 상세 및 전략
                </StyledLink>
                <Logout/>
            </div>

            <FirstContainer className="flex w-full">

                <div className='w-[350px] ml-[120px] mr-[50px] flex-shrink-0'>
                    <div className='text-trai-white text-[80px] mt-[150px] font-bold'>T R A I</div>
                    <div className='text-trai-white text-[40px] mt-[50px] font-bold'>Trade Smarter,</div>
                    <div className='flex'>
                        <div className='text-trai-white text-[40px] mr-2 font-bold'>Trade with AI</div>
                        <div className='relative z-10'>
                            <FireworkButton/>
                        </div>
                    </div>
                </div>
                <HomeImage className="flex flex-end h-[670px] relative left-[-12%]"
                            src="/images/main_laptop.png" alt="image"/>
            </FirstContainer>

            <SecondContainer>
                <h2 className='font-bold text-[32px] mb-8'>AI 에이전트 소개</h2>
                <div className='flex flex-col w-full md:gap-8 md:flex-row'>
                    <div className='md:w-1/2'>
                        <CardThreeJS onSelectAgent={handleAgentSelect} />
                    </div>
                    <div className='md:w-1/2'>
                        <AgentCard 
                            className='h-full'
                            style={{ 
                                opacity: 1,
                                transform: 'translateY(0)',
                                transition: 'all 0.5s ease-in-out'
                            }}
                        >
                            <h3 className='font-bold mb-10 text-center text-[24px]'>
                                {agentsData[selectedAgentIndex].name}
                            </h3>
                            <div className='text-[16px] leading-relaxed'>
                                {agentsData[selectedAgentIndex].description}
                            </div>
                        </AgentCard>
                    </div>
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

                <div className='text-trai-greytext text-[14px] text-center mt-20'>
                    &copy; 2024. 행복자유. All rights reserved.
                </div>

            </ThirdContainer>

        </div>
    );
};

const agentsData = [
    {
        name: "기술적 분석 에이전트",
        description: "기술적 분석 에이전트는 비트코인 시장을 실시간으로 분석하여 투자 결정을 자동으로 내리는 퀀트 트레이딩 솔루션입니다. 4시간마다 비트코인 데이터를 수집하여 다양한 기술적 지표(이동평균선, MACD, RSI, 볼린저 밴드)를 분석합니다. 4시간봉과 일봉 데이터를 모두 활용하여 더욱 정확한 시장 분석을 제공하며, AI 모델이 이 데이터를 종합적으로 해석하여 매수, 매도, 보유 중 최적의 투자 결정을 도출합니다."
    },
    {
        name: "뉴스 분석 에이전트",
        description: "뉴스 에이전트는 최신 뉴스를 실시간으로 수집하고 분석하여 시장 동향을 파악합니다. AI가 Google News를 통해 수집된 비트코인 관련 주요 뉴스를 해석하여 매수와 매도 결정을 내립니다. 최신 뉴스가 시장에 미치는 영향을 즉각적으로 분석하여 신속하고 객관적인 투자 판단을 제공합니다."
    },
    {
        name: "차트 패턴 분석 에이전트",
        description: "차트 패턴 분석 에이전트는 4시간 단위의 실시간 캔들 차트를 분석하여 주요 시각적 패턴을 식별합니다. AI가 상승 삼각형, 컵 앤 핸들, 하락 삼각형 등 10가지 주요 차트 패턴을 인식하고, 패턴의 방향성을 기반으로 매수와 매도 시점을 포착합니다. 시각적 패턴 분석을 통해 시장의 기술적 흐름을 파악하여 효과적인 투자 타이밍을 제시합니다."
    },
    {
        name: "시장 심리 분석 에이전트",
        description: "시장 심리 분석 에이전트는 시장의 감정 상태를 나타내는 공포탐욕지수(Fear and Greed Index)를 실시간으로 분석합니다. AI가 과거 30일간의 지수 변화를 추적하여 시장의 심리를 5단계로 평가하고, 극도의 공포에서 극도의 탐욕 사이의 투자자 심리를 파악하여 최적의 매매 시점을 찾아냅니다. 시장 심리 분석을 통해 과매수/과매도 구간을 식별하고 효과적인 투자 전략을 제시합니다."
    },
    {
        name: "투자 의사결정 에이전트",
        description: "투자 의사결정 에이전트는 네 가지 전문 분석 에이전트의 분석 결과를 종합하여 최종 매매 결정을 내립니다. AI가 각 에이전트의 분석을 투자자의 성향과 결합하여 평가하고, 수익 극대화와 리스크 관리를 고려한 최적의 매매 전략을 제시합니다. 투자자별 맞춤형 포트폴리오 관리를 통해 효율적인 자산 운용을 지원합니다."
    },
    {
        name: "포트폴리오 에이전트",
        description: "포트폴리오 에이전트는 투자자의 자산을 효율적으로 배분하고 관리합니다. AI가 현재 보유 자산, 투자 손익, 시장 상황을 분석하여 최적의 매매 비중을 결정하며, 최소 거래 금액을 고려한 실행 가능한 주문을 생성합니다. 과거 10회 투자 이력과 5일간의 수익률을 바탕으로 투자 전략을 지속적으로 개선하여 개인의 상황을 고려한 수익을 추구합니다."
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
            <AnswerWrapper isOpen={isOpen}>
                <Answer>{answer}</Answer>
            </AnswerWrapper>
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


const HomeImage = styled.img`
    display: none;

    @media (min-width: 1000px) {
        display: block;
        position: relative;
        height: 600px;
        object-fit: cover;
    }
`


const FirstContainer = styled.div`
    background: linear-gradient(180deg, var(--trai-navy), var(--trai-mint));
    height: 700px;
    padding: 50px;
    max-width: 100%;
    margin: 0 auto;
`

const SecondContainer = styled.div`
    background-color: var(--trai-background);
    min-height: 700px;
    padding: 50px;
    max-width: 100%;
    margin: 0 auto;
`

const AgentCard = styled.div`
    background-color: var(--trai-white);
    transition: all 0.3s ease-in-out;
    border: 2px solid white;
    border-radius: 5px;
    padding: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (min-width: 768px) {
        margin-top: 100px;
    }

    &:hover {
        transform: translateY(-5px);
    }
`


const ThirdContainer = styled.div`
    background-color: var(--trai-disabled);
    min-height: 700px;
    padding: 50px 150px 10px;
`

const FAQContainer = styled.div`
    background-color: var(--trai-background);
    max-width: 100%;
    box-sizing: border-box;
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

const AnswerWrapper = styled.div`
    max-height: ${props => props.isOpen ? '500px' : '0'};
    overflow: hidden;
    transition: max-height 0.7s ease-in-out;
`

const Answer = styled.div`
    margin-top: 10px;
    padding: 15px;
    font-size: 16px;
    line-height: 2;
`



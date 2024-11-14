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
        <div className="w-full flex flex-col" style={{ overflowX: 'hidden' }}>
            <div className='flex justify-end items-center pr-12 bg-trai-navy'>
                
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

            <FirstContainer className="flex">

                <div className='w-[350px] flex-shrink-0'>
                    <div className='text-trai-white text-[80px] mt-[150px] font-bold'>T R A I</div>
                    <div className='text-trai-white text-[40px] mt-[50px] font-bold'>Trade Smarter,</div>
                    <div className='flex'>
                        <div className='text-trai-white text-[40px] mr-2 font-bold'>Trade with AI</div>
                        <div className='relative z-10'>
                            <FireworkButton/>
                        </div>
                    </div>
                </div>
                <HomeImage className="flex flex-end h-[700px] relative top-[-15%] right-[8%]"
                            src="/images/figmaimage2.png" alt="image"/>
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
                            {/* <h3 className='font-bold mb-10 text-center text-[24px]'>
                                {agentsData[selectedAgentIndex].name}
                            </h3>
                            <div className='text-[16px] leading-relaxed'>
                                {agentsData[selectedAgentIndex].description}
                            </div> */}
                            <AgentTitle>{agentsData[selectedAgentIndex].name}</AgentTitle>
                            <AgentDescription>{agentsData[selectedAgentIndex].description}</AgentDescription>
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

            </ThirdContainer>

        </div>
    );
};

const agentsData = [
    {
        name: "퀀트 분석 에이전트",
        description: "퀀트 분석 에이전트는 기술적 지표를 바탕으로 데이터를 분석하여 투자 결정을 내리는 역할을 합니다. 캔들 데이터를 기반으로 RSI, MACD, 볼린저 밴드 등 다양한 지표를 분석해 시장을 냉철하게 진단하며, 데이터 기반의 거래 전략을 수립합니다. 이처럼 수치 분석에 따른 전략적 접근을 통해 시장의 흐름을 반영한 결정을 제공합니다."
    },
    {
        name: "차트 패턴 에이전트",
        description: "차트 패턴 에이전트는 비트코인 차트의 주요 패턴을 분석하여 상승과 하락의 가능성을 예측하는 전문가로, 시장 흐름을 실시간으로 파악하는 역할을 수행합니다. 4시간 단위의 비트코인 차트를 바탕으로 상승 삼각형, 하락 삼각형 등 10개의 대표적인 패턴을 탐지하며, 명확한 패턴이 없더라도 방향성에 맞춰 결정을 내립니다. 이를 통해 시장의 미묘한 변화를 반영한 거래 결정을 지원합니다."
    },
    {
        name: "심리 분석 에이전트",
        description: "심리 분석 에이전트는 시장의 공포 탐욕 지수를 통해 투자 심리를 분석합니다. 극심한 공포부터 탐욕까지의 감정 상태를 수치화하여, 시장 참여자들이 비트코인 시장에 대해 느끼는 감정의 흐름을 포착합니다. 이를 통해 현재의 시장 분위기를 진단하고, 시장의 감정적 흐름에 따른 투자 결정을 지원합니다."
    },
    {
        name: "뉴스 분석 에이전트",
        description: "뉴스 분석 에이전트는 최신 비트코인 관련 뉴스를 분석하여, 시장에 즉각적인 영향을 줄 수 있는 정보를 바탕으로 투자 결정을 지원합니다. 주요 뉴스와 그 시사점들을 반영해 시장의 상황을 빠르게 파악하며, 복잡한 뉴스 동향에서도 실시간으로 방향성 있는 거래 결정을 내릴 수 있습니다."
    },
    {
        name: "최종 결정 에이전트",
        description: "최종 결정 에이전트는 차트 패턴, 공포 탐욕 지수, 뉴스, 기술적 지표 등 모든 에이전트들의 분석을 종합하여 최종 거래 전략을 수립합니다. 다양한 요소들을 종합적으로 고려해 사용자의 투자 성향에 맞춘 결정을 내리며, 수익률을 극대화할 수 있는 전략을 제안합니다. 리스크 관리 원칙을 반영하여 신뢰성 있는 결정을 제공합니다."
    },
    {
        name: "포트폴리오 관리 에이전트",
        description: "포트폴리오 관리 에이전트는 투자자의 현재 자산 상황과 성향에 맞춘 투자 비율을 설정하여 효과적인 자산 운영을 돕습니다. 자산 현황, 최근 투자 성과, 비트코인 보유량을 바탕으로 적절한 비율을 제안해 리스크를 최소화하고 안정적인 성과를 추구합니다."
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
    }
`


const FirstContainer = styled.div`
    background: linear-gradient(180deg, var(--trai-navy), var(--trai-mint));
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
    transition: all 0.3s ease-in-out;
    border: 2px solid white;
    border-radius: 5px;
    padding: 50px;
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
const AgentTitle = styled.h3`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
`;

const AgentDescription = styled.p`
    font-size: 16px;
    line-height: 1.8;
    color: var(--trai-text);
`;

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




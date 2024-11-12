import { useState, useEffect } from 'react';
import { instance } from '@api/axios';
import styled from "styled-components";
import PropTypes from 'prop-types';

import QuantAgent from "@components/MultipleAgents/QuantAgent";
import PatternAgent from "@components/MultipleAgents/PatternAgent";
import FngAgent from "@components/MultipleAgents/FngAgent";
import NewsAgent from "@components/MultipleAgents/NewsAgent";
import MasterAgent from "@components/MultipleAgents/MasterAgent";

const AgentAI = ({ agentId, selectedDate }) => {

  const [data, setData] = useState(null);

  const [parsedData, setParsedData] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      console.log("fetchData 호출됨");

      try {
        const response = await instance.get('api/agent-history', {
          params: { agentId }
        });

        const parsedData = JSON.parse(response.data.jsonData);
        const quantData = parsedData.quant;
        const patternData = parsedData.chart_pattern;
        const masterData = parsedData.master;
        const newsData = parsedData.news_search;
        const fngData = parsedData.fng;

        setData(response.data);
        setParsedData({ quantData, patternData, masterData, newsData, fngData });
        console.log("Received agentId:", agentId);
        console.log("parsedData", parsedData);
      } catch(error){
        console.error("데이터 요청 오류: ", error);
      }
    }
    if (agentId) {
      fetchData();
    }
  }, [agentId])

  if(!parsedData){
    return (
      <div className='flex justify-center items-center text-center'>
        <div>AI 에이전트의 판단을 보고 싶은 거래건을 선택해주세요.</div>
      </div>
  )}

  return(
    <Container>
      <QuantAgent className="item" quantData={parsedData?.quantData}/>
      <PatternAgent className="item" patternData={parsedData?.patternData}/>
      <FngAgent className="item" fngData={parsedData?.fngData} selectedDate={selectedDate}/>
      <MasterAgent className="item" masterData={parsedData?.masterData}/>
      <NewsAgent className="item" newsData={parsedData?.newsData} />
    </Container>
  )
}

AgentAI.propTypes = {
  agentId: PropTypes.number,
  selectedDate: PropTypes.string.isRequired,
}

export default AgentAI;



const Container = styled.div`
  display: grid;
  grid-template-columns: 6fr 4fr 4fr 5fr;
  grid-template-rows: 200px 200px;
  gap: 30px;
  padding: 20px;
  padding-bottom: 100px;

  .item:nth-child(1) {
    grid-column: 1 / span 1;
    grid-row: 1 / span 1;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    padding: 20px;
    color: var(--trai-white);
    background: linear-gradient(180deg, var(--trai-darknavy), var(--trai-navy));
  }

  .item:nth-child(2) {
    grid-column: 2;
    grid-row: 1;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    padding: 20px;
    background: linear-gradient(180deg, var(--trai-white), var(--trai-navy));
  }

  .item:nth-child(3) {
    grid-column: 3;
    grid-row: 1;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    padding: 20px;
    background-color: var(--trai-white);
  }

  .item:nth-child(4) {
    grid-column: 4;
    grid-row: 1 / span 2;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    padding: 20px;
    background: linear-gradient(135deg, var(--trai-greytext), var(--trai-disabled));
  }

  .item:nth-child(5) {
    grid-column: 1 / span 3;
    grid-row: 2;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    padding: 20px;
    background-color: var(--trai-white);
  }
`
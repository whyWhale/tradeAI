import { useState } from 'react';

import DailyTradeHistory from '@components/DailyTradeHistory';
import AgentAI from '@components/AgentAI';
import NavBar from '@components/NavBar';
import BitBot from '@components/BitBot';

const TradeDetails = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [agentId, setAgentId] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSelectAgentId = (id) => {
    console.log("Selected agentId:", id);
    setAgentId(id);
  };

  return (
    <div className='flex bg-trai-background min-h-screen' style={{ width: '1390px' }}>
      <aside className="navbar">
        <NavBar openModal={openModal} />
      </aside>
      <section className='flex-1 ml-[275px] mt-[10px]'>
        <div><DailyTradeHistory onSelectAgentId={handleSelectAgentId} selectedDate={selectedDate} onDateChange={handleDateChange} /></div>
        <div><AgentAI agentId={agentId} selectedDate={selectedDate} /></div>
        {isModalOpen && <BitBot onClose={closeModal} />}
      </section>
    </div>
  )

}

export default TradeDetails;
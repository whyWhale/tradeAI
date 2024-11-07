import { useState } from 'react';

import DailyTradeHistory from '@components/DailyTradeHistory';
import AgentAI from '@components/AgentAI';
import NavBar from '@components/NavBar';
import BitBot from '@components/BitBot';

const TradeDetails = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className='flex bg-trai-background min-h-screen' style={{ width: '1400px' }}>
      <aside className='w-72'>
        <NavBar openModal={openModal} />
      </aside>
      <section className='flex-1'>
        <div><DailyTradeHistory /></div>
        <div><AgentAI/></div>
        {isModalOpen && <BitBot onClose={closeModal} />}
      </section>
    </div>
  )

}

export default TradeDetails;
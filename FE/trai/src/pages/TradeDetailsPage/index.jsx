import { useState } from 'react';

import DailyTradeHistory from '@components/DailyTradeHistory';
import NavBar from '@components/NavBar';
import BitBot from '@components/BitBot';

const TradeDetails = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className='flex bg-trai-background min-h-screen'>
      <aside className='w-72 border border-blue-500'>
        <NavBar openModal={openModal} />
      </aside>
      <section className='flex-1'>
        <div><DailyTradeHistory /></div>
        {isModalOpen && <BitBot onClose={closeModal} />}
      </section>
    </div>
  )

}

export default TradeDetails;
import { useState } from 'react';

import NavBar from '@components/NavBar';
import FireworkButton from '@components/FireworkButton';
import Modal from '@components/Modal';

const TradeSettings = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleConfirm = () => {
    setIsModalOpen(false);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  }


  return (
    <div className='flex bg-trai-background min-h-screen'>
      <aside className='w-72'>
        <NavBar />
      </aside>
      <section className='flex-1'>
        <div>거래 설정 페이지입니다.</div>
        <FireworkButton />
        {/* 모달 테스트 */}
        <button onClick={handleOpenModal} className='bg-trai-mint p-2 m-2 text-trai-white rounded'>
          Modal
        </button>
        {isModalOpen && (
          <Modal
            title="Test Modal"
            message="Are you sure you want to continue?"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            confirmText="continue"
            cancelText="delete"
          />
        )}
      </section>
    </div>
  );
};

export default TradeSettings;
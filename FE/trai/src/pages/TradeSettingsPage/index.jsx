import { useState } from 'react';
import { useForm } from 'react-hook-form';

import NavBar from '@components/NavBar';
import Modal from '@components/Modal';

const TradeSettings = () => {

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savedValue, setSavedValue] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleConfirm = () => {
    setIsModalOpen(false);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  }

  // 수정 버튼 클릭 시
  const handleEdit = () => {
    setIsEditing(true);
    // 저장된 값으로 폼 초기화
    reset({ investmentStyle: savedValue });
  }

  // 저장 수정
  const onSubmit = (data) => {
    console.log("저장 수정 버튼 발동", data);
    setSavedValue(data.investmentStyle);
    setIsEditing(false);
  }


  // 테스트 기능
  const handleTestRequest = () => {
    console.log("test function start");
  }


  return (
    <div className='flex bg-trai-background min-h-screen'>
      <aside className='w-72'>
        <NavBar />
      </aside>

      <section className='flex-1'>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 bg-trai-white p-4 m-10'>
          <label htmlFor='investmentStyle'>본인의 투자 성향을 작성해주세요.</label>
          <input
            id='investmentStyle'
            type='text'
            
            className={`p-2 border rounded w-full ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
            placeholder='예시: 저는 공격적인 투자를 선호합니다.'
            
          />

          <div className='flex justify-evenly'>
            {!isEditing ? (
              <button 
                type='button' 
                onClick={handleEdit} 
                className='bg-trai-mint p-2 text-trai-white rounded'
              > 수정 </button>
            ) : (
              <button 
                type='submit' 
                className='bg-trai-mint p-2 text-trai-white rounded'
              > 저장 </button>
            )}
            <button 
              type='button' 
              onClick={handleTestRequest} 
              className='bg-trai-navy p-2 text-trai-white rounded'
            >
              Test
            </button>
          </div>
        </form>



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
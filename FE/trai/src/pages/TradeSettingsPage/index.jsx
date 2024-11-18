import { useEffect, useState } from 'react';

import NavBar from '@components/NavBar';
import Modal from '@components/Modal';
import { instance } from "@api/axios.js";
import {useNavigate} from "react-router-dom";
import BitBot from '@components/BitBot';

const TradeSettings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRoleAdmin, setIsRoleAdmin] = useState(false);
  const [savedValue, setSavedValue] = useState('');
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);


  const [isBitModalOpen, setBitIsModalOpen] = useState(false);

  const openBitModal = () => setBitIsModalOpen(true);
  const closeBitModal = () => setBitIsModalOpen(false);

  useEffect(() => {
    const ivt = async () => {
      try {
        const response = await instance.get('/api/users/investment-type');
        setSavedValue(response.data);
      } catch (error) {
        console.error("Error fetching investment type:", error);
      }
    };

    const role = async ()=>{try {
      const response = await instance.get('/api/users/userInfo');
      const isAdmin = response.data === 'ROLE_ADMIN';
      setIsRoleAdmin(response.data === 'ROLE_ADMIN')
    } catch (error) {
      console.error("Error updating investment type:", error);
    }
    }

    ivt();
    role();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    instance.get('/api/agent-history/ai');
    navigate('/trade-details')
    alert('거래내역 페이지로 이동합니다.')
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 수정 버튼 클릭 시
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 저장 버튼 클릭 시
  const handleSave = async () => {
    const investmentType = {
      investmentType: savedValue
    };

    try {
      const response = await instance.patch('/api/users/investment-type', investmentType);
      setSavedValue(response.data);
      setIsEditing(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error updating investment type:", error);
    }
  };
  return (

      <div className='flex bg-trai-background h-screen'>
        <aside className="navbar fixed w-64">
          <NavBar openModal={openBitModal}/>
        </aside>

        <section className='flex-1 p-8 bg-trai-background mt-40 mb-40 flex justify-center'
                 style={{paddingLeft: '270px'}}>
          <div className='flex flex-col gap-6 bg-white p-6 shadow-md rounded-lg max-w-3xl w-full'>
            <label htmlFor='investmentStyle' className='text-lg font-semibold'>본인의 투자 성향을 작성해주세요.</label>
            {isSaved && <span className="text-sm text-green-500">수정이 완료되었어요 🌈</span>}
            <textarea
                id='investmentStyle'
                value={savedValue}
                onChange={(e) => setSavedValue(e.target.value)}
                className={`p-4 border rounded w-full h-40 resize-none ${!isEditing ? 'bg-gray-100' : 'bg-trai-white'}`}
                placeholder='예시: 저는 공격적인 투자를 선호합니다.'
                readOnly={!isEditing}
            />
            {isRoleAdmin && (
            <div className='flex justify-evenly'>
              {!isEditing ? (
                  <button
                      type="button"
                      onClick={handleEdit}
                      className="bg-trai-mint p-2 text-white rounded-md w-24"
                  >
                    수정
                  </button>
              ) : (
                  <button
                      type="button"
                      onClick={handleSave}
                      className="bg-trai-mint p-2 text-white rounded-md w-24"
                  >
                    저장
                  </button>
              )}

                  <button
                      type="button"
                      onClick={handleOpenModal}
                      className={`p-2 text-white rounded w-30 ${isEditing ? 'bg-gray-300 cursor-not-allowed' : 'bg-trai-navy'}`}
                      disabled={isEditing}
                  >
                    실시간 투자 하기
                  </button>
            </div>
                )}
          </div>

          {isModalOpen && (
              <Modal
                  title="현재 성향으로 투자를 진행합니다."
                  message="진행하시겠습니까?"
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                  confirmText="네"
                  cancelText="아니오"
              />
          )}
          {isBitModalOpen && <BitBot onClose={closeBitModal}/>}
        </section>
      </div>
  );
};

export default TradeSettings;
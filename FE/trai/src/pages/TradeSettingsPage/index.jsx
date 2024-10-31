import NavBar from '@components/NavBar';
import FireworkButton from '@components/FireworkButton';

const TradeSettings = () => {
  return (
    <div className='flex bg-trai-background min-h-screen'>
      <aside className='w-72'>
        <NavBar />
      </aside>
      <section className='flex-1'>
        <div>거래 설정 페이지입니다.</div>
        <FireworkButton />
      </section>
    </div>
  );
};

export default TradeSettings;
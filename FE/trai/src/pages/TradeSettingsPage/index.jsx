import NavBar from '@components/NavBar'

const TradeSettings = () => {
  return (
    <div className='flex bg-trai-background min-h-screen'>
      <aside className='w-72 border border-blue-500'>
        <NavBar/>
      </aside>
      <section className='flex-1'>
        <div>거래 설정 페이지입니다.</div>
      </section>
    </div>
  )

}

export default TradeSettings;
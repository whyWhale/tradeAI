import NavBar from '@components/NavBar'

const InvestmentStatus = () => {
  return (
    <div className='flex bg-trai-background min-h-screen'>
      <aside className='w-72 border border-blue-500'>
        <NavBar/>
      </aside>
      <section className='flex-1'>
        <div>투자 현황 페이지입니다.</div>
      </section>
    </div>
  )

}

export default InvestmentStatus;
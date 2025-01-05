import './App.css'
import Navigation from './navigation'


function Home() {
  return (
    <>
      <header style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
        <div className="header-left">
          <img src="icon.png" alt="Icon" />
          <h1>标题</h1>
        </div>
        <div className="header-right">
          <a href="#link1">链接1</a>
          <a href="#link2">链接2</a>
          <a href="#link3">链接3</a>
        </div>
      </header>
      <nav style={{ backgroundColor: '#e0e0e0', padding: '10px' }}>
        <Navigation />
      </nav>
    </>
  )
}

export default Home

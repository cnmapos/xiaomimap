import './App.css'
import Navigation from './navigation'


function App() {


  return (
    <>
      <header>
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
      <nav>
        <Navigation />
      </nav>
    </>
  )
}

export default App

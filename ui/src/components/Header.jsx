import './Header.css'

function Header({ currentPage, onNavigate }) {
  return (
    <div className="header">
      <div className="header-logo">
        <h1>easys cafe</h1>
      </div>
      <div className="header-nav">
        <button 
          className={`nav-button ${currentPage === 'order' ? 'active' : ''}`}
          onClick={() => onNavigate('order')}
        >
          주문하기
        </button>
        <button 
          className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
          onClick={() => onNavigate('admin')}
        >
          관리자
        </button>
      </div>
    </div>
  )
}

export default Header


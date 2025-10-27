import './Dashboard.css'

function Dashboard({ totalOrders, receivedOrders, manufacturingOrders, completedOrders }) {
  return (
    <div className="dashboard">
      <h3>관리자 대시보드</h3>
      <div className="dashboard-stats">
        <div className="stat-item">
          <span className="stat-label">총 주문</span>
          <span className="stat-value">{totalOrders}</span>
        </div>
        <div className="stat-divider">/</div>
        <div className="stat-item">
          <span className="stat-label">주문 접수</span>
          <span className="stat-value">{receivedOrders}</span>
        </div>
        <div className="stat-divider">/</div>
        <div className="stat-item">
          <span className="stat-label">제조 중</span>
          <span className="stat-value">{manufacturingOrders}</span>
        </div>
        <div className="stat-divider">/</div>
        <div className="stat-item">
          <span className="stat-label">제조 완료</span>
          <span className="stat-value">{completedOrders}</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


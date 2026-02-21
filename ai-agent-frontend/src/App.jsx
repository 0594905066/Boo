import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [agentStatus, setAgentStatus] = useState('idle')
  const [tasks, setTasks] = useState([])
  const [learningProgress, setLearningProgress] = useState(0)
  const [systemHealth, setSystemHealth] = useState({
    backend: 'unknown',
    database: 'unknown',
    n8n: 'unknown'
  })
  const [newTask, setNewTask] = useState('')

  // جلب حالة الوكيل من الواجهة الخلفية
  useEffect(() => {
    const fetchAgentStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/agent/status')
        if (response.ok) {
          const data = await response.json()
          setAgentStatus(data.status)
          setLearningProgress(data.progress || 0)
          setSystemHealth(data.systemHealth || {})
        }
      } catch (error) {
        console.error('خطأ في جلب حالة الوكيل:', error)
        setAgentStatus('error')
      }
    }

    fetchAgentStatus()
    const interval = setInterval(fetchAgentStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  // إضافة مهمة جديدة
  const handleAddTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await fetch('http://localhost:3000/api/agent/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: newTask })
        })
        if (response.ok) {
          const task = await response.json()
          setTasks([...tasks, task])
          setNewTask('')
        }
      } catch (error) {
        console.error('خطأ في إضافة المهمة:', error)
      }
    }
  }

  // بدء تعلم الوكيل
  const handleStartLearning = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/agent/learn', {
        method: 'POST'
      })
      if (response.ok) {
        setAgentStatus('learning')
      }
    } catch (error) {
      console.error('خطأ في بدء التعلم:', error)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 لوحة التحكم - وكيل الذكاء الاصطناعي الشامل</h1>
        <p className="subtitle">نظام تعلم ذاتي متكامل للبرمجة والتصميم</p>
      </header>

      <main className="main-content">
        {/* قسم حالة النظام */}
        <section className="system-status">
          <h2>حالة النظام</h2>
          <div className="status-grid">
            <div className={`status-card ${agentStatus}`}>
              <h3>حالة الوكيل</h3>
              <p className="status-value">{agentStatus}</p>
            </div>
            <div className={`status-card ${systemHealth.backend}`}>
              <h3>الواجهة الخلفية</h3>
              <p className="status-value">{systemHealth.backend}</p>
            </div>
            <div className={`status-card ${systemHealth.database}`}>
              <h3>قاعدة البيانات</h3>
              <p className="status-value">{systemHealth.database}</p>
            </div>
            <div className={`status-card ${systemHealth.n8n}`}>
              <h3>n8n</h3>
              <p className="status-value">{systemHealth.n8n}</p>
            </div>
          </div>
        </section>

        {/* قسم التعلم والتقدم */}
        <section className="learning-section">
          <h2>التعلم الذاتي</h2>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${learningProgress}%` }}></div>
            </div>
            <p className="progress-text">التقدم: {learningProgress}%</p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleStartLearning}
            disabled={agentStatus === 'learning'}
          >
            {agentStatus === 'learning' ? 'جاري التعلم...' : 'بدء التعلم'}
          </button>
        </section>

        {/* قسم إدارة المهام */}
        <section className="tasks-section">
          <h2>المهام</h2>
          <div className="task-input-container">
            <input
              type="text"
              placeholder="أدخل مهمة جديدة..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              className="task-input"
            />
            <button className="btn btn-secondary" onClick={handleAddTask}>
              إضافة مهمة
            </button>
          </div>

          <div className="tasks-list">
            {tasks.length === 0 ? (
              <p className="no-tasks">لا توجد مهام حالياً</p>
            ) : (
              tasks.map((task, index) => (
                <div key={index} className="task-item">
                  <h4>{task.description}</h4>
                  <p className="task-status">الحالة: {task.status}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* قسم المعلومات */}
        <section className="info-section">
          <h2>معلومات النظام</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>الواجهة الأمامية</h3>
              <p>React + Vite</p>
            </div>
            <div className="info-card">
              <h3>الواجهة الخلفية</h3>
              <p>Node.js + Express</p>
            </div>
            <div className="info-card">
              <h3>قاعدة البيانات</h3>
              <p>PostgreSQL</p>
            </div>
            <div className="info-card">
              <h3>الأتمتة</h3>
              <p>n8n</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 وكيل الذكاء الاصطناعي الشامل - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  )
}

export default App

-- إنشاء قاعدة بيانات n8n
CREATE DATABASE n8n_db;

-- الاتصال بقاعدة البيانات الرئيسية
\c ai_agent_db;

-- جدول المهام
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  task_type VARCHAR(50),
  complexity VARCHAR(20),
  estimated_time VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100)
);

-- جدول خطوات المهام
CREATE TABLE IF NOT EXISTS task_steps (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  step_order INTEGER,
  title VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  description TEXT,
  estimated_duration VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المعرفة المكتسبة
CREATE TABLE IF NOT EXISTS knowledge (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR(255),
  confidence_score DECIMAL(3,2),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول حالة النظام
CREATE TABLE IF NOT EXISTS system_health (
  id SERIAL PRIMARY KEY,
  component VARCHAR(100),
  status VARCHAR(50),
  last_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  error_message TEXT
);

-- جدول سجل الأنشطة
CREATE TABLE IF NOT EXISTS activity_log (
  id SERIAL PRIMARY KEY,
  action VARCHAR(255),
  details TEXT,
  agent_status VARCHAR(50),
  progress INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول التوصيات
CREATE TABLE IF NOT EXISTS recommendations (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  task_type VARCHAR(50),
  recommendation TEXT,
  priority VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهارس للأداء
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_type ON tasks(task_type);
CREATE INDEX idx_knowledge_category ON knowledge(category);
CREATE INDEX idx_activity_log_created ON activity_log(created_at);

-- إدراج بيانات أولية لحالة النظام
INSERT INTO system_health (component, status) VALUES
  ('backend', 'online'),
  ('database', 'online'),
  ('n8n', 'offline'),
  ('redis', 'online');

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- تطبيق الدالة على الجداول
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_steps_updated_at BEFORE UPDATE ON task_steps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_updated_at BEFORE UPDATE ON knowledge
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

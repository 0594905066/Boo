var express = require('express');
var router = express.Router();
var smartPlanner = require('../lib/smartPlanner');

// محاكاة قاعدة بيانات بسيطة للوكيل
var agentState = {
  status: 'idle',
  progress: 0,
  tasks: [],
  systemHealth: {
    backend: 'online',
    database: 'online',
    n8n: 'offline'
  },
  knowledge: {
    programming: [],
    design: [],
    automation: []
  }
};

// الحصول على حالة الوكيل
router.get('/status', function(req, res, next) {
  res.json({
    status: agentState.status,
    progress: agentState.progress,
    systemHealth: agentState.systemHealth,
    timestamp: new Date().toISOString()
  });
});

// بدء التعلم
router.post('/learn', function(req, res, next) {
  agentState.status = 'learning';
  agentState.progress = 0;

  // محاكاة عملية التعلم
  const learningInterval = setInterval(() => {
    agentState.progress += Math.random() * 15;
    if (agentState.progress >= 100) {
      agentState.progress = 100;
      agentState.status = 'idle';
      clearInterval(learningInterval);
    }
  }, 2000);

  res.json({
    message: 'بدء عملية التعلم الذاتي',
    status: agentState.status
  });
});

// إضافة مهمة جديدة
router.post('/tasks', function(req, res, next) {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'وصف المهمة مطلوب' });
  }

  const task = {
    id: agentState.tasks.length + 1,
    description: description,
    status: 'pending',
    createdAt: new Date().toISOString(),
    analysis: {}
  };

  // تحليل المهمة باستخدام SmartPlanner
  analyzeTask(task);

  agentState.tasks.push(task);

  res.json(task);
});

// الحصول على قائمة المهام
router.get('/tasks', function(req, res, next) {
  res.json({
    tasks: agentState.tasks,
    total: agentState.tasks.length
  });
});

// الحصول على تفاصيل مهمة محددة
router.get('/tasks/:id', function(req, res, next) {
  const task = agentState.tasks.find(t => t.id == req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'المهمة غير موجودة' });
  }

  res.json(task);
});

// تحديث حالة المهمة
router.put('/tasks/:id', function(req, res, next) {
  const { status } = req.body;
  const task = agentState.tasks.find(t => t.id == req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'المهمة غير موجودة' });
  }

  task.status = status || task.status;
  res.json(task);
});

// الحصول على المعرفة المكتسبة
router.get('/knowledge', function(req, res, next) {
  res.json({
    programming: agentState.knowledge.programming.length,
    design: agentState.knowledge.design.length,
    automation: agentState.knowledge.automation.length,
    total: agentState.knowledge.programming.length + 
           agentState.knowledge.design.length + 
           agentState.knowledge.automation.length
  });
});

// إضافة معرفة جديدة
router.post('/knowledge', function(req, res, next) {
  const { category, content } = req.body;

  if (!category || !content) {
    return res.status(400).json({ error: 'الفئة والمحتوى مطلوبان' });
  }

  if (agentState.knowledge[category]) {
    agentState.knowledge[category].push({
      content: content,
      addedAt: new Date().toISOString()
    });

    res.json({
      message: 'تمت إضافة المعرفة بنجاح',
      category: category,
      count: agentState.knowledge[category].length
    });
  } else {
    res.status(400).json({ error: 'فئة غير معروفة' });
  }
});

// الحصول على توصيات التحسين
router.get('/suggestions/:taskType', function(req, res, next) {
  const suggestions = smartPlanner.getOptimizationSuggestions(req.params.taskType);
  res.json({
    taskType: req.params.taskType,
    suggestions: suggestions
  });
});

// منطق تحليل المهمة (Smart Planner)
function analyzeTask(task) {
  const analysis = smartPlanner.analyzeTasks(task.description);
  task.analysis = analysis;
}

module.exports = router;

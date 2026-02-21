/**
 * Smart Planner - منطق المخطط الذكي
 * يقوم بتحليل المهام وتوليد خطط تنفيذية ذكية
 */

class SmartPlanner {
  constructor() {
    this.taskHistory = [];
    this.patterns = {
      programming: {
        keywords: ['برمج', 'كود', 'api', 'function', 'class', 'module'],
        steps: ['تحليل المتطلبات', 'تصميم البنية', 'كتابة الكود', 'الاختبار', 'التوثيق']
      },
      design: {
        keywords: ['تصميم', 'واجهة', 'ui', 'ux', 'layout', 'color'],
        steps: ['فهم المتطلبات', 'رسم الأسكتشات', 'تصميم الواجهة', 'الاختبار', 'التسليم']
      },
      automation: {
        keywords: ['أتمت', 'workflow', 'تكامل', 'automation', 'integration'],
        steps: ['تحديد المهام المتكررة', 'تصميم سير العمل', 'الإعداد', 'الاختبار', 'المراقبة']
      }
    };
  }

  /**
   * تحليل المهمة وتوليد خطة تنفيذية
   */
  analyzeTasks(taskDescription) {
    const analysis = {
      type: this.identifyTaskType(taskDescription),
      complexity: this.calculateComplexity(taskDescription),
      estimatedTime: this.estimateTime(taskDescription),
      steps: [],
      resources: [],
      risks: [],
      priority: this.calculatePriority(taskDescription)
    };

    // توليد الخطوات بناءً على نوع المهمة
    analysis.steps = this.generateSteps(analysis.type, taskDescription);

    // تحديد الموارد المطلوبة
    analysis.resources = this.identifyResources(analysis.type);

    // تحديد المخاطر المحتملة
    analysis.risks = this.identifyRisks(analysis.type, analysis.complexity);

    return analysis;
  }

  /**
   * تحديد نوع المهمة
   */
  identifyTaskType(description) {
    const lowerDesc = description.toLowerCase();

    for (const [type, config] of Object.entries(this.patterns)) {
      for (const keyword of config.keywords) {
        if (lowerDesc.includes(keyword)) {
          return type;
        }
      }
    }

    return 'general';
  }

  /**
   * حساب مستوى التعقيد
   */
  calculateComplexity(description) {
    const length = description.length;
    const wordCount = description.split(' ').length;

    if (wordCount > 30 || length > 200) {
      return 'high';
    } else if (wordCount > 15 || length > 100) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * تقدير الوقت المطلوب
   */
  estimateTime(description) {
    const complexity = this.calculateComplexity(description);

    const timeMap = {
      low: '15-30 دقيقة',
      medium: '1-2 ساعة',
      high: '3-8 ساعات'
    };

    return timeMap[complexity] || 'غير محدد';
  }

  /**
   * حساب الأولوية
   */
  calculatePriority(description) {
    const urgentKeywords = ['عاجل', 'فوري', 'حرج', 'critical', 'urgent'];
    const lowerDesc = description.toLowerCase();

    for (const keyword of urgentKeywords) {
      if (lowerDesc.includes(keyword)) {
        return 'high';
      }
    }

    return 'medium';
  }

  /**
   * توليد خطوات التنفيذ
   */
  generateSteps(taskType, description) {
    const baseSteps = this.patterns[taskType]?.steps || ['تحليل', 'التخطيط', 'التنفيذ', 'الاختبار'];

    return baseSteps.map((step, index) => ({
      order: index + 1,
      title: step,
      status: 'pending',
      description: `${step} لـ: ${description.substring(0, 50)}...`,
      estimatedDuration: this.getStepDuration(taskType, index)
    }));
  }

  /**
   * الحصول على مدة كل خطوة
   */
  getStepDuration(taskType, stepIndex) {
    const durations = {
      programming: ['15 دقيقة', '30 دقيقة', '45 دقيقة', '20 دقيقة', '10 دقائق'],
      design: ['20 دقيقة', '40 دقيقة', '30 دقيقة', '15 دقيقة', '10 دقائق'],
      automation: ['15 دقيقة', '25 دقيقة', '30 دقيقة', '20 دقيقة', '15 دقيقة']
    };

    return durations[taskType]?.[stepIndex] || '15 دقيقة';
  }

  /**
   * تحديد الموارد المطلوبة
   */
  identifyResources(taskType) {
    const resources = {
      programming: ['محرر كود', 'بيئة تطوير', 'مكتبات برمجية', 'أدوات اختبار'],
      design: ['أداة تصميم', 'مكتبة ألوان', 'مكتبة أيقونات', 'أدوات نماذج'],
      automation: ['منصة أتمتة', 'واجهات برمجية', 'قاعدة بيانات', 'أدوات مراقبة']
    };

    return resources[taskType] || ['موارد عامة'];
  }

  /**
   * تحديد المخاطر المحتملة
   */
  identifyRisks(taskType, complexity) {
    const risks = {
      low: ['تأخير بسيط', 'أخطاء طفيفة'],
      medium: ['تأخير معتدل', 'أخطاء متوسطة', 'مشاكل توافق'],
      high: ['تأخير كبير', 'أخطاء حرجة', 'مشاكل أداء', 'مشاكل أمان']
    };

    return risks[complexity] || [];
  }

  /**
   * تحديث حالة المهمة
   */
  updateTaskStatus(taskId, status) {
    const task = this.taskHistory.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      task.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  /**
   * الحصول على توصيات التحسين
   */
  getOptimizationSuggestions(taskType) {
    const suggestions = {
      programming: [
        'استخدام أنماط التصميم المعروفة',
        'كتابة اختبارات شاملة',
        'توثيق الكود بشكل واضح',
        'استخدام أدوات التحليل التلقائي'
      ],
      design: [
        'اتبع مبادئ التصميم الحديثة',
        'اختبر على أجهزة مختلفة',
        'احصل على ملاحظات المستخدمين',
        'استخدم نظام ألوان متسق'
      ],
      automation: [
        'ابدأ بحالات استخدام بسيطة',
        'اختبر سير العمل قبل النشر',
        'راقب الأداء والأخطاء',
        'وثق جميع الخطوات'
      ]
    };

    return suggestions[taskType] || [];
  }
}

module.exports = new SmartPlanner();

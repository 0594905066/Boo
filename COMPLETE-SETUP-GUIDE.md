# دليل شامل لتشغيل مشروع وكيل الذكاء الاصطناعي الكامل

## نظرة عامة

هذا الدليل يوفر تعليمات خطوة بخطوة لتشغيل مشروع وكيل الذكاء الاصطناعي الشامل بجميع مكوناته (الواجهة الأمامية، الواجهة الخلفية، قاعدة البيانات، ومنصة الأتمتة).

## المتطلبات الأساسية

قبل البدء، تأكد من أن لديك:

*   **Docker و Docker Compose:** لتشغيل الخدمات في حاويات.
*   **Node.js و npm/pnpm:** لتشغيل الواجهة الأمامية والخلفية.
*   **Git:** لاستنساخ المستودع.
*   **متصفح ويب:** للوصول إلى الواجهات.
*   **اتصال إنترنت:** لتحميل الحزم والبيانات.

## خطوات التشغيل

### الخطوة 1: استنساخ المستودع

```bash
git clone https://github.com/0594905066/Boo.git
cd Boo
```

### الخطوة 2: تشغيل الخدمات الأساسية (PostgreSQL و n8n و Redis)

```bash
docker-compose up --build -d
```

**ما يحدث:**
*   تحميل صور Docker الضرورية.
*   إنشاء وتشغيل حاويات PostgreSQL و n8n و Redis.
*   تهيئة قاعدة البيانات باستخدام ملف `init-db.sql`.

**التحقق من الحالة:**
```bash
docker-compose ps
```

### الخطوة 3: تشغيل الواجهة الخلفية (Node.js/Express.js)

في نافذة terminal جديدة:

```bash
cd Boo/ai-agent-backend
npm install
npm start
```

**النتيجة المتوقعة:**
```
Server is running on http://localhost:3000
```

### الخطوة 4: تشغيل الواجهة الأمامية (React.js)

في نافذة terminal جديدة:

```bash
cd Boo/ai-agent-frontend
pnpm install
pnpm run dev
```

**النتيجة المتوقعة:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## الوصول إلى المكونات

بعد تشغيل جميع الخدمات، يمكنك الوصول إلى:

| المكون | الرابط | الوصف |
| :--- | :--- | :--- |
| **الواجهة الأمامية** | http://localhost:5173 | لوحة التحكم الرئيسية للوكيل |
| **الواجهة الخلفية (API)** | http://localhost:3000 | واجهة برمجة التطبيقات |
| **n8n** | http://localhost:5678 | منصة الأتمتة (اسم المستخدم: admin، كلمة المرور: admin123) |
| **PostgreSQL** | localhost:5432 | قاعدة البيانات (المستخدم: ai_agent، كلمة المرور: secure_password_123) |
| **Redis** | localhost:6379 | ذاكرة التخزين المؤقت |

## اختبار الواجهات

### اختبار الواجهة الأمامية

1.  افتح http://localhost:5173 في متصفحك.
2.  يجب أن ترى لوحة التحكم الرئيسية للوكيل.
3.  جرب إضافة مهمة جديدة أو عرض حالة الوكيل.

### اختبار الواجهة الخلفية

استخدم أداة مثل **Postman** أو **curl** لاختبار API:

```bash
# الحصول على حالة الوكيل
curl http://localhost:3000/api/agent/status

# إضافة مهمة جديدة
curl -X POST http://localhost:3000/api/agent/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "Build a web app", "task_type": "programming"}'

# الحصول على قائمة المهام
curl http://localhost:3000/api/agent/tasks
```

### اختبار n8n

1.  افتح http://localhost:5678 في متصفحك.
2.  سجل الدخول باستخدام (admin / admin123).
3.  انتقل إلى **Workflows** واستيرد ملف `n8n-workflows.json`.
4.  قم بتشغيل سير عمل واحدة يدوياً للتحقق من أنها تعمل.

## استيراد سير العمل في n8n

لاستيراد سير العمل المسبقة:

1.  افتح n8n (http://localhost:5678).
2.  انقر على **Workflows** في القائمة الجانبية.
3.  انقر على زر **Import** (أو **+**).
4.  اختر **From File**.
5.  حدد ملف `n8n-workflows.json`.
6.  انقر على **Import**.

للحصول على تفاصيل أكثر، راجع ملف `n8n-setup-guide.md`.

## إدارة الخدمات

### إيقاف الخدمات

```bash
# إيقاف جميع الخدمات
docker-compose down

# إيقاف الخدمات مع حذف البيانات
docker-compose down -v
```

### إعادة تشغيل الخدمات

```bash
docker-compose restart
```

### عرض السجلات

```bash
# عرض سجلات جميع الخدمات
docker-compose logs -f

# عرض سجلات خدمة محددة
docker-compose logs -f n8n
docker-compose logs -f postgres
```

## استكشاف الأخطاء

### الواجهة الأمامية لا تحمل

*   تأكد من أن الواجهة الخلفية تعمل بشكل صحيح.
*   تحقق من أن CORS مفعل في الواجهة الخلفية.
*   افتح أدوات المطور (F12) وتحقق من الأخطاء في Console.

### الواجهة الخلفية لا تستجيب

*   تأكد من أن Node.js مثبت بشكل صحيح.
*   تحقق من أن المنفذ 3000 غير مستخدم.
*   أعد تشغيل الخادم.

### n8n لا يعمل

*   تأكد من أن Docker Compose يعمل بشكل صحيح.
*   تحقق من السجلات: `docker-compose logs n8n`.
*   أعد تشغيل حاوية n8n: `docker-compose restart n8n`.

### قاعدة البيانات لا تتصل

*   تأكد من أن حاوية PostgreSQL تعمل.
*   تحقق من بيانات الاعتماد في `docker-compose.yml`.
*   جرب الاتصال يدوياً:
    ```bash
    psql -h localhost -U ai_agent -d ai_agent_db
    ```

## الخطوات التالية

بعد التشغيل الناجح:

1.  **استكشف الواجهات:** تعرف على كيفية استخدام لوحة التحكم والـ APIs.
2.  **استيرد سير العمل:** استيرد سير العمل المسبقة في n8n.
3.  **اختبر الأتمتة:** قم بتشغيل سير عمل واحدة يدوياً.
4.  **خصص المشروع:** عدّل سير العمل والـ APIs حسب احتياجاتك.
5.  **طور المزيد:** أضف مكونات جديدة وسير عمل إضافية.

## الملفات المهمة

| الملف | الوصف |
| :--- | :--- |
| `docker-compose.yml` | تكوين الخدمات (PostgreSQL، n8n، Redis) |
| `init-db.sql` | مخطط قاعدة البيانات |
| `n8n-workflows.json` | سير العمل المسبقة |
| `ai-agent-backend/app.js` | ملف الواجهة الخلفية الرئيسي |
| `ai-agent-frontend/src/App.jsx` | ملف الواجهة الأمامية الرئيسي |
| `n8n-setup-guide.md` | دليل تفصيلي لـ n8n |
| `final_project_report.md` | التقرير النهائي للمشروع |

## الموارد الإضافية

*   [توثيق n8n](https://docs.n8n.io)
*   [توثيق Express.js](https://expressjs.com)
*   [توثيق React.js](https://react.dev)
*   [توثيق PostgreSQL](https://www.postgresql.org/docs)
*   [توثيق Docker](https://docs.docker.com)

---

**ملاحظة:** إذا واجهت أي مشاكل، تأكد من أن جميع المتطلبات الأساسية مثبتة بشكل صحيح وأن جميع المنافذ المطلوبة متاحة.

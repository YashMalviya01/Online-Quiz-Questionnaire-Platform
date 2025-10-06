# 🚀 Quick Reference: Phase 2 APIs

## Authentication
```javascript
// All requests need this header:
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📚 Question Banks

```javascript
// Create
POST /api/question-banks
{ name, description, category, subject, tags, isPublic }

// List (with filters)
GET /api/question-banks?category=Math&tags=algebra&page=1&limit=10

// Get One
GET /api/question-banks/:id

// Update
PUT /api/question-banks/:id
{ name, description, ... }

// Delete
DELETE /api/question-banks/:id

// Add Question
POST /api/question-banks/:id/questions
{ questionId }

// Remove Question
DELETE /api/question-banks/:id/questions/:questionId

// Share
POST /api/question-banks/:id/share
{ userId, permission: 'view'|'edit' }

// Unshare
DELETE /api/question-banks/:id/share/:userId

// Stats
GET /api/question-banks/:id/statistics
```

## 📊 Analytics

```javascript
// Full Analytics
GET /api/analytics/quiz/:quizId

// Question Analytics
GET /api/analytics/quiz/:quizId/questions

// At-Risk Students
GET /api/analytics/quiz/:quizId/at-risk

// Top Performers
GET /api/analytics/quiz/:quizId/top-performers

// Trends
GET /api/analytics/quiz/:quizId/trends?startDate=...&endDate=...

// Violations
GET /api/analytics/quiz/:quizId/violations

// Export
GET /api/analytics/quiz/:quizId/export?format=csv

// Recalculate
POST /api/analytics/quiz/:quizId/recalculate
```

## 🔍 Enhanced Proctoring

```javascript
// Create Event
POST /api/enhanced-proctoring/events
{ quizId, resultId }

// Update (Add Violations)
PUT /api/enhanced-proctoring/events/:id
{
  eyeTracking: { lookAwayCount, violation: {...} },
  browserMonitoring: { tabSwitch: {...} },
  faceDetection: { multipleFacesDetected, ... }
}

// Get Event
GET /api/enhanced-proctoring/events/:id

// List Events
GET /api/enhanced-proctoring/quiz/:quizId/events?riskLevel=high

// Review
POST /api/enhanced-proctoring/events/:id/review
{ reviewStatus, reviewNotes, actionTaken }

// Flagged
GET /api/enhanced-proctoring/quiz/:quizId/flagged
```

## ✍️ Grading

```javascript
// Pending Queue
GET /api/grading/quiz/:quizId/pending

// Grade Answer
POST /api/grading/result/:resultId/answer/:questionId
{ awardedScore, feedback }

// Grade with Rubric
POST /api/grading/result/:resultId/answer/:questionId/rubric
{ rubricScores: { "Criterion": score, ... } }

// Bulk Grade
POST /api/grading/result/:resultId/bulk
{ gradings: [{ questionId, awardedScore, feedback }, ...] }

// Add Feedback
POST /api/grading/result/:resultId/feedback
{ feedback }

// Stats
GET /api/grading/quiz/:quizId/statistics

// Auto-Grade
POST /api/grading/result/:resultId/auto-grade
```

## 🛡️ Permissions

| Endpoint | Roles | Additional |
|----------|-------|------------|
| Question Banks | instructor, admin | owner/editor for write |
| Analytics | instructor, admin | quiz owner |
| Proctoring | instructor, admin | quiz owner |
| Grading | instructor, admin | quiz owner |

## 📦 Response Format

```javascript
// Success
{
  success: true,
  data: { ... },
  message: "...", // optional
  pagination: { page, limit, total, pages } // for lists
}

// Error
{
  success: false,
  message: "Error message",
  error: "Detailed error" // optional
}
```

## 🔢 Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## 🎯 Common Use Cases

### Create and Use Question Bank
```javascript
// 1. Create bank
POST /api/question-banks
{ name: "Math Bank", category: "Math" }
// → Save bankId

// 2. Add questions
POST /api/question-banks/:bankId/questions
{ questionId: "q1" }
POST /api/question-banks/:bankId/questions
{ questionId: "q2" }

// 3. Share with colleague
POST /api/question-banks/:bankId/share
{ userId: "instructor2", permission: "edit" }

// 4. Use in quiz creation
POST /api/quizzes
{ questions: ["q1", "q2", ...] }
```

### Monitor Quiz Performance
```javascript
// 1. Get full analytics
GET /api/analytics/quiz/:quizId
// → Review overall performance

// 2. Identify struggling students
GET /api/analytics/quiz/:quizId/at-risk
// → Send help/resources

// 3. Review difficult questions
GET /api/analytics/quiz/:quizId/questions
// → Filter by low success rate

// 4. Export for records
GET /api/analytics/quiz/:quizId/export?format=csv
// → Save report
```

### Handle Proctoring Violations
```javascript
// 1. Get flagged attempts
GET /api/enhanced-proctoring/quiz/:quizId/flagged
// → List high-risk students

// 2. Review each event
GET /api/enhanced-proctoring/events/:eventId
// → Check violation details

// 3. Make decision
POST /api/enhanced-proctoring/events/:eventId/review
{
  reviewStatus: "flagged",
  reviewNotes: "Multiple tab switches",
  actionTaken: "warning-issued"
}
```

### Grade Subjective Questions
```javascript
// 1. Get pending items
GET /api/grading/quiz/:quizId/pending
// → List essays/files

// 2. Grade with rubric
POST /api/grading/result/:resultId/answer/:qId/rubric
{
  rubricScores: {
    "Content": 8,
    "Organization": 7,
    "Grammar": 9
  }
}

// 3. Add overall feedback
POST /api/grading/result/:resultId/feedback
{ feedback: "Excellent work overall!" }

// 4. Check progress
GET /api/grading/quiz/:quizId/statistics
// → See % graded
```

## 🔗 Related Docs

- `API_TESTING_GUIDE.md` - Detailed testing
- `PHASE_2_COMPLETE.md` - Full documentation
- `PHASE_2_SUMMARY.md` - Feature overview

---

**Quick access to all 31 endpoints!** 🚀

# AI Features Quick Reference Guide

## 🚀 Quick Start

### Installation (5 minutes)
```bash
cd backend
npm install
# Add GEMINI_API_KEY to .env
npm run dev
```

### Get API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy and paste into `.env`:
   ```
   GEMINI_API_KEY=your-key-here
   ```

---

## 🎯 API Endpoints

### Check AI Availability
```http
GET /api/ai-quiz/check-availability
```

### Generate Questions
```http
POST /api/ai-quiz/generate/multiple-choice
POST /api/ai-quiz/generate/true-false
POST /api/ai-quiz/generate/coding
POST /api/ai-quiz/generate/essay
POST /api/ai-quiz/generate/mixed
```

**Request Body Example:**
```json
{
  "topic": "React Hooks",
  "difficulty": "medium",
  "count": 5,
  "saveToBank": true,
  "category": "Frontend Development"
}
```

### Improve/Validate Questions
```http
POST /api/ai-quiz/improve/:questionId
GET  /api/ai-quiz/validate/:questionId
GET  /api/ai-quiz/stats
```

### Code Submission with AI Detection
```http
POST /api/code/submit
```

**Request Body:**
```json
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript",
  "testCases": [
    { "input": "2,3", "expectedOutput": "5" }
  ],
  "runAIDetection": true
}
```

---

## 🎨 Frontend Components

### AI Quiz Generator
```jsx
import AIQuizGenerator from './components/AIQuizGenerator';

<AIQuizGenerator 
  onQuestionsGenerated={(questions) => console.log(questions)}
  onClose={() => setShowGenerator(false)}
/>
```

### AI Detection Dashboard
```jsx
import AIDetectionDashboard from './components/AIDetectionDashboard';

<AIDetectionDashboard 
  userId={currentUser.id}
  quizId={selectedQuiz.id}
  resultId={resultId}
/>
```

### AI Detection Results (Student View)
```jsx
import AIDetectionResults from './components/AIDetectionResults';

<AIDetectionResults detection={answer.aiDetection} />
```

---

## 📊 AI Detection Heuristics

### Scoring Factors (Weighted)
1. **Comment Ratio** (20%): Percentage of comments vs code
2. **Variable Naming** (25%): Naming patterns and conventions
3. **Boilerplate** (20%): Template and standard code detection
4. **GPT Fingerprints** (35%): AI-specific patterns

### Risk Levels
- **0-20**: ✅ Minimal Risk (appears human-written)
- **20-35**: ℹ️ Low Risk (minor indicators)
- **35-50**: ⚠️ Moderate Risk (some patterns detected)
- **50-100**: 🚨 High Risk (manual review required)

### Detection Indicators
- `comment_ratio`: Excessive comments
- `variable_naming`: Unusually long/descriptive names
- `boilerplate`: Standard templates detected
- `perfect_formatting`: Near-perfect indentation
- `explanatory_comments`: "This", "Here", "Now" style
- `type_annotations`: Comprehensive type hints
- `docstrings`: Multiple detailed docstrings
- `error_handling`: Comprehensive try-catch patterns
- `validation_logic`: Extensive validation code

---

## 💡 Usage Examples

### Generate 5 Medium Difficulty JavaScript Questions
```javascript
const response = await api.post('/ai-quiz/generate/coding', {
  topic: 'JavaScript ES6 Features',
  language: 'javascript',
  difficulty: 'medium',
  count: 5,
  saveToBank: true,
  category: 'JavaScript'
});

console.log(response.data.questions);
```

### Generate Mixed Question Set
```javascript
const response = await api.post('/ai-quiz/generate/mixed', {
  topic: 'Web Development Basics',
  difficulty: 'easy',
  distribution: {
    multipleChoice: 8,
    trueFalse: 5,
    coding: 2,
    essay: 1
  },
  saveToBank: true
});

console.log(response.data.breakdown);
// { multipleChoice: 8, trueFalse: 5, coding: 2, essay: 1 }
```

### Check Code for AI Generation
```javascript
const response = await api.post('/code/submit', {
  code: studentCode,
  language: 'python',
  testCases: testCases,
  runAIDetection: true
});

const detection = response.data.aiDetection;
console.log(`AI Score: ${detection.aiScore}`);
console.log(`Risk Level: ${detection.recommendation}`);
console.log(`Indicators:`, detection.indicators);
```

---

## 🔧 Configuration

### Environment Variables
```bash
# Required
GEMINI_API_KEY=your-gemini-api-key

# Optional
USE_DOCKER=false
LOG_LEVEL=info
```

### Rate Limits
- Free Tier: 60 requests/minute
- Recommended: Use caching for repeated requests
- Production: Consider paid tier for high-volume use

---

## 🐛 Troubleshooting

### "Gemini AI service is not available"
**Solution**: Check if `GEMINI_API_KEY` is set in `.env`
```bash
echo $GEMINI_API_KEY  # Linux/Mac
echo %GEMINI_API_KEY%  # Windows
```

### "Failed to generate questions"
**Possible Causes**:
1. Invalid API key
2. Rate limit exceeded
3. Network issues
4. Malformed request

**Solution**: Check logs for detailed error message

### "AI detection not running"
**Solution**: Ensure `runAIDetection: true` in request body

### Questions not saving to database
**Solution**: Set `saveToBank: true` in request

---

## 📚 Additional Resources

- **Full Documentation**: `AI_IMPLEMENTATION_SUMMARY.md`
- **API Reference**: `docs/API_QUICK_REFERENCE.md`
- **Setup Guide**: `README.md` (AI Features Setup section)
- **Google AI Studio**: https://makersuite.google.com/

---

## 🎓 Best Practices

### For Quiz Generation
1. **Be Specific**: Use detailed topics ("React useEffect Hook" vs "React")
2. **Review Before Saving**: Preview questions before adding to bank
3. **Mix Difficulties**: Generate diverse difficulty levels
4. **Use Categories**: Organize questions with meaningful categories
5. **Validate Quality**: Use the `/validate` endpoint for important questions

### For AI Detection
1. **Don't Over-Rely**: Use as one factor among many
2. **Manual Review**: Always review high-risk submissions
3. **Explain to Students**: Be transparent about detection criteria
4. **Consider Context**: False positives can occur with well-written code
5. **Combine with Proctoring**: Use alongside other anti-cheat measures

### For Performance
1. **Batch Requests**: Use mixed generation for multiple types
2. **Cache Results**: Store generated questions for reuse
3. **Async Operations**: Don't block UI during generation
4. **Error Handling**: Always handle API failures gracefully
5. **Monitor Limits**: Track API usage to avoid rate limits

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Check logs
tail -f logs/combined.log

# Seed demo data
node src/utils/seedData.js
```

---

**Last Updated**: November 3, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅

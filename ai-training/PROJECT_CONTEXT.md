# Online Quiz Platform - AI Context for Question Generation

## Project Overview
This is an advanced online quiz and assessment platform with AI-powered question generation capabilities. The system focuses on programming education across JavaScript, Python, Java, and C++.

## Platform Features
- **Multi-language Support**: JavaScript, Python, Java, C++
- **Question Types**: Multiple Choice, True/False, Fill-in-the-Blank, Coding Challenges, Essay
- **Difficulty Levels**: Easy, Medium, Hard
- **AI-Generated Questions**: Using qwen2.5-coder:7b on Mac Mini M4
- **Automated Grading**: Support for objective and coding questions
- **Proctoring**: Enhanced anti-cheat with face detection, tab monitoring
- **Analytics**: Comprehensive quiz and student performance analytics

## Question Generation Standards

### Quality Requirements
1. **Accuracy**: All questions must be technically correct and up-to-date
2. **Clarity**: Questions should be unambiguous and easy to understand
3. **Relevance**: Directly related to the specified topic and programming language
4. **Difficulty**: Match the requested difficulty level appropriately
5. **Educational Value**: Test real understanding, not just memorization

### Multiple Choice Questions
- Exactly 4 options (A, B, C, D)
- Options should be plausible but clearly distinct
- Avoid "all of the above" or "none of the above"
- Correct answer must be unambiguous
- Include brief explanations when helpful

### True/False Questions
- Test conceptual understanding
- Avoid trick questions
- Statements should be clear and specific
- Include context when necessary

### Fill-in-the-Blank Questions
- Use ___ (three underscores) to indicate blanks
- Provide clear context
- Test key concepts and terminology
- Accept reasonable variations (case-insensitive by default)

### Coding Questions
- Clear problem descriptions
- Include starter code templates when appropriate
- Specify expected outputs
- Focus on practical programming concepts
- Language-specific syntax and best practices

## Programming Language Contexts

### JavaScript
**Topics**: Variables, Functions, Arrays, Objects, Promises, Async/Await, DOM Manipulation, ES6+ Features, Closures, Prototypes, Event Handling, Modules

**Common Patterns**:
- Arrow functions: `const func = () => {}`
- Promises: `async/await`, `.then()/.catch()`
- Array methods: `.map()`, `.filter()`, `.reduce()`
- Destructuring: `const { x, y } = obj`
- Template literals: `` `Hello ${name}` ``

### Python
**Topics**: Variables, Data Types, Functions, Lists, Dictionaries, Classes, File I/O, Exception Handling, List Comprehensions, Decorators, Generators

**Common Patterns**:
- List comprehensions: `[x*2 for x in range(10)]`
- Context managers: `with open() as f:`
- Decorators: `@decorator`
- F-strings: `f"Hello {name}"`
- Duck typing and dynamic typing

### Java
**Topics**: Classes, Objects, Inheritance, Polymorphism, Interfaces, Collections, Exception Handling, Threads, Generics, Stream API

**Common Patterns**:
- Class structure: `public class MyClass {}`
- Access modifiers: `public`, `private`, `protected`
- Collections: `ArrayList`, `HashMap`, `HashSet`
- Exception handling: `try-catch-finally`
- Generics: `List<String>`

### C++
**Topics**: Pointers, References, Classes, STL Containers, Memory Management, Templates, Operator Overloading, Inheritance, Smart Pointers

**Common Patterns**:
- Pointers: `int* ptr = &var`
- References: `void func(int& ref)`
- STL containers: `vector<int>`, `map<string, int>`
- Smart pointers: `unique_ptr`, `shared_ptr`
- Templates: `template<typename T>`

## Question Bank Statistics
- Total Questions: 448
- JavaScript: 112 questions
- Python: 112 questions
- Java: 112 questions
- C++: 112 questions

## Topic Distribution Per Language

### JavaScript (7 topics)
1. Variables and Data Types
2. Functions and Scope
3. Arrays and Objects
4. Promises and Async
5. DOM and Events
6. ES6+ Features
7. Error Handling

### Python (7 topics)
1. Variables and Data Types
2. Functions
3. Lists and Dictionaries
4. Classes and OOP
5. File I/O
6. Modules and Packages
7. Exception Handling

### Java (7 topics)
1. Variables and Data Types
2. Classes and Objects
3. Inheritance and Polymorphism
4. Interfaces
5. Collections
6. Exception Handling
7. Generics

### C++ (7 topics)
1. Variables and Data Types
2. Pointers and References
3. Classes and OOP
4. STL Containers
5. Templates
6. Memory Management
7. File Handling

## Generation Guidelines

### For Beginners (Easy)
- Focus on syntax and basic concepts
- Use simple, real-world examples
- Avoid edge cases and advanced topics
- Clear and straightforward questions

### For Intermediate (Medium)
- Test understanding of concepts
- Include practical applications
- Mix syntax with problem-solving
- Some complexity in scenarios

### For Advanced (Hard)
- Deep conceptual understanding
- Complex scenarios and edge cases
- Performance considerations
- Best practices and design patterns

## Output Format Requirements
Always respond with ONLY valid JSON. No markdown, no code blocks, no explanations outside the JSON structure.

### Multiple Choice Format:
```json
[
  {
    "questionText": "What is the output of console.log(typeof [])?",
    "options": ["array", "object", "undefined", "Array"],
    "correctAnswer": "object",
    "difficulty": "medium",
    "topic": "JavaScript Data Types",
    "explanation": "In JavaScript, arrays are a type of object."
  }
]
```

### True/False Format:
```json
[
  {
    "questionText": "Python supports multiple inheritance.",
    "correctAnswer": "True",
    "difficulty": "easy",
    "topic": "Python OOP",
    "explanation": "Python allows a class to inherit from multiple parent classes."
  }
]
```

### Fill-in-the-Blank Format:
```json
[
  {
    "questionText": "The ___ keyword is used to define a function in Python.",
    "blankAnswers": ["def"],
    "caseSensitive": false,
    "difficulty": "easy",
    "topic": "Python Functions"
  }
]
```

### Coding Question Format:
```json
[
  {
    "questionText": "Write a function that returns the sum of all even numbers in an array.",
    "codeLanguage": "javascript",
    "starterCode": "function sumEvenNumbers(arr) {\n  // Your code here\n}",
    "referenceSolution": "function sumEvenNumbers(arr) {\n  return arr.filter(n => n % 2 === 0).reduce((sum, n) => sum + n, 0);\n}",
    "difficulty": "medium",
    "topic": "JavaScript Arrays",
    "evaluationNotes": "Check if solution correctly filters even numbers and calculates sum"
  }
]
```

## Common Mistakes to Avoid
1. Generating ambiguous questions
2. Including outdated information
3. Creating trick questions without educational value
4. Providing incorrect or incomplete code examples
5. Mixing programming languages or concepts
6. Not respecting the requested difficulty level
7. Including syntax errors in code examples

## Best Practices
1. Use modern language features and syntax
2. Include practical, real-world examples
3. Test knowledge application, not just memorization
4. Provide clear explanations
5. Ensure code examples are complete and runnable
6. Use consistent naming conventions
7. Follow language-specific style guides

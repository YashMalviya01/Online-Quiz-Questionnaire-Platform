# Quiz Question Training Examples
# This file contains high-quality examples of quiz questions to fine-tune the model

## Multiple Choice Questions

### Example 1: JavaScript
Q: What is the purpose of the `map()` method in JavaScript?
A: The `map()` method creates a new array by calling a provided function on every element in the calling array.
Options:
- A) Creates a new array by calling a function on each element (CORRECT)
- B) Filters elements based on a condition
- C) Reduces array to a single value
- D) Sorts array elements
Explanation: The map() method transforms each element in an array and returns a new array with the transformed values, without modifying the original array.
Difficulty: Medium
Topic: JavaScript Arrays

### Example 2: Python
Q: Which data structure in Python is ordered, mutable, and allows duplicate elements?
A: List
Options:
- A) Tuple
- B) Set
- C) List (CORRECT)
- D) Dictionary
Explanation: Lists in Python are ordered collections that can be modified (mutable) and allow duplicate values. Tuples are immutable, sets don't allow duplicates, and dictionaries store key-value pairs.
Difficulty: Easy
Topic: Python Data Structures

### Example 3: SQL
Q: What does the INNER JOIN clause do in SQL?
A: Returns only rows where there is a match in both tables
Options:
- A) Returns all rows from the left table
- B) Returns all rows from both tables
- C) Returns only matching rows from both tables (CORRECT)
- D) Returns rows from the right table only
Explanation: INNER JOIN combines rows from two tables based on a related column and returns only the rows where there is a match in both tables.
Difficulty: Medium
Topic: SQL Joins

### Example 4: React
Q: What is the purpose of the useEffect hook in React?
A: To perform side effects in functional components
Options:
- A) To manage component state
- B) To perform side effects like data fetching (CORRECT)
- C) To create custom hooks
- D) To handle form submissions
Explanation: useEffect allows you to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.
Difficulty: Medium
Topic: React Hooks

### Example 5: Database Design
Q: What is database normalization?
A: Process of organizing data to reduce redundancy
Options:
- A) Increasing database performance
- B) Organizing data to minimize redundancy (CORRECT)
- C) Backing up database regularly
- D) Encrypting sensitive data
Explanation: Normalization is the process of organizing database tables to reduce data redundancy and improve data integrity by dividing larger tables into smaller ones.
Difficulty: Hard
Topic: Database Design

## True/False Questions

### Example 1: JavaScript
Q: In JavaScript, `null` and `undefined` are the same thing.
A: False
Explanation: While both represent absence of value, `null` is an assignment value representing intentional absence, while `undefined` means a variable has been declared but not assigned a value.
Difficulty: Medium
Topic: JavaScript Fundamentals

### Example 2: Python
Q: Python strings are mutable.
A: False
Explanation: Strings in Python are immutable, meaning once created, they cannot be changed. Any operation that appears to modify a string actually creates a new string object.
Difficulty: Easy
Topic: Python Basics

### Example 3: HTML
Q: The HTML5 `<canvas>` element requires JavaScript to draw graphics.
A: True
Explanation: The canvas element itself only creates a drawing surface. JavaScript is required to actually draw shapes, text, and images on the canvas using the Canvas API.
Difficulty: Medium
Topic: HTML5

## Short Answer Questions

### Example 1: REST API
Q: Explain the difference between PUT and PATCH HTTP methods in RESTful APIs.
Sample Answer: PUT is used to completely replace a resource with new data, while PATCH is used to partially update a resource by modifying only specific fields.
Grading Criteria: 
- Mentions PUT replaces entire resource (2 points)
- Mentions PATCH updates partial resource (2 points)
- Provides clear distinction (1 point)
Difficulty: Medium
Topic: REST APIs

### Example 2: Git
Q: What is the purpose of git rebase and how does it differ from git merge?
Sample Answer: Git rebase rewrites commit history by applying commits from one branch on top of another, creating a linear history. Git merge creates a new merge commit that combines changes from both branches, preserving the complete history.
Grading Criteria:
- Explains rebase creates linear history (2 points)
- Explains merge creates merge commit (2 points)
- Notes difference in history preservation (1 point)
Difficulty: Hard
Topic: Version Control

## Coding Questions

### Example 1: JavaScript
Q: Write a function that reverses a string without using the built-in reverse() method.
Starter Code:
```javascript
function reverseString(str) {
  // Your code here
}
```
Test Cases:
- reverseString("hello") should return "olleh"
- reverseString("JavaScript") should return "tpircSavaJ"
- reverseString("") should return ""
Sample Solution:
```javascript
function reverseString(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}
```
Difficulty: Easy
Topic: JavaScript Strings

### Example 2: Python
Q: Implement a function to find the second largest number in a list.
Starter Code:
```python
def second_largest(numbers):
    # Your code here
    pass
```
Test Cases:
- second_largest([1, 5, 3, 9, 2]) should return 5
- second_largest([10, 10, 9, 8]) should return 9
- second_largest([5]) should return None
Sample Solution:
```python
def second_largest(numbers):
    if len(numbers) < 2:
        return None
    unique_numbers = list(set(numbers))
    unique_numbers.sort(reverse=True)
    return unique_numbers[1] if len(unique_numbers) >= 2 else None
```
Difficulty: Medium
Topic: Python Lists and Algorithms

## Essay Questions

### Example 1: Software Architecture
Q: Discuss the advantages and disadvantages of microservices architecture compared to monolithic architecture. When would you choose one over the other?
Key Points to Cover:
- Microservices advantages: scalability, independence, technology flexibility
- Microservices disadvantages: complexity, network overhead, data consistency
- Monolithic advantages: simplicity, easier development, better performance for small apps
- Monolithic disadvantages: scaling limitations, deployment coupling
- Decision factors: team size, project complexity, scalability needs
Grading Rubric:
- Identifies 3+ advantages of each (3 points)
- Identifies 2+ disadvantages of each (2 points)
- Provides decision criteria (3 points)
- Clear structure and examples (2 points)
Difficulty: Hard
Topic: Software Architecture

### Example 2: Web Security
Q: Explain common web security vulnerabilities (XSS, CSRF, SQL Injection) and how to prevent them.
Key Points to Cover:
- XSS: Injecting malicious scripts; prevent with input sanitization and CSP
- CSRF: Unauthorized commands from authenticated users; prevent with tokens
- SQL Injection: Malicious SQL queries; prevent with parameterized queries
- Importance of security best practices
Grading Rubric:
- Explains each vulnerability clearly (3 points)
- Provides prevention methods for each (3 points)
- Includes examples or scenarios (2 points)
- Discusses overall security importance (2 points)
Difficulty: Hard
Topic: Web Security

## Quality Standards

### Good Questions:
✅ Clear and unambiguous
✅ Single correct answer (for MCQ/T-F)
✅ Appropriate difficulty level
✅ Include explanations
✅ Test understanding, not memorization
✅ Relevant to topic
✅ Professional language
✅ Realistic scenarios

### Avoid:
❌ Trick questions
❌ Ambiguous wording
❌ Multiple correct answers (unless intentional)
❌ Typos or grammatical errors
❌ Outdated information
❌ Too easy or too hard for difficulty level
❌ Irrelevant distractors in options
❌ Questions testing trivial knowledge

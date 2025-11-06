#!/usr/bin/env python3
"""
Generate comprehensive topic-based question bank for programming languages
Creates diverse questions across multiple topics for each language
"""

import json
import random

# Define comprehensive question templates for each language
QUESTION_TEMPLATES = {
    "javascript": {
        "Variables and Data Types": [
            {"q": "What keyword is used to declare a block-scoped variable?", "type": "mc", "opts": ["let", "var", "const", "variable"], "ans": 0},
            {"q": "Which data type is used for decimal numbers in JavaScript?", "type": "mc", "opts": ["float", "decimal", "number", "double"], "ans": 2},
            {"q": "JavaScript has dynamic typing.", "type": "tf", "ans": True},
            {"q": "The __ keyword declares a constant that cannot be reassigned.", "type": "fb", "ans": ["const"]},
            {"q": "What is the output of typeof undefined?", "type": "mc", "opts": ["undefined", "null", "object", "string"], "ans": 0},
            {"q": "Variables declared with var are function-scoped.", "type": "tf", "ans": True},
            {"q": "The __ operator checks both value and type equality.", "type": "fb", "ans": ["===", "strict equality"]},
            {"q": "JavaScript supports BigInt for arbitrary-precision integers.", "type": "tf", "ans": True},
            {"q": "What is the result of typeof null?", "type": "mc", "opts": ["object", "null", "undefined", "number"], "ans": 0},
            {"q": "NaN (Not-a-Number) is of type number.", "type": "tf", "ans": True},
            {"q": "The __ keyword was introduced in ES6 for block-scoped declarations.", "type": "fb", "ans": ["let"]},
            {"q": "Which symbol represents template literals?", "type": "mc", "opts": ["Backticks ``", "Single quotes ''", "Double quotes \"\"", "Brackets []"], "ans": 0},
            {"q": "JavaScript variables are case-sensitive.", "type": "tf", "ans": True},
            {"q": "The __ value represents intentional absence of any value.", "type": "fb", "ans": ["null"]},
            {"q": "What is the maximum safe integer in JavaScript?", "type": "mc", "opts": ["2^53 - 1", "2^31 - 1", "2^63 - 1", "Infinity"], "ans": 0},
            {"q": "Symbols are always unique and immutable.", "type": "tf", "ans": True},
        ],
        "Functions": [
            {"q": "Which keyword is used to define a function?", "type": "mc", "opts": ["function", "func", "def", "method"], "ans": 0},
            {"q": "Arrow functions have their own 'this' binding.", "type": "tf", "ans": False},
            {"q": "The __ keyword returns a value from a function.", "type": "fb", "ans": ["return"]},
            {"q": "What syntax defines an arrow function?", "type": "mc", "opts": ["() => {}", "() -> {}", "function() {}", "lambda() {}"], "ans": 0},
            {"q": "Functions in JavaScript are first-class objects.", "type": "tf", "ans": True},
            {"q": "The __ keyword is used to exit a function early.", "type": "fb", "ans": ["return"]},
            {"q": "Which method calls a function with a given this value?", "type": "mc", "opts": ["call()", "invoke()", "execute()", "run()"], "ans": 0},
            {"q": "IIFE stands for Immediately Invoked Function Expression.", "type": "tf", "ans": True},
            {"q": "What method binds a function permanently to a context?", "type": "mc", "opts": ["bind()", "attach()", "link()", "connect()"], "ans": 0},
            {"q": "Default parameters were introduced in ES6.", "type": "tf", "ans": True},
            {"q": "The __ parameter collects remaining arguments into an array.", "type": "fb", "ans": ["rest", "..."]},
            {"q": "Which allows functions to be passed as arguments?", "type": "mc", "opts": ["Higher-order functions", "Callback functions", "Lambda functions", "Anonymous functions"], "ans": 0},
            {"q": "Closures have access to outer function variables.", "type": "tf", "ans": True},
            {"q": "The __ method applies a function with an array of arguments.", "type": "fb", "ans": ["apply", "apply()"]},
            {"q": "What is a function that returns another function called?", "type": "mc", "opts": ["Curried function", "Nested function", "Recursive function", "Callback function"], "ans": 0},
            {"q": "Generator functions use the function* syntax.", "type": "tf", "ans": True},
        ],
        "Arrays": [
            {"q": "Which method adds elements to the end of an array?", "type": "mc", "opts": ["push()", "append()", "add()", "insert()"], "ans": 0},
            {"q": "Arrays in JavaScript can hold mixed data types.", "type": "tf", "ans": True},
            {"q": "The __ method removes the last element from an array.", "type": "fb", "ans": ["pop", "pop()"]},
            {"q": "What method creates a new array with filtered elements?", "type": "mc", "opts": ["filter()", "select()", "where()", "find()"], "ans": 0},
            {"q": "Array.isArray() checks if a value is an array.", "type": "tf", "ans": True},
            {"q": "The __ method joins array elements into a string.", "type": "fb", "ans": ["join", "join()"]},
            {"q": "Which method adds elements to the beginning of an array?", "type": "mc", "opts": ["unshift()", "prepend()", "addFirst()", "push()"], "ans": 0},
            {"q": "The spread operator for arrays is written as ...", "type": "tf", "ans": True},
        ],
        "Objects": [
            {"q": "How do you access an object property using bracket notation?", "type": "mc", "opts": ["obj['key']", "obj.key", "obj->key", "obj::key"], "ans": 0},
            {"q": "Objects in JavaScript are passed by reference.", "type": "tf", "ans": True},
            {"q": "The __ method returns an array of object keys.", "type": "fb", "ans": ["Object.keys", "keys"]},
            {"q": "What method creates a new object from an existing one?", "type": "mc", "opts": ["Object.create()", "new Object()", "Object.make()", "Object.copy()"], "ans": 0},
            {"q": "Object property names must be strings or symbols.", "type": "tf", "ans": True},
            {"q": "The __ operator deletes a property from an object.", "type": "fb", "ans": ["delete"]},
            {"q": "Which method merges multiple objects?", "type": "mc", "opts": ["Object.assign()", "Object.merge()", "Object.combine()", "Object.join()"], "ans": 0},
            {"q": "Object destructuring allows extracting multiple properties at once.", "type": "tf", "ans": True},
        ],
        "Promises and Async": [
            {"q": "A Promise can be in which state?", "type": "mc", "opts": ["pending, fulfilled, rejected", "waiting, done, failed", "open, closed, error", "running, complete, broken"], "ans": 0},
            {"q": "The async keyword makes a function return a Promise.", "type": "tf", "ans": True},
            {"q": "The __ keyword pauses async function execution.", "type": "fb", "ans": ["await"]},
            {"q": "Which method runs multiple promises concurrently?", "type": "mc", "opts": ["Promise.all()", "Promise.race()", "Promise.run()", "Promise.execute()"], "ans": 0},
            {"q": "await can only be used inside async functions.", "type": "tf", "ans": True},
            {"q": "The __ method handles promise rejection.", "type": "fb", "ans": ["catch", "catch()"]},
            {"q": "What executes after a promise settles (fulfilled or rejected)?", "type": "mc", "opts": ["finally()", "complete()", "done()", "settle()"], "ans": 0},
            {"q": "Promise.race() returns when the first promise settles.", "type": "tf", "ans": True},
        ],
        "Data Structures": [
            {"q": "Which data structure follows LIFO (Last-In-First-Out)?", "type": "mc", "opts": ["Stack", "Queue", "Array", "Set"], "ans": 0},
            {"q": "Map stores key-value pairs with unique keys.", "type": "tf", "ans": True},
            {"q": "The __ data structure ensures unique values.", "type": "fb", "ans": ["Set"]},
            {"q": "Which method adds an element to a Set?", "type": "mc", "opts": ["add()", "insert()", "push()", "append()"], "ans": 0},
            {"q": "WeakMap allows garbage collection of unused keys.", "type": "tf", "ans": True},
            {"q": "The __ structure follows FIFO (First-In-First-Out).", "type": "fb", "ans": ["Queue"]},
            {"q": "What structure stores data in hierarchical parent-child relationships?", "type": "mc", "opts": ["Tree", "Graph", "Stack", "Heap"], "ans": 0},
            {"q": "Linked lists provide O(1) insertion at both ends.", "type": "tf", "ans": True},
        ],
    },
    "python": {
        "Variables and Data Types": [
            {"q": "What is the correct way to assign a value to a variable?", "type": "mc", "opts": ["x = 5", "var x = 5", "let x = 5", "int x = 5"], "ans": 0},
            {"q": "Python is dynamically typed.", "type": "tf", "ans": True},
            {"q": "The __ function returns the type of a variable.", "type": "fb", "ans": ["type", "type()"]},
            {"q": "Which of these is NOT a Python data type?", "type": "mc", "opts": ["char", "int", "float", "str"], "ans": 0},
            {"q": "Variables in Python can start with a number.", "type": "tf", "ans": False},
            {"q": "The __ keyword defines a None value.", "type": "fb", "ans": ["None"]},
            {"q": "What is the result of 10 / 3 in Python 3?", "type": "mc", "opts": ["3.333...", "3", "3.0", "Error"], "ans": 0},
            {"q": "Python supports complex numbers natively.", "type": "tf", "ans": True},
        ],
        "Lists and Tuples": [
            {"q": "Which method adds an item to the end of a list?", "type": "mc", "opts": ["append()", "add()", "push()", "insert()"], "ans": 0},
            {"q": "Tuples are immutable in Python.", "type": "tf", "ans": True},
            {"q": "The __ method removes an item from a list by value.", "type": "fb", "ans": ["remove", "remove()"]},
            {"q": "What operator creates a list slice?", "type": "mc", "opts": [":", "..", "->", "::"], "ans": 0},
            {"q": "Lists can contain mixed data types.", "type": "tf", "ans": True},
            {"q": "The __ function returns the length of a list.", "type": "fb", "ans": ["len", "len()"]},
            {"q": "Which method sorts a list in place?", "type": "mc", "opts": ["sort()", "sorted()", "order()", "arrange()"], "ans": 0},
            {"q": "List comprehensions provide a concise way to create lists.", "type": "tf", "ans": True},
        ],
        "Dictionaries": [
            {"q": "How do you create an empty dictionary?", "type": "mc", "opts": ["{}", "[]", "dict()", "Both {} and dict()"], "ans": 3},
            {"q": "Dictionary keys must be immutable.", "type": "tf", "ans": True},
            {"q": "The __ method returns all keys in a dictionary.", "type": "fb", "ans": ["keys", "keys()"]},
            {"q": "Which method safely gets a value with a default?", "type": "mc", "opts": ["get()", "fetch()", "retrieve()", "find()"], "ans": 0},
            {"q": "Dictionaries maintain insertion order in Python 3.7+.", "type": "tf", "ans": True},
            {"q": "The __ method removes a key-value pair from a dictionary.", "type": "fb", "ans": ["pop", "pop()", "del"]},
            {"q": "What returns both keys and values as tuples?", "type": "mc", "opts": ["items()", "pairs()", "entries()", "tuples()"], "ans": 0},
            {"q": "Dictionary comprehensions create dictionaries concisely.", "type": "tf", "ans": True},
        ],
        "Functions": [
            {"q": "Which keyword defines a function in Python?", "type": "mc", "opts": ["def", "function", "func", "define"], "ans": 0},
            {"q": "Python functions can return multiple values.", "type": "tf", "ans": True},
            {"q": "The __ keyword creates an anonymous function.", "type": "fb", "ans": ["lambda"]},
            {"q": "What is the default return value of a function?", "type": "mc", "opts": ["None", "0", "null", "undefined"], "ans": 0},
            {"q": "*args allows a function to accept variable arguments.", "type": "tf", "ans": True},
            {"q": "The __ keyword returns a value from a function.", "type": "fb", "ans": ["return"]},
            {"q": "Which decorator makes a method static?", "type": "mc", "opts": ["@staticmethod", "@static", "@classmethod", "@method"], "ans": 0},
            {"q": "Functions in Python are first-class objects.", "type": "tf", "ans": True},
        ],
        "Classes and OOP": [
            {"q": "Which keyword creates a class in Python?", "type": "mc", "opts": ["class", "Class", "object", "struct"], "ans": 0},
            {"q": "Python supports multiple inheritance.", "type": "tf", "ans": True},
            {"q": "The __ method initializes a new object.", "type": "fb", "ans": ["__init__", "init"]},
            {"q": "What is the first parameter of instance methods?", "type": "mc", "opts": ["self", "this", "me", "obj"], "ans": 0},
            {"q": "Private attributes are denoted by a double underscore prefix.", "type": "tf", "ans": True},
            {"q": "The __ method is called when an object is deleted.", "type": "fb", "ans": ["__del__", "del"]},
            {"q": "Which decorator creates a class method?", "type": "mc", "opts": ["@classmethod", "@class", "@static", "@method"], "ans": 0},
            {"q": "Python uses duck typing for polymorphism.", "type": "tf", "ans": True},
        ],
        "Data Structures": [
            {"q": "Which module provides deque (double-ended queue)?", "type": "mc", "opts": ["collections", "queue", "deque", "datastructures"], "ans": 0},
            {"q": "heapq module implements a min-heap by default.", "type": "tf", "ans": True},
            {"q": "The __ structure from collections counts element occurrences.", "type": "fb", "ans": ["Counter"]},
            {"q": "What structure implements LIFO in Python?", "type": "mc", "opts": ["Stack using list", "Queue", "Deque", "Set"], "ans": 0},
            {"q": "Sets perform membership testing in O(1) average time.", "type": "tf", "ans": True},
            {"q": "The __ module provides ordered dictionary.", "type": "fb", "ans": ["collections"]},
            {"q": "Which collection maintains sorted keys?", "type": "mc", "opts": ["SortedDict (external)", "dict", "OrderedDict", "defaultdict"], "ans": 0},
            {"q": "defaultdict provides default values for missing keys.", "type": "tf", "ans": True},
        ],
    },
    "java": {
        "Variables and Data Types": [
            {"q": "Which keyword declares a constant in Java?", "type": "mc", "opts": ["final", "const", "constant", "static"], "ans": 0},
            {"q": "Java is a statically typed language.", "type": "tf", "ans": True},
            {"q": "The __ data type stores 32-bit integers.", "type": "fb", "ans": ["int", "integer"]},
            {"q": "What is the size of a long in Java?", "type": "mc", "opts": ["64 bits", "32 bits", "128 bits", "16 bits"], "ans": 0},
            {"q": "Variables must be initialized before use in Java.", "type": "tf", "ans": True},
            {"q": "The __ keyword creates a new object.", "type": "fb", "ans": ["new"]},
            {"q": "Which wrapper class corresponds to int?", "type": "mc", "opts": ["Integer", "Int", "Number", "Numeric"], "ans": 0},
            {"q": "Autoboxing converts primitives to wrapper objects automatically.", "type": "tf", "ans": True},
        ],
        "Classes and Objects": [
            {"q": "What is the entry point of a Java application?", "type": "mc", "opts": ["main method", "start method", "run method", "init method"], "ans": 0},
            {"q": "Java supports multiple inheritance through classes.", "type": "tf", "ans": False},
            {"q": "The __ keyword refers to the current object.", "type": "fb", "ans": ["this"]},
            {"q": "Which access modifier makes members accessible only within the class?", "type": "mc", "opts": ["private", "protected", "public", "default"], "ans": 0},
            {"q": "Constructors must have the same name as the class.", "type": "tf", "ans": True},
            {"q": "The __ keyword calls the parent class constructor.", "type": "fb", "ans": ["super"]},
            {"q": "What keyword prevents method overriding?", "type": "mc", "opts": ["final", "static", "const", "sealed"], "ans": 0},
            {"q": "Static members belong to the class, not instances.", "type": "tf", "ans": True},
        ],
        "Inheritance": [
            {"q": "Which keyword is used to inherit a class?", "type": "mc", "opts": ["extends", "inherits", "implements", "derives"], "ans": 0},
            {"q": "A class can extend only one class in Java.", "type": "tf", "ans": True},
            {"q": "The __ keyword prevents inheritance.", "type": "fb", "ans": ["final"]},
            {"q": "Which keyword is used to implement an interface?", "type": "mc", "opts": ["implements", "uses", "extends", "adopts"], "ans": 0},
            {"q": "Abstract classes can have constructors.", "type": "tf", "ans": True},
            {"q": "The __ keyword makes a method abstract.", "type": "fb", "ans": ["abstract"]},
            {"q": "What is the parent of all classes in Java?", "type": "mc", "opts": ["Object", "Class", "Super", "Base"], "ans": 0},
            {"q": "Interfaces can have default method implementations.", "type": "tf", "ans": True},
        ],
        "Collections": [
            {"q": "Which interface represents an ordered collection?", "type": "mc", "opts": ["List", "Set", "Map", "Collection"], "ans": 0},
            {"q": "HashSet allows duplicate elements.", "type": "tf", "ans": False},
            {"q": "The __ class implements a dynamic array.", "type": "fb", "ans": ["ArrayList", "Array List"]},
            {"q": "Which interface represents key-value pairs?", "type": "mc", "opts": ["Map", "Dictionary", "Table", "Hash"], "ans": 0},
            {"q": "LinkedList provides faster insertion than ArrayList.", "type": "tf", "ans": True},
            {"q": "The __ interface ensures unique elements.", "type": "fb", "ans": ["Set"]},
            {"q": "Which class provides a LIFO structure?", "type": "mc", "opts": ["Stack", "Queue", "Deque", "List"], "ans": 0},
            {"q": "HashMap maintains insertion order.", "type": "tf", "ans": False},
        ],
        "Exception Handling": [
            {"q": "Which keyword is used to throw an exception?", "type": "mc", "opts": ["throw", "throws", "raise", "except"], "ans": 0},
            {"q": "Checked exceptions must be caught or declared.", "type": "tf", "ans": True},
            {"q": "The __ block always executes after try-catch.", "type": "fb", "ans": ["finally"]},
            {"q": "What is the parent of all exceptions?", "type": "mc", "opts": ["Throwable", "Exception", "Error", "RuntimeException"], "ans": 0},
            {"q": "NullPointerException is a checked exception.", "type": "tf", "ans": False},
            {"q": "The __ keyword declares exceptions a method may throw.", "type": "fb", "ans": ["throws"]},
            {"q": "Which exception indicates array index out of bounds?", "type": "mc", "opts": ["ArrayIndexOutOfBoundsException", "IndexOutOfRangeException", "OutOfBoundsException", "ArrayException"], "ans": 0},
            {"q": "try-with-resources automatically closes resources.", "type": "tf", "ans": True},
        ],
        "Data Structures": [
            {"q": "Which interface represents a collection of unique elements?", "type": "mc", "opts": ["Set", "List", "Map", "Queue"], "ans": 0},
            {"q": "TreeSet maintains elements in sorted order.", "type": "tf", "ans": True},
            {"q": "The __ class implements a hash table.", "type": "fb", "ans": ["HashMap", "Hashtable"]},
            {"q": "What structure follows FIFO (First-In-First-Out)?", "type": "mc", "opts": ["Queue", "Stack", "Set", "Tree"], "ans": 0},
            {"q": "PriorityQueue maintains elements in heap order.", "type": "tf", "ans": True},
            {"q": "The __ structure uses nodes with references.", "type": "fb", "ans": ["LinkedList", "Linked List"]},
            {"q": "Which provides O(1) access by index?", "type": "mc", "opts": ["ArrayList", "LinkedList", "TreeSet", "HashMap"], "ans": 0},
            {"q": "Binary Search Trees support O(log n) search on average.", "type": "tf", "ans": True},
        ],
    },
    "cpp": {
        "Pointers and References": [
            {"q": "What operator gets the address of a variable?", "type": "mc", "opts": ["&", "*", "->", "::"], "ans": 0},
            {"q": "References must be initialized when declared.", "type": "tf", "ans": True},
            {"q": "The __ operator dereferences a pointer.", "type": "fb", "ans": ["*", "asterisk"]},
            {"q": "Which operator accesses members through a pointer?", "type": "mc", "opts": ["->", ".", "::", "*"], "ans": 0},
            {"q": "nullptr represents a null pointer in modern C++.", "type": "tf", "ans": True},
            {"q": "The __ keyword allocates memory dynamically.", "type": "fb", "ans": ["new"]},
            {"q": "What frees dynamically allocated memory?", "type": "mc", "opts": ["delete", "free", "remove", "deallocate"], "ans": 0},
            {"q": "Pointers can be reassigned to point to different addresses.", "type": "tf", "ans": True},
        ],
        "Classes and Objects": [
            {"q": "What is the default access specifier in a class?", "type": "mc", "opts": ["private", "public", "protected", "internal"], "ans": 0},
            {"q": "C++ supports multiple inheritance.", "type": "tf", "ans": True},
            {"q": "A __ is called when an object is destroyed.", "type": "fb", "ans": ["destructor", "~destructor"]},
            {"q": "What symbol prefixes a destructor name?", "type": "mc", "opts": ["~", "-", "!", "@"], "ans": 0},
            {"q": "Constructors cannot be virtual.", "type": "tf", "ans": True},
            {"q": "The __ constructor is called when copying objects.", "type": "fb", "ans": ["copy", "copy constructor"]},
            {"q": "Which keyword prevents object copying?", "type": "mc", "opts": ["delete", "private", "final", "sealed"], "ans": 0},
            {"q": "this is a pointer to the current object.", "type": "tf", "ans": True},
        ],
        "Inheritance and Polymorphism": [
            {"q": "Which keyword makes a function overridable?", "type": "mc", "opts": ["virtual", "override", "abstract", "dynamic"], "ans": 0},
            {"q": "Pure virtual functions must be overridden in derived classes.", "type": "tf", "ans": True},
            {"q": "A __ function has no implementation in base class.", "type": "fb", "ans": ["pure virtual", "virtual"]},
            {"q": "What syntax declares a pure virtual function?", "type": "mc", "opts": ["= 0", "= null", "abstract", "pure"], "ans": 0},
            {"q": "Virtual destructors ensure proper cleanup in inheritance.", "type": "tf", "ans": True},
            {"q": "The __ keyword indicates function overriding (C++11).", "type": "fb", "ans": ["override"]},
            {"q": "Which prevents further inheritance from a class?", "type": "mc", "opts": ["final", "sealed", "closed", "terminal"], "ans": 0},
            {"q": "Abstract classes cannot be instantiated.", "type": "tf", "ans": True},
        ],
        "Templates": [
            {"q": "What keyword defines a template parameter?", "type": "mc", "opts": ["typename", "type", "class", "Both typename and class"], "ans": 3},
            {"q": "Templates are instantiated at compile time.", "type": "tf", "ans": True},
            {"q": "A __ template works with any data type.", "type": "fb", "ans": ["generic", "template"]},
            {"q": "Which keyword specializes a template for a type?", "type": "mc", "opts": ["template<>", "specialize", "typedef", "using"], "ans": 0},
            {"q": "Function templates can deduce template arguments.", "type": "tf", "ans": True},
            {"q": "The __ library provides template containers.", "type": "fb", "ans": ["STL", "Standard Template Library"]},
            {"q": "What is a template that takes another template as parameter?", "type": "mc", "opts": ["Template template parameter", "Nested template", "Meta template", "Higher-order template"], "ans": 0},
            {"q": "Variadic templates accept variable number of arguments.", "type": "tf", "ans": True},
        ],
        "STL Containers": [
            {"q": "Which container provides constant-time random access?", "type": "mc", "opts": ["vector", "list", "deque", "set"], "ans": 0},
            {"q": "set automatically sorts elements.", "type": "tf", "ans": True},
            {"q": "The __ container stores key-value pairs.", "type": "fb", "ans": ["map"]},
            {"q": "Which container is LIFO (Last-In-First-Out)?", "type": "mc", "opts": ["stack", "queue", "deque", "priority_queue"], "ans": 0},
            {"q": "unordered_map uses hash tables for storage.", "type": "tf", "ans": True},
            {"q": "The __ container ensures unique elements.", "type": "fb", "ans": ["set"]},
            {"q": "Which provides constant-time insertion at both ends?", "type": "mc", "opts": ["deque", "vector", "list", "array"], "ans": 0},
            {"q": "list in STL is a doubly-linked list.", "type": "tf", "ans": True},
        ],
        "Data Structures": [
            {"q": "Which structure uses dynamic memory allocation?", "type": "mc", "opts": ["Linked List", "Array", "Stack", "Queue"], "ans": 0},
            {"q": "Binary trees have at most two children per node.", "type": "tf", "ans": True},
            {"q": "The __ structure allows O(1) enqueue and dequeue.", "type": "fb", "ans": ["Queue", "queue"]},
            {"q": "What provides O(log n) search in balanced trees?", "type": "mc", "opts": ["BST", "Array", "Linked List", "Stack"], "ans": 0},
            {"q": "Heaps are complete binary trees.", "type": "tf", "ans": True},
            {"q": "The __ uses buckets for collision resolution.", "type": "fb", "ans": ["Hash Table", "hash table"]},
            {"q": "Which structure supports DFS and BFS traversal?", "type": "mc", "opts": ["Graph", "Array", "Stack", "Queue"], "ans": 0},
            {"q": "Tries are efficient for prefix searches.", "type": "tf", "ans": True},
        ],
    },
}

def generate_questions_for_topic(language, topic, templates):
    """Generate questions for a specific topic - one question per template (no duplication)"""
    questions = []
    base_templates = templates.get(topic, [])
    
    # Generate one question per unique template (no replication)
    for template in base_templates:
        q_data = {
            "questionText": template["q"],
            "maxScore": 1,
            "difficulty": random.choice(["easy", "medium", "hard"]),
            "category": "Programming",
            "topic": topic,
            "tags": [language, topic]
        }
        
        if template["type"] == "mc":
            q_data["questionType"] = "multiple-choice"
            q_data["options"] = template["opts"]
            q_data["correctAnswer"] = template["opts"][template["ans"]]
        elif template["type"] == "tf":
            q_data["questionType"] = "true-false"
            q_data["correctAnswer"] = "True" if template["ans"] else "False"
        elif template["type"] == "fb":
            q_data["questionType"] = "fill-in-the-blank"
            q_data["blankAnswers"] = template["ans"]
            q_data["caseSensitive"] = False
        
        questions.append(q_data)
    
    return questions

def generate_all_questions():
    """Generate complete question bank - one question per unique template"""
    question_bank = {}
    
    for language, topics in QUESTION_TEMPLATES.items():
        print(f"Generating questions for {language.upper()}...")
        all_questions = []
        
        for topic, templates in topics.items():
            topic_questions = generate_questions_for_topic(language, topic, {topic: templates})
            all_questions.extend(topic_questions)
            print(f"  ✓ {topic}: {len(topic_questions)} unique questions")
        
        question_bank[language] = all_questions
        print(f"  Total: {len(all_questions)} unique questions\n")
    
    return question_bank

def main():
    print("="*70)
    print("Topic-Based Question Bank Generator")
    print("="*70 + "\n")
    
    # Generate questions
    question_bank = generate_all_questions()
    
    # Statistics
    total = sum(len(q) for q in question_bank.values())
    print(f"\n{'='*70}")
    print(f"Generation Complete!")
    print(f"{'='*70}")
    print(f"Total Languages: {len(question_bank)}")
    print(f"Total Questions: {total}")
    
    # Save
    output_file = "../backend/src/data/questionBankGenerated.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(question_bank, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Saved to: {output_file}")
    print("="*70 + "\n")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Generate comprehensive topic-based question bank for programming languages
Creates diverse questions across multiple important topics
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
            {"q": "The __ keyword yields values in generator functions.", "type": "fb", "ans": ["yield"]},
        ],
        "Arrays and Iteration": [
            {"q": "Which method adds elements to the end of an array?", "type": "mc", "opts": ["push()", "append()", "add()", "insert()"], "ans": 0},
            {"q": "Arrays in JavaScript can hold mixed data types.", "type": "tf", "ans": True},
            {"q": "The __ method removes the last element from an array.", "type": "fb", "ans": ["pop", "pop()"]},
            {"q": "What method creates a new array with filtered elements?", "type": "mc", "opts": ["filter()", "select()", "where()", "find()"], "ans": 0},
            {"q": "Array.isArray() checks if a value is an array.", "type": "tf", "ans": True},
            {"q": "The __ method joins array elements into a string.", "type": "fb", "ans": ["join", "join()"]},
            {"q": "Which method adds elements to the beginning of an array?", "type": "mc", "opts": ["unshift()", "prepend()", "addFirst()", "push()"], "ans": 0},
            {"q": "The spread operator for arrays is written as ...", "type": "tf", "ans": True},
            {"q": "What method transforms each array element?", "type": "mc", "opts": ["map()", "transform()", "convert()", "change()"], "ans": 0},
            {"q": "The reduce() method accumulates array values into a single result.", "type": "tf", "ans": True},
            {"q": "The __ method returns the first element matching a condition.", "type": "fb", "ans": ["find", "find()"]},
            {"q": "Which method removes elements from an array?", "type": "mc", "opts": ["splice()", "slice()", "cut()", "remove()"], "ans": 0},
            {"q": "forEach() returns a new array.", "type": "tf", "ans": False},
            {"q": "The __ method tests if all elements pass a condition.", "type": "fb", "ans": ["every", "every()"]},
            {"q": "What method checks if at least one element passes a test?", "type": "mc", "opts": ["some()", "any()", "exists()", "contains()"], "ans": 0},
            {"q": "Array destructuring allows extracting multiple values at once.", "type": "tf", "ans": True},
        ],
        "Objects and Prototypes": [
            {"q": "How do you access an object property using bracket notation?", "type": "mc", "opts": ["obj['key']", "obj.key", "obj->key", "obj::key"], "ans": 0},
            {"q": "Objects in JavaScript are passed by reference.", "type": "tf", "ans": True},
            {"q": "The __ method returns an array of object keys.", "type": "fb", "ans": ["Object.keys", "keys"]},
            {"q": "What method creates a new object from an existing one?", "type": "mc", "opts": ["Object.create()", "new Object()", "Object.make()", "Object.copy()"], "ans": 0},
            {"q": "Object property names can be symbols or strings.", "type": "tf", "ans": True},
            {"q": "The __ operator deletes a property from an object.", "type": "fb", "ans": ["delete"]},
            {"q": "Which method merges multiple objects?", "type": "mc", "opts": ["Object.assign()", "Object.merge()", "Object.combine()", "Object.join()"], "ans": 0},
            {"q": "Object destructuring allows extracting multiple properties at once.", "type": "tf", "ans": True},
            {"q": "What method returns an array of object values?", "type": "mc", "opts": ["Object.values()", "Object.getValues()", "values()", "getValues()"], "ans": 0},
            {"q": "The prototype chain is used for inheritance in JavaScript.", "type": "tf", "ans": True},
            {"q": "The __ method defines a new property on an object.", "type": "fb", "ans": ["Object.defineProperty"]},
            {"q": "Which method prevents modifications to an object?", "type": "mc", "opts": ["Object.freeze()", "Object.lock()", "Object.seal()", "Object.protect()"], "ans": 0},
            {"q": "hasOwnProperty() checks if a property exists directly on an object.", "type": "tf", "ans": True},
            {"q": "The __ property references an object's prototype.", "type": "fb", "ans": ["__proto__", "prototype"]},
            {"q": "What method returns key-value pairs as arrays?", "type": "mc", "opts": ["Object.entries()", "Object.pairs()", "Object.items()", "Object.tuples()"], "ans": 0},
            {"q": "Object.seal() prevents adding or removing properties but allows modification.", "type": "tf", "ans": True},
        ],
        "Promises and Async": [
            {"q": "A Promise can be in which states?", "type": "mc", "opts": ["pending, fulfilled, rejected", "waiting, done, failed", "open, closed, error", "running, complete, broken"], "ans": 0},
            {"q": "The async keyword makes a function return a Promise.", "type": "tf", "ans": True},
            {"q": "The __ keyword pauses async function execution.", "type": "fb", "ans": ["await"]},
            {"q": "Which method runs multiple promises concurrently?", "type": "mc", "opts": ["Promise.all()", "Promise.race()", "Promise.run()", "Promise.execute()"], "ans": 0},
            {"q": "await can only be used inside async functions.", "type": "tf", "ans": True},
            {"q": "The __ method handles promise rejection.", "type": "fb", "ans": ["catch", "catch()"]},
            {"q": "What executes after a promise settles (fulfilled or rejected)?", "type": "mc", "opts": ["finally()", "complete()", "done()", "settle()"], "ans": 0},
            {"q": "Promise.race() returns when the first promise settles.", "type": "tf", "ans": True},
            {"q": "Which method returns a promise that resolves immediately?", "type": "mc", "opts": ["Promise.resolve()", "Promise.create()", "Promise.make()", "Promise.instant()"], "ans": 0},
            {"q": "Promise.allSettled() waits for all promises regardless of outcome.", "type": "tf", "ans": True},
            {"q": "The __ method chains promise handlers.", "type": "fb", "ans": ["then", "then()"]},
            {"q": "What returns a rejected promise?", "type": "mc", "opts": ["Promise.reject()", "Promise.fail()", "Promise.error()", "Promise.throw()"], "ans": 0},
            {"q": "Promises help avoid callback hell.", "type": "tf", "ans": True},
            {"q": "The __ executes when promise resolves successfully.", "type": "fb", "ans": ["then", "resolve handler"]},
            {"q": "Which returns the first fulfilled or all rejected?", "type": "mc", "opts": ["Promise.any()", "Promise.some()", "Promise.first()", "Promise.one()"], "ans": 0},
            {"q": "Async functions automatically wrap return values in promises.", "type": "tf", "ans": True},
        ],
        "DOM Manipulation": [
            {"q": "Which method selects an element by ID?", "type": "mc", "opts": ["getElementById()", "selectById()", "findId()", "getElement()"], "ans": 0},
            {"q": "querySelector() returns the first matching element.", "type": "tf", "ans": True},
            {"q": "The __ method selects all matching elements.", "type": "fb", "ans": ["querySelectorAll"]},
            {"q": "What property changes an element's HTML content?", "type": "mc", "opts": ["innerHTML", "content", "html", "innerContent"], "ans": 0},
            {"q": "textContent is safer than innerHTML for user input.", "type": "tf", "ans": True},
            {"q": "The __ method adds a CSS class to an element.", "type": "fb", "ans": ["classList.add", "add"]},
            {"q": "Which method creates a new DOM element?", "type": "mc", "opts": ["createElement()", "create()", "newElement()", "makeElement()"], "ans": 0},
            {"q": "appendChild() adds a node to the end of a parent's children.", "type": "tf", "ans": True},
            {"q": "The __ method removes a child element.", "type": "fb", "ans": ["removeChild", "remove"]},
            {"q": "What event fires when DOM is fully loaded?", "type": "mc", "opts": ["DOMContentLoaded", "load", "ready", "onload"], "ans": 0},
            {"q": "addEventListener() can attach multiple handlers to one event.", "type": "tf", "ans": True},
            {"q": "The __ property accesses element attributes.", "type": "fb", "ans": ["getAttribute", "attributes"]},
            {"q": "Which method clones a DOM node?", "type": "mc", "opts": ["cloneNode()", "copy()", "duplicate()", "clone()"], "ans": 0},
            {"q": "Event bubbling propagates from child to parent elements.", "type": "tf", "ans": True},
            {"q": "The __ method prevents default browser behavior.", "type": "fb", "ans": ["preventDefault"]},
            {"q": "What property provides the element that triggered an event?", "type": "mc", "opts": ["event.target", "event.source", "event.element", "event.sender"], "ans": 0},
        ],
        "ES6+ Features": [
            {"q": "Which feature allows exporting multiple named values?", "type": "mc", "opts": ["Named exports", "Default export", "Module export", "Batch export"], "ans": 0},
            {"q": "Template literals support multi-line strings.", "type": "tf", "ans": True},
            {"q": "The __ operator provides default values for null/undefined.", "type": "fb", "ans": ["??", "nullish coalescing"]},
            {"q": "What feature enables import/export between modules?", "type": "mc", "opts": ["ES6 Modules", "CommonJS", "RequireJS", "AMD"], "ans": 0},
            {"q": "Destructuring can extract nested object properties.", "type": "tf", "ans": True},
            {"q": "The __ chaining operator safely accesses nested properties.", "type": "fb", "ans": ["?.", "optional chaining"]},
            {"q": "Which creates a new class in ES6?", "type": "mc", "opts": ["class keyword", "function constructor", "Object.create()", "prototype"], "ans": 0},
            {"q": "Arrow functions inherit this from enclosing scope.", "type": "tf", "ans": True},
            {"q": "The __ method creates a shallow copy of an array.", "type": "fb", "ans": ["slice", "..."]},
            {"q": "What provides unique identifiers as property keys?", "type": "mc", "opts": ["Symbol", "UUID", "GUID", "Hash"], "ans": 0},
            {"q": "for...of loop iterates over iterable objects.", "type": "tf", "ans": True},
            {"q": "The __ statement imports all exports from a module.", "type": "fb", "ans": ["import *", "*"]},
            {"q": "Which method finds an object's prototype?", "type": "mc", "opts": ["Object.getPrototypeOf()", "getProto()", "prototype()", "protoOf()"], "ans": 0},
            {"q": "WeakSet allows automatic garbage collection of objects.", "type": "tf", "ans": True},
            {"q": "The __ exports a single default value from a module.", "type": "fb", "ans": ["export default"]},
            {"q": "What creates an iterator from an iterable?", "type": "mc", "opts": ["Symbol.iterator", "iterator()", "getIterator()", "iter()"], "ans": 0},
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
            {"q": "The __ function converts a value to an integer.", "type": "fb", "ans": ["int", "int()"]},
            {"q": "Which operator performs floor division?", "type": "mc", "opts": ["//", "/", "%", "div"], "ans": 0},
            {"q": "Strings in Python are immutable.", "type": "tf", "ans": True},
            {"q": "The __ function returns the length of an object.", "type": "fb", "ans": ["len", "len()"]},
            {"q": "What represents infinity in Python?", "type": "mc", "opts": ["float('inf')", "Infinity", "INF", "Math.inf"], "ans": 0},
            {"q": "Multiple variables can be assigned in one line.", "type": "tf", "ans": True},
            {"q": "The __ checks if a variable is defined.", "type": "fb", "ans": ["in", "hasattr"]},
            {"q": "Which function checks if a value is an integer?", "type": "mc", "opts": ["isinstance(x, int)", "isint(x)", "type(x) == int", "checkint(x)"], "ans": 0},
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
            {"q": "The __ method inserts an item at a specific index.", "type": "fb", "ans": ["insert", "insert()"]},
            {"q": "What method returns and removes an item at an index?", "type": "mc", "opts": ["pop()", "remove()", "delete()", "extract()"], "ans": 0},
            {"q": "Negative indices access elements from the end of a list.", "type": "tf", "ans": True},
            {"q": "The __ method extends a list with another iterable.", "type": "fb", "ans": ["extend", "extend()"]},
            {"q": "Which function creates a new sorted list?", "type": "mc", "opts": ["sorted()", "sort()", "order()", "arrange()"], "ans": 0},
            {"q": "Lists are mutable sequences in Python.", "type": "tf", "ans": True},
            {"q": "The __ operator replicates a list n times.", "type": "fb", "ans": ["*", "multiply"]},
            {"q": "What method counts occurrences of a value in a list?", "type": "mc", "opts": ["count()", "frequency()", "occurrences()", "find()"], "ans": 0},
        ],
        "Dictionaries and Sets": [
            {"q": "How do you create an empty dictionary?", "type": "mc", "opts": ["{}", "[]", "dict()", "Both {} and dict()"], "ans": 3},
            {"q": "Dictionary keys must be immutable.", "type": "tf", "ans": True},
            {"q": "The __ method returns all keys in a dictionary.", "type": "fb", "ans": ["keys", "keys()"]},
            {"q": "Which method safely gets a value with a default?", "type": "mc", "opts": ["get()", "fetch()", "retrieve()", "find()"], "ans": 0},
            {"q": "Dictionaries maintain insertion order in Python 3.7+.", "type": "tf", "ans": True},
            {"q": "The __ method removes a key-value pair from a dictionary.", "type": "fb", "ans": ["pop", "pop()", "del"]},
            {"q": "What returns both keys and values as tuples?", "type": "mc", "opts": ["items()", "pairs()", "entries()", "tuples()"], "ans": 0},
            {"q": "Dictionary comprehensions create dictionaries concisely.", "type": "tf", "ans": True},
            {"q": "The __ method updates a dictionary with another.", "type": "fb", "ans": ["update", "update()"]},
            {"q": "Which creates a set in Python?", "type": "mc", "opts": ["{1, 2, 3}", "[1, 2, 3]", "(1, 2, 3)", "set[1, 2, 3]"], "ans": 0},
            {"q": "Sets automatically remove duplicate values.", "type": "tf", "ans": True},
            {"q": "The __ method adds an element to a set.", "type": "fb", "ans": ["add", "add()"]},
            {"q": "What operation finds common elements between sets?", "type": "mc", "opts": ["intersection", "union", "difference", "common"], "ans": 0},
            {"q": "Frozenset is an immutable version of set.", "type": "tf", "ans": True},
            {"q": "The __ method merges sets returning a new set.", "type": "fb", "ans": ["union", "union()"]},
            {"q": "Which finds elements in one set but not another?", "type": "mc", "opts": ["difference()", "subtract()", "exclude()", "minus()"], "ans": 0},
        ],
        "Functions and Decorators": [
            {"q": "Which keyword defines a function in Python?", "type": "mc", "opts": ["def", "function", "func", "define"], "ans": 0},
            {"q": "Python functions can return multiple values.", "type": "tf", "ans": True},
            {"q": "The __ keyword creates an anonymous function.", "type": "fb", "ans": ["lambda"]},
            {"q": "What is the default return value of a function?", "type": "mc", "opts": ["None", "0", "null", "undefined"], "ans": 0},
            {"q": "*args allows a function to accept variable arguments.", "type": "tf", "ans": True},
            {"q": "The __ keyword returns a value from a function.", "type": "fb", "ans": ["return"]},
            {"q": "Which decorator makes a method static?", "type": "mc", "opts": ["@staticmethod", "@static", "@classmethod", "@method"], "ans": 0},
            {"q": "Functions in Python are first-class objects.", "type": "tf", "ans": True},
            {"q": "The __ parameter accepts keyword arguments as a dictionary.", "type": "fb", "ans": ["**kwargs", "kwargs"]},
            {"q": "What decorator makes a method a class method?", "type": "mc", "opts": ["@classmethod", "@class", "@static", "@method"], "ans": 0},
            {"q": "Decorators modify function behavior without changing source code.", "type": "tf", "ans": True},
            {"q": "The __ keyword makes a variable global.", "type": "fb", "ans": ["global"]},
            {"q": "Which allows default parameter values?", "type": "mc", "opts": ["def func(x=10)", "def func(x:10)", "def func(x->10)", "def func(x|10)"], "ans": 0},
            {"q": "Nested functions have access to enclosing function variables.", "type": "tf", "ans": True},
            {"q": "The __ keyword allows modifying nonlocal variables.", "type": "fb", "ans": ["nonlocal"]},
            {"q": "What decorator caches function results?", "type": "mc", "opts": ["@lru_cache", "@cache", "@memoize", "@remember"], "ans": 0},
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
            {"q": "The __ method returns a string representation of an object.", "type": "fb", "ans": ["__str__", "str"]},
            {"q": "What method defines object representation for debugging?", "type": "mc", "opts": ["__repr__", "__str__", "__debug__", "__show__"], "ans": 0},
            {"q": "Property decorator creates managed attributes.", "type": "tf", "ans": True},
            {"q": "The __ method compares two objects for equality.", "type": "fb", "ans": ["__eq__", "eq"]},
            {"q": "Which allows operator overloading for addition?", "type": "mc", "opts": ["__add__", "__plus__", "__sum__", "__combine__"], "ans": 0},
            {"q": "Abstract base classes require subclasses to implement methods.", "type": "tf", "ans": True},
            {"q": "The __ module provides abstract base classes.", "type": "fb", "ans": ["abc"]},
            {"q": "What makes an object iterable?", "type": "mc", "opts": ["__iter__ method", "__next__ method", "__loop__ method", "__iterate__ method"], "ans": 0},
        ],
        "File Handling and I/O": [
            {"q": "Which function opens a file in Python?", "type": "mc", "opts": ["open()", "file()", "read()", "load()"], "ans": 0},
            {"q": "The with statement ensures files are properly closed.", "type": "tf", "ans": True},
            {"q": "The __ mode opens a file for reading.", "type": "fb", "ans": ["r", "'r'"]},
            {"q": "What mode appends to a file without truncating?", "type": "mc", "opts": ["'a'", "'w'", "'r+'", "'x'"], "ans": 0},
            {"q": "Binary mode is specified with 'b' suffix.", "type": "tf", "ans": True},
            {"q": "The __ method reads the entire file content.", "type": "fb", "ans": ["read", "read()"]},
            {"q": "Which method reads a file line by line?", "type": "mc", "opts": ["readline()", "readlines()", "read()", "getline()"], "ans": 0},
            {"q": "Files opened with 'w' mode truncate existing content.", "type": "tf", "ans": True},
            {"q": "The __ method writes a string to a file.", "type": "fb", "ans": ["write", "write()"]},
            {"q": "What returns all lines as a list?", "type": "mc", "opts": ["readlines()", "readline()", "getlines()", "lines()"], "ans": 0},
            {"q": "The tell() method returns current file position.", "type": "tf", "ans": True},
            {"q": "The __ method moves file pointer to a position.", "type": "fb", "ans": ["seek", "seek()"]},
            {"q": "Which module handles file paths across OS?", "type": "mc", "opts": ["os.path", "pathlib", "Both os.path and pathlib", "filepath"], "ans": 2},
            {"q": "Context managers use __enter__ and __exit__ methods.", "type": "tf", "ans": True},
            {"q": "The __ function removes a file.", "type": "fb", "ans": ["os.remove", "remove"]},
            {"q": "What checks if a file exists?", "type": "mc", "opts": ["os.path.exists()", "file.exists()", "exists()", "isfile()"], "ans": 0},
        ],
        "Exception Handling": [
            {"q": "Which keyword catches exceptions in Python?", "type": "mc", "opts": ["except", "catch", "error", "handle"], "ans": 0},
            {"q": "The try block must be followed by except or finally.", "type": "tf", "ans": True},
            {"q": "The __ keyword raises an exception.", "type": "fb", "ans": ["raise"]},
            {"q": "What block always executes after try-except?", "type": "mc", "opts": ["finally", "always", "ensure", "cleanup"], "ans": 0},
            {"q": "Multiple except blocks can handle different exceptions.", "type": "tf", "ans": True},
            {"q": "The __ keyword provides an alternate if no exception occurs.", "type": "fb", "ans": ["else"]},
            {"q": "Which is the base class for all exceptions?", "type": "mc", "opts": ["BaseException", "Exception", "Error", "StandardError"], "ans": 0},
            {"q": "Custom exceptions should inherit from Exception class.", "type": "tf", "ans": True},
            {"q": "The __ exception is raised for division by zero.", "type": "fb", "ans": ["ZeroDivisionError"]},
            {"q": "What exception occurs when accessing invalid indices?", "type": "mc", "opts": ["IndexError", "KeyError", "ValueError", "TypeError"], "ans": 0},
            {"q": "KeyError is raised when a dictionary key doesn't exist.", "type": "tf", "ans": True},
            {"q": "The __ exception handles type mismatches.", "type": "fb", "ans": ["TypeError"]},
            {"q": "Which exception is raised for invalid values?", "type": "mc", "opts": ["ValueError", "TypeError", "KeyError", "AttributeError"], "ans": 0},
            {"q": "Assertions raise AssertionError when false.", "type": "tf", "ans": True},
            {"q": "The __ statement tests conditions and raises errors.", "type": "fb", "ans": ["assert"]},
            {"q": "What handles missing attributes on objects?", "type": "mc", "opts": ["AttributeError", "KeyError", "NameError", "TypeError"], "ans": 0},
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
    print("Comprehensive Question Bank Generator")
    print("="*70 + "\n")
    
    # Generate questions
    question_bank = generate_all_questions()
    
    # Statistics
    total = sum(len(q) for q in question_bank.values())
    print(f"\n{'='*70}")
    print("Generation Complete!")
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

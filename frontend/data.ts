import { DayPlan } from './types';

export const CURRICULUM: DayPlan[] = [
  {
    day: 1,
    title: "Core Fundamentals & Modules",
    description: "Understand the runtime environment, module system, and file operations.",
    tasks: [
      {
        id: "d1-t1",
        title: "Install & REPL Exploration",
        description: "Install Node.js LTS. Open your terminal, type `node`, and experiment with the REPL. Perform basic JS math and string manipulation.",
        learningOutcome: "Verify environment setup and understand the Read-Eval-Print Loop.",
        evaluationMethod: "Run `node -v` and take a screenshot of your version.",
        resources: [
          { title: "Node.js Official Download", url: "https://nodejs.org/", type: "article" },
          { title: "The Node.js REPL", url: "https://nodejs.org/en/learn/command-line/how-to-use-the-nodejs-repl", type: "article" }
        ]
      },
      {
        id: "d1-t2",
        title: "CommonJS Module System",
        description: "Create two files: `math.js` (export add/subtract functions) and `app.js` (require math.js). Log results to console.",
        learningOutcome: "Master `module.exports` and `require()` patterns.",
        evaluationMethod: "Run the script. Output should show correct calculations.",
        resources: [
          { title: "Modules: CommonJS", url: "https://nodejs.org/docs/latest/api/modules.html", type: "article" }
        ]
      },
      {
        id: "d1-t3",
        title: "File System (fs) Operations",
        description: "Use the built-in `fs` module to read a text file, modify its content (append text), and write it to a new file synchronously and asynchronously.",
        learningOutcome: "Understand the difference between blocking (sync) and non-blocking (async) I/O.",
        evaluationMethod: "Create a script that generates `output.txt` successfully.",
        resources: [
          { title: "Node.js File System", url: "https://www.w3schools.com/nodejs/nodejs_filesystem.asp", type: "article" }
        ]
      },
      {
        id: "d1-t4",
        title: "Basic HTTP Server",
        description: "Build a raw HTTP server using the `http` module. Respond with 'Hello World' for the root route and JSON data for '/api'.",
        learningOutcome: "Understand low-level HTTP handling without frameworks.",
        evaluationMethod: "Visit localhost:3000 in browser and see the text.",
        resources: [
          { title: "Anatomy of an HTTP Transaction", url: "https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/", type: "article" }
        ]
      },
      {
        id: "d1-t5",
        title: "NPM & package.json",
        description: "Initialize a project with `npm init`. Install `lodash` and use it to manipulate an array. Inspect `node_modules`.",
        learningOutcome: "Learn dependency management and the purpose of package.json.",
        evaluationMethod: "Show package.json containing dependencies.",
        resources: [
          { title: "NPM Guide", url: "https://docs.npmjs.com/about-npm", type: "article" }
        ]
      }
    ],
    quiz: [
      {
        id: "q1-1",
        question: "Which global object is used to export functionality in CommonJS?",
        options: ["export.default", "module.exports", "global.export", "import"],
        correctAnswer: 1
      },
      {
        id: "q1-2",
        question: "What happens if you use fs.readFileSync in a high-traffic web server?",
        options: ["It runs faster", "It blocks the event loop", "It creates a new thread", "Nothing special"],
        correctAnswer: 1
      },
      {
        id: "q1-3",
        question: "Which command creates a package.json file?",
        options: ["node init", "npm start", "npm init", "npm install"],
        correctAnswer: 2
      }
    ]
  },
  {
    day: 2,
    title: "Asynchronous Patterns & Express",
    description: "Dive into the Event Loop, Promises, and the most popular web framework.",
    tasks: [
      {
        id: "d2-t1",
        title: "The Event Loop",
        description: "Write code mixing `setTimeout`, `setImmediate`, and `process.nextTick`. Predict the output order before running.",
        learningOutcome: "Deep dive into phases of the Event Loop (Microtasks vs Macrotasks).",
        evaluationMethod: "Explain why the output order occurred.",
        resources: [
          { title: "The Node.js Event Loop", url: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/", type: "article" }
        ]
      },
      {
        id: "d2-t2",
        title: "Promises & Async/Await",
        description: "Refactor a callback-hell snippet (nested fs reads) into `async/await` using `fs.promises`.",
        learningOutcome: "Write clean, readable asynchronous code.",
        evaluationMethod: "Code should have no nested callbacks.",
        resources: [
          { title: "JavaScript Async/Await", url: "https://javascript.info/async-await", type: "article" }
        ]
      },
      {
        id: "d2-t3",
        title: "Express Server Setup",
        description: "Install `express`. Create a server with GET, POST, PUT, DELETE routes for a 'User' resource.",
        learningOutcome: "Understand RESTful routing conventions.",
        evaluationMethod: "Test endpoints using Postman or cURL.",
        resources: [
          { title: "Express Hello World", url: "https://expressjs.com/en/starter/hello-world.html", type: "article" }
        ]
      },
      {
        id: "d2-t4",
        title: "Express Middleware",
        description: "Create a custom middleware that logs the Request Method and URL + timestamp for every incoming request.",
        learningOutcome: "Learn how middleware intercepts the request-response cycle.",
        evaluationMethod: "Console should show logs when you hit endpoints.",
        resources: [
          { title: "Writing Middleware", url: "https://expressjs.com/en/guide/writing-middleware.html", type: "article" }
        ]
      },
      {
        id: "d2-t5",
        title: "Error Handling",
        description: "Implement a global error handling middleware in Express using the `(err, req, res, next)` signature.",
        learningOutcome: "Gracefully handle server crashes and send proper 500 responses.",
        evaluationMethod: "Throw an error in a route and ensure the server stays alive.",
        resources: [
          { title: "Express Error Handling", url: "https://expressjs.com/en/guide/error-handling.html", type: "article" }
        ]
      }
    ],
    quiz: [
      {
        id: "q2-1",
        question: "What keyword pauses the execution of an async function?",
        options: ["stop", "pause", "await", "defer"],
        correctAnswer: 2
      },
      {
        id: "q2-2",
        question: "In Express, how do you pass control to the next middleware?",
        options: ["return true", "next()", "continue()", "res.send()"],
        correctAnswer: 1
      },
      {
        id: "q2-3",
        question: "Which executes first in the event loop?",
        options: ["setTimeout(0)", "process.nextTick()", "setImmediate()", "I/O callbacks"],
        correctAnswer: 1
      }
    ]
  },
  {
    day: 3,
    title: "Databases & Real-world Application",
    description: "Connect your server to data storage and explore real-time capabilities.",
    tasks: [
      {
        id: "d3-t1",
        title: "Environment Variables",
        description: "Install `dotenv`. Move your port number and potential API keys into a `.env` file and access them via `process.env`.",
        learningOutcome: "Secure configuration management.",
        evaluationMethod: "Server starts using port from .env file.",
        resources: [
          { title: "Dotenv Package", url: "https://www.npmjs.com/package/dotenv", type: "article" }
        ]
      },
      {
        id: "d3-t2",
        title: "Database Connection (Mock or Real)",
        description: "Simulate a database. Create a `data.json` file. Create routes to read/write to this JSON file acting as a persistent store.",
        learningOutcome: "Understand persistence CRUD operations.",
        evaluationMethod: "Data persists after server restart.",
        resources: [
          { title: "Node.js JSON DB", url: "https://medium.com/@albertomontalesi/read-and-write-json-files-with-node-js-23340529d01a", type: "article" }
        ]
      },
      {
        id: "d3-t3",
        title: "Input Validation",
        description: "Use a library like `joi` or `zod` to validate incoming POST request bodies before saving to your data store.",
        learningOutcome: "Security best practices: never trust user input.",
        evaluationMethod: "Send invalid data and receive a 400 error.",
        resources: [
          { title: "Zod Documentation", url: "https://zod.dev/", type: "article" }
        ]
      },
      {
        id: "d3-t4",
        title: "Events Module",
        description: "Create a custom Event Emitter. Emit an event 'userRegistered' that triggers a listener simulating sending a welcome email.",
        learningOutcome: "Understand the Observer pattern native to Node.",
        evaluationMethod: "Console log 'Email sent' when event emits.",
        resources: [
          { title: "Node.js Events", url: "https://nodejs.org/api/events.html", type: "article" }
        ]
      },
      {
        id: "d3-t5",
        title: "Deployment Prep",
        description: "Create a simple README.md. Structure your project files neatly. Research platforms like Render or Railway.",
        learningOutcome: "Preparing code for production environments.",
        evaluationMethod: "Project is clean and documented.",
        resources: [
          { title: "Node.js Best Practices", url: "https://github.com/goldbergyoni/nodebestpractices", type: "book" }
        ]
      }
    ],
    quiz: [
      {
        id: "q3-1",
        question: "Why do we use environment variables?",
        options: ["To make code faster", "To hide secrets and config", "To increase memory", "To style the output"],
        correctAnswer: 1
      },
      {
        id: "q3-2",
        question: "What status code should be returned for validation errors?",
        options: ["200", "500", "404", "400"],
        correctAnswer: 3
      },
      {
        id: "q3-3",
        question: "Which Node module is the basis for many others?",
        options: ["http", "events", "fs", "path"],
        correctAnswer: 1
      }
    ]
  }
];
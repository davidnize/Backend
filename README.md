# Backend

My backend learning projects, from basic Node.js to a database-backed API. Each folder is a separate project.

## Projects

| Folder | Topic |
|---|---|
| 1.0 Node | Node.js basics |
| 2.0 Express | Building servers and routes with Express |
| 3.0 Embedded javascript | Rendering pages with EJS templates |
| 4.0 API | Building and using REST APIs |
| 5.0 PostgreSQL | Storing data in PostgreSQL, including a books app with an edit endpoint |

## Running a project

```bash
cd "1.0 Node"     # or any other project folder
npm install
node index.js     # or: nodemon index.js
```

Each project has its own `package.json`, so run `npm install` inside the folder first. Projects that use PostgreSQL need a local database running and the connection details set in the code.

## Tech

Node.js, Express, EJS, PostgreSQL

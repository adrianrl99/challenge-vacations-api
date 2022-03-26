### Brief

It's November, and everyone is planning their holiday vacation. But management is struggling! They need a solution to approve vacation requests while also ensuring that there are still enough employees in the office to achieve end-of-year goals.

Your task is to build one HTTP API that allows employees to make vacation requests, and another that provides managers with an overview of all vacation requests and allows them to decline or approve requests.

### Tasks

- [x] Implement assignment using:
  - [x] Language: Node
  - [x] Framework: Express
- [x] There should be API routes that allow workers to:
  - [x] See their requests
    - [x] Filter by status (approved, pending, rejected)
  - [x] See their number of remaining vacation days
  - [x] Make a new request if they have not exhausted their total limit (30 per year)
- There should be API routes that allow managers to:
  - [x] See an overview of all requests
    - [x] Filter by pending and approved
  - [x] See an overview for each individual employee
  - [x] See an overview of overlapping requests
  - [x] Process an individual request and either approve or reject it
- [x] Write tests for your business logic

Each request should, at minimum, have the following signature:

```
{
  "id": ENTITY_ID,
  "author": WORKER_ID,
  "status": STATUS_OPTION, // may be one of: "approved", "rejected", "pending"
  "resolved_by": MANAGER_ID,
  "request_created_at": "2020-08-09T12:57:13.506Z",
  "vacation_start_date" "2020-08-24T00:00:00.000Z",
  "vacation_end_date" "2020-09-04T00:00:00.000Z",
}
```

You are expected to design any other required models and routes for your API.

### Evaluation Criteria

- [ ] Node best practices
- [ ] Completeness: Did you include all features?
- [ ] Correctness: Does the solution perform in a logical way?
- [ ] Maintainability: Is the solution written in a clean, maintainable way?
- [ ] Testing: Has the solution been adequately tested?
- [ ] Documentation: Is the API well-documented?

### CodeSubmit

Please organize, design, test, and document your code as if it were going into production - then push your changes to the master branch. After you have pushed your code, you must submit the assignment via the assignment page.

All the best and happy coding,

The Taxfyle Team

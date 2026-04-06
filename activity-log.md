Milestone 3 Progress - Database Integration and Frontend Connection

Work Completed:
Connected the Node.js / Express backend to the MySQL database
Configured the database connection file and verified successful connection
Integrated frontend pages with backend API routes
Connected the Expenses page to live backend/database data
Connected the Categories page to live backend/database data
Connected the Budgets page to live backend/database data
Created Dashboard summary route and connected the Dashboard page
Created Reports summary route and connected the Reports page
Implemented working category CRUD functionality (add, rename, delete, reset defaults)
Tested API endpoints locally through browser and backend responses

Pages Connected:
Expenses: Connected to database-backed API data
Categories: Connected to database-backed API data with CRUD functionality
Budgets: Connected to database-backed API data
Dashboard: Connected to backend summary route
Reports: Connected to backend reporting route

Decisions Made:
Used MySQL as the main database for storing application data
Kept the backend organized using routes and controllers
Integrated pages one at a time to reduce debugging issues
Focused first on connecting live read functionality before completing all write actions
Prioritized features needed for the milestone walkthrough/demo

Testing Performed:
Verified backend server connection to MySQL
Tested GET endpoints for:
GET /api/expenses
GET /api/categories
GET /api/budgets
GET /api/dashboard
GET /api/reports
Tested category actions:
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
POST /api/categories/reset-defaults
Verified frontend pages load live backend data successfully

Next Steps:
Finish connecting remaining write actions for expenses and budgets
Improve validation and error handling
Prepare and record final project walkthrough/demo
Finalize README, Kanban board, and submission materials

Status: Core frontend/backend/database integration complete


Activity Blog – CP476 Personal Finance Tracker

Entry 2: Milestone 3 Integration and Testing
Date: April 5, 2026
Attendees: Yafet, Jose, Ben

Meeting Summary
The team focused on connecting the Personal Finance Tracker frontend and backend to the MySQL database for Milestone 3. The goal for this stage was to move the application from a mostly prototype state into a working full-stack version with real backend routes and database-connected pages.

The team also reviewed which features were most important for the milestone demonstration and focused on connecting the most visible user-facing pages first.

Key Decisions
MySQL would be fully connected to the backend for live application data
Frontend pages would be integrated one at a time to simplify testing and debugging
Dashboard and Reports would use summary/reporting endpoints instead of static data
Priority would be placed on demo-ready functionality over adding extra unfinished features

Task Assignments

Yafet
Connected the backend to MySQL
Integrated Expenses, Categories, Budgets, Dashboard, and Reports with backend/database data
Implemented and debugged category CRUD functionality
Tested API routes and frontend/backend integration
Updated README, Kanban board, and project documentation

Jose
Assisted with frontend/backend integration
Supported query/database connection work
Helped with testing and verifying application functionality
Contributed to walkthrough/demo preparation for test

Ben
Supported project structure and organization
Assisted with testing and review of integrated features
Contributed to presentation/demo planning
Helped with documentation and project coordination
Contributed to walkthrough/demo preparation for backend/database


Current Status
Backend successfully connected to MySQL
Core frontend pages are connected to live backend/database data
Dashboard and Reports are functional through backend summary routes
Categories CRUD functionality is implemented and tested
Project is in final preparation stage for walkthrough/demo and submission

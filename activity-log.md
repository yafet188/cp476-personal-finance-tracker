## Milestone 2 Progress - Backend Setup

### Work Completed:
- Set up complete Node.js/Express backend skeleton for Personal Expense Tracker
- Created project structure with routes, controllers, middleware, models, and utils folders
- Implemented stub endpoints for all core features:
  - Authentication (register, login, logout)
  - Expenses (CRUD operations with monthly filtering)
  - Categories (CRUD with default categories)
  - Budgets (CRUD with spending tracking)
- Added middleware structure for authentication protection
- Configured server entry point with error handling and security middleware (helmet, cors, morgan)

### Decisions Made:
- Using Node.js as the backend framework for its simplicity
- Organized code using routes and controllers
- Implemented stub responses first to establish API contracts before database integration
- Using file-based structure that aligns with our data planning (User, Expense, Category, Budget entities)
### Next Steps:
- Connect to database (MySQL/PostgreSQL)
- Implement actual user authentication with JWT
- Add validation logic for inputs
- Begin Sprint 1 user stories (UI-1, UI-2, Exp-1)

---

## Backend Server Configuration

### Work Completed:
- Initialized Node.js project with npm
- Installed dependencies: express, dotenv, cors, helmet, morgan, nodemon
- Created server.js with:
  - Environment variable configuration
  - Security middleware setup
  - Route registration
  - 404 and error handling middleware
  - Health check endpoint
- Verified server runs properly on port 5000

### Decisions Made:
- Using environment variables for configuration (PORT, JWT_SECRET, DB credentials)
- Implementing all endpoints as stubs first to allow frontend development to be completed

### Testing Performed:
- All endpoints tested with curl/PowerShell:
  - GET /health - returns server status
  - POST /api/auth/register - stub response working
  - GET /api/expenses - returns sample expense data
  - GET /api/categories - returns default categories
    
### Status: Complete Backend skeleton ready for full implementation


# Activity Blog – CP476 Personal Finance Tracker

## Entry 1: Project Planning & Setup
Date: January 29, 2026  
Attendees: Yafet, Jose, Ben  

### Meeting Summary
The team met to finalize the project idea and organize responsibilities for Milestone 01. After discussing multiple options, we agreed to build a Personal Finance Tracker web application. The goal of the app is to allow users to track income and expenses and have overall management of funds.

We reviewed the Milestone 01 requirements and discussed how to divide the planning work efficiently across the team.

### Key Decisions
- Project topic: Personal Finance Tracker
- GitHub will be used for version control and project management
- GitHub Projects (Kanban board) will track tasks and individual contributions
- Roles will be flexible and may rotate in future milestones

### Task Assignments
- **Yafet**
  - Created the GitHub repository
  - Set up README and project documentation
  - Created and organized the GitHub Kanban board
  - Initialized the activity blog

- **Jose**
  - Designed wireframes for the main user workflow
  - Helped define overall application structure and navigation

- **Ben**
  - Assigned responsibility for identifying core data entities and relationships
  - Responsible for documenting team workflow and roles

### Current Status
- GitHub repository and Kanban board successfully set up
- Initial tasks created and assigned
- Planning work for data modeling and user stories is in progress

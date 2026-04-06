# CP476 – Personal Finance Tracker

## Milestone 03

## Overview
The Personal Finance Tracker is a web application designed to help users manage their personal finances by tracking expenses, setting budgets, organizing categories, viewing monthly reports, etc.

This project was developed for CP476 as a full-stack group project using a frontend, backend, and MySQL database connection.

--------------------------------------------------

## Features
- Add, edit, and delete expenses
- Create and manage expense categories
- Set monthly and category budgets
- View dashboard summaries
- View spending reports by category
- Store and retrieve data from a MySQL database
- Frontend and backend integration using API routes

--------------------------------------------------

## Tech Stack

Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Node.js
- Express.js

Database:
- MySQL

--------------------------------------------------

## Project Structure

personalfinancetracker/

frontend/
  dashboard.html
  expenses.html
  budgets.html
  categories.html
  reports.html
  css/
  js/

backend/
  controllers/
  routes/
  config/
  models/
  server.js

sql/
  schema.sql

README.md

--------------------------------------------------

## Main Pages

Dashboard
Displays:
- Total spending
- Total budget
- Remaining budget
- Budget progress
- Monthly expense summary

Expenses
Allows users to:
- Add new expenses
- Edit existing expenses
- Delete expenses
- Assign expenses to categories

Budgets
Allows users to:
- Set an overall monthly budget
- Set category-specific budgets
- View budget totals

Categories
Allows users to:
- Add new categories
- Rename categories
- Delete categories
- Reset default categories

Reports
Displays:
- Monthly total spending
- Number of expenses
- Spending breakdown by category

--------------------------------------------------

## API Endpoints

Expenses
GET /api/expenses
POST /api/expenses
PUT /api/expenses/:id
DELETE /api/expenses/:id

Categories
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
POST /api/categories/reset

Budgets
GET /api/budgets
POST /api/budgets
PUT /api/budgets/:id
DELETE /api/budgets/:id

Dashboard
GET /api/dashboard

Reports
GET /api/reports

--------------------------------------------------

## Database

The project uses a MySQL database to store:
- Users
- Expenses
- Categories
- Budgets

Tables:
- users
- expenses
- categories
- budgets

--------------------------------------------------

## How to Run the Project

1. Clone the Repository
git clone https://github.com/yafet188/cp476-personalfinancetracker.git
cd cp476-personalfinancetracker

2. Install Backend Dependencies
cd backend
npm install

3. Set Up MySQL Database

CREATE DATABASE finance_tracker;
USE finance_tracker;

Then run your SQL schema file.

4. Start the Backend Server
node server.js

Server runs at:
http://localhost:3000

5. Run the Frontend
Open frontend files using Live Server or browser.

Example:
frontend/dashboard.html

--------------------------------------------------

## Current Project Status

Completed:
- Frontend pages created
- Backend API routes implemented
- MySQL database connected
- Expenses integrated with database
- Categories integrated with database
- Budgets integrated with database
- Dashboard connected to backend
- Reports connected to backend

In Progress / Future Improvements:
- User authentication
- Improved validation
- Better error handling
- Export features
- More advanced reports

--------------------------------------------------

## Team Members & Roles

Yafet:
- Frontend development and page implementation
- Backend integration and feature connection
- Database connection setup and testing
- CRUD feature debugging and final fixes
- Project documentation updates (README, Kanban, GitHub organization)
- Coordination of final project submission requirements

Jose:
- Frontend to backend integration support
- SQL query implementation and API data connection
- Helped connect application functionality to the database
- Assisted with functional testing of database-connected features
- Recorded walkthrough/demo of the working application
- Contributed to project presentation and technical explanation

Ben:
- Project structure planning and application organization
- Helped explain file structure, endpoints, and application flow
- Assisted database connection setup and testing
- Supported testing and review of app functionality
- Worked on project presentation / walkthrough materials
- Assisted with documentation / PDF deliverable preparation
- Recorded walkthrough/demo of the working application
- Contributed to project communication and final submission support

--------------------------------------------------

## Demo Notes

For the demo, show:
- App running in browser
- Backend server running
- Database connected
- API endpoints working

Examples to demonstrate:
- Add expense → appears in DB
- Add category → appears instantly
- Set budget → updates dashboard
- Dashboard reflects real data
- Reports show category breakdown

--------------------------------------------------

## Course Info

Course: CP476
Project: Personal Finance Tracker - Milestone 03
Term: Winter 2026

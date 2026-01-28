# Scitforte Internship – UI Project

This is the UI project developed as part of the Scitforte internship task.  
It is a Laravel Blade + Bootstrap frontend application that consumes APIs from the Laravel Sanctum backend project.

## Features

- User Registration
- User Login
- Authentication using API tokens
- Dashboard page after login
- Categories CRUD
- Products CRUD
- Bootstrap-based responsive UI
- API integration with external backend project

## Tech Stack

- Laravel (Blade)
- Bootstrap 5
- PHP
- REST APIs

## Project Setup

1. Clone the repository
   git clone https://github.com/umar-rao-dev/scitforte-intern-ui.git

2. Install dependencies
   composer install

3. Create .env file
   cp .env.example .env

4. Set Application Key
   php artisan key:generate

5. Configure API Base URL

   In .env file, set:

   API_BASE_URL=http://localhost:8000/api

   (Update this URL according to where your API project is running)

6. Run the project
   php artisan serve

7. Open in browser
   http://127.0.0.1:8000

## Related Backend API Project

Backend API Repository:  
https://github.com/umar-rao-dev/scitforte-intern-api

## Internship Task

This project was created as part of an internship assignment to build an API-based Laravel application with separate frontend and backend architecture.

---

Developed by Muhammad Umar Rao

# Hemis Project

## Overview
Hemis is a web application designed for managing institutions and their associated data. It provides an interface for super administrators to add, edit, and manage user accounts, as well as institutions and their report years.

## Project Structure
The project is organized into the following main directories:

- **app**: Contains the backend logic of the application.
  - **Http/Controllers/Api**: Houses the API controllers that handle requests related to institutions.
    - `InstitutionController.php`: Manages API requests for institutions, including CRUD operations and data transformation for responses.
  - **Models**: Contains the Eloquent models representing the database tables.
    - `ReportYear.php`: Defines the ReportYear model for the report_years table.

- **src**: Contains the frontend components of the application.
  - **Pages/SuperAdmin/InstitutionManagement**: Contains components related to institution management.
    - `UploadDialog.jsx`: A modal component for adding or editing user information, including form handling and profile image uploads.

## Features
- **Institution Management**: Create, read, update, and delete institutions through a RESTful API.
- **User Management**: Add and edit user accounts with role-based access control.
- **Profile Image Upload**: Users can upload profile images during account creation or editing.
- **Dynamic Year Selection**: The application dynamically retrieves and displays report years for selection.

## Installation
To set up the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd Hemis
   ```

3. Install dependencies:
   ```
   composer install
   npm install
   ```

4. Set up your environment variables by copying the `.env.example` file to `.env` and configuring your database settings.

5. Run the migrations to set up the database:
   ```
   php artisan migrate
   ```

6. Start the development server:
   ```
   php artisan serve
   ```

## Usage
Access the application through your web browser at `http://localhost:8000`. Use the provided interface to manage institutions and users.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
# School Management API

This project provides a simple API for managing school information, allowing you to add new schools and list schools based on their proximity to a given location.

## Installation

Follow these steps to set up and run the project locally:

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/pc-hover/school-management.git](https://github.com/pc-hover/school-management.git)
    cd school-management
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    * Create a `.env` file in the root directory of the project.
    * Add the following content to the `.env` file, replacing the placeholder values with your actual MySQL database credentials:

        ```text
        PORT=3000
        HOST=your-mysql-host
        USER=your-mysql-user
        PASSWORD=your-password
        DB_NAME=school_management
        ```

4.  **Start the application:**

    ```bash
    npm start
    ```

    This command will start the Node.js server, and the API will be accessible at `http://localhost:3000`.

## API Endpoints

### 1. Add a School

* **Method:** `POST`
* **Endpoint:** `/addSchool`
* **Request Body:**

    ```json
    {
      "name": "Greenwood High",
      "address": "123 Education Blvd, Boston, MA",
      "latitude": 42.3601,
      "longitude": -71.0589
    }
    ```

    **Request Body Parameters:**

    * `name`: The name of the school (string, required).
    * `address`: The address of the school (string, required).
    * `latitude`: The latitude of the school (number, required).
    * `longitude`: The longitude of the school (number, required).

* **Response:**

    ```json
    {
      "message": "School added successfully",
      "schoolId": 1
    }
    ```

    **Response Body Parameters:**

    * `message`: A message indicating the success of the operation (string).
    * `schoolId`: The unique identifier assigned to the newly added school (number).

### 2. List Schools by Proximity

* **Method:** `GET`
* **Endpoint:** `/listSchools`
* **Query Parameters:**

    * `latitude`: Latitude of the user (number, required). Example: `/listSchools?latitude=40.7128&longitude=-74.0060`
    * `longitude`: Longitude of the user (number, required). Example: `/listSchools?latitude=40.7128&longitude=-74.0060`

* **Response:**

    ```json
    [
      {
        "id": 1,
        "name": "Greenwood High",
        "address": "123 Education Blvd, Boston, MA",
        "latitude": 42.3601,
        "longitude": -71.0589,
        "distance": 0
      }
    ]
    ```

    **Response Body Parameters (Array of School Objects):**

    * `id`: The unique identifier of the school (number).
    * `name`: The name of the school (string).
    * `address`: The address of the school (string).
    * `latitude`: The latitude of the school (number).
    * `longitude`: The longitude of the school (number).
    * `distance`: The distance between the provided user coordinates and the school's coordinates (number). The units of distance will depend on the calculation method used (likely kilometers or miles).

## Deployment

The API is currently deployed and accessible at the following URL:

[https://school-management-eight-sage.vercel.app/](https://school-management-eight-sage.vercel.app/)

You can use this deployed endpoint to test the API functionalities. For example, to list schools near a specific location using the deployed API, you would make a GET request to:

`https://school-management-eight-sage.vercel.app/listSchools?latitude=<your_latitude>&longitude=<your_longitude>`

Similarly, to add a school, you would make a POST request to `https://school-management-eight-sage.vercel.app/addSchool` with the request body as described in the "Add a School" section, ensuring you set the `Content-Type` header to `application/json`.

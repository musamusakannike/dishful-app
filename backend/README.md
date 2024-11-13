# Recipe AI API Documentation

This document serves as a guide for frontend developers on how to interact with the Recipe AI API, including endpoints, request parameters, and response formats. This API provides recipe generation based on various inputs such as food names, ingredients, and leftovers. All endpoints follow RESTful principles and return data in JSON format.

## Base URL

All requests are prefixed with the following base URL:

```
http://<your-server-url>/api/v1
```

## Authentication

Endpoints are protected, requiring a JWT token in the headers:

```json
Authorization: Bearer <token>
```

Ensure that the token is obtained by registering or logging in via the authentication endpoints.

## Endpoints Overview

### Authentication

#### 1. **Register User**

**Endpoint**: `POST /auth/register`

Registers a new user.

**Request Body**:

```json
{
  "username": "string", // Required, min length 3
  "email": "string", // Required, valid email
  "password": "string" // Required, min length 6
}
```

**Response**:

- **201**: User registered successfully. Returns user data and a JWT token.
- **400**: Validation error (e.g., "User already exists").

#### 2. **Login User**

**Endpoint**: `POST /auth/login`

Logs in an existing user.

**Request Body**:

```json
{
  "email": "string", // Required
  "password": "string" // Required
}
```

**Response**:

- **200**: Login successful. Returns user data and a JWT token.
- **400**: Invalid email or password.

### Recipe Generation

#### 1. **Generate Recipe by Food Name**

**Endpoint**: `POST /recipe/text-recipe`

Generates a recipe based on a food name.

**Request Body**:

```json
{
  "food": "string", // Required, the name of the food
  "additionalText": "string" // Optional, extra instructions
}
```

**Response**:

- **200**: Returns the generated recipe.
- **400**: Validation error (e.g., missing `food` field).

#### 2. **Generate Recipe by Ingredients**

**Endpoint**: `POST /recipe/ingredients-recipe`

Generates a recipe based on a list of ingredients.

**Request Body**:

```json
{
  "ingredients": ["string"], // Required, array of ingredients
  "additionalText": "string" // Optional, extra instructions
}
```

**Response**:

- **200**: Returns the generated recipe and other possible recipes.
- **404**: No recipe available with the provided ingredients.
- **400**: Validation error.

#### 3. **Generate Random Recipe**

**Endpoint**: `POST /recipe/random-recipe`

Generates a random recipe.

**Request Body**:

```json
{
  "additionalText": "string" // Optional, extra instructions
}
```

**Response**:

- **200**: Returns a randomly generated recipe.

#### 4. **Generate Recipe from Leftovers**

**Endpoint**: `POST /recipe/leftovers-recipe`

Generates a recipe based on leftover ingredients.

**Request Body**:

```json
{
  "leftovers": ["string"], // Required, array of leftovers
  "additionalText": "string" // Optional, extra instructions
}
```

**Response**:

- **200**: Returns the generated recipe.
- **400**: Validation error (e.g., empty `leftovers` array).

## Response Format

Each successful response contains a recipe object with the following structure:

```json
{
  "title": "string",
  "ingredients": ["string"],
  "steps": ["string"],
  "recipeSource": "string",
  "foodLocation": "string",
  "additionalInfo": "string",
  "nutritionalInfo": {
    "calories": "string",
    "protein": "string",
    "fat": "string",
    "carbs": "string"
  },
  "difficulty": "string",
  "timeEstimate": "string",
  "pairings": ["string"],
  "substitutions": [
    {
      "ingredient": "string",
      "substitute": "string"
    }
  ]
}
```

## Example Usage

### Register User Example

**Request**:

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "chef123",
  "email": "chef123@example.com",
  "password": "securepassword"
}
```

**Response**:

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "username": "chef123",
      "email": "chef123@example.com"
    },
    "token": "<jwt-token>"
  }
}
```

### Generate Recipe by Ingredients Example

**Request**:

```http
POST /api/v1/recipe/ingredients-recipe
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "ingredients": ["tomato", "onion", "basil"],
  "additionalText": "Create a vegan option"
}
```

**Response**:

```json
{
  "recipe": {
    "title": "Tomato Basil Soup",
    "ingredients": ["tomato", "onion", "basil", "olive oil", "salt", "pepper"],
    "steps": ["Chop ingredients...", "Heat oil...", "Add tomatoes..."],
    "recipeSource": "Italian",
    "foodLocation": "Italy",
    "nutritionalInfo": {
      "calories": "150",
      "protein": "3g",
      "fat": "5g",
      "carbs": "22g"
    },
    "difficulty": "easy",
    "timeEstimate": "30 minutes",
    "pairings": ["Garlic Bread"],
    "substitutions": [
      {
        "ingredient": "basil",
        "substitute": "oregano"
      }
    ]
  },
  "otherRecipes": [
    // Other similar recipes
  ]
}
```

## Error Responses

- **400**: Bad Request - Invalid input data or missing required fields.
- **401**: Unauthorized - Invalid or missing JWT token.
- **404**: Not Found - Recipe not found (for specific endpoints).
- **500**: Server Error - Issue on the server side.

## Notes

- Ensure the frontend includes a JWT token in all requests to the `/recipe` endpoints.
- Follow required request body structures to avoid validation errors.
- The `additionalText` field in recipe generation requests is optional and can be used to customize recipes (e.g., "Make it vegan" or "Add spicy flavor").

### Saved Recipes

The `/api/v1/save` endpoints allow authenticated users to save and retrieve their favorite recipes.

**Base URL**: `/api/v1/save`

**Authentication**: All endpoints under `/save` require a JWT token in the `Authorization` header.

#### 1. **Get Saved Recipes**

**Endpoint**: `GET /api/v1/save`

Retrieves all recipes saved by the authenticated user.

**Headers**:

- `Authorization`: Bearer `<jwt-token>`

**Response**:

- **200**: Returns a list of recipes saved by the user.
- **500**: Internal server error (e.g., database issues).

**Response Body**:

```json
[
  {
    "title": "Spaghetti Bolognese",
    "recipe": {
      "ingredients": ["spaghetti", "tomato sauce", "ground beef"],
      "steps": ["Boil spaghetti...", "Cook beef...", "Combine..."]
    },
    "user": "user_id",
    "_id": "recipe_id"
  }
  // Additional saved recipes
]
```

**Example Request**:

```http
GET /api/v1/save
Authorization: Bearer <jwt-token>
```

**Example Response**:

```json
[
  {
    "title": "Spaghetti Bolognese",
    "recipe": {
      "ingredients": ["spaghetti", "tomato sauce", "ground beef"],
      "steps": ["Boil spaghetti...", "Cook beef...", "Combine..."]
    },
    "user": "63b27d5c5d7f6f001f35c8f4",
    "_id": "63b27d5c5d7f6f001f35c8f7"
  }
]
```

#### 2. **Save a Recipe**

**Endpoint**: `POST /api/v1/save`

Allows an authenticated user to save a recipe.

**Headers**:

- `Authorization`: Bearer `<jwt-token>`

**Request Body**:

```json
{
  "title": "string", // Required, title of the recipe
  "recipe": {
    // Required, recipe details
    "ingredients": ["string"], // Array of ingredients
    "steps": ["string"] // Array of preparation steps
  }
}
```

**Response**:

- **201**: Recipe saved successfully. Returns the saved recipe data.
- **500**: Internal server error (e.g., failure in saving to database).

**Response Body**:

```json
{
  "title": "Spaghetti Bolognese",
  "recipe": {
    "ingredients": ["spaghetti", "tomato sauce", "ground beef"],
    "steps": ["Boil spaghetti...", "Cook beef...", "Combine..."]
  },
  "user": "user_id",
  "_id": "recipe_id"
}
```

**Example Request**:

```http
POST /api/v1/save
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Spaghetti Bolognese",
  "recipe": {
    "ingredients": ["spaghetti", "tomato sauce", "ground beef"],
    "steps": ["Boil spaghetti...", "Cook beef...", "Combine..."
    ]
  }
}
```

**Example Response**:

```json
{
  "title": "Spaghetti Bolognese",
  "recipe": {
    "ingredients": ["spaghetti", "tomato sauce", "ground beef"],
    "steps": ["Boil spaghetti...", "Cook beef...", "Combine..."]
  },
  "user": "63b27d5c5d7f6f001f35c8f4",
  "_id": "63b27d5c5d7f6f001f35c8f7"
}
```

This documentation should enable the frontend team to integrate effectively with the Recipe AI API and implement error handling for a smooth user experience. Let me know if you need further details on any of the endpoints!

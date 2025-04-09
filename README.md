# My Blog CMS

My Blog CMS is a content management system (CMS) that allows users to create, edit, and manage articles. This project is built using **Next.js**, **React**, **MongoDB**, and **BetterAuth** for user authentication.

## Features

- **User Authentication**: Secure login and session management using **BetterAuth**.
- **Article Management**: Users can create, edit, view, and delete articles.
- **Pagination**: Articles are paginated for better performance and navigation.
- **Search**: Articles can be searched by title, content, or author.

## Technologies

- **Next.js**: Framework for building the React application with SSR/SSG.
- **React**: Frontend library for building interactive UIs.
- **MongoDB**: Database for storing articles and user information.
- **BetterAuth**: Authentication system to manage user sessions securely.
- **Docker**: Containerization of the application and MongoDB.
- **Sonner**: Notification library for user interactions.

## Prerequisites

Make sure you have the following installed on your system:

- **Docker**: To build and run containers.
- **Node.js**: To run the application locally or in the Docker container.
- **MongoDB Atlas**: For a cloud-hosted MongoDB instance (or a local MongoDB instance).

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/xosebastian/my-blog-cms.git
cd my-blog-cms
```

### 2. Install dependencies

Use either **npm** or **yarn** to install project dependencies.

If using **npm**:

```bash
npm install
```

If using **yarn**:

```bash
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```env
NEXT_PUBLIC_BETTER_AUTH_URL=<your-better-auth-url>
NEXT_PUBLIC_BETTER_AUTH_PROJECT_ID=<your-better-auth-project-id>
NEXT_PUBLIC_MONGO_URI=<your-mongo-uri>
```

Replace `<your-better-auth-url>`, `<your-better-auth-project-id>`, and `<your-mongo-uri>` with the correct values.

#### 4. Run the application with Docker Compose

To run the project with Docker Compose, use the following command:

```bash
docker-compose up
```

This will build the necessary Docker images and start the application along with MongoDB.

### 5. Running the Application Locally

If you prefer to run the application without Docker, you can run it locally using the following command:

For **development mode**:

```bash
npm run dev
```

or

```bash
yarn dev
```

Visit `http://localhost:3000` to access the application.

## Available Routes

- **POST `/api/auth/sign-in/email`**: Sign in with email.
- **GET `/api/articles`**: List of articles (paginated).
- **GET `/api/articles/author`**: Fetch articles of a specific author by `authorId` (paginated).
- **GET `/api/users`**: Fetch users (for admin use).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [BetterAuth](https://better-auth.com/)
```

This `README.md` file provides the installation instructions, Docker setup, and general usage for your project. Feel free to customize it further based on any additional configuration or details specific to your project.
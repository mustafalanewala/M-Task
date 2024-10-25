## **1. Project Overview**

**Project Name:** MTask

**Description:**  
MTask is a powerful task management application that allows users to seamlessly sign up and log in using Google OAuth. Users can create, manage, and categorize their tasks as completed, pending, or failed. With features like task editing, deletion, and an intuitive interface, MTask helps individuals stay organized and productive.

---

## **2. Technology Stack**

### **Frontend:**
- **Framework:** React.js
- **State Management:** Redux (with Redux Toolkit)
- **Routing:** React Router
- **UI Library:** Material-UI or Tailwind CSS
- **Authentication:** OAuth (using Google or other providers)

### **Backend:**
- **Framework:** Node.js with Express.js
- **Database:** Firebase Firestore (NoSQL)
- **Authentication:** Firebase Authentication with OAuth providers

### **Hosting:**
- **Frontend & Backend Hosting:** Vercel

---

## **3. Authentication with OAuth**

### **Steps:**

1. **Set Up OAuth Provider:**
   - Configure OAuth on Firebase for Google or other third-party providers.
   - Obtain OAuth credentials (Client ID and Client Secret).

2. **OAuth Flow in React:**
   - Use Firebase Authentication to integrate OAuth.
   - Use Firebase SDK for handling login and token management.
   - Store the JWT token securely (Redux state for temporary token storage).

3. **Redirecting User Post-Login:**
   - On successful OAuth login, redirect the user to the task management dashboard.

---

## **4. Backend (Node.js + Express)**

1. **Set Up Express Server:**
   - Handle API routes for managing tasks (CRUD operations).
   - Ensure authentication middleware to protect routes.
   
2. **Connect to Firebase Firestore:**
   - Use Firebase Admin SDK on the server to interact with Firestore for storing and retrieving tasks.

3. **API Endpoints:**
   - **POST /tasks:** Create a new task.
   - **GET /tasks:** Get all tasks for the authenticated user.
   - **PUT /tasks/:id:** Update a specific task.
   - **DELETE /tasks/:id:** Delete a task.

---

## **5. State Management with Redux**

1. **Actions and Reducers:**
   - Set up Redux slices for managing user authentication state and task-related data.
   - Actions like `fetchTasks`, `addTask`, `updateTask`, `deleteTask`, and `setUser` for managing state.

2. **Thunk for Async Operations:**
   - Use Redux Thunk for handling asynchronous calls to Firebase via the backend API (e.g., fetching tasks, creating tasks).

---

## **6. Task Management Features**

1. **Create Task:** 
   - A form where users can add a new task (title, description, due date).
   
2. **View Tasks:**
   - Display all tasks, filter by status (pending, completed, failed).
   
3. **Edit/Update Task:**
   - Allow users to update task details.

4. **Delete Task:**
   - Provide a button to delete tasks from Firebase.

5. **Task Status:**
   - Mark tasks as completed, failed, or pending.

---

## **7. Hosting and Deployment**

### **Steps:**

1. **Frontend on Vercel:**
   - Deploy the React app to Vercel with automatic integration from your GitHub repository.
   - Configure environment variables for OAuth credentials and Firebase settings.

2. **Backend on Vercel:**
   - Deploy the Node.js + Express backend as a Vercel serverless function.
   - Ensure proper API routes are configured.

---
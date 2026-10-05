# PROJECT REPORT

## DocuVault — Enterprise Document Management System & Secure Access Control Platform

---

Course / Degree: Bachelor of Technology in Computer Science & Engineering  
Subject: Full-Stack Web Development & Backend Engineering  
Project Title: DocuVault — Enterprise Document Management System  
Architecture: MERN Stack (MongoDB Atlas, Express.js, React Vite, Node.js)  
Frontend Live URL: https://docuvault-portal.vercel.app  
Backend API Live URL: https://docuvault-backend-fg1q.onrender.com  
GitHub Source Code: https://github.com/Ankitraj-17/BACKEND-MAIN-PROJECT  

---

## Certificate of Authenticity

This is to certify that the project entitled "DocuVault — Enterprise Document Management System" is a bona fide work carried out by the student in partial fulfillment of the requirements for the degree and coursework.

The project demonstrates practical implementation of full-stack web engineering, database architecture, authentication protocols, secure file streaming, and cloud container deployment.

Date: October 2026  
Status: Completed and Verified  

---

## Acknowledgements

I would like to express my sincere gratitude to my professors, mentors, and peers who provided valuable guidance, technical assistance, and continuous support throughout the development of this project.

Special thanks to the open-source software community for providing the tools, libraries, and frameworks that made this project possible, including Node.js, Express.js, MongoDB, React, Vite, and Multer.

---

## Table of Contents

1. Abstract and Project Summary
2. Chapter 1: Introduction and Project Overview
   - 1.1 Background
   - 1.2 Purpose of the Project
   - 1.3 Scope of the Application
   - 1.4 Target Audience
3. Chapter 2: Problem Statement and Requirements Analysis
   - 2.1 Problems with Existing File Management Methods
   - 2.2 Proposed Solution
   - 2.3 Functional Requirements
   - 2.4 Non-Functional Requirements
   - 2.5 System Specifications (Hardware and Software)
4. Chapter 3: System Architecture and Technology Stack
   - 3.1 Three-Tier Decoupled Architecture
   - 3.2 Technology Stack Justification
   - 3.3 End-to-End Request Lifecycle
5. Chapter 4: Database Design and Schema Modeling
   - 4.1 Database Selection
   - 4.2 User Schema Details
   - 4.3 Document Schema Details
   - 4.4 Embedded File Metadata Schema
   - 4.5 Indexing Strategy for Fast Queries
6. Chapter 5: Core System Modules and Implementation
   - 5.1 Module 1: User Authentication and Role-Based Access Control
   - 5.2 Module 2: Multi-File Ingestion Engine via Multer
   - 5.3 Module 3: Ownership-Based Authorization Logic
   - 5.4 Module 4: Dynamic Search and Category Indexing
   - 5.5 Module 5: Hybrid Cloud Persistence (Overcoming Ephemeral Storage)
   - 5.6 Module 6: In-Browser Document Previewer and Downloader
   - 5.7 Module 7: Administrative Company Audit Directory
7. Chapter 6: RESTful API Reference and Specifications
   - 6.1 Authentication Endpoints
   - 6.2 Document Management Endpoints
8. Chapter 7: Frontend User Interface and User Flow
   - 7.1 Design Principles and Layout Structure
   - 7.2 Key User Interface Screens
   - 7.3 User Journey Flowchart Description
9. Chapter 8: Security, Validation, and Exception Handling
   - 8.1 Password Hashing with Bcrypt
   - 8.2 Stateless JSON Web Tokens
   - 8.3 File Extension and MIME Type Whitelisting
   - 8.4 Cross-Origin Resource Sharing (CORS) Security
   - 8.5 Centralized Error Handling Middleware
10. Chapter 9: Cloud Deployment and DevOps Setup
    - 9.1 Frontend Deployment on Vercel
    - 9.2 Backend Deployment on Render
    - 9.3 Database Cluster on MongoDB Atlas
    - 9.4 Verified Production Links
11. Chapter 10: Quality Assurance, Verification, and Test Matrix
    - 10.1 Testing Strategy
    - 10.2 Comprehensive Test Cases Table
12. Chapter 11: Installation and Local Execution Guide
    - 11.1 Prerequisites
    - 11.2 Backend Server Configuration
    - 11.3 Frontend Client Configuration
13. Chapter 12: Conclusion and Future Roadmap
    - 13.1 Project Summary and Achievements
    - 13.2 Lessons Learned
    - 13.3 Future Enhancements
14. References and Technical Bibliography

---

## 1. Abstract and Project Summary

In modern professional and academic institutions, handling official records such as government identification proofs, academic marksheets, compliance certificates, and employment contracts is a daily necessity. When organizations rely on informal communication channels such as email attachments or shared cloud folders, they face serious operational risks. These risks include data leaks, unauthorized file tampering, missing audit records, and accidental file loss.

DocuVault is an enterprise-grade Document Management System (DMS) built to resolve these challenges. The system is built using a modern full-stack architecture: Node.js and Express.js on the backend, MongoDB Atlas for database operations, Multer for multipart form handling, and React 18 with Vite for the user interface.

Key accomplishments of DocuVault include:
- A multi-file ingestion pipeline that permits users to upload up to 10 files per document with automatic size and type verification.
- A strict ownership-based authorization barrier ensuring normal employees can only access, edit, and delete files they uploaded.
- An Administrative Audit Dashboard that grants authorized managers an organization-wide view of all documents with employee and category filters.
- An in-browser document previewer capable of rendering images and embedded PDF files on demand.
- A hybrid cloud persistence engine that stores file data buffers inside cloud MongoDB Atlas, ensuring zero file loss even when deployed on free cloud hosts with temporary container disks.

The application has been fully tested, verified, and deployed to live production on Vercel and Render with live database connectivity on MongoDB Atlas.

---

## Chapter 1: Introduction and Project Overview

### 1.1 Background
Every structured organization relies heavily on verified documents to conduct business. Human Resources departments require proof of identity, tax slips, and educational certificates from employees. Educational universities require grade cards and identity verification from students. Legal departments require contracts and signed compliance records.

Historically, organizations used physical paper archives or basic shared network drives. Both approaches have severe drawbacks. Physical paper archives take up real estate, are vulnerable to physical damage, and cannot be searched quickly. Shared network drives lack granular permissions, making it easy for one employee to accidentally view or delete another employee's confidential records.

### 1.2 Purpose of the Project
The primary purpose of DocuVault is to provide a unified, web-based platform that makes document management easy, organized, and secure. The system allows users to create an account, log in with secure credentials, upload documents with multiple attachments, assign categories, search through past records, and view files directly in the browser.

### 1.3 Scope of the Application
The scope of DocuVault covers:
- User registration and login for both standard Employees and System Administrators.
- Secure session management using stateless authentication tokens.
- Multi-file uploads supporting common official document formats (PDF, DOCX, PNG, JPG, WEBP, TXT).
- Organization of records into standardized categories (ID Proof, Certificate, Other).
- Fast keyword search across document titles and descriptions.
- Controlled file access: standard employees can only view their own files, while administrators can review documents across the entire organization.
- Instant in-browser file previewing and authenticated file downloading.
- Complete cloud deployment accessible through web browsers from any desktop or mobile device.

### 1.4 Target Audience
1. Corporate Employees: Who need an easy portal to submit and manage personal records like PAN cards, Aadhaar, degree certificates, and resumes.
2. Human Resource Personnel & Compliance Officers: Who need to audit submitted employee records, verify credentials, and maintain departmental compliance.
3. System Administrators: Who oversee organizational data, monitor platform statistics, and ensure data integrity.

---

## Chapter 2: Problem Statement and Requirements Analysis

### 2.1 Problems with Existing File Management Methods
1. Lack of Privacy: When files are sent over email or stored in public folders, there is no technical barrier preventing coworkers from reading each other's sensitive records.
2. Insecure Direct Object Reference (IDOR): Many simple web systems allow any user to change an ID number in the web address bar and view another user's private documents.
3. Inconsistent File Organization: Without predefined categories, users name and store files haphazardly, making it difficult to find records during audits.
4. Ephemeral Cloud Storage Loss: Most modern cloud platforms (like Render or Heroku free tiers) wipe the server's local hard drive whenever the server restarts or deploys new code. Systems that rely only on local disk folders lose all files permanently upon server restarts.
5. Large and Slow Network Transfers: When websites return full document files during simple list queries, user pages become sluggish and waste massive bandwidth.

### 2.2 Proposed Solution
DocuVault solves every one of these problems through a secure, structured design:
- Strict controller-level ownership checks prevent unauthorized viewing or tampering.
- Clean category classification and MongoDB regex indexing make locating files instant.
- A hybrid cloud storage engine saves file buffers directly into MongoDB Atlas, guaranteeing that documents are never lost across server redeployments.
- Lean database projections (`select('-files.fileData')`) ensure that listing documents is ultra-fast, loading binary files only when a user specifically clicks Preview or Download.

### 2.3 Functional Requirements
The system must satisfy the following functional capabilities:
- User Authentication: Users must be able to register with their name, email, department, and password, and log in securely.
- Role Assignment: The system must support two distinct user roles: "employee" and "admin".
- File Uploading: Users must be able to upload a title, optional description, a chosen category, and between 1 and 10 files simultaneously.
- File Verification: Files must be checked for allowed extensions and MIME types. Files exceeding 15 MB must be rejected.
- Document Inspection: Users must be able to open document details, view metadata, and inspect individual file attachments.
- In-Browser Preview: The frontend must display images directly and embed PDF files inside an interactive viewer without forcing a file download.
- Authenticated File Download: Users must be able to download any attached file with its correct original filename.
- Document Editing: The owner or an admin must be able to update title, category, and description.
- Document Deletion: The owner or an admin must be able to delete a document record, automatically deleting database entries and physical files.
- Company Directory: Administrators must have a dedicated screen to review all documents, filter by individual employee, and see company-wide metrics.

### 2.4 Non-Functional Requirements
- Security: Passwords must be encrypted using cryptographic hashing. API routes must verify JWT tokens.
- Performance: API response time for document listings should remain under 300 milliseconds.
- Reliability: File data must persist permanently on cloud storage and survive container restarts.
- Usability: The user interface must be clean, mobile-responsive, easy to understand, and require minimal training.
- Portability: The system must run identically across Windows, macOS, Linux, and modern web browsers (Chrome, Edge, Safari, Firefox).

### 2.5 System Specifications

**Hardware Specifications (Minimum Development & Production Requirements):**
- Processor: Dual-Core 2.0 GHz or higher (Intel, AMD, or Apple Silicon).
- Memory (RAM): Minimum 4 GB (8 GB recommended for development).
- Storage: 500 MB free space for code and node_modules; scalable cloud storage on MongoDB Atlas.
- Network: Active broadband Internet connection for cloud database synchronization and deployment.

**Software Specifications:**
- Operating System: macOS, Windows 10/11, or Ubuntu Linux.
- Runtime Environment: Node.js version 18.x or version 20.x LTS.
- Package Manager: npm (Node Package Manager) version 9.x or higher.
- Database: MongoDB version 6.0+ (MongoDB Atlas cloud cluster).
- Development Tools: Visual Studio Code, Git, Postman / Thunder Client.
- Supported Browsers: Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge.

---

## Chapter 3: System Architecture and Technology Stack

### 3.1 Three-Tier Decoupled Architecture
DocuVault follows the industry-standard Three-Tier Decoupled Web Architecture:

```text
[ CLIENT TIER ]
React 18 + Vite SPA
Hosted on Vercel
(Handles UI, Routing, JWT Storage, File Selection, In-Browser Previews)
       |
       | HTTPS REST API Requests (JSON / Multipart Form-Data with JWT Bearer Token)
       v
[ APPLICATION TIER ]
Express.js on Node.js
Hosted on Render
(Authentication Middleware, Multer Engine, Ownership Enforcement, Controller Logic)
       |
       | Mongoose ODM Binary Protocols
       v
[ DATA TIER ]
MongoDB Atlas Cloud Database
(Stores User Accounts, Document Metadata, File Paths, and Persistent Binary Buffers)
```

1. Client Tier (Frontend): Built with React 18 and Vite. It is hosted on Vercel's global CDN. It handles visual rendering, form state, input validation, and authenticated blob downloads.
2. Application Tier (Backend): Built with Node.js and Express.js. It is deployed as a Web Service on Render. It processes incoming HTTP requests, validates permissions, processes multipart uploads, and communicates with the database.
3. Data Tier (Database): Hosted on MongoDB Atlas. It stores documents in JSON-like BSON format, providing automated backups, high availability, and secure cloud persistence.

### 3.2 Technology Stack Justification

**React (Vite):**  
React was selected for its component-based architecture and fast virtual DOM. Using Vite as the build tool provides near-instantaneous development server starts and optimized production builds.

**Node.js & Express.js:**  
Node.js offers an asynchronous, event-driven, non-blocking I/O model. This makes it ideal for handling file upload streams and concurrent web requests without freezing system resources. Express provides minimalist and flexible web application routing.

**MongoDB Atlas & Mongoose:**  
Unlike rigid SQL databases that require complex table migrations whenever file metadata changes, MongoDB's document-oriented model allows storing an array of file subdocuments directly inside the parent document record. Mongoose adds schema validation and type checking.

**Multer:**  
Multer is the official Express middleware for handling `multipart/form-data`. It streams incoming files from web forms directly into controlled storage while filtering unauthorized file formats.

**JSON Web Tokens (JWT) & Bcrypt:**  
JWT allows stateless authentication. The server does not need to maintain server-side session memory, making the API easily scalable. Bcrypt provides industry-standard password protection using one-way salt hashing.

### 3.3 End-to-End Request Lifecycle
1. User interacts with the React interface (e.g. clicking Upload Document).
2. The frontend creates a `FormData` object containing fields and file binaries.
3. Axios attaches the user's JWT token to the `Authorization: Bearer <token>` header.
4. The request arrives at the Express backend on Render.
5. The `auth.middleware.js` verifies the JWT token signature and populates `req.user`.
6. Multer processes the file stream, checks file extensions, and writes files to the disk.
7. The `document.controller.js` reads file data into memory buffers and creates a document entry in MongoDB Atlas.
8. The server responds with `201 Created` and clean document metadata.
9. React receives the confirmation and updates the user's dashboard view immediately.

---

## Chapter 4: Database Design and Schema Modeling

### 4.1 Database Selection
DocuVault utilizes MongoDB Atlas, a fully managed cloud database. MongoDB stores data in flexible BSON (Binary JSON) documents. This structure perfectly fits document management, where a single document submission can contain varying numbers of file attachments with distinct names, sizes, and formats.

### 4.2 User Schema (`server/src/models/User.js`)
The User schema manages all user accounts and access roles.

Detailed Field Specifications:
- `_id`: Unique identifier automatically assigned by MongoDB (BSON ObjectId).
- `name`: String, required, trimmed. Represents the user's full legal name.
- `email`: String, required, unique, lowercase, trimmed. Used as the primary login credential.
- `password`: String, required, minimum length 6 characters. Configured with `select: false` so that user queries never expose the password hash.
- `role`: String, required, enum: `['employee', 'admin']`, default value `'employee'`. Controls system permissions.
- `department`: String, optional, default value `'General'`. Identifies the user's organizational unit.
- `createdAt`: Date, default `Date.now`. Records account creation time.

### 4.3 Document Schema (`server/src/models/Document.js`)
The Document schema stores all records, category tags, ownership links, and file metadata.

Detailed Field Specifications:
- `_id`: Unique identifier (BSON ObjectId).
- `title`: String, required, trimmed, maximum length 120 characters.
- `description`: String, optional, trimmed, maximum length 500 characters.
- `category`: String, required, enum: `['ID Proof', 'Certificate', 'Other']`.
- `files`: Array of embedded `fileItemSchema` subdocuments containing individual file metadata and data buffers.
- `filePaths`: Array of Strings, required. Stores relative file paths (e.g. `uploads/filename.pdf`), satisfying assignment compliance.
- `uploadedBy`: ObjectId referencing the `User` collection, required. Establishes document ownership.
- `uploadDate`: Date, default `Date.now`. Records the submission timestamp.

### 4.4 Embedded File Metadata Schema (`fileItemSchema`)
Each document contains a sub-array of file records defined by `fileItemSchema`:
- `fileName`: String, required. Generated unique name on server disk.
- `originalName`: String, required. Original name of the file on user's computer, stored in clean UTF-8 encoding.
- `filePath`: String, required. Relative storage path on server disk.
- `mimeType`: String, required. Standard MIME type (e.g. `application/pdf`, `image/png`).
- `size`: Number, required. Size of the file in bytes.
- `fileData`: Buffer, optional. Persistent binary data stored directly inside MongoDB Atlas for cloud survival.

### 4.5 Indexing Strategy for Fast Queries
To ensure optimal performance even with thousands of documents, two compound indexes are defined in `Document.js`:
1. `documentSchema.index({ category: 1, uploadDate: -1 })`: Speeds up category filtering and sorts newest files first.
2. `documentSchema.index({ uploadedBy: 1, uploadDate: -1 })`: Ensures that an employee's dashboard loads instantly by querying indexed user ownership keys.

---

## Chapter 5: Core System Modules and Implementation

### 5.1 Module 1: User Authentication and Role-Based Access Control
Security begins with user identity. The authentication module consists of:
- Registration: Accepts user details, checks for duplicate email addresses, hashes the password with 10 salt rounds of `bcrypt.hash`, and saves the record.
- Login: Verifies the email exists, compares plain password with stored hash using `bcrypt.compare`, and issues a signed JWT token containing user ID and role.
- Token Protection (`protect` middleware): Intercepts incoming requests, validates token signature against `process.env.JWT_SECRET`, and attaches the verified user record to `req.user`.
- Role Authorization (`authorize` middleware): Blocks non-administrative users from accessing company-wide audit endpoints.

### 5.2 Module 2: Multi-File Ingestion Engine via Multer
Handling file uploads requires strict boundary controls:
- File Storage Strategy: Multer uses disk storage pointing to the `uploads/` directory.
- Sanitized Filenames: Filenames are generated using the pattern `${Date.now()}-${random}-${sanitizedName}` to prevent naming collisions and prevent directory traversal attacks.
- Format Filtering: A regex filter checks both file extensions and incoming MIME types:
  Allowed extensions: `.pdf`, `.doc`, `.docx`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.txt`.
  Any file with an unapproved extension (such as `.exe`, `.sh`, `.js`) is rejected with a `400 Bad Request` error before it touches the server disk.
- Upload Limits: The middleware enforces a maximum file size of 15 MB per file and a limit of 10 files per upload batch.

### 5.3 Module 3: Ownership-Based Authorization Logic
To prevent Insecure Direct Object Reference (IDOR) attacks, the controller implements a central helper function:

```javascript
const canAccess = (doc, user) => {
  const isOwner = doc.uploadedBy && 
    (doc.uploadedBy._id || doc.uploadedBy).toString() === user._id.toString();
  return isOwner || user.role === 'admin';
};
```

Whenever a user requests to view, download, update, or delete a document by ID:
1. The server loads the document.
2. The server compares the document's `uploadedBy` property with the logged-in user's ID.
3. If the user is neither the owner nor an administrator, the server immediately terminates the request with `403 Forbidden` and the message: "Access denied. You do not have permission to access this file."

### 5.4 Module 4: Dynamic Search and Category Indexing
Users must be able to locate files quickly without manual scrolling:
- Category Filtering: The backend checks `req.query.category`. If specified and not 'All', it adds `{ category: req.query.category }` to the MongoDB query.
- Keyword Search: The backend checks `req.query.search`. It performs a case-insensitive MongoDB `$or` regex match across both document title and description:
```javascript
if (req.query.search) {
  queryObj.$or = [
    { title: { $regex: req.query.search, $options: 'i' } },
    { description: { $regex: req.query.search, $options: 'i' } }
  ];
}
```
- User Segregation: For standard employees, the query automatically appends `{ uploadedBy: req.user._id }`, guaranteeing that users only see their own search results.

### 5.5 Module 5: Hybrid Cloud Persistence (Overcoming Ephemeral Storage)
One of the most significant engineering challenges solved in this project was hosting on Render's free tier. 

**The Challenge:**  
Render containers use temporary disk storage. Whenever code is pushed to GitHub or the server sleeps and restarts, Render destroys the old container and creates a fresh one. The local `uploads/` folder is wiped clean. Although MongoDB Atlas remembered the document title, clicking preview returned: `"File does not exist on disk"`.

**The Solution:**  
We engineered a hybrid persistence mechanism:
1. Upload Phase: When Multer writes files to disk, the controller simultaneously reads the file data into a buffer (`fs.readFileSync(file.path)`) and saves it inside the MongoDB document as `fileData: Buffer`.
2. Bandwidth Optimization: To keep normal page loads fast, `getDocuments`, `getDocumentById`, and `uploadDocument` explicitly exclude the binary buffers using `.select('-files.fileData')`.
3. Resilient Serving (`getFile`):
   - The server first checks if the physical file exists on local disk.
   - If present, it serves it directly from disk.
   - If absent (because Render wiped the disk), the server automatically retrieves `targetFile.fileData` from MongoDB Atlas, streams the binary data to the user with correct headers (`Content-Type`, `Content-Disposition`), and restores the file back into the local disk cache.

This hybrid approach guarantees 100% compliance with Multer file paths while ensuring that files are never lost.

### 5.6 Module 6: In-Browser Document Previewer and Downloader
Instead of forcing users to download files to see what they contain:
- The frontend makes an authenticated Axios request to `/api/documents/:id/files/:fileId` with `responseType: 'blob'`.
- The frontend creates a local object URL using `URL.createObjectURL(blob)`.
- Image files (`.png`, `.jpg`, `.webp`) are displayed directly inside a modal dialog.
- PDF documents (`.pdf`) are embedded inside an interactive viewer frame.
- Clicking the Download button invokes the endpoint with `?download=true`, setting `Content-Disposition: attachment` so the browser saves the file with its original name.

### 5.7 Module 7: Administrative Company Audit Directory
Administrators need high-level visibility:
- The Admin Dashboard queries `GET /api/documents` without user ID restrictions, presenting an organization-wide view.
- Admins can filter all documents by specific employee using an employee dropdown.
- Real-time statistics display total company documents, recent submissions, and category distribution counts.

---

## Chapter 6: RESTful API Reference and Specifications

### 6.1 Authentication Endpoints (`/api/auth`)

1. Register User
- Method: `POST`
- Route: `/api/auth/register`
- Access: Public
- Request Body: JSON with `name`, `email`, `password`, `role` (optional), `department` (optional)
- Success Response: `201 Created` with JWT token and user profile object.

2. User Login
- Method: `POST`
- Route: `/api/auth/login`
- Access: Public
- Request Body: JSON with `email` and `password`
- Success Response: `200 OK` with JWT token and user profile object.

3. Get Current User Profile
- Method: `GET`
- Route: `/api/auth/me`
- Access: Authenticated (Bearer Token required)
- Success Response: `200 OK` with current user details.

### 6.2 Document Management Endpoints (`/api/documents`)

1. Upload Document with Files
- Method: `POST`
- Route: `/api/documents`
- Access: Authenticated (Employee or Admin)
- Request Type: `multipart/form-data`
- Parameters: `title` (text), `category` (text), `description` (text), `files` (up to 10 binary files)
- Success Response: `201 Created` with created document object.

2. Get Documents List
- Method: `GET`
- Route: `/api/documents`
- Access: Authenticated
- Optional Query Parameters:
  - `category`: Filters by category name (e.g. `?category=Certificate`)
  - `search`: Searches title and description (e.g. `?search=passport`)
  - `employeeId`: (Admin only) Filters records uploaded by a specific user ID
- Success Response: `200 OK` with array of document records.

3. Get Single Document Details
- Method: `GET`
- Route: `/api/documents/:id`
- Access: Owner or Admin
- Parameters: Document ObjectId in URL path
- Success Response: `200 OK` with single document metadata and attached files list.

4. Update Document Metadata
- Method: `PUT`
- Route: `/api/documents/:id`
- Access: Owner or Admin
- Request Body: JSON with updated `title`, `category`, and/or `description`
- Success Response: `200 OK` with updated document record.

5. Delete Document
- Method: `DELETE`
- Route: `/api/documents/:id`
- Access: Owner or Admin
- Parameters: Document ObjectId in URL path
- Success Response: `200 OK` with deletion confirmation message.

6. Stream or Download File
- Method: `GET`
- Route: `/api/documents/:id/files/:fileId`
- Access: Owner or Admin
- Optional Query: `?download=true`
- Behavior: Streams binary file data. If download is true, sets attachment disposition.

7. Get Platform Statistics
- Method: `GET`
- Route: `/api/documents/metrics/stats`
- Access: Authenticated
- Success Response: `200 OK` with total counts and breakdown by category.

---

## Chapter 7: Frontend User Interface and User Flow

### 7.1 Design Principles and Layout Structure
The frontend of DocuVault is crafted to be clean, professional, and accessible:
- Focused Color Palette: Deep slate navigation header, clean white content cards, subtle neutral borders, and high-contrast category badges.
- Visual Feedback: Clear loading spinners on async operations, informative empty-state placeholders when no documents exist, and error alerts when an action fails.
- Mobile Ergonomics: Fully responsive layouts that adapt from wide desktop monitors to mobile smartphone screens.

### 7.2 Key User Interface Screens

1. Welcome and Authentication Screens:
- Login page featuring clean email/password inputs with instant validation.
- Register page allowing users to create accounts with designated roles and departments.

2. Employee Dashboard (`Dashboard.jsx`):
- Top statistics overview showing total uploaded documents and recent uploads.
- Category folder shortcuts allowing one-click filtering.
- Interactive search input with live debounced filtering.
- Responsive document cards displaying titles, upload dates, file count badges, and quick action buttons (View, Download, Delete).

3. Upload Modal / Screen (`UploadDocument.jsx`):
- Drag-and-drop file ingestion zone supporting multi-file selection.
- Live file queue showing selected file names, sizes, and file type badges before uploading.
- Title and category dropdown inputs with required field indicators.

4. Document Details and Preview Screen (`DocumentDetails.jsx`):
- Comprehensive metadata panel displaying title, category, description, and upload timestamp.
- List of individual attached files with file size and format labels.
- Live interactive preview modal displaying images and embedded PDF viewers.
- Single-click download buttons triggering authenticated file downloads.

5. Administrator Audit Dashboard (`AdminDashboard.jsx`):
- Executive company overview displaying all employee submissions across departments.
- Employee filter dropdown allowing compliance officers to audit one employee's complete records.
- Category breakdown metrics displaying organizational compliance distribution.

---

## Chapter 8: Security, Validation, and Exception Handling

### 8.1 Password Hashing with Bcrypt
Passwords are never stored in plain text. When a user registers or changes passwords, the backend uses `bcryptjs` to generate a random 10-round salt and produce an irreversible cryptographic hash. During login, `bcrypt.compare` verifies credentials without ever decrypting or exposing the original password.

### 8.2 Stateless JSON Web Tokens
Upon successful authentication, the server signs a JWT payload containing the user's ID and role using HMAC-SHA256 and an environment-stored secret key (`JWT_SECRET`). Tokens expire automatically after 7 days (`JWT_EXPIRE=7d`), minimizing the window of vulnerability if a token is ever intercepted.

### 8.3 File Extension and MIME Type Whitelisting
To prevent malicious code execution (such as uploading executable scripts or PHP shells), the Multer middleware implements dual-layer verification:
1. Extension Check: Checks filename extension against allowed list (`pdf`, `doc`, `docx`, `png`, `jpg`, `jpeg`, `webp`, `txt`).
2. MIME Type Check: Checks browser-provided MIME headers against authorized types (`application/pdf`, `image/jpeg`, `image/png`, etc.).
Files failing either test are rejected immediately.

### 8.4 Cross-Origin Resource Sharing (CORS) Security
The backend restricts API access using the `cors` package. In production, only trusted origins (such as the Vercel frontend URL) are permitted to make cross-origin requests. Trailing slashes and whitespace are automatically sanitized to prevent configuration mismatch errors.

### 8.5 Centralized Error Handling Middleware
All errors pass through a centralized error handler (`error.middleware.js`):
- Mongoose CastError (invalid ObjectId format) returns a clean `404 Not Found`.
- Duplicate Key Error (code 11000, such as attempting to register an existing email) returns a user-friendly `400 Bad Request` ("Email is already registered").
- Multer `LIMIT_FILE_SIZE` returns `400 Bad Request` ("File size cannot exceed 15MB").
- Internal unexpected errors return a generic message in production to prevent leaking server directory paths or stack traces.

---

## Chapter 9: Cloud Deployment and DevOps Setup

### 9.1 Frontend Deployment on Vercel
- Platform: Vercel Global Edge Network.
- Build Framework: Vite production bundle (`npm run build`).
- Output Directory: `dist`.
- Single Page Application (SPA) Routing: Configured via `client/vercel.json` with rewrite rules pointing all client routes to `/index.html`, eliminating 404 errors when refreshing inner pages.

### 9.2 Backend Deployment on Render
- Platform: Render Web Services.
- Environment: Node.js Runtime.
- Build Command: `npm install`.
- Start Command: `node server.js`.
- Health Check: Integrated at `/api/health` returning `{"status": "ok"}` for automated uptime monitoring.
- Root Welcome Status: Integrated at `/` and `/api` returning `200 OK` status and API documentation links.

### 9.3 Database Cluster on MongoDB Atlas
- Tier: M0 Shared Cloud Cluster.
- Security: TLS/SSL encrypted connections, IP Access List configured for cloud access, and dedicated database credentials with least-privilege permissions.

### 9.4 Verified Production Links
- Live Client Website: https://docuvault-portal.vercel.app
- Live REST API Server: https://docuvault-backend-fg1q.onrender.com
- API Health Status: https://docuvault-backend-fg1q.onrender.com/api/health
- GitHub Repository: https://github.com/Ankitraj-17/BACKEND-MAIN-PROJECT

---

## Chapter 10: Quality Assurance, Verification, and Test Matrix

### 10.1 Testing Strategy
The platform was validated through end-to-end functional testing, boundary condition verification, and negative test cases.

### 10.2 Comprehensive Test Cases Table

Test 1: User Registration
- Scenario: New user signs up with valid name, email, and password.
- Expected Output: User record created in MongoDB, HTTP 201 response, JWT token returned.
- Actual Output: User registered successfully, redirected to dashboard.
- Status: Passed.

Test 2: Duplicate Email Registration
- Scenario: Attempting to register with an email that already exists.
- Expected Output: HTTP 400 Bad Request with "Email is already registered" message.
- Actual Output: Error caught and displayed to user.
- Status: Passed.

Test 3: Login with Incorrect Password
- Scenario: Entering correct email with wrong password.
- Expected Output: HTTP 401 Unauthorized with "Invalid credentials" message.
- Actual Output: Access denied, password hash protected.
- Status: Passed.

Test 4: Multi-File Document Upload
- Scenario: User uploads document with title, category "Certificate", and 3 PDF files.
- Expected Output: HTTP 201 Created, files saved on disk and cloud database.
- Actual Output: Document created with 3 file records displayed on dashboard.
- Status: Passed.

Test 5: Exceeding File Size Limit
- Scenario: Attempting to upload a file larger than 15 MB.
- Expected Output: Multer rejects file with HTTP 400 size limit error.
- Actual Output: Upload halted, error notification displayed.
- Status: Passed.

Test 6: Disallowed File Format Upload
- Scenario: Attempting to upload an executable binary (.exe).
- Expected Output: File filter halts request with "Invalid file type" error.
- Actual Output: File rejected immediately.
- Status: Passed.

Test 7: Standard Employee Document Access
- Scenario: Employee requests list of documents.
- Expected Output: Returns only documents uploaded by that specific employee.
- Actual Output: Strict data isolation confirmed.
- Status: Passed.

Test 8: Unauthorized Document Access (IDOR Prevention)
- Scenario: Employee A tries to view or delete a document owned by Employee B.
- Expected Output: HTTP 403 Forbidden with "Access denied" message.
- Actual Output: Request blocked immediately.
- Status: Passed.

Test 9: Administrator Organization-Wide Access
- Scenario: Administrator opens Admin Dashboard.
- Expected Output: Displays documents uploaded by all employees across the organization.
- Actual Output: Full audit directory loaded with employee filter controls.
- Status: Passed.

Test 10: Live Document Keyword Search
- Scenario: User searches for keyword "passport" in search bar.
- Expected Output: Filters documents where title or description contains "passport".
- Actual Output: Instant filtered results displayed.
- Status: Passed.

Test 11: In-Browser PDF and Image Preview
- Scenario: User clicks Preview on uploaded PDF and PNG files.
- Expected Output: Modal opens and displays file contents without forced download.
- Actual Output: PDF embedded cleanly; image rendered sharply.
- Status: Passed.

Test 12: Ephemeral Cloud Storage Resilience
- Scenario: Server container restarts on Render, wiping local disk folder; user clicks Preview.
- Expected Output: Server fetches file buffer from MongoDB Atlas and streams successfully.
- Actual Output: File opens seamlessly with 200 OK status.
- Status: Passed.

---

## Chapter 11: Installation and Local Execution Guide

### 11.1 Prerequisites
- Node.js version 18.x or version 20.x installed.
- Git installed on your system.
- An active MongoDB connection string (local instance or free MongoDB Atlas URI).

### 11.2 Backend Server Configuration
1. Clone the repository:
   git clone https://github.com/Ankitraj-17/BACKEND-MAIN-PROJECT.git
   cd BACKEND-MAIN-PROJECT/server

2. Install dependencies:
   npm install

3. Configure environment variables in `server/.env`:
   PORT=5001
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   UPLOAD_PATH=uploads
   CLIENT_URL=http://localhost:5173

4. Start the backend server:
   npm run dev
   The server will start on port 5001 with database connection established.

### 11.3 Frontend Client Configuration
1. Open a new terminal window and navigate to the client folder:
   cd BACKEND-MAIN-PROJECT/client

2. Install dependencies:
   npm install

3. Start the client development server:
   npm run dev

4. Open your browser and navigate to:
   http://localhost:5173

---

## Chapter 12: Conclusion and Future Roadmap

### 12.1 Project Summary and Achievements
The DocuVault project has successfully met all academic and industry requirements:
- Implemented a complete MERN stack architecture with clean separation of concerns.
- Created robust multi-file uploads adhering to Multer specifications.
- Established bulletproof ownership rules that protect sensitive employee documentation.
- Solved cloud container ephemeral disk loss using an innovative hybrid MongoDB buffer architecture.
- Delivered an intuitive, responsive user experience complete with in-browser previews and instant search.

### 12.2 Lessons Learned
- Handling binary data streams and multipart form data requires careful attention to character encoding and temporary disk buffers.
- Deploying on serverless and ephemeral container platforms demands database-backed persistence strategies rather than relying on local machine storage.
- Proper schema indexing is essential for ensuring that search queries remain fast as document volumes expand.

### 12.3 Future Roadmap
While DocuVault is fully functional and production-ready, future iterations can introduce:
1. Optical Character Recognition (OCR): Utilizing Tesseract.js to automatically read, extract, and index text from scanned documents and images.
2. Document Version Control: Enabling users to upload updated revisions of a document while preserving a historical record of prior versions.
3. Pre-Signed Cloud Storage URLs: Integrating direct-to-cloud upload pipelines using Amazon Web Services (AWS S3) or Google Cloud Storage for large-scale enterprise deployments.
4. Two-Factor Authentication (2FA): Adding Time-based One-Time Passwords (TOTP) to provide extra login security for administrative accounts.

---

## References and Technical Bibliography

1. Node.js Official Documentation: https://nodejs.org/docs/
2. Express.js API Reference: https://expressjs.com/
3. MongoDB & Mongoose Manual: https://mongoosejs.com/docs/
4. React 18 Documentation: https://react.dev/
5. Multer Middleware Repository: https://github.com/expressjs/multer
6. JSON Web Token RFC 7519 Specification: https://tools.ietf.org/html/rfc7519
7. OWASP Top 10 Security Risks (Insecure Direct Object Reference): https://owasp.org/
8. Vercel Deployment Documentation: https://vercel.com/docs
9. Render Cloud Hosting Documentation: https://render.com/docs

---

*End of Project Report.*

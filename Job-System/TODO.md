# Integration TODO

## Backend Updates Needed:

### 1. Update User Model Roles
- Change roles from `["jobseeker", "employer", "admin"]` to `["user", "company", "admin"]` to match frontend

### 2. Update Job Model
- Add: experience, employmentType, remote, postedAt, isPremium, companyLogo fields

### 3. Add More Job Routes
- GET /api/jobs/:id - Get single job
- PUT /api/jobs/:id - Update job
- DELETE /api/jobs/:id - Delete job

### 4. Add Application Routes
- GET /api/applications - Get all applications
- POST /api/applications - Create application

## Frontend Updates Needed:

### 1. Create API Service
- Create src/services/api.js for API calls

### 2. Update Jobs.jsx
- Fetch from API instead of mock data

### 3. Update Login.jsx
- Match backend API response format

### 4. Update Register.jsx
- Match backend API and roles

### 5. Update ProtectedRoute.jsx
- Match backend role system

### 6. Update Dashboard pages
- Fetch real data from backend

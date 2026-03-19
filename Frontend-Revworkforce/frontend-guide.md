# 📘 RevWorkforce — Frontend API Guide

**Base URL:** `http://localhost:8080`  
**Auth Type:** JWT Bearer Token  
**Token Validity:** 24 hours

---

## 🔐 1. Authentication

### How Token-Based Auth Works

```
1. User logs in → POST /auth/login
2. Server returns a JWT token + role
3. Frontend stores token in localStorage
4. Every subsequent API call must include:
   Authorization: Bearer <token>
```

---

### 1.1 Login

> No token required for this endpoint.

**`POST /auth/login`**

#### cURL
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tanu@gmail.com",
    "password": "yourpassword"
  }'
```

#### ✅ Success Response `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "name": "Tanu Sharma",
  "email": "tanu@gmail.com",
  "role": "ROLE_EMPLOYEE"
}
```

#### ❌ Error Response `401 Unauthorized`
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Bad credentials"
}
```

#### 💡 Frontend: Store token and route by role
```javascript
// After login
const { token, role, name, email } = response.data;
localStorage.setItem('token', token);
localStorage.setItem('role', role);
localStorage.setItem('userName', name);

// Route based on role
if (role === 'ROLE_ADMIN')    navigate('/admin/dashboard');
if (role === 'ROLE_MANAGER')  navigate('/manager/dashboard');
if (role === 'ROLE_EMPLOYEE') navigate('/employee/dashboard');
```

#### 💡 Frontend: Attach token to every API call (Axios interceptor)
```javascript
// axiosConfig.js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.clear();
      window.location.href = '/login';  // Redirect to login on token expiry
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 👥 2. Roles Overview

| Role | Value in JWT | Who they are |
|------|-------------|-------------|
| Admin | `ROLE_ADMIN` | Full access — manage everything |
| Manager | `ROLE_MANAGER` | Manage team, approve/reject leaves, review performance |
| Employee | `ROLE_EMPLOYEE` | View own data, apply leaves, submit performance goals |

---

## 👤 3. User APIs (`/api/users`)

> All endpoints require a valid Bearer token.

### 3.1 Get All Users — **ADMIN only**

**`GET /api/users`**

```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

#### ✅ Response `200 OK`
```json
[
  {
    "id": 1,
    "firstName": "Rahul",
    "lastName": "Sharma",
    "email": "rahul@gmail.com",
    "department": { "id": 1, "name": "Engineering" },
    "designation": { "id": 1, "name": "Software Engineer" }
  }
]
```

---

### 3.2 Get My Profile — **EMPLOYEE only**

**`GET /api/users/me`**

```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer <EMPLOYEE_TOKEN>"
```

#### ✅ Response `200 OK`
```json
{
  "id": 5,
  "firstName": "Tanu",
  "lastName": "Singh",
  "email": "tanu@gmail.com",
  "department": { "id": 2, "name": "HR" },
  "designation": { "id": 3, "name": "HR Executive" }
}
```

---

### 3.3 Get My Team — **MANAGER only**

**`GET /api/users/my-team`**

```bash
curl -X GET http://localhost:8080/api/users/my-team \
  -H "Authorization: Bearer <MANAGER_TOKEN>"
```

#### ✅ Response `200 OK`
```json
[
  { "id": 5, "firstName": "Tanu", "lastName": "Singh", "email": "tanu@gmail.com" },
  { "id": 6, "firstName": "Amit", "lastName": "Kumar", "email": "amit@gmail.com" }
]
```

---

### 3.4 Create User — **ADMIN only**

**`POST /api/users?managerId=2`**

```bash
curl -X POST "http://localhost:8080/api/users?managerId=2" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Priya",
    "lastName": "Verma",
    "email": "priya@gmail.com",
    "password": "pass123"
  }'
```

#### ✅ Response `200 OK`
```json
{
  "id": 10,
  "firstName": "Priya",
  "lastName": "Verma",
  "email": "priya@gmail.com"
}
```

---

### 3.5 Update User — **ADMIN / MANAGER / EMPLOYEE**

> - ADMIN → can update anyone  
> - MANAGER → can update only their reportees  
> - EMPLOYEE → can update only own profile

**`PUT /api/users/{id}`**

```bash
curl -X PUT http://localhost:8080/api/users/5 \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Tanu",
    "lastName": "Sharma",
    "email": "tanu@gmail.com"
  }'
```

---

### 3.6 Delete User — **ADMIN only**

**`DELETE /api/users/{id}`**

```bash
curl -X DELETE http://localhost:8080/api/users/10 \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

#### ✅ Response `200 OK`
```
User deleted successfully
```

---

### 3.7 Assign Manager — **MANAGER only**

**`PUT /api/users/{userId}/assign-manager`**

Manager assigns themselves as the manager of a user.

```bash
curl -X PUT http://localhost:8080/api/users/5/assign-manager \
  -H "Authorization: Bearer <MANAGER_TOKEN>"
```

---

## 🏖️ 4. Leave APIs (`/api/leaves`)

### Role-to-Endpoint Map

| Action | Endpoint | Role |
|--------|----------|------|
| Apply leave | `POST /api/leaves` | EMPLOYEE |
| My leaves (JWT-based) | `GET /api/leaves/my` | EMPLOYEE |
| My leaves (legacy) | `GET /api/leaves/report` | EMPLOYEE |
| Leaves by employee ID | `GET /api/leaves/employee/{id}` | ADMIN / MANAGER |
| Pending leaves (manager) | `GET /api/leaves/pending?managerId=` | MANAGER |
| Team leaves | `GET /api/leaves/team?managerId=` | MANAGER |
| All leaves | `GET /api/leaves/all` | ADMIN |
| Approve leave | `PUT /api/leaves/{id}/approve?managerId=` | MANAGER |
| Reject leave | `PUT /api/leaves/{id}/reject?comment=` | MANAGER |
| Cancel leave | `PUT /api/leaves/{id}/cancel` | EMPLOYEE |

---

### 4.1 Apply Leave — **EMPLOYEE**

**`POST /api/leaves`**

```bash
curl -X POST http://localhost:8080/api/leaves \
  -H "Authorization: Bearer <EMPLOYEE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "leaveTypeId": 1,
    "startDate": "2026-03-01",
    "endDate": "2026-03-03",
    "reason": "Fever and rest"
  }'
```

#### ✅ Response `200 OK`
```json
{
  "id": 12,
  "employeeName": "Tanu Singh",
  "managerName": "Priya Verma",
  "leaveType": "Sick Leave",
  "status": "PENDING",
  "startDate": "2026-03-01",
  "endDate": "2026-03-03",
  "reason": "Fever and rest"
}
```

#### ❌ Insufficient Balance
```json
{
  "status": 500,
  "message": "Insufficient leave balance. You have 2 days left for Sick Leave"
}
```

---

### 4.2 Get My Leaves (JWT Auth) — **EMPLOYEE**

**`GET /api/leaves/my`**

```bash
curl -X GET http://localhost:8080/api/leaves/my \
  -H "Authorization: Bearer <EMPLOYEE_TOKEN>"
```

#### ✅ Response `200 OK`
```json
[
  {
    "id": 12,
    "employeeName": "Tanu Singh",
    "managerName": "Priya Verma",
    "leaveType": "Sick Leave",
    "status": "PENDING",
    "startDate": "2026-03-01",
    "endDate": "2026-03-03",
    "reason": "Fever and rest"
  },
  {
    "id": 8,
    "employeeName": "Tanu Singh",
    "managerName": "Priya Verma",
    "leaveType": "Casual Leave",
    "status": "APPROVED",
    "startDate": "2026-02-10",
    "endDate": "2026-02-11",
    "reason": "Family function"
  }
]
```

---

### 4.3 Get Leaves by Employee ID — **ADMIN / MANAGER**

**`GET /api/leaves/employee/{employeeId}`**

```bash
curl -X GET http://localhost:8080/api/leaves/employee/5 \
  -H "Authorization: Bearer <ADMIN_OR_MANAGER_TOKEN>"
```

#### ✅ Response — same shape as 4.2 above

---

### 4.4 Get Pending Leaves — **MANAGER**

**`GET /api/leaves/pending?managerId={id}`**

```bash
curl -X GET "http://localhost:8080/api/leaves/pending?managerId=3" \
  -H "Authorization: Bearer <MANAGER_TOKEN>"
```

---

### 4.5 Approve Leave — **MANAGER**

**`PUT /api/leaves/{leaveId}/approve?managerId={id}`**

```bash
curl -X PUT "http://localhost:8080/api/leaves/12/approve?managerId=3" \
  -H "Authorization: Bearer <MANAGER_TOKEN>"
```

#### ✅ Response `200 OK`
```json
{
  "id": 12,
  "employeeName": "Tanu Singh",
  "status": "APPROVED",
  ...
}
```

#### ❌ Not Authorized (wrong manager)
```json
{ "message": "You are not authorized to approve this leave" }
```

---

### 4.6 Reject Leave — **MANAGER**

**`PUT /api/leaves/{leaveId}/reject?comment={reason}`**

```bash
curl -X PUT "http://localhost:8080/api/leaves/12/reject?comment=Insufficient%20team%20coverage" \
  -H "Authorization: Bearer <MANAGER_TOKEN>"
```

#### ✅ Response `200 OK`
```json
{
  "id": 12,
  "status": "REJECTED",
  ...
}
```

---

### 4.7 Cancel Leave — **EMPLOYEE**

**`PUT /api/leaves/{leaveId}/cancel`**

```bash
curl -X PUT http://localhost:8080/api/leaves/12/cancel \
  -H "Authorization: Bearer <EMPLOYEE_TOKEN>"
```

---

### 4.8 Get All Leaves — **ADMIN**

**`GET /api/leaves/all`**

```bash
curl -X GET http://localhost:8080/api/leaves/all \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## 📊 5. Performance APIs (`/api/performance`)

### 5.1 Submit Performance Goal — **EMPLOYEE**

**`POST /api/performance`**

```bash
curl -X POST http://localhost:8080/api/performance \
  -H "Authorization: Bearer <EMPLOYEE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": 5,
    "managerId": 3,
    "goal": "Complete 3 microservices by Q2",
    "startDate": "2026-03-01",
    "endDate": "2026-06-30"
  }'
```

#### ✅ Response `200 OK`
```json
{
  "id": 7,
  "employeeId": 5,
  "managerId": 3,
  "goal": "Complete 3 microservices by Q2",
  "status": "PENDING",
  "feedback": null,
  "rating": null,
  "startDate": "2026-03-01",
  "endDate": "2026-06-30"
}
```

---

### 5.2 Get Pending Reviews — **MANAGER**

**`GET /api/performance/pending?managerId={id}`**

```bash
curl -X GET "http://localhost:8080/api/performance/pending?managerId=3" \
  -H "Authorization: Bearer <MANAGER_TOKEN>"
```

---

### 5.3 Review Performance — **MANAGER**

**`PUT /api/performance/{id}/review`**

```bash
curl -X PUT http://localhost:8080/api/performance/7/review \
  -H "Authorization: Bearer <MANAGER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": "Excellent work! Delivered ahead of schedule.",
    "rating": 5
  }'
```

#### ✅ Response `200 OK`
```json
{
  "id": 7,
  "status": "REVIEWED",
  "feedback": "Excellent work! Delivered ahead of schedule.",
  "rating": 5
}
```

---

### 5.4 My Performance History — **EMPLOYEE**

**`GET /api/performance/my?employeeId={id}`**

```bash
curl -X GET "http://localhost:8080/api/performance/my?employeeId=5" \
  -H "Authorization: Bearer <EMPLOYEE_TOKEN>"
```

---

## 🏢 6. Department APIs (`/api/departments`)

### 6.1 Create Department — **ADMIN**

```bash
curl -X POST http://localhost:8080/api/departments \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Engineering" }'
```

#### ✅ Response
```json
{ "id": 1, "name": "Engineering" }
```

### 6.2 Get All Departments — **All roles**

```bash
curl -X GET http://localhost:8080/api/departments \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 🪪 7. Designation APIs (`/api/designations`)

### 7.1 Create Designation — **ADMIN**

```bash
curl -X POST http://localhost:8080/api/designations \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Software Engineer" }'
```

### 7.2 Get All Designations — **All roles**

```bash
curl -X GET http://localhost:8080/api/designations \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 📅 8. Holiday APIs (`/api/holidays`)

### 8.1 Add Holiday — **ADMIN**

```bash
curl -X POST http://localhost:8080/api/holidays \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Holi",
    "date": "2026-03-25"
  }'
```

#### ✅ Response
```json
{ "id": 1, "name": "Holi", "date": "2026-03-25" }
```

### 8.2 Get All Holidays — **All roles**

```bash
curl -X GET http://localhost:8080/api/holidays \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 🗂️ 9. Leave Type APIs (`/api/admin/leave-types`)

### 9.1 Create Leave Type — **ADMIN**

```bash
curl -X POST http://localhost:8080/api/admin/leave-types \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Sick Leave" }'
```

### 9.2 Get All Leave Types — **All roles**

```bash
curl -X GET http://localhost:8080/api/admin/leave-types \
  -H "Authorization: Bearer <TOKEN>"
```

#### ✅ Response
```json
[
  { "id": 1, "name": "Sick Leave" },
  { "id": 2, "name": "Casual Leave" },
  { "id": 3, "name": "Earned Leave" }
]
```

---

## 🚦 10. HTTP Status Code Reference

| Code | Meaning | When it happens |
|------|---------|----------------|
| `200 OK` | Success | Request processed correctly |
| `401 Unauthorized` | Invalid/missing token | Token not sent or expired |
| `403 Forbidden` | Token valid but no permission | Wrong role for endpoint |
| `404 Not Found` | Resource not found | ID doesn't exist |
| `500 Internal Server Error` | Business logic error | Displayed as message string (insufficient balance, etc.) |

---

## ⚙️ 11. Role-Based API Quick Reference

### EMPLOYEE can call:
- `GET /api/users/me`
- `GET /api/leaves/my`
- `GET /api/leaves/report`
- `POST /api/leaves`
- `PUT /api/leaves/{id}/cancel`
- `POST /api/performance`
- `GET /api/performance/my?employeeId={id}`
- `GET /api/departments`, `GET /api/designations`, `GET /api/holidays`
- `GET /api/admin/leave-types`

### MANAGER can call:
(All Employee endpoints) **plus:**
- `GET /api/users/my-team`
- `GET /api/leaves/pending?managerId={id}`
- `GET /api/leaves/team?managerId={id}`
- `GET /api/leaves/employee/{employeeId}`
- `PUT /api/leaves/{id}/approve?managerId={id}`
- `PUT /api/leaves/{id}/reject?comment={reason}`
- `GET /api/performance/pending?managerId={id}`
- `PUT /api/performance/{id}/review`

### ADMIN can call:
(All Manager endpoints) **plus:**
- `GET /api/users`
- `POST /api/users`
- `DELETE /api/users/{id}`
- `GET /api/leaves/all`
- `POST /api/departments`
- `POST /api/designations`
- `POST /api/holidays`
- `POST /api/admin/leave-types`

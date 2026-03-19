# API Documentation — Reject Leave

## Overview

| Property      | Value |
|---------------|-------|
| **Method**    | `PUT` |
| **URL**       | `/api/leaves/{id}/reject` |
| **Auth**      | Bearer JWT (required) |
| **Role**      | Manager / Admin |
| **Controller**| `LeaveController.rejectLeave` |
| **Service**   | `LeaveService.rejectLeave` |

---

## Description

Allows a **Manager** (or Admin) to **reject** a leave request that is currently in `PENDING` status.
A `comment` explaining the reason for rejection is **mandatory**.
The rejection comment is stored on the leave record as `managerComment`.

---

## Path Parameters

| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| `id`      | `Long` | ✅ Yes   | The unique ID of the leave to reject |

---

## Query Parameters

| Parameter | Type     | Required | Description                                    |
|-----------|----------|----------|------------------------------------------------|
| `comment` | `String` | ✅ Yes   | Manager's reason for rejection (must be non-empty) |

---

## Request Headers

| Header          | Value                        | Required |
|-----------------|------------------------------|----------|
| `Authorization` | `Bearer <your-jwt-token>`    | ✅ Yes   |
| `Content-Type`  | `application/json`           | Optional |

---

## Request Body

**None** — all inputs are via path and query parameters.

---

## cURL Example

```bash
curl -X PUT "http://localhost:8080/api/leaves/7/reject?comment=Insufficient%20team%20coverage%20during%20that%20period" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYW5hZ2VyQGdtYWlsLmNvbSIsInJvbGUiOiJNQU5BR0VSIiwiaWF0IjoxNzA4ODIwMDAwLCJleHAiOjE3MDg5MDY0MDB9.SampleSignature"
```

---

## Success Response

**HTTP Status:** `200 OK`

```json
{
  "id": 7,
  "employeeName": "Harshita Sharma",
  "managerName": "Rajesh Kumar",
  "type": "Casual Leave",
  "status": "REJECTED",
  "startDate": "2025-03-10",
  "endDate": "2025-03-12",
  "reason": "Personal work"
}
```

### Response Fields (LeaveDTO)

| Field          | Type       | Description                                          |
|----------------|------------|------------------------------------------------------|
| `id`           | `Long`     | Unique ID of the leave record                        |
| `employeeName` | `String`   | Full name of the employee who applied for leave      |
| `managerName`  | `String`   | Full name of the assigned manager                    |
| `type`         | `String`   | Leave type name (e.g., `Casual Leave`, `Sick Leave`) |
| `status`       | `String`   | Updated status — always `"REJECTED"` on success      |
| `startDate`    | `LocalDate`| Start date of the leave (`yyyy-MM-dd`)               |
| `endDate`      | `LocalDate`| End date of the leave (`yyyy-MM-dd`)                 |
| `reason`       | `String`   | Employee's original reason for applying leave        |

---

## Business Rules & Validations

| Rule | Behaviour |
|------|-----------|
| `comment` must not be blank | Throws `RuntimeException("Manager comment is mandatory for rejection")` → `500` |
| Leave must be in `PENDING` status | Throws `RuntimeException("Only pending leaves can be rejected")` → `500` |
| Leave ID must exist | Throws `RuntimeException("Leave not found with id: {id}")` → `500` |
| Leave balance is **not deducted** | Balance is only deducted on approval, never on rejection |
| `managerComment` field is persisted | The rejection comment is saved to the `Leave` entity for audit purposes |

---

## Error Responses

> **Note:** Spring Boot returns `500 Internal Server Error` for unhandled `RuntimeException` by default. Add a `@ControllerAdvice` to return cleaner error codes.

### 400 — Missing or blank comment

```bash
curl -X PUT "http://localhost:8080/api/leaves/7/reject?comment=" \
  -H "Authorization: Bearer <token>"
```

**Response (500):**
```json
{
  "timestamp": "2025-03-01T12:00:00.000+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Manager comment is mandatory for rejection"
}
```

---

### Leave not found (invalid ID)

```bash
curl -X PUT "http://localhost:8080/api/leaves/9999/reject?comment=Not+approved" \
  -H "Authorization: Bearer <token>"
```

**Response (500):**
```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "Leave not found with id: 9999"
}
```

---

### Leave is not in PENDING status

If the leave is already `APPROVED`, `REJECTED`, or `CANCELLED`:

**Response (500):**
```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "Only pending leaves can be rejected"
}
```

---

### 401 — Missing or invalid JWT

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

---

## Flow Diagram

```
Client (Manager)
     │
     │  PUT /api/leaves/{id}/reject?comment=...
     │  Authorization: Bearer <token>
     ▼
JwtFilter ──validates JWT──► SecurityConfig (authenticated)
     │
     ▼
LeaveController.rejectLeave(id, comment)
     │
     ▼
LeaveService.rejectLeave(leaveId, comment)
     ├─► [validate] comment not blank
     ├─► [lookup]   leaveRepository.findById(id)
     ├─► [validate] status == "PENDING"
     ├─► leave.setStatus("REJECTED")
     ├─► leave.setManagerComment(comment)
     └─► leaveRepository.save(leave)
     │
     ▼
LeaveController.mapToDTO(savedLeave)
     │
     ▼
200 OK  →  LeaveDTO (JSON)
```

---

## Related Endpoints

| Method | URL                           | Description                       |
|--------|-------------------------------|-----------------------------------|
| `POST` | `/api/leaves`                 | Employee applies for leave        |
| `PUT`  | `/api/leaves/{id}/approve`    | Manager approves a leave request  |
| `PUT`  | `/api/leaves/{id}/cancel`     | Employee cancels a leave request  |
| `GET`  | `/api/leaves/pending`         | Manager fetches pending leaves    |
| `GET`  | `/api/leaves/report`          | Employee views their own leaves   |
| `GET`  | `/api/leaves/team`            | Manager views team leave history  |
| `GET`  | `/api/leaves/all`             | Admin views all leave records     |

---

## Source References

| File | Purpose |
|------|---------|
| [`LeaveController.java` L235–L242](../../src/main/java/com/revworkforce/controller/LeaveController.java) | HTTP endpoint handler |
| [`LeaveService.java` L176–L193](../../src/main/java/com/revworkforce/service/LeaveService.java) | Business logic & validations |
| [`LeaveDTO.java`](../../src/main/java/com/revworkforce/dto/LeaveDTO.java) | Response payload shape |
| [`SecurityConfig.java`](../../src/main/java/com/revworkforce/security/SecurityConfig.java) | JWT auth filter chain |

# 📊 Payroll Dashboard – Role-Based Payroll Management System

A full-stack web application for managing employee payroll with secure role-based access. This system enables Admins to upload and edit salary data, Managers to monitor team salaries, and Employees to securely view and download their own payslips.

---


---

## 🔐 Key Features

- ✅ **Secure Login & JWT Authentication**
- 🧑‍💼 **Role-Based Access Control (RBAC)**
  - **Admin**: Can upload/edit payroll data
  - **Manager**: Can view all employee data (read-only)
  - **Employee**: Can view only their own salary and download payslip
- 📥 **Excel Sheet Uploading and Editing**
- 📄 **Auto Payslip Generation**
- 📊 **Clean & Responsive UI**
- 💾 **Data Persistence with MongoDB Atlas**

---

## 🧰 Tech Stack

| Frontend  | Backend   | Database | Authentication |
|-----------|-----------|----------|----------------|
| React     | Node.js   | MongoDB  | JWT            |
| TypeScript| Express.js| Mongoose | bcrypt         |
| Tailwind CSS |         |          |                |

---

## 📁 Folder Structure
/client → React frontend
/components
/dashboards
ExcelUpload.tsx
SheetView.tsx

/server → Node.js backend
/routes
/controllers
/middleware
.env


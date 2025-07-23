# 📊 Function Points Analysis – University Platform

This document contains the **Function Point Analysis** of a university platform.  
Each user story is categorized by function type and complexity:

- **EI (External Input)** – Input that modifies internal data
- **EO (External Output)** – Processed data output
- **EQ (External Inquiry)** – Simple data retrieval
- **ILF (Internal Logical File)** – Internal data maintained by the system
- **EIF (External Interface File)** – External data referenced but not maintained

---

## 📥 External Input (EI)

| Task Description | Complexity |
|------------------|------------|
| Register as a professor | Medium |
| Register as a student | Medium |
| Login as a professor | Low |
| Login as a student | Low |
| Logout as a student | Low |
| Logout as a professor | Low |
| Create a new course | Medium |
| Add a new post to a course | Medium |
| Create a test for a course | High |
| Create a new note | Medium |
| Delete a note | Low |
| Save another student's note to personal notes | Medium |
| Submit a test | High |
| Enroll in a course | Medium |
| Unsubscribe from a course | Medium |

---

## 📤 External Output (EO)

| Task Description | Complexity |
|------------------|------------|
| View the home page to select a role | Low |
| View the access page (login/signup) | Low |
| View student homepage with recent notes and courses | Medium |
| Download a note attachment | Low |
| View test results | Medium |

---

## 🔍 External Inquiry (EQ)

| Task Description | Complexity |
|------------------|------------|
| Access professor profile | Low |
| Access student profile | Low |
| View all professor courses | Medium |
| Search courses by name (professor) | Low |
| View created tests | Medium |
| View students enrolled in a course | Medium |
| View enrolled courses (student) | Medium |
| Search enrolled courses by name | Low |
| Search new courses by name or professor | Medium |
| View materials shared by professors | Medium |
| View professor posts | Medium |
| View own notes | Medium |
| View other students' notes | Medium |
| Search own notes by name | Low |
| Filter other students' notes by course | Medium |
| Search other students' notes by course tag | Medium |
| View tests created by professors | Medium |

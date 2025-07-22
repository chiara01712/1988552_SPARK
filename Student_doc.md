# SYSTEM DESCRIPTION:
Our project is about building a user-friendly educational platform that streamlines course management, content sharing, and assessments for professors and students. It allows professors to create courses, upload materials, and design quizzes, while students can access resources, take tests, and share their own notes within a collaborative learning environment.

# USER STORIES:
## Registration, Authentication, Profile Management, and Logout
1. As a professor, I want to Register in the site, So that I can have an account as a professor
2. As a Student, I want to Register in the site, So that I can have an account as a student
3. As a professor, I want to Login in the site, So that I can use the functionality of the site as a professor
4. As a Student, I want to Login in the site, So that I can use the functionality of the site as a student
5. As a professor, I want to access my profile, So that I can view my account
6. As a Student, I want to access my profile, So that I can view my account
7. As a Student, I want to logout from the site, So that I can end my session
8. As a professor, I want to logout from the site, So that I can end my session
9. As a student, I want to acces to my home page, So that I can see the last notes created and the last courses I enrolled in

## PROFESSOR
10. As a professor, I want to create a new course, So that I can publish new materials
11. As a professor, I want to add a new post to my courses, So that I can share an announcement or material with my students
12. As a professor, I want to view all my courses, So that I can manage them
13. As a professor, I want to search my courses by their name, So that I can find them quickly
14. As a professor, I want to create a test for my course, So that the students can assess their knowledge
15. As a professor, I want to view the tests I created, So that I can manage them
16. As a professor, I want to view the students enrolled in my courses, So that I can check who is enrolled

## STUDENT
17. As a student, I want to view the courses I'm enrolled in, So that I can access the materials and assignments
18. As a student, I want to search the courses I'm enrolled in by their name, So that I can find them quickly
19. As a student, I want to search for a new course by its name or by its professor, So that I can enroll in it
20. As a student, I want to view the materials shared by my professors, So that I can study them
21. As a student, I want to view the posts made by my professors, So that I can stay updated on course announcements
22. As a student, I want to create new notes, So that I can keep track of important information
23. As a student, I want to view the notes I created, So that I can review important information
24. As a student I want to view all all the notes created by other students, So that I can learn from their insights
25. As a student, I want to serch my notes by their name, So that I can find them quickly
26. As a student, I want to filter the other students notes by the course they are related to, So that I can find them quickly
27. As a student, I want to search the notes created by other students by their name, So that I can find them quickly
28. As a student, I want to view the tests created by my professors, So that I can prepare for them
29. As a student, I want to do the tests, So that I can assess my understanding of the material
30. As a student, I want to view the results of my tests, So that I can track my progress

# CONTAINERS:

## CONTAINER_NAME: postgres

### DESCRIPTION:
The postgres container runs a PostgreSQL instance that serves as the central storage for all persistent data in the educational platform. It supports all microservices by managing structured information related to users, courses, teaching materials, notes, and assessments. The database includes initialized tables for user accounts, course content, student notes, and quiz results. 

### USER STORIES:

### PORTS:
PostgreSQL default port: 5432 

### PERSISTENCE EVALUATION
The postgres container requires persistent storage to manage and maintain essential user-related data for both students and professors. It ensures data consistency and availability for both professors and students, and is accessed by the platform's various microservices to enable secure data retrieval, updates, and storage.

### EXTERNAL SERVICES CONNECTIONS
The postgres container does not connect to external services.

### MICROSERVICES:

#### MICROSERVICE: PostgreSQL Databases
- TYPE: backend
- DESCRIPTION:  Manages persistent storage of data for the application
- PORTS: 5432
- TECHNOLOGICAL SPECIFICATION:
- SERVICE ARCHITECTURE: three db (...)
- DB STRUCTURE:

**_courses_** :	| **_id_** | title | description | professor_id | student_ids | professor_name | tag | timestamps | created_at |

**_users_** :	| **_id_** | username | role | password | email | prof_name | created_at |

**_notes_** :	| **_id_** | student_id | course_id | title | description | file_url | file_type | professor_name | tag | timestamps | created_at |

**_quizzes_** :	| **_id_** | course_id | title | description | questions  | created_at |

**_quizAnswers_** :	| **_id_** | student_id | quiz_id | answers | completed  | score | created_at |

**_course_materials_** :	| **_materialId_** | courseId | date | description | file_url  | file_type | created_at |

## CONTAINER_NAME: user-service

### DESCRIPTION:
The user-service container is responsible for handling all operations related to user accounts and authentication. It manages the lifecycle of both student and professor profiles, including registration, login, and role assignment. This service securely stores user credentials, generates and validates authentication tokens, and enforces role-based access control throughout the platform. 

### USER STORIES:

### PORTS:
8080:8080

### PERSISTENCE EVALUATION
The user-service container does not handle data persistence internally; instead, it depends on the postgres container to store and manage all persistent user data.

### EXTERNAL SERVICES CONNECTIONS
The user-service container communicates with the postgres container in order to store and retrieve user's information through RabbitMQ.

### MICROSERVICES:

#### MICROSERVICE: User management
- TYPE: backend
- DESCRIPTION: Handles user authentication, including login and token validation
- PORTS: 8080
- TECHNOLOGICAL SPECIFICATION:
- SERVICE ARCHITECTURE:


# SYSTEM DESCRIPTION:
Our project is about building a user-friendly educational platform that streamlines course management, content sharing, and assessments for professors and students. It allows professors to create courses, upload materials, and design quizzes, while students can access resources, take tests, and share their own notes within a collaborative learning environment.

# USER STORIES:

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


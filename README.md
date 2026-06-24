Restful Booker API Testing

API test automation project built using Postman and Newman to validate the functionality, reliability, and behavior of the Restful Booker API.

Overview

This project contains a collection of automated API tests for the Restful Booker application, a REST API playground designed for learning and practicing API testing. The test suite validates common CRUD operations, authentication, response validation, and error handling scenarios.

Restful Booker is intentionally designed as a learning platform for API testing and resets its data periodically.

Repository: https://github.com/Area-Turtle/restfullbooker-API-testing

Technologies Used
Postman
Newman
JavaScript (Postman Test Scripts)
GitHub Actions
REST API Testing
API Endpoints Covered
Health Check
GET /ping
Authentication
POST /auth
Booking Management
GET /booking
GET /booking/{id}
POST /booking
PUT /booking/{id}
PATCH /booking/{id}
DELETE /booking/{id}
Test Coverage

The collection includes validation for:

HTTP status codes
Response times
Response headers
JSON schema and data validation
Authentication token generation
Booking creation
Booking retrieval
Booking updates
Booking deletion
Negative test scenarios
Environment variable management
CI/CD

GitHub Actions is configured to automatically execute the Postman collection on pushes and pull requests. Test results are generated through Newman and can be integrated into CI pipelines for continuous validation.

Learning Objectives

This project demonstrates:

API test design
RESTful service validation
Postman collection development
Newman CLI execution
CI/CD integration with GitHub Actions
Automated regression testing
Reference

Restful Booker is a free API playground created for learning and practicing API testing techniques.

Website: https://restful-booker.herokuapp.com/
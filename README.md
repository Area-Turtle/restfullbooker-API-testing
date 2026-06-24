# Restful Booker API Testing

API test automation project built using **Postman** and **Newman** to validate the functionality, reliability, and behavior of the Restful Booker API.

---

## Table of Contents

* [Overview](#-overview)
* [Technologies Used](#️-technologies-used)
* [API Endpoints Covered](#-api-endpoints-covered)

  * [Health Check](#️-health-check)
  * [Authentication](#-authentication)
  * [Booking Management](#-booking-management)
* [Test Coverage](#-test-coverage)
* [CI/CD](#-cicd)
* [Learning Objectives](#-learning-objectives)
* [Project Highlights](#-project-highlights)
* [Reference](#-reference)

---

## Overview

This project contains a collection of automated API tests for the **Restful Booker** application, a REST API playground designed for learning and practicing API testing.

The test suite validates common CRUD operations, authentication, response validation, and error handling scenarios. Restful Booker is intentionally designed as a learning platform for API testing and resets its data periodically.

**Repository:** https://github.com/Area-Turtle/restfullbooker-API-testing

---

## Technologies Used

| Technology     | Purpose                       |
| -------------- | ----------------------------- |
| Postman        | API Development & Testing     |
| Newman         | Collection Runner & Reporting |
| JavaScript     | Postman Test Scripts          |
| GitHub Actions | CI/CD Automation              |
| REST APIs      | Endpoint Validation           |

---

## API Endpoints Covered

### Health Check

| Method | Endpoint |
| ------ | -------- |
| GET    | `/ping`  |

### Authentication

| Method | Endpoint |
| ------ | -------- |
| POST   | `/auth`  |

### Booking Management

| Method | Endpoint        |
| ------ | --------------- |
| GET    | `/booking`      |
| GET    | `/booking/{id}` |
| POST   | `/booking`      |
| PUT    | `/booking/{id}` |
| PATCH  | `/booking/{id}` |
| DELETE | `/booking/{id}` |

---

## Test Coverage

The collection includes validation for:

* HTTP status codes
* Response times
* Response headers
* JSON schema and data validation
* Authentication token generation
* Booking creation
* Booking retrieval
* Booking updates
* Booking deletion
* Negative test scenarios
* Environment variable management

### Validation Areas

* Functional Testing
* CRUD Operations
* Authentication Testing
* Response Validation
* Error Handling
* Environment Variable Usage
* Automated Regression Testing

---

## CI/CD

GitHub Actions is configured to automatically execute the Postman collection on:

* Push events
* Pull requests

### Pipeline Features

* Automated API test execution
* Newman CLI integration
* JUnit report generation
* Continuous validation
* Regression testing support

---

## Learning Objectives

This project demonstrates:

* API test design
* RESTful service validation
* Postman collection development
* Newman CLI execution
* CI/CD integration with GitHub Actions
* Automated regression testing

---

## Project Highlights

> **Goal:** Build a maintainable API automation framework using Postman and Newman while integrating automated execution through GitHub Actions.

### Key Skills Demonstrated

* REST API Testing
* API Automation
* Test Case Design
* Test Validation
* Continuous Integration
* Quality Assurance Best Practices

---

## Reference

**Restful Booker**

A free API playground created for learning and practicing API testing techniques.

https://restful-booker.herokuapp.com/


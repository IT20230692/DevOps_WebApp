# Product Catalog Microservice

This repository contains a Node.js microservice that acts as a product catalog for an e-commerce application. It is a core component that allows for listing, searching, and managing products. The service is designed with best practices in DevOps, including CI/CD, containerization, and basic security measures.

## Functional Overview

The service provides the following functionalities with RESTful API endpoints:

### Product Management

- **List Products**: `GET /products` - Retrieves a list of all products.
- **Add Product**: `POST /products` - Adds a new product to the catalog.
- **Retrieve Product Details**: `GET /products/:id` - Fetches details of a specific product.
- **Update Product**: `PUT /products/:id` - Updates the information of a product.
- **Delete Product**: `DELETE /products/:id` - Removes a product from the catalog.

### Order Management

- **Place Order**: `POST /orders` - Allows a user to place a new order.

### User Authentication

- **Register**: `POST /auth/register` - Registers a new user account.
- **Login**: `POST /auth/login` - Authenticates a user and returns a JWT.

### Review Management

- **View Reviews**: `GET /reviews` - Retrieves all reviews for a particular product.
- **Add Review**: `POST /reviews` - Allows a user to post a new review for a product.
- **Review Details**: `GET /reviews/:id` - Fetches details of a particular review.

## DevOps Practices

### Version Control

The codebase is hosted on GitHub, under a public repository.

### CI/CD Pipeline

An automated build and deployment process using GitHub Actions is in place. After passing the tests and security checks, code is automatically deployed to AWS ECS.

## Containerization with Docker

The microservice is containerized using Docker, which helps maintain a consistent development, testing, and production environment. The `Dockerfile` in this repository contains all the necessary steps to create the Docker image. This image is then pushed to Amazon ECR, which hosts our container images.

## Deployment

The containerized microservice is deployed using the managed container orchestration services provided by AWS, specifically Amazon ECS. This ensures that the microservice is always accessible over the internet.

## Security Measures

Basic security best practices are implemented, such as:

- Use of IAM roles and security groups to follow the principle of least privilege.
- Secure data handling and encrypted data transmission.
- Integration of managed SAST tools like SonarCloud within the CI/CD pipeline to enable DevSecOps practices.

## Usage

To use this project:

1. Clone the repository.
2. Make necessary changes to the code.
3. Push the changes to the main branch.
4. Wait for the CI workflow to complete.
5. Review the SonarCloud security report in the pull request.
6. Once the CI and SonarCloud checks pass, merge the code.
7. The CD workflow will automatically deploy the changes to Amazon ECS.

## Getting Started

To set up the project locally:

1. Clone the repository.
2. Retrieve necessary secrets and configurations from AWS Secret Manager.
3. Run `docker build -t product-catalog .` to build the Docker container.
4. Run `docker run -p 5000:5000 product-catalog` to start the service locally.

For full deployment instructions, refer to `DEPLOYMENT.md`.

## Contributing

We welcome contributions! Please read `CONTRIBUTING.md` for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

## Acknowledgements

- A special thank you to all contributors who have helped shape this project.
- Our CI/CD pipeline is powered by GitHub Actions.

Should you have any questions or require support, please open an issue in the repository.

# Elsa coding challenge

![SystemDesign](./system-design.png)

## Design

The backend services will be divided into 4 domains:

- Logging (`logger-service`)
- Customer (`auth-service` and `user-service`)
- Quiz (`quiz-content-service`, `quiz-session-service` and `quiz-session-socket`)
- Score (`leader-board-service`, `score-service` and `score-socket`)

## Implementation

### Requirements

User Participation:

Users should be able to join a quiz session using a unique quiz ID.
The system should support multiple users joining the same quiz session simultaneously.

### Tools

- Lerna: to manage downstream services and sdk
- Express for simple and fast server's implementation
- Redis/Bull
- Mongodb
- Socket.io (for realtime engine)

### Flow

User first need to login the platform, or play as guest from Quiz-Socket client miniapps (`elsa-client`). It will send the data to `quiz-session-socket` server -> `user-service` -> `auth-service` to get user information and token.

#### 1. Create new session

When user is authenticated, it will:

- create new quiz-session data (`quiz-session-service`) and push userId to `userIds` field
- generate list of questions from `quiz-content-service`

After verifying the user and creating the quiz-session, it will return the quiz session back to quiz-socket-client-miniapps

#### 2. Join an existing session

After authenticating, user is able to join the existing session using unique sessionId (mongodb ObjectId - can be replaced by nanoId/uuid).

- If session is not existed, it will throw errors: `[QuizSessionSocket] [QuizSessionSdk] Error: 404 - [QuizSessionService] Session not found.`
- If session is existed, user will be able to join the room. All other users will get notified that one user just joined (using `io.to(roomId).emit` event)

This diagram will represent flow of the request:

[QuizSessionClient](https://github.com/quannh-netalik/elsa-client) -> [QuizSessionSocket](./apps/quiz-session-socket/) -> [QuizSessionSdk](./packages/quiz-session-sdk) -> [QuizSessionService](./apps/quiz-session-service/):

1. [QuizSessionService](./apps/quiz-session-service/) -> [UserSdk](./packages/user-sdk/) -> [UserService](./apps/user-service/) -> [AuthSdk](./packages/auth-sdk/) -> [AuthService](./apps/auth-service/) `(User verification and authentication)`
2. [QuizSessionService](./apps/quiz-session-service/) -> [QuizContentSdk](./packages/quiz-content-sdk/) -> [QuizContentService](./apps/quiz-content-service/) `(Quiz generation)`

### Build For the Future:

1. **Scalability**:
   - _Horizontal scaling_: Scaling out instances (on schedule, on threshold stats), adding replica for redis cluster, mongodb.
   - _Vertical scaling_: upgrading the core instances stats like RAM, CPU, etc.
2. **Performance**: fronted by a load-balancer, api gateways
3. **Reliability**:
   - Apply SAGA pattern for downstream services by providing fault tolerance. It improves scalability by decoupling services and supporting asynchronous processing, allowing for independent operation and scaling of downstream services.
   - Health-check other services before making request. We could add a health-check to the sdk of the service (ex: user-sdk ----health-check-----> user-service) on initiating.
4. **Maintainability**:
   - _SDK_: Write sdk for services allow other teams/developers easier to be integrated with, the can reuse it throughout different services. Once the requirements or any changes need to be update on core-services, it can be sorted out by update the sdk.
   - _Linting_: We can integrate apps/pkg with linting libraries like Eslint, integrate with commit hooks (husky) for linting rules. We can also integrate with `Sonarqube` to control the code quality, debug, code-smell or duplicate.
   - _Test_: Test should cover most of the cases with clear description. Other developer can review the test cases for better understanding of the function's logic. We can apply different test strategy here, example: unit-test, endToEnd test, integration-test, etc.
5. **Monitoring and Observability**:
   - Implement logging services, and tracing down with different query field:
     - correlationId (unique nanoId/uuid)
     - source (from auth-sdk, auth-service, user-sdk, user-service, etc.)
     - message
   - Implement threshold for services based on stats like CPU, Ram, etc. When stats reach threshold, send email for notified the stakeholders or ops team to handle errors.

## Setup

### Installation

```bash
## Build packages
npm run build:packages

## Install
npm install

## Build apps
npm run build: apps
```

### Run services

Make sure you run logging-service first

```bash
## logging-service
npm run start:log
```

Then run all others services in the different terminal

```bash
npm start
```

### Data

Quiz-content data is placed at [quiz.json](./apps/quiz-content-service/data/quiz.json) and it will be imported directly to the database once the service started.

To create user data please hit this in the terminal:

```terminal
    curl --location 'http://localhost:8060/signup' \
    --header 'x-api-key: THIS_IS_A_SECRET_KEY' \
    --header 'correlation-id: 866c86a7-c640-406a-8d9f-c432e119e9aa' \
    --header 'Content-Type: application/json' \
    --data '{
        "type": "internal",
        "username": "abc1",
        "firstName": "abc",
        "lastName": "abc",
        "password": "abc"
    }'
```

# Devtinder APIs

authRouter
-POST /Signup
-POST /login
-POST /logout

profileRouter
- GET /Profile/view
- PATCH /Profile/edit
- PATCH /Profile/password

connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accept/:requestId
- POST /request/review/reject/:requestId

userRouter
- GET /connections
- GET /user/requests
- GET /user/feed   - gets u the profiles of other user on platform


Status: ignore, interested (from sender side) ; accept, reject (from receiver side)
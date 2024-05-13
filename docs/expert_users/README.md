# Deployed Project

Deployed link: [https://digit-sum-graphs.vercel.app/](https://digit-sum-graphs.vercel.app/)

## Previous Building Instructions

Clone the project: *git clone https://github.com/fahmed0710/Digit-Sum-Graphs.git*

### Docker Setup
1. Navigate to the development code: *cd dev*
2. Build the image: *docker compose build*
3. Start the docker services: *docker compose up -d*

### Backend Setup Commands
1. Navigate to backend from project root: *cd dev/backend*
2. Install dependencies: *pip3 install Flask, pip3 install flask_cors, pip3 install flask_sqlalchemy,install jsonify*
5. Interact with the backend via localhost:4000 (after starting the Docker containers)

### Frontend Setup Commands
1. Navigate to frontend from project root: *cd dev/frontend*
2. Install dependencies: *npm i*
3. Run the development server: *npm run dev*
4. Interact with the frontend via localhost:3000
5. Change all the backend routing to localhost:4000 to access the Docker database

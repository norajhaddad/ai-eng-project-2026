# ai-eng-project-2026
FNAF World Team Lab

A fan-made team-building and party-analysis web application inspired by FNaF World.
Project overview:
FNaF World Team Lab helps players explore the FNaF World character roster, create teams of four animatronics, and analyze their parties to identify strengths, potential weaknesses, and possible character swaps. The goal is to make team planning easier by organizing character information and providing useful recommendations. 

Features:
Character gallery- browse various FNaF World characters and view their moves and abilities. 
Character filtering- filter the roster to find specific animatronics. 
Team builder- select 4 animatronics to create a party.
Saved parties- save and manage multiple parties using a database.
Party analysis- identify strengths and potential weaknesses based on available move categories.
Suggested swaps- receive character-swap recommendations to improve move-category coverage.
Responsive interface- a FNaF World-inspired design with custom styling.

Technologies used:
Frontend: 
React, Vite, React Router, JavaScript, CSS, & Lucide React icons.
Backend:
Node.js, Express, & SQLite.

How to run the project:
1. Install dependencies- Open a terminal in the project folder and run 'npm install'. 
2. Start the backend- In the first terminal, run 'node server/index.cjs'. The backend will run on port 3001.
3. Start the frontend- Open a second terminal and run 'npm run dev'. Then open the local URL provided by Vite (usually port 5173). Both servers need to be running for database saving and party analysis to work.

How party analysis works: The application analyzes the moves available to the four selected animatronics. It examines the party's move-category coverage to identify strengths and potential weaknesses. The backend also generates possible character swaps that could improve the team's coverage. Recommendations are based on the available character and move information, not simulated battles or exact damage calculations, nor by utilizing an AI or actively fetching information from the FNaF World wiki upon each analysis.

Database: The application uses SQLite to store saved parties. The local database file, server/parties.db, is excluded from Git version control. The backend is responsible for initializing the database.

Testing:
The application has been manually tested for its main features, including browsing/filtering characters, creating parties, saving and managing parties, viewing party analysis, displaying suggested character swaps, & navigating between application pages.

Purpose of this project: This project was developed as part of the Code2College Full Stack Web pathway to practice building an interactive web application that connects a React frontend to an Express backend and a database.
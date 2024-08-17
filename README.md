This is my MWA project based on MEAN Stack
-----------------------------------------
Project Title is Travel Journal
-----------------------------------
I have made main document : Trips with attributes country ,airport and hotel
Sub document : Gallery with attribute place and picture.
CRUD database (json file) is inside databasefile  folder.

---------------------------------------------------------------------------------

To Run this project need to do as following:
------------------------------------------------------

1. Clone this project
2. NPM Install
3. Go to Angular project via cd public/travel-jounral
4. Do NPM install on UI
3. Go to mongosh in commandline
4. need to create database as "traveljournal"
5. import database(json) file from databasefile folder 
6. For importing db: mongoimport --db=traveljournal --collection=trips --file=databasefile/trips.json --jsonArray
7. npm start on  main folder and run http://localhost:4200







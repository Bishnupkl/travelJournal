This is my MWA project based on MEAN Stack
-----------------------------------------
Project Title is Travel Journal
-----------------------------------
I have made main document : Trips with attributes country ,airport and hotel
Sub document : Gallery with attribute place and picture.

---------------------------------------------------------------------------------
CRUD database (json file) is inside data folder.
------------------------------------------------------
To Run this project need to do as following:
1. Clone this project
2. NPM Install
3. Go to mongosh in commandline
4. need to create database as "traveljournal"
5. import database(json) file from data folder (/data)
6. For importing db: mongoimport --db=traveljournal --collection=trips --file=data/trips.json --jsonArray
7. npm start and run
8. Some REST API to test taveljournal  are as follows:
   1. GET- http://localhost:3000/trips
   2. POST - http://localhost:3000/trips
   3. GET - http://localhost:3000/trips/tripId
   4. DELETE - http://localhost:3000/trips/tripId
   5. PUT - http://localhost:3000/trips/tripId
   6. GET - http://http://localhost:3000/trips/tripId/gallery
   7. POST - http://localhost:3000/trips/tripId/gallery
   8. GET- http://http://localhost:3000/trips/tripId/gallery/galleryId
   9. POST- http://http://localhost:3000/trips/tripId/gallery/galleryId
   10. PUT- http://http://localhost:3000/trips/tripId/gallery/galleryId
   11. PATCH- http://http://localhost:3000/trips/tripId/gallery/galleryId
   12. DELETE- http://http://localhost:3000/trips/tripId/gallery/galleryId




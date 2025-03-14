# synkramaJigarBooklib
A book library project - jigar kajiwala

this project is built with Express(nodeJS) - and configure with the MongoDB database(using mongoose).

1. you have to clone the project repository.
2. prerequiste - MongoDB compass - Node and Npm should be installed on local machine.
3. Then install node modules with npm install under the project folder terminal.
4. After succesfully install node modules, run --> npm run dev.
5. In terminal console you get -> server run on 6933 Port and MongoDB connected.
6. After that you import the postman APi inside the 'Postman API json' folder.

from postman API you test the backend API and add, update, delete and fetch books by ID and by Page.

==========================================================>
I use joi for validataion of schema and request body.(not apply everywhere)
where - joi is apply
-- book collection schema 
-- fetch book with pagination with get method.

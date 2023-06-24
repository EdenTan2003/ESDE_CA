# In this Repository it contains patched codes from the initial codes to prevent the 6 vulnerabilities for this CA.

Vunerabilities Include:

    1. Cross Site-Scripting
    2. SQL Injection
    3. Broken Authentication
    4. Broken Access Control
    5. Sensitive Data Exposure
    6. Insufficient Logging & Monitoring

    More info from OWASP Top 10 Vulnerabilities:
    https://owasp.org/www-project-top-ten/2017/

# Bonus on top of rectifying 1 of each of the 6 vulnerabilities:

    1. Done Input Validation for all input fields like register new user, search inputs, email invitation, design file type submission etc.
    2. Done Output Sanitization for User Data E.g., Full name, Email and Role name displayed in Admin Page and User Page.
    3. To prevent easy password guessing against broken authentication I did a weak password check where the password must Contain at least 1 upper case, 1 lower case, 1 number, 1 special character with at least 7 characters.
    4. Changed the cloudinary files in database to https instead of http by changing the seeddata.js file and the cloudinary upload image (uploadFile Function) in fileService.js by changing result.url to result.secure_url to remove the https warnings for future and current submissions.
    5. Used Bearer Token for all and not using user Id and role for user access control and authentication.
    6. Used Session-Storage instead of Local-Storage to delete token after user has closed the tab/browser instead of continuing to store it.
    7. Used express-rate-limit to limit the number of attempts for register page, login page, email invitation page and design submission page to prevent brute forcing.
    8. Created a check role from token to make sure that only user and admin can access their own sites without being able to access a web page that they don’t have access to through the URL Link.
    9. Used Try and Catch for all functions in authController.js and userController.js to handle all errors at the end to prevent callback hell.
    10. Standardized fileService.js, authService.js and userService.js to use Promise and declare SQL statement before the Promise.
    11. Used Standardized JSON Response for authController.js and userController.js.

# .env file setup in backend directory:

    1. DB_USERNAME=your_DBUsername_Here
    2. DB_PASSWORD=your_DBPassword_Here
    3. DB_DATABASE_NAME=ay2324s1_st0505_esde_ca
    4. JWTKEY=QSBKV1QgY29kZSBmb3IgQVkyMjIzczEgRVNERSBzdHVkZW50cw==
    
    5. CLOUDINARY_CLOUD_NAME=your_Cloudinary_Cloud_Name_Here
    6. CLOUDINARY_API_KEY=your_Cloudinary_API_Key_Here
    7. CLOUDINARY_API_SECRET=your_Cloudinary_API_Secret_Here
    
    8. MAILTRAP_USERNAME=your_Mailtrap_Username_Here
    9. MAILTRAP_PASSWORD=your_Mailtrap_Password_Here

# How to set up:

    1. Make sure that you have created and filled in the above .env file first.
    2. Use the prepare_database_ca1.sql to set up databse in MySQL Workbench
    3. Populate the database with users, files and etc by CD'ing into backend folder and run the seeddata.js file.
    4. Finally run nodemon index.js in the respective backend and frontend folder and you are set.

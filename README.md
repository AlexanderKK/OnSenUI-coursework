# OnSenUI-project

 OnSenUI Coursework Project For Academic Purposes.
 Simple cordova application to take photos and write image data(containing exif data) to json file and provide functionality like read, create and delete.
 It also displays full information and properties of the used simulator/device and it has messages to nofify the user about the actions performed.
 The app features 3 main pages with the following functionality:
 • Page 1 "Album": Album containing all photos taken with search by date field so you can organize your photos better.
 • Page 2 "Take Photo": On this page you can take photos and they will be saved inside the json file provided.
 • Page 3 "About": Here you can see all the information about the device you are using.

# Dependencies:

 • Cordova
 • Onsen UI
 • Npm
 • Apache Server/XAMPP (or something similar which supports PHP)

# Installation & Usage

 # 1. Npm modules installation
    1. After downloading initiate "npm install" command inside the main folder.
    2. Next you have to execute "npm audit fix"/"npm audit fix --force".
    3. After this execute "npm fund" and your are done with this part.

 # 2. Cordova dependencies installation
    4. Now you have to add simulation platform to run with cordova. You might do so with executing "cordova platform add android" or "cordova platform add browser".
    By doing so the needed plugins will be installed and the simulation platform will be added.

 # 3. Ensuring Back-end functionality for read, create, delete operations
    5. Copy the folder "OnSenBlog" into your apache server directory(htdocs), same for XAMPP.
    This way photos taken will be saved inside the JSON file provided and can be browsed and deleted.
    6. Start your server and make sure it listens on port 80.

 # 4. Running the project
    1. Finally you will have to run "simulate android" in order to execute the project and you are done.

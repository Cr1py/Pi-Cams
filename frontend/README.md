This will contain the react webapp which will be server by the WT server

The setup something like this 

`yarn create react-app frontend --template typescript --skip-git`


backend/
    
    Serve the react app:
        somehow the server has to server on route "/app" the
        public/index.html file

    APIs: ( just send back json )
        The react app will call the following rest apis and get json back:
        /users/addemail -> email controller will the entry to the database
        /users -> send back all register users of the system in the dbs
        /activities -> a list of all the motion detections with time
        /video -> give you a stream of what the camera is seeing now
        
        --- optional 
        /auth

   Routes will get sent to controllers and the controller will take to a model that executes stuff agains the database or third party services
Model classes that utilize 
        1) https://www.webtoolkit.eu/wt/doc/tutorial/dbo.html   OR ODB
        2) classes that manage 3rd party service like mailgun   


  Internal Apis that the pico system will call
      methods 
      - motionDetected() - call model to update database
      - 

frontend/
    package.json
    tsconfig.json
    yarn.lock
    src/
        .tsx

    public/
        index.html
        favicon.ico

==================================================================
IMPORTANT: TO RUN THE WEBPAGE

Node JS:

    - Node.js v20.9.0


For Mac/ Linux Users:

    - brew update
    - brew install watchman


React Set Up:

    - npm install
    - npx expo install react-native-web@~0.19.6 react-dom@18.2.0 @expo/webpack-config@^19.0.0
    - npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar react-native-gesture-handler
    - npm install react-native-webview
    - npm install react-native-fs
    - npm install react-native-render-html
    - npm install --save-dev expo-module-scripts  (use only if the program runs into memory leak issues)



To Run:

    - cd securityUI
        - npm run android
        - npm run ios
        - npm run web (Use this one for now)


Notes:

    - login for testing:
        - username: christine@email.com
        - password: password
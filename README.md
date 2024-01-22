This is the initial README for this project 

Details about project incoming.

## Install

brew install --cask db-browser-for-sqlite


## Starting up

For Mac:
```bash

make -f Makefile.mac clean
make -f Makefile.mac
 ./homesecurity --docroot . --http-listen 0.0.0.0:8080


For Windows:
```bash

make -f Makefile.win clean
make -f Makefile.win
./homesecurity --docroot . --http-listen 0.0.0.0:8080
```

The database is created automatically at homesecurity.db if it doesn't exist

To seed the data ( only needs to be done when it is created the first time )

1) open the database browser and open homesecurity.db
2) copy from database/seed.sql and paste into the database browser execute sql section 
3) click the execute button
4) click write chages



## Backend Interface

POST /users/add


note: securitysystem should always be Home


{
    "username": "username",
    "password": "password",
    "email": "email",
    "mobile": "phone",
    "securitysystem": "Home"
}



GET /users/list

will return something like the following

{
    "path": "List Users",
    "users": [
        {
            "email": "amy@email.com",
            "mobile": "416-555-5555",
            "name": "Amy Uccello",
            "password": "password"
        },
        {
            "email": "christine@email.com",
            "mobile": "416-555-5557",
            "name": "Christine",
            "password": "password"
        }
    ]
}


GET /users/get?email=amy@email.com

will return

{
    "email": "amy@email.com",
    "mobile": "416-555-5555",
    "name": "Amy Uccello",
    "password": "password",
    "path": "Get User"
}

GET /users/delete?amy@email.com

will delete the user with the given email


POST /users/update
{
    "email": "jackie@email.com",
    "name": "Jackie",
    "mobile": "416-555-5500"
}

will update the user with the given email
and the following two fields



Subscriptions:

POST /subscriptions/add

note: devicename should always be FrontDoor

{
    "email": "christine@email.com",
    "type": "camera",
    "name": "frontdoor camera",
    "message": "The front door camera has detected motion",
    "devicename": "FrontDoor"
}

will add a subscription for the user with the given email of events of given type and will notify with `message` when the event occurs

GET /subscriptions/list?email=amanda@email.com

Will return a list of subscriptions for the given user

{
    "email": "amanda@email.com",
    "path": "List Subscriptions",
    "subscriptions": [
        {
            "message": "The front door camera has detected motion",
            "name": "frontdoor camera",
            "type": "camera"
        },
        {
            "message": "The side door camera has detected motion",
            "name": "sidedoor camera",
            "type": "camera"
        }
    ]
}


GET /events/list?devicename=FrontDoor


[
	{
		"device" : "FrontDoor",
		"name" : "Something Event",
		"timestamp" : "2017-05-01 12:00:00",
		"type" : "camera"
	},
	{
		"device" : "FrontDoor",
		"name" : "Something Event",
		"timestamp" : "2017-05-01 12:00:00",
		"type" : "camera"
	},
	{
		"device" : "FrontDoor",
		"name" : "Something Event",
		"timestamp" : "2017-05-01 12:00:00",
		"type" : "camera"
	},
	{
		"device" : "FrontDoor",
		"name" : "Something Event",
		"timestamp" : "2017-05-01 12:00:00",
		"type" : "camera"
	}
]

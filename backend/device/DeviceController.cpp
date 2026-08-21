// Function that the thread will execute
#include <iostream>
#include <thread>
#include "../models/models.cpp"
#include <Wt/Dbo/Dbo.h>
#include <Wt/Dbo/backend/Sqlite3.h>

#include "../controllers/EventController.h"
#include "DeviceController.h"


// Function that thread starts in
void deviceThreadFunction() {

    auto dbs = std::make_unique<Wt::Dbo::backend::Sqlite3>("homesecurity.db");
    Wt::Dbo::Session session;
    session.setConnection(std::move(dbs));

    session.mapClass<User>("User");  // Map the User class to the User table
    session.mapClass<SecuritySystem>("SecuritySystem");
    session.mapClass<Device>("Device");
    session.mapClass<Event>("Event");
    session.mapClass<Subscription>("Subscription");
    session.mapClass<Notification>("Notification");

    EventController *ec = new EventController(session);



    for (int i = 0; i < 500; ++i) {
        std::cout << "Thread iteration " << i << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(20));

        ec->fireEvent("Something Event", "2017-05-01 12:00:00", "camera", "FrontDoor");
        
    }
}


DeviceController::DeviceController(Wt::Dbo::Session& session) : session(session) { }


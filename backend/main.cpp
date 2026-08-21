/**
 * Group 31 
 * File Name: main.cpp
 * Main Entry file for the homesecurity system
 * Class: CS3307
 * Date Created: Nov 20, 2023
*/

#include "main.h"
#include <Wt/WFileResource.h>
#include <thread>
#include <Wt/Http/Response.h>
#include <Wt/Http/Header.h>

class UsersResource : public Wt::WResource {
public:
    UsersResource(Wt::Dbo::Session& session) : session_(session) {
        // Set CORS headers to allow all origins
        Wt::Http::Header header;
        header.addField("Access-Control-Allow-Origin", "*");
        header.addField("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        header.addField("Access-Control-Allow-Headers", "Content-Type");
        setHeader(header);
    }

    void handleRequest(const Wt::Http::Request& request, Wt::Http::Response& response) override {
        // Your resource handling logic goes here
    }

private:
    Wt::Dbo::Session& session_;
};



/**
 * Function name: main
 * Description: The main function entrypoint.
 * Parameters: argc - the number of arguments
 *             argv - the arguments
 * Return Value: 0 on success, 1 on failure
*/
int main(int argc, char **argv)
{

    Wt::WServer server(argc, argv);

    auto dbs = std::make_unique<Wt::Dbo::backend::Sqlite3>("homesecurity.db");
    Wt::Dbo::Session session;
    session.setConnection(std::move(dbs));

    session.mapClass<User>("User");  // Map the User class to the User table
    session.mapClass<SecuritySystem>("SecuritySystem");
    session.mapClass<Device>("Device");
    session.mapClass<Event>("Event");
    session.mapClass<Subscription>("Subscription");
    session.mapClass<Notification>("Notification");
    

    Wt::Dbo::Transaction transaction(session);

    try {
            // Attempt to create tables
            session.createTables();

            // Commit the transaction if table creation succeeds
            transaction.commit();
        } catch (const Wt::Dbo::Exception& e) {
            // An error occurred, rollback the transaction
            transaction.rollback();

            // Log the error message
            std::cerr << e.what() << std::endl;

            // Optionally re-throw the exception if you want to handle it at a higher level
            // throw;
        }


    // Launch a thread that is non blocking to handle events from the device
    // eg create a device class that instantiates a singual EventController
    // for every event on the device, call the fireEvent method on the EventController
    // it must not stop execution of the main thread

    std::thread thread(deviceThreadFunction);
    thread.detach();

    
    // set up all routes here
    // UsersRoutes
    UsersResource *usersResource = new UsersResource(session);
    server.addResource(usersResource, "/users");

    // SubscriptionsRoutes
    SubscriptionsResource *subscriptionsResource = new SubscriptionsResource(session);
    server.addResource(subscriptionsResource, "/subscriptions");

     // SubscriptionsRoutes
    EventsResource *eventsResource = new EventsResource(session);
    server.addResource(eventsResource, "/events");

    // Set up static file serving for the React app
    Wt::WFileResource *fileResource = new Wt::WFileResource("text/html","frontend/index.html");
    server.addResource(fileResource, "/");

    Wt::WFileResource *fileResource1 = new Wt::WFileResource("application/javascript", "frontend/react.js");
    server.addResource(fileResource1, "/react.js");

    Wt::WFileResource *fileResource2 = new Wt::WFileResource("text/css","frontend/react.css");
    server.addResource(fileResource2, "/react.css");


    if (server.start()) {
        Wt::WServer::waitForShutdown();
        server.stop();
    }

    delete usersResource;
    delete subscriptionsResource;
    delete eventsResource;
    delete fileResource;
    delete fileResource1;
    delete fileResource2;

    return 0;  

}

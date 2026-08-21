/**
 * group 31
 * @file EventsResource.cpp
 * @brief This file contains the rest endpoints for events
 * Class: CS3307
 * Date Created: Nov 20, 2023
*/


#include "EventsResource.h"

/**
 * Constructor
*/
EventsResource::EventsResource(Wt::Dbo::Session& session) : session(session) { }


/**
 * Request handler
*/
void EventsResource::handleRequest(const Wt::Http::Request& request,
                               Wt::Http::Response& response) {
        

        std::string path = request.pathInfo();

        // all these routes are relative to /evnets
        
        if (path == "/list") {
            listEvents(request, response);
        } else {
            response.setStatus(404);  // Not Found
            response.out() << "Route not found";
        }

}

/**
 * listEvents resources
*/
void EventsResource::listEvents(const Wt::Http::Request& request, Wt::Http::Response& response) {
        
        const std::string* deviceNamePtr = request.getParameter("devicename");
        if (!deviceNamePtr) {
            response.setStatus(400);  // Bad Request
            response.out() << "Missing devicename parameter";
            return;
        }

        std::string deviceName = *deviceNamePtr;

        Wt::Dbo::Transaction transaction(session);

        Wt::Dbo::ptr<Device> device = session.find<Device>().where("name = ?").bind(deviceName);
        
        try {
            Wt::Json::Array eventsArray;

            auto events = device->events;
            for (const auto& event : events) {
                Wt::Json::Object eventJson;
                eventJson["name"] = Wt::Json::Value(event->name);
                eventJson["timestamp"] = Wt::Json::Value(event->timestamp);
                eventJson["type"] = Wt::Json::Value(event->type);
                eventJson["device"] = Wt::Json::Value(event->device->name);
                eventsArray.push_back(eventJson);
            }

            std::string jsonString = Wt::Json::serialize(eventsArray);

            response.setMimeType("application/json");
            response.out() << jsonString;

        } catch (const Wt::Dbo::Exception& e) {
            std::cerr << e.what() << std::endl;
            response.setStatus(500);  // Internal Server Error
            response.out() << "Database error: " << e.what();
        } catch (const std::exception& e) {
            std::cerr << e.what() << std::endl;
            response.setStatus(500);  // Internal Server Error
            response.out() << "Error: " << e.what();
        }

    }

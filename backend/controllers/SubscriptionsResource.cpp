/**
 * group 31
 * @file SubscriptioinsResource.cpp
 * @brief This file contains the rest endpoints for subscriptions
 * Class: CS3307
 * Date Created: Nov 20, 2023
*/

#include "SubscriptionsResource.h"
#include <Wt/Json/Array.h>
#include <Wt/Json/Object.h>
#include <Wt/Json/Serializer.h>
#include <Wt/Json/Parser.h>
#include <Wt/Http/Request.h>
#include "../models/models.cpp"

SubscriptionsResource::SubscriptionsResource(Wt::Dbo::Session& session) : session(session) { }


void SubscriptionsResource::handleRequest(const Wt::Http::Request& request,
                               Wt::Http::Response& response) {
        

        std::string path = request.pathInfo();

        // all these routes are relative to /subscriptions
        
        if (path == "/list") {
            listSubscriptions(request, response);
        } else if (path == "/add") {
            addSubscription(request, response);
        } else {
            response.setStatus(404);  // Not Found
            response.out() << "Route not found";
        }

}


void SubscriptionsResource::listSubscriptions(const Wt::Http::Request& request, Wt::Http::Response& response) {
    try {
        const std::string* emailPtr = request.getParameter("email");
        if (!emailPtr) {
            response.setStatus(400);  // Bad Request
            response.out() << "Missing email parameter";
            return;
        }

        std::string email = *emailPtr;

        Wt::Dbo::Transaction transaction(session);

        // Find user by email
        Wt::Dbo::ptr<User> user = session.find<User>().where("email = ?").bind(email);

        if (!user) {
            response.setStatus(404);  // Not Found
            response.out() << "User not found";
            return;
        }

        Wt::Json::Array subscriptionsArray;

        auto subscriptions = user->subscriptions;
        for (const auto& subscription : subscriptions) {
            Wt::Json::Object subscriptionJson;
            subscriptionJson["name"] = Wt::Json::Value(subscription->name);
            subscriptionJson["message"] = Wt::Json::Value(subscription->message);
            subscriptionJson["type"] = Wt::Json::Value(subscription->type);
            subscriptionsArray.push_back(subscriptionJson);
        }

        transaction.commit();

        Wt::Json::Object json;
        json["path"] = "List Subscriptions";
        json["email"] = Wt::Json::Value(email);
        json["subscriptions"] = subscriptionsArray;

        std::string jsonString = Wt::Json::serialize(json);

        response.setMimeType("application/json");
        response.addHeader("Access-Control-Allow-Origin", "*");  // Optional: for cross-origin requests
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



void SubscriptionsResource::addSubscription(const Wt::Http::Request& request, Wt::Http::Response& response) {
        
            std::istreambuf_iterator<char> eos;
            
            if (request.method() == "POST") {
                std::string body = std::string(std::istreambuf_iterator<char>(request.in()), eos); //request.body();
                Wt::Json::Object json;
                Wt::Json::parse(body, json, false);

                std::string email = json.get("email");
                std::string name = json.get("name");
                std::string message = json.get("message");
                std::string devicename = json.get("devicename");
                std::string type = json.get("type");

                {
                    Wt::Dbo::Transaction transaction(session);
                    std::unique_ptr<Subscription> subscription(new Subscription());
                    subscription->name = name;
                    subscription->message = message;
                    subscription->type = type;
                    subscription->user = session.find<User>().where("email = ?").bind(email);
                    subscription->device = session.find<Device>().where("name = ?").bind(devicename);
                    
                    session.add(std::move(subscription));
                    transaction.commit();
                }


                response.setMimeType("application/json");
                response.out() << "{\"status\": \"success\"}";
            } else {
                response.setStatus(405);  // Method Not Allowed
                response.out() << "Method Not Allowed. Please use POST.";
            }

}


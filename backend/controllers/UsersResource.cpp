/**
 * group 31
 * @file UsersResource.cpp
 * @brief This file contains the rest endpoints for the users
 * Class: CS3307
 * Date Created: Nov 20, 2023
*/


#include "UsersResource.h"
#include <Wt/Json/Array.h>
#include <Wt/Json/Object.h>
#include <Wt/Json/Serializer.h>
#include <Wt/Json/Parser.h>
#include <Wt/Http/Request.h>
#include "../models/models.cpp"


UsersResource::UsersResource(Wt::Dbo::Session& session) : session(session) { }

// Added by Christine to fix cross-origin requests
void UsersResource::handleOptionsRequest(const Wt::Http::Request& request, Wt::Http::Response& response) {
    response.addHeader("Access-Control-Allow-Origin", "*");
    response.addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.addHeader("Access-Control-Allow-Headers", "Content-Type");
    response.addHeader("Access-Control-Max-Age", "86400"); // 24 hours
    response.setStatus(200);
}

void UsersResource::handleRequest(const Wt::Http::Request& request,
                               Wt::Http::Response& response) {

        if (request.method() == "OPTIONS") {
            handleOptionsRequest(request, response);
            return;
        }

        std::string path = request.pathInfo();

        // all these routes are relative to /users
        
        if (path == "/list") {
            // Handle the /send_email route
            listUsers(request, response);
        } else if (path == "/add") {
            // Handle the /add
            addUser(request, response);
        } else if (path == "/delete") {
            // Handle the /delete
            deleteUser(request, response);
        } else if (path == "/get") {
            // Handle the /get
            getUser(request, response);  
        } else if (path == "/update") {
            // Handle the /update
            if (request.method() == "POST") {
                updateUser(request, response);
            } else {
                response.setStatus(405);  // Method Not Allowed
                response.out() << "Method Not Allowed. Please use POST.";
            }
        }    
        else {
            response.setStatus(404);  // Not Found
            response.out() << "Route not found";
        }

}


void UsersResource::listUsers(const Wt::Http::Request& request, Wt::Http::Response& response) {


        try {
            Wt::Dbo::Transaction transaction(session);

            typedef Wt::Dbo::collection< Wt::Dbo::ptr<User> > Users;
            Users users = session.find<User>();

            Wt::Json::Array usersArray;
            for (Users::const_iterator i = users.begin(); i != users.end(); ++i) {
                Wt::Json::Object userJson;
                userJson["name"] = Wt::Json::Value((*i)->name);
                userJson["password"] = Wt::Json::Value((*i)->password);
                userJson["email"] = Wt::Json::Value((*i)->email);
                userJson["mobile"] = Wt::Json::Value((*i)->mobile);
                // Add other User fields as needed
                usersArray.push_back(userJson);
            }

            transaction.commit();

            Wt::Json::Object json;
            json["path"] = "List Users";
            json["users"] = usersArray;

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
            } catch (...) {
                response.setStatus(500);  // Internal Server Error
                response.out() << "Unknown error";
            }

}

void UsersResource::addUser(const Wt::Http::Request& request, Wt::Http::Response& response) {

    // Added by Christine to fix cross-origin requests
    response.addHeader("Access-Control-Allow-Origin", "*"); 
    response.addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.addHeader("Access-Control-Allow-Headers", "Content-Type");

    std::istreambuf_iterator<char> eos;
    
    if (request.method() == "POST") {
        std::string body = std::string(std::istreambuf_iterator<char>(request.in()), eos);
        Wt::Json::Object json;
        Wt::Json::parse(body, json, false);

        std::string name = json.get("name");
        std::string password = json.get("password");
        std::string email = json.get("email");
        std::string mobile = json.get("mobile");
        std::string securitysystem = json.get("securitysystem");

        {
            Wt::Dbo::Transaction transaction(session);
            std::unique_ptr<User> person(new User());
            person->name = name;
            person->password = password;
            person->email = email;
            person->mobile = mobile;
            int ssid = session.query<int>("select id from User WHERE name = ?").bind("Home");
            person->securitysystem = session.find<SecuritySystem>().where("Name = ?").bind(securitysystem);
            session.add(std::move(person));
            transaction.commit();
        }

        response.setMimeType("application/json");
        response.out() << "{\"status\": \"success\"}";
    } else {
        response.setStatus(405);  // Method Not Allowed
        response.out() << "Method Not Allowed. Please use POST.";
    }
}


void UsersResource::getUser(const Wt::Http::Request& request, Wt::Http::Response& response) {
        
        try {
        // Parse email address from request (assuming it's a query parameter)
            
        const std::string* emailPtr = request.getParameter("email");
        if (!emailPtr) {
            response.setStatus(400);  // Bad Request
            response.out() << "Missing email parameter";
            return;
        }
        
        std::string email = *emailPtr;
        
        
        if (email.empty()) {
            response.setStatus(400);  // Bad Request
            response.out() << "Missing email parameter";
            return;
        }

        Wt::Dbo::Transaction transaction(session);

        // Find user by email
        Wt::Dbo::ptr<User> user = session.find<User>().where("email = ?").bind(email);

        if (!user) {
            response.setStatus(404);  // Not Found
            response.out() << "User not found";
        } else {
            // Optionally delete user (uncomment line below to enable deletion)
            // session.remove(user);

            Wt::Json::Object json;
            json["path"] = "Get User";
            json["name"] = Wt::Json::Value(user->name);
            json["password"] = Wt::Json::Value(user->password);
            json["email"] = Wt::Json::Value(user->email);
            json["mobile"] = Wt::Json::Value(user->mobile);
            

            std::string jsonString = Wt::Json::serialize(json);

            response.setMimeType("application/json");
            response.addHeader("Access-Control-Allow-Headers", "Content-Type"); // Added by Christine since we had the browser blocking requests due to CORS restrictions
            response.addHeader("Access-Control-Allow-Origin", "*");  // Optional: for cross-origin requests
            response.out() << jsonString;
        }

        transaction.commit();

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

void UsersResource::deleteUser(const Wt::Http::Request& request, Wt::Http::Response& response) {
    try {
        // Assuming the email is passed as a query parameter
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
        } else {
            // Delete user
            user.remove();

            Wt::Json::Object json;
            json["path"] = "Delete User";
            json["email"] = Wt::Json::Value(email);

            std::string jsonString = Wt::Json::serialize(json);

            response.setMimeType("application/json");
            response.addHeader("Access-Control-Allow-Origin", "*");  // Optional: for cross-origin requests
            response.out() << jsonString;
        }

        transaction.commit();

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


void UsersResource::updateUser(const Wt::Http::Request& request, Wt::Http::Response& response) {
    try {
        // Parse the JSON body
        // std::string body = request.body();
        std::istreambuf_iterator<char> eos;

        Wt::Json::Object json;
        std::string body = std::string(std::istreambuf_iterator<char>(request.in()), eos);
        Wt::Json::parse(body, json);
        
        // Get the email from the JSON object
        if (!json.contains("email")) {
            response.setStatus(400);  // Bad Request
            response.out() << "Missing email in JSON body";
            return;
        }
        std::string email = json.get("email");

        Wt::Dbo::Transaction transaction(session);

        // Find user by email
        Wt::Dbo::ptr<User> user = session.find<User>().where("email = ?").bind(email);

        if (!user) {
            response.setStatus(404);  // Not Found
            response.out() << "User not found";
        } else {
            // Update user information from the JSON object
            if (json.contains("name")) user.modify()->name = std::string(json.get("name"));
            if (json.contains("password")) user.modify()->password = std::string(json.get("password"));
            if (json.contains("mobile")) user.modify()->mobile = std::string(json.get("mobile"));

            transaction.commit();

            Wt::Json::Object responseJson;
            responseJson["path"] = "Update User";
            responseJson["email"] = Wt::Json::Value(email);

            std::string responseString = Wt::Json::serialize(responseJson);

            response.setMimeType("application/json");
            response.addHeader("Access-Control-Allow-Origin", "*");  // Optional: for cross-origin requests
            response.out() << responseString;
        }

    } catch (const Wt::Json::ParseError& e) {
        std::cerr << "JSON parse error: " << e.what() << std::endl;
        response.setStatus(400);  // Bad Request
        response.out() << "Invalid JSON body";
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

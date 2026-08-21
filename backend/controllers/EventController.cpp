/**
 * group 31
 * @file EventsController.cpp
 * @brief This file contains methods to call to handle events from devices
 * Class: CS3307
 * Date Created: Nov 20, 2023
*/

#include "EventController.h"
#include <Wt/Dbo/Dbo.h>
#include <string>
#include "../models/models.cpp"

EventController::EventController(Wt::Dbo::Session& session) : session(session) { }


// When an event occurs on the device
// 1) Event created in the Event Table
// 2) Query all subscriptions and put an Notification in the Notification Table
// 3) Query all subscriptions and send an email to the subscribed user
void EventController::fireEvent(std::string name, std::string timestamp, std::string type, std::string devicename) {
    
    
    // 1) Event created in the Event Table
    
    Wt::Dbo::Transaction transaction(session);

    std::unique_ptr<Event> event(new Event());
    event->name = name;
    event->timestamp = timestamp;
    event->type = type;
    event->device = session.find<Device>().where("name = ?").bind(devicename);

    Wt::Dbo::ptr<Event> eventPtr = session.add(std::move(event));

    transaction.commit();


    // 2) Query all subscriptions of type type and put an Notification in the Notification Table
    {
        Wt::Dbo::Transaction transaction(session);

        // Query all subscriptions of a particular type
        auto query = session.find<Subscription>().where("type = ?").bind(type);

        // Iterate over the queried subscriptions
        typedef Wt::Dbo::collection< Wt::Dbo::ptr<Subscription> > Subscriptions;
        Subscriptions subscriptions = query.resultList();

        for (auto& subscription : subscriptions) {

            std::unique_ptr<Notification> notification(new Notification());

            notification->timestamp = timestamp;

            notification->subscription = subscription;
            
            notification->event = eventPtr; 

            sendFakeEmail(subscription->user->email, subscription->message);
            sendRealEmail(subscription->user->email, subscription->message);

            session.add(std::move(notification));
        }

        transaction.commit();
    }

}

// List all event for a given device to the console
void EventController::listEvents(std::string devicename ) {
    Wt::Dbo::Transaction transaction(session);

    // Find device by name
    Wt::Dbo::ptr<Device> device = session.find<Device>().where("name = ?").bind(devicename);

    if (!device) {
        std::cout << "Device not found" << std::endl;
        return;
    }

    // Iterate over the device's events
    typedef Wt::Dbo::collection< Wt::Dbo::ptr<Event> > Events;
    Events events = device->events;

    for (auto& event : events) {
        std::cout << "Event: " << event->name << std::endl;
    }

    transaction.commit();
}

// Sends a fake email printing to the console
void EventController::sendFakeEmail(std::string email, std::string message) {
    std::cout << "Sending email to " << email << std::endl;
    std::cout << "Message: " << message << std::endl;
}

// Sends a real email using CURL
void EventController::sendRealEmail(std::string email, std::string message) {
    
    // CURL *curl = curl_easy_init();
    // if(curl) {
    //     struct curl_slist *recipients = NULL;
    //     recipients = curl_slist_append(recipients, "recipient@example.com");

    //     curl_easy_setopt(curl, CURLOPT_USERNAME, "your_username");
    //     curl_easy_setopt(curl, CURLOPT_PASSWORD, "your_password");
    //     curl_easy_setopt(curl, CURLOPT_URL, "smtp://smtp.example.com:587");
    //     curl_easy_setopt(curl, CURLOPT_MAIL_FROM, "sender@example.com");
    //     curl_easy_setopt(curl, CURLOPT_MAIL_RCPT, recipients);
    //     curl_easy_setopt(curl, CURLOPT_READDATA, "Subject: Test Email\nTo: recipient@example.com\nFrom: sender@example.com\n\nThis is a test email.");

    //     CURLcode res = curl_easy_perform(curl);
    //     if(res != CURLE_OK)
    //         response.out() << "Failed to send email: " << curl_easy_strerror(res);
    //     else
    //         response.out() << "Email sent successfully";

    //     curl_slist_free_all(recipients);
    //     curl_easy_cleanup(curl);
    // } else {
    //     response.out() << "Failed to initialize curl";
    // }

}


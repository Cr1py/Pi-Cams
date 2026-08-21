/**
 * group 31
 * @file models.cpp
 * @brief This file contains the models for the database
 * @details This file contains the models for the database
 * Class: CS3307
 * Date Created: Nov 20, 2023
*/

#include <Wt/Dbo/Dbo.h>
#include <string>


namespace dbo = Wt::Dbo;

class User;
class Device;
class Subscription;
class Notification;
class Event;

/**
 * Security System class
 * @brief This class represents a security system
 * @details You can have multiple security systems for different properties
*/
class SecuritySystem {
public:
    std::string name;
    std::string address;

    dbo::collection< dbo::ptr<Device> > devices;
    dbo::collection< dbo::ptr<User> > users;

    template<class Action>
    void persist(Action& a){
        dbo::field(a, name,"name");
        dbo::field(a, address,"address");
        dbo::hasMany(a, users, dbo::ManyToOne, "securitysystem");
        dbo::hasMany(a, devices, dbo::ManyToOne, "securitysystem");
    }  
};

/**
 * User class
 * @brief This class represents a user
 * @details A user is represented per security system
*/
class User {

public:
    std::string name;
    std::string password;
    std::string email;
    std::string mobile;
    dbo::ptr<SecuritySystem> securitysystem;
    
    dbo::collection< dbo::ptr<Subscription> > subscriptions;


    template<class Action>
    void persist(Action& a) {
        dbo::field(a, name,     "name");
        dbo::field(a, password, "password");
        dbo::field(a, email,     "email");
        dbo::field(a, mobile,    "mobile");

        dbo::belongsTo(a, securitysystem, "securitysystem");  // the belongs to refers to what is defined in the hasMany
        dbo::hasMany(a, subscriptions, dbo::ManyToOne, "user"); 
    }
    
};

/**
 * Device class
 * @brief This class represents a device
 * @details Examples are camera, motionsensor, audio, sniper
*/
class Device
{
public:
    std::string name;
    std::string type; // "camera", "audio", "motionsensor", "sniper"
    dbo::ptr<SecuritySystem> securitysystem;

    dbo::collection< dbo::ptr<Event> > events;
    dbo::collection< dbo::ptr<Subscription> > subcriptions; 
    
    template<class Action>
    void persist(Action& a) {
        dbo::field(a, name,     "name");
        dbo::field(a, type,     "type");

        dbo::hasMany(a, events, dbo::ManyToOne, "device");
        dbo::hasMany(a, subcriptions, dbo::ManyToOne, "device");
        dbo::belongsTo(a, securitysystem, "securitysystem");}  

};


/**
 * Subscription class
 * @brief This class represents a subscription to be alerted for events on a device
 * @details A subscription is to a device and a type of event for a given user
*/
class Subscription
{
public:
    std::string name;
    std::string message;
    std::string type; // "motion", "video", "audio", "shotsfired  
    dbo::ptr<User> user;
    dbo::ptr<Device> device;

    dbo::collection< dbo::ptr<Notification> > notifications;

    template<class Action>
    void persist(Action& a) {
        dbo::field(a, name,     "name");
        dbo::field(a, message, "message");
        dbo::field(a, type, "type");
        dbo::belongsTo(a, user, "user"); // the belongs to refers to what is defined in the hasMany
        dbo::belongsTo(a, device, "device"); // the belongs to refers to what is defined in the hasMany
        
        dbo::hasMany(a, notifications, dbo::ManyToOne, "subscription"); 
    }  
};

/**
 * Event class
 * @brief This class represents an event
 * @details An event is triggered by a device
*/
class Event
{
public:
    std::string name;
    std::string timestamp;
    std::string type; // "motion", "video", "audio", "shotsfired
    dbo::ptr<Device> device;

    dbo::collection< dbo::ptr<Notification> > notifications;

    template<class Action>
    void persist(Action& a){ 
        dbo::field(a, name,     "name");
        dbo::field(a, timestamp, "timestamp");
        dbo::field(a, type,     "type");
        dbo::belongsTo(a, device, "device"); // the belongs to refers to what is defined in the hasMany
        
        dbo::hasMany(a, notifications, dbo::ManyToOne, "event");
    }  
};


/**
 * Notification class
 * @brief This class represents a notification
 * @details A notification is sent to a user who has subscribed for a given event type on a device
*/
class Notification
{
public:
    std::string timestamp;
    dbo::ptr<Subscription> subscription;
    dbo::ptr<Event> event;
    
    template<class Action>
    void persist(Action& a){
        dbo::field(a, timestamp, "timestamp");
        dbo::belongsTo(a, subscription, "subscription"); // the belongs to refers to what is defined in the hasMany
        dbo::belongsTo(a, event, "event"); // the belongs to refers to what is defined in the hasMany
    }  
    
};

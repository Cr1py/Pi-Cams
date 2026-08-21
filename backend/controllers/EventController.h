#ifndef _EVENTCONTROLLER_
#define _EVENTCONTROLLER_

#include <Wt/WServer.h>
#include <Wt/WResource.h>
#include <Wt/Http/Response.h>
#include <Wt/Json/Object.h>
#include <Wt/Json/Serializer.h>



class EventController  {
    public:

        EventController(Wt::Dbo::Session& session);


        void fireEvent(std::string name, std::string timestamp, std::string type, std::string devicename);
        void listEvents(std::string devicename );
        void sendFakeEmail(std::string email, std::string message);
        void sendRealEmail(std::string email, std::string message);


    private:
        Wt::Dbo::Session& session;
};



#endif // _EVENTCONTROLLER_

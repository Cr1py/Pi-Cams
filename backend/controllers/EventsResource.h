
#ifndef _EVENTSRESOURCE_
#define _EVENTSRESOURCE_


#include <Wt/WServer.h>
#include <Wt/WResource.h>
#include <Wt/Http/Response.h>
#include <Wt/Json/Object.h>
#include <Wt/Json/Serializer.h>
#include <Wt/Json/Array.h>
#include <Wt/Dbo/Dbo.h>
#include "../models/models.cpp"


class EventsResource : public Wt::WResource {
public:
    
    EventsResource(Wt::Dbo::Session& session);

    virtual void handleRequest(const Wt::Http::Request& request,
                                Wt::Http::Response& response) override;

    void listEvents(const Wt::Http::Request& request, Wt::Http::Response& response);
    

private:
    Wt::Dbo::Session& session;

};

#endif // _EVENTSRESOURCE_
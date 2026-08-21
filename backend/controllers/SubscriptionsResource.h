#ifndef _SUBSCRIPTIONSSRESOURCE_
#define _SUBSCRIPTIONSSRESOURCE_

#include <Wt/WServer.h>
#include <Wt/WResource.h>
#include <Wt/Http/Response.h>
#include <Wt/Json/Object.h>
#include <Wt/Json/Serializer.h>


class SubscriptionsResource : public Wt::WResource {
    public:

        SubscriptionsResource(Wt::Dbo::Session& session);

        virtual void handleRequest(const Wt::Http::Request& request,
                                Wt::Http::Response& response) override;

        void listSubscriptions(const Wt::Http::Request& request, Wt::Http::Response& response);
        void addSubscription(const Wt::Http::Request& request, Wt::Http::Response& response);

    private:
        Wt::Dbo::Session& session;
};



#endif // _SUBSCRIPTIONSSRESOURCE_

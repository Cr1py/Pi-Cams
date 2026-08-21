#ifndef _USERSRESOURCE_
#define _USERSRESOURCE_

#include <Wt/WServer.h>
#include <Wt/WResource.h>
#include <Wt/Http/Response.h>
#include <Wt/Json/Object.h>
#include <Wt/Json/Serializer.h>


class UsersResource : public Wt::WResource {
    public:

        // Wt::Dbo::backend::Sqlite3& db;
        // Wt::Dbo::Session& session;

        void handleOptionsRequest(const Wt::Http::Request& request, Wt::Http::Response& response);

        UsersResource(Wt::Dbo::Session& session);
        
        virtual void handleRequest(const Wt::Http::Request& request,
                                Wt::Http::Response& response) override;

        void listUsers(const Wt::Http::Request& request, Wt::Http::Response& response);
        void addUser(const Wt::Http::Request& request, Wt::Http::Response& response);
        void getUser(const Wt::Http::Request& request, Wt::Http::Response& response);
        void deleteUser(const Wt::Http::Request& request, Wt::Http::Response& response);
        void updateUser(const Wt::Http::Request& request, Wt::Http::Response& response);

    private:
        Wt::Dbo::Session& session;

};



#endif // _USERSRESOURCE_
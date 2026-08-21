#ifndef _DEVICECONTROLLER_
#define _DEVICECONTROLLER_



void deviceThreadFunction();


class DeviceController  {
    public:

        DeviceController(Wt::Dbo::Session& session);

    private:
        Wt::Dbo::Session& session;

};


#endif // _DEVICECONTROLLER_
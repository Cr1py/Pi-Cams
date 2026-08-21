PICO code goes here

There will be interfaces ( ie methods that will be exposed by the servers controllers )  exposed by the server that this must call

This should run in its own non block thread and instantiate an Event Controller and then call fireEvent on the event controller when it detects an event

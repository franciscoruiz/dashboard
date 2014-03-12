import random

from twisted.internet import reactor
from twisted.internet.defer import inlineCallbacks

from autobahn.wamp.types import SubscribeOptions
from autobahn.twisted.util import sleep
from autobahn.twisted.wamp import ApplicationSession



class Server(ApplicationSession):
    """
    An application component that publishes events with no payload
    and with complex payloads every second.
    """

    def __init__(self, realm = "realm1"):
        ApplicationSession.__init__(self)
        self._realm = realm


    def onConnect(self):
        self.join(self._realm)


    @inlineCallbacks
    def onJoin(self, details):
        def publish_component_data(data):
            print 'Hub.publishing'
            
            self.publish('com.myapp.topic2', data)
        
        print 'Hub.subscribing'
            
        yield self.subscribe(
            publish_component_data,
            'com.myapp.component',
            )


class Component(ApplicationSession):
    
    def __init__(self, realm = "realm1"):
        ApplicationSession.__init__(self)
        self._realm = realm

    def onConnect(self):
        self.join(self._realm)

    @inlineCallbacks
    def onJoin(self, details):
        counter = 0
        while True:
            print 'Component.publishing'
            
            obj = {'counter': counter, 'foo': [1, 2, 3]}
            self.publish('com.myapp.component', obj)

            counter += 1
            yield sleep(3)

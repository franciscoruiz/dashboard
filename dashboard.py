from twisted.internet.defer import inlineCallbacks

from autobahn.twisted.util import sleep
from autobahn.twisted.wamp import ApplicationSession


_APPLICATION_REALM = 'realm1'


class DashboardComponent(ApplicationSession):

    def __init__(self):
        ApplicationSession.__init__(self)
        self._realm = _APPLICATION_REALM

    def onConnect(self):
        self.join(self._realm)

    def onJoin(self, details):
        self.generateData(details)


class ObjectGenerationComponent(DashboardComponent):
    
    @inlineCallbacks
    def generateData(self, details):
        counter = 0
        while True:
            obj = {'counter': counter, 'foo': [1, 2, 3]}
            self.publish('com.dashboard.objects', obj)

            counter += 1
            yield sleep(3)


class NumberGenerationComponent(DashboardComponent):
    
    @inlineCallbacks
    def generateData(self, details):
        counter = 0
        while True:
            self.publish('com.dashboard.numbers', counter)

            counter += 1
            yield sleep(1)

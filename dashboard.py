from twisted.internet.defer import inlineCallbacks

from autobahn.twisted.util import sleep
from autobahn.twisted.wamp import ApplicationSession


class Component(ApplicationSession):

    def __init__(self, realm='realm1'):
        ApplicationSession.__init__(self)
        self._realm = realm

    def onConnect(self):
        self.join(self._realm)

    @inlineCallbacks
    def onJoin(self, details):
        counter = 0
        while True:
            obj = {'counter': counter, 'foo': [1, 2, 3]}
            self.publish('com.dashboard.component', obj)

            counter += 1
            yield sleep(3)

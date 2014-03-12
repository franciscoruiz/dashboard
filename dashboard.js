try {
   var autobahn = require('autobahn');
} catch (e) {
   // when running in browser, AutobahnJS will
   // be included without a module system
}

var connection = new autobahn.Connection({
   url: 'ws://127.0.0.1:8080/ws',
   realm: 'realm1'}
);

connection.onopen = function (session) {

   function on_topic2(data) {
      console.log("Got event:", data);
   }

   session.subscribe('com.myapp.topic2', on_topic2);
};

connection.open();

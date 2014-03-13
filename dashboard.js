
var init = function (subscriptions) {
      var connection = new autobahn.Connection({
         url: 'ws://127.0.0.1:8080/ws',
         realm: 'realm1'
         });
      
      connection.onopen = function (session) {
            for (event_name in subscriptions) {
                  session.subscribe(event_name, subscriptions[event_name]);
            }
      };
      
      connection.open();
};


var event_logger = function (data) {
      console.log("Got event:", data);
};


// TODO: return the element with the rendered content
var render_template = function (template_id) {
      var template = document.querySelector(template_id);
      var template_content = document.importNode(template.content, true);
      document.body.appendChild(template_content);
};


var Component = function (template_id) {
      render_template(template_id);
      this.element = document.querySelector('#component');
      
      this.render('nothing yet');
};
Component.prototype = {
      render: function (data) {
            this.element.querySelector('span').textContent = JSON.stringify(data);
      }
};


var component = new Component('#template');

init({
      'com.myapp.topic2': event_logger,
      'com.myapp.topic2': function (data) {
            component.render(data);
      }
});

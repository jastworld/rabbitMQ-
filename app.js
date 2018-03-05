// on the request to root (localhost:3000/)
const express = require('express');
const router = express.Router();
var amqp = require('amqplib/callback_api');


router.post("/listen",(req,res)=>{
   //listen { keys: [array] }
   var amqp = require('amqplib/callback_api');


    amqp.connect('amqp://localhost', function(err, conn) {
      conn.createChannel(function(err, channel) {
        var exchange = 'hw3';

        channel.assertExchange(exchange, 'direct', {durable: false});

        channel.assertQueue('', {exclusive: true}, function(err, queue) {
          console.log(' [*] Waiting for logs. To exit press CTRL+C');

          for (var i = 0; i < req.body.keys.length; i++) {
            channel.bindQueue(queue.queue, exchange, req.body.keys[i]);
          }

          channel.consume(queue.queue, function(msg) {
            console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            res.json({
                "msg": msg.content.toString()
            });
          }, {noAck: true});
        });
      });
    });
   //return res.json({"msg": req.body.grid[11]});

});


router.post("/speak",(req,res)=>{
    var amqp = require('amqplib/callback_api');

    amqp.connect('amqp://localhost', function(err, conn) {
      conn.createChannel(function(err, channel) {
        var exchange = 'hw3';
        var message = req.body.msg;
        var key = req.body.key;
        channel.assertExchange(exchange, 'direct', {durable: false});
        channel.publish(exchange, key, new Buffer(message));
        console.log(" [x] Sent %s: '%s'", key, message);
      });
      res.status(200).send();
      //setTimeout(function() { conn.close(); process.exit(0) }, 500);
    });
});
/*
router.get('/send', function (req, res) {
    amqp.connect('amqp://localhost', function(err, conn) {
      conn.createChannel(function(err, ch) {
        var queue = 'hello';

        ch.assertQueue(queue, {durable: false});
        // Note: on Node 6 Buffer.from(msg) should be used
        ch.sendToQueue(queue, new Buffer('Hello fuck!'));
        console.log(" [x] Sent 'Hello World!'");
        res.send('<b>My</b> first express http server');
      });
      setTimeout(function() { conn.close(); }, 500);
    });



});

// On localhost:3000/welcome
router.get('/receive', function (req, res) {
    amqp.connect('amqp://localhost', function(err, conn) {
      conn.createChannel(function(err, ch) {
        var queue = 'hello';

        ch.assertQueue(queue, {durable: false});
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        ch.consume(queue, function(msg) {
          console.log(" [x] Received %s", msg.content.toString());
        }, {noAck: true});
      });
    });


    res.send('<b>Hello</b> welcome to my http server made with express');
});


router.get('/new_tesk',(req,res)=>{
    var amqp = require('amqplib/callback_api');

    amqp.connect('amqp://localhost', function(err, conn) {
      conn.createChannel(function(err, ch) {
        var queue = 'task_queue';
        var msg = process.argv.slice(2).join(' ') || "Hello World!";

        ch.assertQueue(queue, {durable: true});
        ch.sendToQueue(queue, new Buffer(msg), {persistent: true});
        console.log(" [x] Sent '%s'", msg);
      });
      //setTimeout(function() { conn.close(); process.exit(0) }, 500);
    });
});


router.get('/worker',(req,res)=>{
    var amqp = require('amqplib/callback_api');
    res.send('<b>My</b> first express http server');
    amqp.connect('amqp://localhost', function(err, conn) {
      conn.createChannel(function(err, ch) {
        var queue = 'task_queue';

        ch.assertQueue(queue, {durable: true});
        ch.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        ch.consume(queue, function(msg) {
          var secs = msg.content.toString().split('.').length - 1;

          console.log(" [x] Received %s", msg.content.toString());

          setTimeout(function() {
            console.log(" [x] Done");
            ch.ack(msg);
          }, secs * 100000);
        }, {noAck: false});
      });
    });
});*/

// Change the 404 message modifing the middleware
router.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});


module.exports = router;
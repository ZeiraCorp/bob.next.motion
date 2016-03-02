var mqtt = require('mqtt');
var config = require('./app.config');
var chalk = require('chalk');

var mqttClientId = "motionModule"
  , mqttBrokerConnectionString = "mqtt://"+config().mqttBroker+":"+config().mqttPort+"?clientId=" + mqttClientId;

var Gopigo = require('node-gopigo').Gopigo;
var Commands = Gopigo.commands
var Robot = Gopigo.robot

var robot = new Robot({
  minVoltage: 5.5,
  criticalVoltage: 1.2,
  debug: true
});
console.log(chalk.green(mqttBrokerConnectionString));

robot.on('init', function onInit(res) {
  if (res) {
    console.log('GoPiGo Ready!')
    var res1 = robot.motion.increaseSpeed();
    console.log('Increasing speed::' + res1);

    var res2 = robot.motion.increaseSpeed();
    console.log('Increasing speed::' + res2);

    var Bobby = {
      reset: function() {
        robot.reset();
      },
      moveForward: function() {
        var res = robot.motion.forward(false);
        console.log('Moving forward::' + res);
      },
      moveBackward: function() {
        var res = robot.motion.backward(false);
        console.log('Moving backward::' + res);
      },
      turnLeft: function() {
        var res = robot.motion.left();
        console.log('Turning left::' + res);
      },
      turnRight: function() {
        var res = robot.motion.right();
        console.log('Turning right::' + res);
      },
      stop: function() {
        var res = robot.motion.stop();
        console.log('Stop::' + res);
      }
    };

    var mqttClient = mqtt.connect(mqttBrokerConnectionString);

    mqttClient.on("connect", function(){
      mqttClient.subscribe("motion/#");
      console.log(chalk.magenta("MQTT client "+ mqttClientId +" is Listening ..."));

      mqttClient.publish('news', JSON.stringify({
        message: "Motion module is ready"
      }));
    });

    mqttClient.on('message', function(topic, message) {
      console.log(chalk.magenta("message on topic:" + topic + ":" + message.toString()));
      //var json = JSON.parse(message.toString());

      if (topic == "motion/right") {
        Bobby.turnRight();
        //sleep.sleep(1)
      }

      if (topic == "motion/left") {
        Bobby.turnLeft();
        //sleep.sleep(1)
      }

      if (topic == "motion/forward") {
        Bobby.moveForward();
        //sleep.sleep(1)
      }

      if (topic == "motion/backward") {
        Bobby.moveBackward();
        //sleep.sleep(1)
      }

      if (topic == "motion/stop") {
        Bobby.stop();
        //sleep.sleep(1)
      }

    });

  } else {
    console.log('Something went wrong during the init.')
  }
});

robot.on('error', function onError(err) {
  console.log(chalk.red('Something went wrong'));
  console.log(chalk.gray(err));
});

robot.on('normalVoltage', function onNormalVoltage(voltage) {
  console.log(chalk.green('Voltage is ok ['+voltage+']'));
});
robot.on('lowVoltage', function onLowVoltage(voltage) {
  console.log(chalk.yellow('(!!) Voltage is low ['+voltage+']'));
});
robot.on('criticalVoltage', function onCriticalVoltage(voltage) {
  console.log(chalk.red('(!!!) Voltage is critical ['+voltage+']'));
});


robot.init();





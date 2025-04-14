
const { CourseRepo } = require('../course_repo');
const Course = require("../course");
const e = require('express');

class Consumer {
    // channel is the channel to listen to messages
    // rpcQueue is the queue to consume messages from
    // eventEmitter is the event emitter to handle the communication between the producer and consumer

  constructor(channel, rpcQueue) {
    this.channel = channel;
    this.rpcQueue = rpcQueue;
  }

  async consumeMessages() {
    console.log("Ready to consume messages...");

    // Ensures that the consumer remains continuously active,
    // listening for incoming messages on the rpcQueue.
    this.channel.consume(
        this.rpcQueue,
        async (message) => {
          console.log("Message received:", message.content.toString());
          const { correlationId, replyTo } = message.properties;
  
          if (!correlationId || !replyTo) {
            console.log("Missing some properties...");
            return;
          }
          // To understand which function to call (query) to reterieve the data that the client needs
          //const operation = message.properties.headers.function;

          let response = {};

          const { id } = JSON.parse(message.content.toString()); 

          console.log("id: ", id);

          const courseRepo = new CourseRepo(Course);

          const courses = await courseRepo.getCoursesByStudentId(id);
      
          
          if (!courses) {
            console.log("courses not found");
            response = { error: "courses not found" };
          }
          else {
            response =  courses ;
          }
          
   
           
          // Produce the response back to the client
            const RabbitMQCourse = require("./course-s");
            await RabbitMQCourse.initPromise;  // Wait for RabbitMQCourse to be initialized
            
            await RabbitMQCourse.produce(response, correlationId, replyTo);    
        },
        {
        noAck: true, 
      }
    );
  }
}

module.exports = Consumer;
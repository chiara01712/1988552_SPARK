
const { UserRepo } = require('../user_repo');
const User = require("../user");
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

          const userRepo = new UserRepo(User);

          const user = await userRepo.getUserById(id);
        
          console.log("User is:", user);
          
          if (!user) {
            console.log("User not found");
            response = { error: "User not found" };
          }
          else {
            response =  user.username ;
          }
          
   
           
          // Produce the response back to the client
            const RabbitMQUser = require("./user-s");
            await RabbitMQUser.initPromise;  // Wait for RabbitMQUser to be initialized
            
            await RabbitMQUser.produce(response, correlationId, replyTo);    
        },
        {
        noAck: true, 
      }
    );
  }
}

module.exports = Consumer;

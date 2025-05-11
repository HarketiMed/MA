const { producer, consumer } = require('../config/kafka');

const initKafkaProducer = async () => {
  await producer.connect();
  console.log('Kafka Producer connected');
};

const initKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'sentiment-results', fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
      // Handle incoming sentiment analysis results
      // Update movie comments in database
    },
  });
  
  console.log('Kafka Consumer connected and subscribed');
};

const sendKafkaMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [
      { value: JSON.stringify(message) },
    ],
  });
};

module.exports = {
  initKafkaProducer,
  initKafkaConsumer,
  sendKafkaMessage,
};
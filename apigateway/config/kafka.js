const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'api-gateway',
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'api-gateway-group' });

module.exports = { kafka, producer, consumer };
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'comments-service',
  brokers: [process.env.KAFKA_BROKERS || 'kafka:9092']
});

const producer = kafka.producer();

async function sendToSentimentService(comment) {
  await producer.connect();
  
  await producer.send({
    topic: 'raw-comments',
    messages: [{
      value: JSON.stringify({
        commentId: comment._id.toString(),
        movieId: comment.movieId,
        text: comment.text,
        timestamp: new Date().toISOString()
      })
    }]
  });

  console.log(`Sent comment ${comment._id} for sentiment analysis`);
}

module.exports = { sendToSentimentService };
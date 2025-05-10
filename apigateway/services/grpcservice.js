const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const config = require('../config/grpc.config');

const PROTO_PATH = path.join(__dirname, '../../comments-service/proto/comments.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const commentsProto = grpc.loadPackageDefinition(packageDefinition).comments;

class CommentsService {
  constructor() {
    this.client = new commentsProto.CommentsService(
      config.commentsServiceUrl,
      grpc.credentials.createInsecure()
    );
  }

  getMovieComments(movieId) {
    return new Promise((resolve, reject) => {
      this.client.getComments({ movieId }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.comments);
        }
      });
    });
  }
}

module.exports = new CommentsService();
import mongoose from 'mongoose';

const { Schema } = mongoose;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
    unique: 'true',
  },
  token: {
    type: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now(), expires: 3600 },
});

const Token = mongoose.model('Tokens', tokenSchema, 'tokens');

export default Token;

import mongoose from 'mongoose';
const { Schema } = mongoose;
const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    productIds: [{  
      type: String,
      required: true,
    }],
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Order', orderSchema);

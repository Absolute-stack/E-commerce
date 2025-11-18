import mongoose from 'mongoose';

async function connectMongo() {
  mongoose.connection.on('connected', () =>
    console.log('✅ Database Connected')
  );

  await mongoose.connect(`${process.env.DB}`);
}

export default connectMongo;

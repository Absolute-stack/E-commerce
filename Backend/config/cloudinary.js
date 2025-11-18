import { v2 as cloudinary } from 'cloudinary';

async function connectCloud() {
  try {
    cloudinary.config({
      cloud_name: `${process.env.CLOUD_NAME}`,
      api_key: `${process.env.CLOUD_API_KEY}`,
      api_secret: `${process.env.CLOUD_API_SECRET}`,
    });

    await cloudinary.api.ping();

    console.log('✅ Connected to Cloudinary');
  } catch (error) {
    console.log(`${error.message}\t ❌ Failed to Connect To CLoudinary`);
  }
}

export default connectCloud;

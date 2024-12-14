// import * as dotenv from 'dotenv';
// dotenv.config();
export default () => ({
  port: process.env.PORT,

  dburl: process.env.MONGODB_URI,
  api_user_name: process.env.WC_API_USERNAME,
  api_user_secret: process.env.WC_API_SECRET,
  next_images_path: process.env.NEXT_IMAGES_PATH,
  wp_upsell_base: process.env.WP_UPSELL_BASE,
});

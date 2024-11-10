const { S3Client } = require("@aws-sdk/client-s3");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
const { AWS_SECRET_KEY, AWS_ACCESS_KEY, AWS_REGION } = process.env;

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

const getSignedUrl = async ({ key }) => {
  try {
    const presignedPost = await createPresignedPost(s3, {
      Bucket: "in-ourmoments",
      Key: key,
      Expires: 300, // seconds
      Conditions: [
        ["content-length-range", 0, 5 * 1000 * 1000], // 5MB 제한
        ["starts-with", "$Content-Type", "image/"],
      ],
    });
    return presignedPost;
  } catch (error) {
    throw new Error(`Failed to create presigned URL: ${error.message}`);
  }
};

module.exports = { s3, getSignedUrl };

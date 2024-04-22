import AWS from 'aws-sdk';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// Get region from environment variable or set a default value
const region = process.env.AWS_REGION;

// Logging the region for verification
console.log("Region:", region);

// Update AWS SDK configuration with credentials from environment variables
AWS.config.update({
    region: region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const secretsManager = new SecretsManagerClient({ region: region });

const getSecret = async () => {
    const secretId = process.env.SECRET_ID; // Get SecretId from environment variable
    if (!secretId) {
        throw new Error("SecretId not provided in environment variables.");
    }

    try {
        const command = new GetSecretValueCommand({ SecretId: secretId });
        const data = await secretsManager.send(command);
        const secret = JSON.parse(data.SecretString);
        return secret;
    } catch (err) {
        console.error("Error retrieving secret:", err);
        throw err; // Rethrow the error to handle it in the calling code
    }
};

export default getSecret;

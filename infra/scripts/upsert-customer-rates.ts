import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "ap-south-1";
const TABLE_NAME = "RateCards";

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

async function upsertCustomerRates() {
  const items = [
    {
      userType: "CUSTOMER",
      planType: "pro",
      displayName: "Pro Plan",
      description: "Professional tier rate card for Customers",
      basePrice: 5000,
      finalPrice: 2000,
      active: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      userType: "CUSTOMER",
      planType: "pro plus",
      displayName: "Pro Plus Plan",
      description: "Professional Plus tier rate card for Customers",
      basePrice: 10000,
      finalPrice: 5000,
      active: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  console.log("Starting upsert for CUSTOMER rate cards...");

  for (const item of items) {
    try {
      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: item,
        })
      );
      console.log(`Successfully upserted CUSTOMER rate card for plan: ${item.planType}`);
    } catch (error) {
      console.error(`Failed to upsert CUSTOMER rate card for plan: ${item.planType}`, error);
      process.exit(1);
    }
  }
}

upsertCustomerRates();

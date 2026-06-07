import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "ap-south-1";
const TABLE_NAME = "SiteTemplates";

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

async function upsertSiteTemplates() {
  const items = [
    {
      name: "Boss Baby",
      category: "Birthday",
      themeCode: "BIR1",
      sitePreviewImage: "/site_images/bir1.png",
      siteUrl: "https://bir1.eventmacha.com",
      orderedCount: 0,
      diyIndicator: true,
      cloudfrontId: "d1qvbwo88t0xdz.cloudfront.net",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      name: "Luxury Aesthetic",
      category: "Wedding",
      themeCode: "WED01",
      sitePreviewImage: "/site_images/wed1.png",
      siteUrl: "https://wed1.eventmacha.com",
      orderedCount: 0,
      diyIndicator: false,
      cloudfrontId: "d2erzgeomjmaxz.cloudfront.net",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      name: "Modern Aesthetic",
      category: "Wedding",
      themeCode: "wed2",
      sitePreviewImage: "/site_images/wed2.png",
      siteUrl: "https://wed2.eventmacha.com",
      orderedCount: 0,
      diyIndicator: false,
      cloudfrontId: "d33yotw5xxbkez.cloudfront.net",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      name: "Golden Union",
      category: "Wedding",
      themeCode: "wed3",
      sitePreviewImage: "/site_images/wed3.png",
      siteUrl: "https://wed3.eventmacha.com",
      orderedCount: 0,
      diyIndicator: false,
      cloudfrontId: "d5vmnnvqj65fw.cloudfront.net",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      name: "Tiny Tales",
      category: "Birthday",
      themeCode: "bir2",
      sitePreviewImage: "/site_images/bir2.png",
      siteUrl: "https://bir2.eventmacha.com",
      orderedCount: 0,
      diyIndicator: true,
      cloudfrontId: "d1ih0v5sg6p6dl.cloudfront.net",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      name: "Mountain Vibe",
      category: "Wedding",
      themeCode: "wed4",
      sitePreviewImage: "/site_images/wed4.png",
      siteUrl: "https://wed4.eventmacha.com",
      orderedCount: 0,
      diyIndicator: false,
      cloudfrontId: "d2dsrf313q2gmn.cloudfront.net",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      name: "Royal Twilight",
      category: "Wedding",
      themeCode: "wed5",
      sitePreviewImage: "/site_images/wed5.png",
      siteUrl: "https://wed5.eventmacha.com",
      orderedCount: 0,
      diyIndicator: false,
      cloudfrontId: "dh3ui37r8mrx1.cloudfront.net",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      name: "Radha Krishna",
      category: "Wedding",
      themeCode: "wed6",
      sitePreviewImage: "/site_images/wed6.png",
      siteUrl: "https://wed6.eventmacha.com",
      orderedCount: 0,
      diyIndicator: false,
      cloudfrontId: "d10urcl9ysko3u.cloudfront.net",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  ];

  console.log("Starting upsert for site templates...");

  for (const item of items) {
    try {
      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: item,
        })
      );
      console.log(`Successfully upserted site template for themeCode: ${item.themeCode}`);
    } catch (error) {
      console.error(`Failed to upsert site template for themeCode: ${item.themeCode}`, error);
      process.exit(1);
    }
  }
}

upsertSiteTemplates();

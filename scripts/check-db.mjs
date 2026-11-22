import "dotenv/config";
import dns from "node:dns/promises";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

console.log("\n🔍 Checking MongoDB Configuration...");

if (!uri) {
  console.error("❌ MONGODB_URI is not set in .env!");
  process.exit(1);
}

const maskedUri = uri.replace(/:([^:@]+)@/, ":****@");
console.log(`📡 Target URI: ${maskedUri}`);

async function runCheck() {
  if (uri.startsWith("mongodb+srv://")) {
    const host = uri.replace("mongodb+srv://", "").split("/")[0].split("@").pop()?.split("?")[0];
    if (host) {
      console.log(`🌐 Resolving DNS SRV record for: _mongodb._tcp.${host}...`);
      try {
        const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${host}`);
        console.log(`✅ SRV DNS records resolved (${srvRecords.length} host(s) found).`);
      } catch (err) {
        console.error(`\n❌ DNS Resolution Failed (${err.code}): Cannot find MongoDB host "${host}".`);
        console.error("\n💡 Possible Reasons:");
        console.error("  1. Inactivity: Free MongoDB Atlas clusters (M0) auto-pause after 60 days.");
        console.error("     -> Log in to https://cloud.mongodb.com and click 'Resume'.");
        console.error("  2. Cluster Renamed / Deleted: The cluster was recreated with a new subdomain.");
        console.error("     -> Go to Atlas -> Connect -> Drivers and copy your latest connection string.");
        console.error("  3. Typo in .env MONGODB_URI.");
        process.exit(1);
      }
    }
  }

  console.log("🔌 Attempting connection to MongoDB...");
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, bufferCommands: false });
    console.log("✅ Successfully connected to MongoDB!\n");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ MongoDB Connection Failed: ${err.message}`);
    process.exit(1);
  }
}

runCheck();

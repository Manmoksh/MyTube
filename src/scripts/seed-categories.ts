import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
  "Cars and vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Film and animation",
  "How-to and style",
  "Music",
  "Pets and animals",
  "News and politics",
  "People and blogs",
  "Science and technology",
  "Sports",
  "Travel and events",
];
async function main() {
  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `Videos related to ${name.toLocaleLowerCase()} `,
    }));
    await db.insert(categories).values(values);
    console.log("category seeded successfully");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}
main();

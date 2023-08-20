const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello,world!");
})

app.get("/dreams", async (req, res) => {
  try {
    const dreamSnapshot = await db.collection("dreams").get();
    const dreams = dreamSnapshot.docs.map((doc) => doc.data());
    res.json(dreams);
  } catch (error) {
    console.error("Error fetching dreams:", error);
    res.status(500).json({ message: "Error fetching dreams" });
  }
});

app.post("/dreams", async (req, res) => {
  const newDream = req.body;

  try {
    const newDreamRef = await db.collection("dreams").add(newDream);
    const createdDream = await newDreamRef.get();
    res.status(201).json(createdDream.data());
  } catch (error) {
    console.error("Error inserting dream:", error);
    res.status(500).json({ message: "Error inserting dream" });
  }
});

app.delete("/dreams/:id", async (req, res) => {
  const dreamId = req.params.id;

  try {
    const dreamRef = db.collection("dreams").doc(dreamId);
    const dreamDoc = await dreamRef.get();

    if (!dreamDoc.exists) {
      res.status(404).json({ message: "Dream not found" });
    } else {
      await dreamRef.delete();
      res.status(200).json({ message: "Dream deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting dream:", error);
    res.status(500).json({ message: "Error deleting dream" });
  }
});

app.listen(() => console.log(`Server is running on Vercel`));

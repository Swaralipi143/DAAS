const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Publication = require("./models/Publication"); // Ensure this is the correct path to your schema

dotenv.config();

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Sample Publications Data
const publications = [
    {
        _id: ObjectId("67d9953440f276fb65d3332a"),
        title: "Coordination of phage genome degradation versus host genome protection by a bifunctional restriction-modification enzyme visualized by CryoEM",
        authors: ["Betty W. Shen", "Joel D. Quispe","Yvette Luyten", "Benjamin E. McGough", "Richard D. Morgan", "Barry L. Stoddard"],
        category: "Medicine",
        year: 2021,
        openAccess: true,
        impactFactor: 9.1,
        downloadLinks: {
            pdf: "https://drive.google.com/file/d/169u6razGNW-iq1LsQapCWjyjTNWQuneN/view?usp=drive_link",
            epub: "https://drive.google.com/file/d/1Jfgty0Upxwiy95oyor5jqi7J7PFsUdw_/view?usp=drive_link",
            html: "https://drive.google.com/file/d/1-NxLHsTN4Qrn6NnjLFYV12a2ms82Zs3C/view?usp=drive_link"
        }
    },
    {
        _id: ObjectId("67d997ab5b650d8024ad7844"),
        title: "Crystal structure of human PACRG in complex with MEIG1 reveals roles in axoneme formation and tubulin binding",
        authors: ["Nimra Khan", "Dylan Pelletier", "Thomas S. McAlear", "...","Susanne Bechstedt", "Khanh Huy Bui", "Jean-Franc¸ ois Trempe"],
        category: "Medicine",
        year: 2021,
        openAccess: true,
        impactFactor: 7.8,
        downloadLinks: {
            pdf: "https://drive.google.com/file/d/1fbxPqqb-gs5XX0MAJIdzbAhmiiAmIGfy/view?usp=drive_link",
            epub: "https://drive.google.com/file/d/1OzgzVePz-jHJomYconhxTSD4ZsvVzSIy/view?usp=drive_link",
            html: "https://drive.google.com/file/d/1Ef-Bw98HjXn5wrLqNc74VfhdHUnxxMmS/view?usp=drive_link"
        }
    }
];

// Insert Data into Database
const seedDatabase = async () => {
    try {
        await Publication.insertMany(publications);
        console.log("✅ Sample data inserted successfully!");
        mongoose.connection.close(); // Close connection after seeding
    } catch (err) {
        console.error("❌ Error seeding database:", err);
    }
};

seedDatabase();

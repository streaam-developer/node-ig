const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');

const ig = new IgApiClient();

// ====== EDIT HERE ======
const USERNAME = "bat.5916445";
const PASSWORD = "rMuD@e5HH5vuvJE";
const VIDEO_PATH = "./video.mp4"; // your video path
const CAPTION = "Hello from node bot 🚀";
// =======================

async function loginAndSaveSession() {
    ig.state.generateDevice(USERNAME);

    // load session if exists
    if (fs.existsSync("session.json")) {
        console.log("🔁 Loading saved session...");
        const session = JSON.parse(fs.readFileSync("session.json"));
        await ig.state.deserialize(session);
        return true;
    }

    console.log("🔐 Logging in...");
    await ig.account.login(USERNAME, PASSWORD);

    // save session
    const serialized = await ig.state.serialize();
    delete serialized.constants;

    fs.writeFileSync("session.json", JSON.stringify(serialized));
    console.log("✅ Session saved");
}

async function uploadVideo() {
    try {
        await loginAndSaveSession();

        console.log("📤 Uploading video...");

        const videoBuffer = fs.readFileSync(VIDEO_PATH);

        await ig.publish.video({
            video: videoBuffer,
            caption: CAPTION,
        });

        console.log("🎉 Video uploaded successfully!");
    } catch (err) {
        console.log("❌ Error:", err.message);
    }
}

uploadVideo();

const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');

const ig = new IgApiClient();

// ===== EDIT =====
const USERNAME = "bat.5916445";
const PASSWORD = "rMuD@e5HH5vuvJE";
const VIDEO_PATH = "./reel.mp4";
const CAPTION = "My reel from bot 🚀";
// =================

async function login() {
    ig.state.generateDevice(USERNAME);

    if (fs.existsSync("session.json")) {
        try {
            console.log("🔁 Loading session...");
            const session = JSON.parse(fs.readFileSync("session.json"));
            await ig.state.deserialize(session);
            await ig.account.currentUser();
            console.log("✅ Session OK");
            return;
        } catch {
            console.log("⚠️ Session expired, relogin");
        }
    }

    console.log("🔐 Login fresh...");
    await ig.simulate.preLoginFlow();
    await ig.account.login(USERNAME, PASSWORD);
    await ig.simulate.postLoginFlow();

    const serialized = await ig.state.serialize();
    delete serialized.constants;
    fs.writeFileSync("session.json", JSON.stringify(serialized));
    console.log("✅ Session saved");
}

async function uploadReel() {
    try {
        await login();

        console.log("📤 Uploading reel...");

        const video = fs.readFileSync(VIDEO_PATH);

        await ig.publish.video({
            video: video,
            caption: CAPTION,
            product_type: "clips", // important for reels
        });

        console.log("🎉 Reel uploaded successfully!");
    } catch (e) {
        console.log("❌ Error:", e.response?.body || e.message);
    }
}

uploadReel();

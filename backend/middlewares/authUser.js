const { clerkClient } = require("@clerk/clerk-sdk-node");
const User = require("../models/userModel"); // adjust path accordingly

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    // Use the correct Clerk method to verify the token (usually verifySessionToken)
    // But clerkClient.verifyToken can also work if you are sure
    const session = await clerkClient.verifyToken(token);
    console.log("Clerk session:", session);

    // Clerk user ID is usually in session.sub
    const clerkUserId = session.sub;

    if (!clerkUserId) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    // Attach session and claims to req.auth for downstream use
    req.auth = {
      session,
      sessionClaims: session.sessionClaims || session.claims || session, // fallback for Clerk SDK differences
    };

    // Try to find user in MongoDB
    let user = await User.findOne({ clerkId: clerkUserId });

    // If not found, fetch user info from Clerk
    if (!user) {
      // Fetch user info from Clerk
      const clerkUser = await clerkClient.users.getUser(clerkUserId);

      const email =
        (clerkUser.email_addresses &&
          clerkUser.email_addresses[0] &&
          clerkUser.email_addresses[0].email_address) ||
        clerkUser.email_address ||
        clerkUser.primary_email_address?.email_address ||
        (clerkUser.username
          ? clerkUser.username + "@noemail.clerk"
          : clerkUserId + "@noemail.clerk");

      // Use Clerk metadata if available
      const meta = clerkUser.unsafeMetadata || {};
      const name =
        meta.name ||
        [clerkUser.first_name, clerkUser.last_name]
          .filter(Boolean)
          .join(" ")
          .trim() ||
        clerkUser.username ||
        email;
      const dob = meta.dob || "Not Selected";
      const gender = meta.gender || "Not Selected";
      const image = clerkUser.image_url || "";

      user = await User.create({
        clerkId: clerkUserId,
        name,
        dob,
        gender,
        email,
        image,
      });
    }

    req.user = user; // attach full user object if needed
    next();
  } catch (err) {
    console.error("Clerk Auth Error:", err);
    if (err.message && err.message.includes("JWT expired")) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = authUser;

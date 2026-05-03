import { type Request, type Response } from "express";
import ApiError from "../../common/utils/api-error.js";
import admin from "../../common/firebase/firebase.js";
import { db } from "../../../db/config.js";
import { userTable } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { env } from "../../../db/env.js";
import ApiResponse from "../../common/utils/api-response.js";

const signin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return ApiError.badRequest("Firebase ID Token required");
    }

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);

    const { uid, email, name, picture } = decoded;

    if (!email) {
      return ApiError.badRequest("Email not found in token");
    }
    console.log("dqfvd", decoded);

    // Check if user already exists
    const userExists = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    let user;

    if (userExists.length > 0) {
      user = userExists[0];
    } else {
      const newUser = await db
        .insert(userTable)
        .values({
          email,
          name,
          profilePic: picture,
          providerId: uid,
        })
        .returning();

      user = newUser[0];
    }
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const token = jwt.sign(user, env.TOKEN_SECRET, {
      expiresIn: "7d",
    });

    ApiResponse.ok(res, "SignIn Sucessfull", { user, token });
  } catch (error) {
    console.error("Signin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { signin };

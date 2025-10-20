import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Webhook } from "svix";
// Remove this import as it's not available in the server package

const prisma = new PrismaClient();

// Clerk webhook handler
export const handleClerkWebhook = async (req: Request, res: Response) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
    }

    // Get the headers
    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ error: "Error occured -- no svix headers" });
    }

    // Get the body
    const body = JSON.stringify(req.body);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: any;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return res.status(400).json({ error: "Error occured" });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, public_metadata } = evt.data;
      
      const email = email_addresses[0]?.email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim() || "User";
      const role = (public_metadata?.role as string) || "CUSTOMER";

      // Create user in database
      await prisma.users.create({
        data: {
          clerkId: id,
          name,
          email: email || "",
          role: role as "CUSTOMER" | "DEALER" | "ADMIN",
          isApproved: role === "ADMIN" // Auto-approve admins
        }
      });

      console.log(`User created: ${name} (${email}) with role: ${role}`);
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, public_metadata } = evt.data;
      
      const email = email_addresses[0]?.email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim() || "User";
      const role = (public_metadata?.role as string) || "CUSTOMER";

      // Update user in database
      await prisma.users.update({
        where: { clerkId: id },
        data: {
          name,
          email: email || "",
          role: role as "CUSTOMER" | "DEALER" | "ADMIN"
        }
      });

      console.log(`User updated: ${name} (${email}) with role: ${role}`);
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      // Delete user from database
      await prisma.users.delete({
        where: { clerkId: id }
      });

      console.log(`User deleted: ${id}`);
    }

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Error processing webhook" });
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.users.findUnique({
      where: { userId },
      select: {
        userId: true,
        clerkId: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        address: true,
        city: true,
        province: true,
        isApproved: true,
        businessName: true,
        businessLicense: true,
        storeName: true,
        createdAt: true,
        _count: {
          select: {
            productsAsDealer: true,
            ordersAsCustomer: true,
            ordersAsDealer: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const {
      phoneNumber,
      address,
      city,
      province,
      businessName,
      businessLicense,
      storeName
    } = req.body;

    const updateData: any = {};
    
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (province !== undefined) updateData.province = province;
    if (businessName !== undefined) updateData.businessName = businessName;
    if (businessLicense !== undefined) updateData.businessLicense = businessLicense;
    if (storeName !== undefined) updateData.storeName = storeName;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const user = await prisma.users.update({
      where: { userId },
      data: updateData,
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        address: true,
        city: true,
        province: true,
        isApproved: true,
        businessName: true,
        businessLicense: true,
        storeName: true
      }
    });

    res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Failed to update user profile" });
    }
  }
};

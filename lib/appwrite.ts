import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Models,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.rn.aora",
  projectId: "679c9404003bd33a6461",
  databaseId: "679c9679002b0aed98a2",
  userCollectionId: "679c96c80019bdcd1f1c",
  videoCollectionId: "679c97100014c46a0642",
  storageId: "679c98410007507574d7",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

interface User extends Models.Document {
  accountId: string;
  email: string;
  username: string;
  avatar: string;
}

export const createUser = async (
  email: string,
  password: string,
  username: string
): Promise<void> => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Account creation failed");
    const avatarUrl = avatars.getInitials(username);

    await SignInUser(email, password);
    const newUser = await databases.createDocument<User>(
      databaseId,
      userCollectionId,
      ID.unique(),
      { accountId: newAccount.$id, email, username, avatar: avatarUrl }
    );
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
};

export const SignInUser = async (
  email: string,
  password: string
): Promise<Models.Session> => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw new Error("No current account found.");
    }

    const currentUserResponse = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUserResponse || !currentUserResponse.documents.length) {
      throw new Error("No user document found for the current account.");
    }

    return currentUserResponse.documents[0];
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);

    // Map documents to VideoProps structure
    const formattedPosts = posts.documents.map((doc) => ({
      $id: doc.$id,
      title: doc.title, // Ensure these fields exist in your Appwrite database
      thumbnail: doc.thumbnail,
      video: doc.video,
      creator: {
        username: doc.creator_username, // Match these to your actual database fields
        avatar: doc.creator_avatar,
      },
    }));

    console.log("Formatted posts:", formattedPosts);
    return formattedPosts; // Return the formatted data
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(7),
    ]);

    // Map documents to VideoProps structure
    const formattedPosts = posts.documents.map((doc) => ({
      $id: doc.$id,
      title: doc.title,
      thumbnail: doc.thumbnail,
      video: doc.video,
      creator: {
        username: doc.creator_username,
        avatar: doc.creator_avatar,
      },
    }));

    console.log("Formatted latest posts:", formattedPosts);
    return formattedPosts; // Return the formatted data
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    throw new Error(error);
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
    console.log("User logged out successfully");
    // Optionally, redirect to your login screen here using your navigation logic
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Models,
  ImageGravity,
  Query,
  Storage,
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
const storage = new Storage(client);

interface User extends Models.Document {
  accountId: string;
  email: string;
  username: string;
  avatar: string;
}
// Interface for getFilePreview parameters
interface GetFilePreviewParams {
  fileId: string;
  type: "video" | "image";
}

// Interface for uploadFile parameters
interface UploadFileParams {
  file: FileType; // Define FileType based on the file structure if needed
  type: "video" | "image";
}

// Interface for createVideo parameters
interface CreateVideoForm {
  thumbnail: any;
  video: any;
  title: string;
  prompt: string;
  userId: string;
}

// Example FileType interface (adjust according to the actual file structure)
interface FileType {
  mimeType: string;
  [key: string]: any;
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
    console.log(error);

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

    const formattedPosts = posts.documents.map((doc) => ({
      $id: doc.$id,
      title: doc.title,
      thumbnail: doc.thumbnail,
      video: doc.video,
      creator: {
        username: doc.creator?.username || doc.creatorUsername || doc.username,
        avatar: doc.creator?.avatar || doc.creatorAvatar || doc.avatar,
      },
    }));

    return formattedPosts;
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

    return formattedPosts; // Return the formatted data
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);

    // Map documents to VideoProps structure
    const formattedPosts = posts.documents.map((doc) => ({
      $id: doc.$id,
      title: doc.title,
      thumbnail: doc.thumbnail,
      video: doc.video,
      creator: {
        username: doc.creator?.username, // Access the joined creator data
        avatar: doc.creator?.avatar,
      },
    }));

    return formattedPosts;
  } catch (error) {
    console.error("Error fetching search posts:", error);
    throw new Error(error);
  }
};

export const getUserPosts = async (userId: string) => {
  if (!userId) {
    console.log("No userId provided to getUserPosts");
    return [];
  }

  try {
    console.log("Fetching posts for userId:", userId);

    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
    ]);

    console.log("Raw posts response:", posts);

    const formattedPosts = posts.documents.map((doc) => ({
      $id: doc.$id,
      title: doc.title,
      thumbnail: doc.thumbnail,
      video: doc.video,
      creator: {
        username: doc.creator?.username,
        avatar: doc.creator?.avatar,
      },
    }));

    console.log("Formatted posts:", formattedPosts);
    return formattedPosts;
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    throw error;
  }
};
export const checkSession = async () => {
  try {
    const session = await account.getSession("current");
    if (session) {
      const user = await getCurrentUser();
      return { session, user };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.error("Error logging out:", error);
    throw new Error(error);
  }
};
export const getFilePreview = async (params: GetFilePreviewParams) => {
  const { fileId, type } = params;
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Center,
        100
      );
    } else {
      throw new Error("Invalid file type.");
    }

    if (!fileUrl) throw new Error("Failed to get file URL");

    return fileUrl;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
};

export const uploadFile = async (params: UploadFileParams) => {
  const { file, type } = params;
  if (!file) return null;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview({ fileId: uploadedFile.$id, type });
    return fileUrl;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Upload failed");
  }
};

export const createVideo = async (form: CreateVideoForm) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile({ file: form.thumbnail, type: "image" }),
      uploadFile({ file: form.video, type: "video" }),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    console.error("Error creating video:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create video"
    );
  }
};

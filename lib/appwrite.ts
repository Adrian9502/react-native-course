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

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

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
      config.databaseId,
      config.userCollectionId,
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

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {}
};

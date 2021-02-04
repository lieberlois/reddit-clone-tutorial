import DataLoader from "dataloader";
import { User } from "../entities/User";

// Keys [1, 7, 8, 9]
// [User 1, User 7, User 8, User 9]
export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = {};

    users.forEach((user) => (userIdToUser[user.id] = user));
    const userArray = userIds.map((userId) => userIdToUser[userId]);
    return userArray;
  });

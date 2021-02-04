import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";

// [{postId: 5, userId: 10}]
// return [{postId: 5, userId: 10, value: 1}]
export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any);
      const updootKeysToUpdoots: Record<string, Updoot> = {};

      updoots.forEach(
        (u) => (updootKeysToUpdoots[`${u.postId}.${u.userId}`] = u)
      );
      const updootArray = keys.map(
        (k) => updootKeysToUpdoots[`${k.postId}.${k.userId}`]
      );
      return updootArray;
    }
  );

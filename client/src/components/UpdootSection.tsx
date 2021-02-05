import { ApolloCache } from "@apollo/client";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Post, PostSnippetFragment, useVoteMutation, VoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (value: number, postId: number, cache: ApolloCache<VoteMutation>) => {
  const data = cache.readFragment<Pick<Post, "id" | "points" | "voteStatus">>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    let newPoints = data.points + value;
    if (data.voteStatus) {
      // If vote flips, then double
      newPoints += value;
    }
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value }
    }
    );
  }
}

const UpdootSection = ({ post }: UpdootSectionProps) => {
  const [vote] = useVoteMutation();
  const [loadingState, setLoadingState] = useState<"up-load" | "down-load" | "idle">("idle")

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        isLoading={loadingState === "up-load"}
        aria-label="chevron-up"
        icon={<ChevronUpIcon />}
        colorScheme={post.voteStatus === 1 ? "green" : ""}
        onClick={async () => {
          if (post.voteStatus === 1) return;
          setLoadingState("up-load");
          await vote({
            variables: { postId: post.id, value: 1 },
            update: (cache) => updateAfterVote(1, post.id, cache)
          })
          setLoadingState("idle");
        }}
      />
      {post.points}
      <IconButton
        isLoading={loadingState === "down-load"}
        aria-label="chevron-down"
        icon={<ChevronDownIcon />}
        colorScheme={post.voteStatus === -1 ? "red" : ""}
        onClick={async () => {
          if (post.voteStatus === -1) return;
          setLoadingState("down-load");
          await vote({
            variables: { postId: post.id, value: -1 },
            update: (cache) => updateAfterVote(-1, post.id, cache)
          })
          setLoadingState("idle");
        }}
      />
    </Flex>
  )
}

export default UpdootSection

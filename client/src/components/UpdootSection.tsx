import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const UpdootSection = ({ post }: UpdootSectionProps) => {
  const [, vote] = useVoteMutation();
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
          await vote({ postId: post.id, value: 1 })
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
          await vote({ postId: post.id, value: -1 })
          setLoadingState("idle");
        }}
      />
    </Flex>
  )
}

export default UpdootSection

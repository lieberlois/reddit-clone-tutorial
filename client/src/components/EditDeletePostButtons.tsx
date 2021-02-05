import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { Flex, IconButton } from '@chakra-ui/react'
import React from 'react'
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
  postId: number;
  creatorId: number
}

export const EditDeletePostButtons = ({ postId, creatorId }: EditDeletePostButtonsProps) => {
  const [deletePost] = useDeletePostMutation()
  const { data: meData } = useMeQuery()

  if (meData?.me?.id !== creatorId) {
    return null
  }

  return (
    <Flex flex={1} direction="column">
      <NextLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
        <IconButton
          ml="auto"
          mb={2}
          icon={<EditIcon />}
          aria-label="edit-post"
        />
      </NextLink>
      <IconButton
        ml="auto"
        icon={<DeleteIcon />}
        colorScheme="red"
        aria-label="delete-post"
        onClick={() => deletePost({
          variables: { id: postId }, update: (cache) => {
            cache.evict({
              // Post:72
              id: "Post:" + postId
            })
          }
        })}
      />
    </Flex>
  )
}

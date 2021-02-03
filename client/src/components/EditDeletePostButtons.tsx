import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { Flex, IconButton } from '@chakra-ui/react'
import React from 'react'
import NextLink from "next/link";
import { useDeletePostMutation } from '../generated/graphql';

interface EditDeletePostButtonsProps {
  postId: number;
}

export const EditDeletePostButtons = ({ postId }: EditDeletePostButtonsProps) => {
  const [, deletePost] = useDeletePostMutation()

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
        onClick={() => deletePost({ id: postId })}
      />
    </Flex>
  )
}

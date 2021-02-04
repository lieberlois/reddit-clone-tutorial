import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { useRouter } from "next/router";

export const NavBar = () => {
  const [{ data, fetching }] = useMeQuery()
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
  const router = useRouter();

  let body = null

  if (fetching) {

  } else if (!data?.me) {
    body = (
      <Flex>
        <NextLink href="/login">
          <Link mr={4}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </Flex>
    )
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button colorScheme="pink" as={Link} mr={4}>Create Post</Button>
        </NextLink>
        <Box mr={4}>{data.me.username}</Box>
        <Button
          variant="outline"
          isLoading={logoutFetching}
          onClick={async () => {
            await logout();
            router.reload();
          }}
          as={Link}
        >
          Logout
        </Button>
      </Flex >
    )
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4} align="center">
      <NextLink href="/">
        <Link>
          <Heading>RedditClone</Heading>
        </Link>
      </NextLink>
      <Box ml={"auto"}>{body}</Box>
    </Flex>

  )
}

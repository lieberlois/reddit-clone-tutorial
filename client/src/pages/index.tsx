import { Box, Center, Flex, Heading, Link, Stack, Text, Button } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link"

const Index = () => {
  const [variables, setVariables] = useState({ limit: 33, cursor: null as null | string })
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>No posts found.</div>
  }
  return (
    <Layout>
      <Flex mb={4} align="center">
        <Heading>RedditClone</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
          <>
            <Stack spacing={8}>
              {data!.posts.posts.map(p => (
                <Box p={5} shadow="md" borderWidth="1px" key={p.id}>
                  <Heading fontSize="xl">{p.title}</Heading>
                  <Text mt={4}>{p.textSnippet}</Text>
                </Box>
              ))}
            </Stack>
            {data && data.posts.hasMore && <Center>
              <Button
                variant="outline"
                colorScheme="black"
                isLoading={fetching}
                my={8}
                onClick={() => {
                  setVariables({
                    cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
                    limit: variables.limit
                  });
                }}
              >
                Load more
              </Button>
            </Center>}
          </>
        )
      }
    </Layout >
  )
}


export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

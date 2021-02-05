import { Box, Center, Flex, Heading, Link, Stack, Text, Button } from "@chakra-ui/react";
import React from "react";
import Layout from "../components/Layout";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import NextLink from "next/link"
import UpdootSection from "../components/UpdootSection";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { apolloWrapper } from "../utils/withApollo";

const Index = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { limit: 15, cursor: null as null | string },
    notifyOnNetworkStatusChange: true
  });

  const { data: user } = useMeQuery()

  if (!loading && !data) {
    return <div>No posts found.</div>
  }
  return (
    <Layout>
      {!data && loading ? (
        <div>Loading...</div>
      ) : (
          <>
            <Stack spacing={8}>
              {data!.posts.posts.map(p => !p ? null : (
                <Flex p={5} shadow="md" borderWidth="1px" key={p.id}>
                  <UpdootSection post={p} />
                  <Box flex={1}>
                    <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                      <Link>
                        <Heading fontSize="xl">{p.title}</Heading>
                      </Link>
                    </NextLink>
                    <Text>posted by: {p.creator.username}</Text>
                    <Flex align="center">
                      <Text mt={4}>{p.textSnippet}{p.textSnippet.length === 100 && "..."}</Text>
                      {user?.me?.id === p.creator.id && (
                        <EditDeletePostButtons key={p.id} postId={p.id} creatorId={p.creator.id} />
                      )}
                    </Flex>
                  </Box>
                </Flex>
              ))}
            </Stack>
            {data && data.posts.hasMore && <Center>
              <Button
                variant="outline"
                colorScheme="black"
                isLoading={loading}
                my={8}
                onClick={() => {
                  fetchMore({
                    variables: {
                      limit: variables?.limit,
                      cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
                    },
                    // Old way for updating, new way is in _app.tsx
                    // updateQuery: (previousValues, { fetchMoreResult }): PostsQuery => {
                    //   if (!fetchMoreResult) {
                    //     return previousValues as PostsQuery
                    //   }

                    //   return {
                    //     __typename: "Query",
                    //     posts: {
                    //       __typename: "PaginatedPosts",
                    //       hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                    //       posts: [
                    //         ...(previousValues as PostsQuery).posts.posts,
                    //         ...(fetchMoreResult as PostsQuery).posts.posts
                    //       ]
                    //     }
                    //   }
                    // }
                  })
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


export default apolloWrapper({ ssr: true })(Index);

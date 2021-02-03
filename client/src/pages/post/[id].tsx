import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import Layout from "../../components/Layout"
import { Heading } from "@chakra-ui/react";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { useMeQuery } from "../../generated/graphql";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";

const Post = ({ }) => {
  const [{ data, error, fetching }] = useGetPostFromUrl();
  const [{ data: user }] = useMeQuery()


  if (fetching) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Heading>Couldn't find your post.</Heading>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      {data.post.text}
      {user?.me?.id === data.post.creator.id && <EditDeletePostButtons postId={data.post.id} />}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
import React from "react";
import Layout from "../../components/Layout"
import { Heading } from "@chakra-ui/react";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { useMeQuery } from "../../generated/graphql";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { apolloWrapper } from "../../utils/withApollo";

const Post = ({ }) => {
  const { data, error, loading } = useGetPostFromUrl();
  const { data: user } = useMeQuery()


  if (loading) {
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
      {user?.me?.id === data.post.creator.id && <EditDeletePostButtons postId={data.post.id} creatorId={data.post.creator.id} />}
    </Layout>
  );
};

export default apolloWrapper({ ssr: true })(Post);;
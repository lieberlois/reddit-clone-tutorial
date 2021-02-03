import { Box, Button, Heading } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { InputField } from '../../../components/InputField';
import Layout from '../../../components/Layout';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetIntId } from '../../../utils/useGetIntId';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';

interface EditPostProps {

}

const EditPost = ({ }: EditPostProps) => {
  const [{ data, error, fetching }] = useGetPostFromUrl();
  const [, updatePost] = useUpdatePostMutation();
  const postId = useGetIntId();
  const router = useRouter()

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
    <div>
      <Layout variant="small">
        <Formik
          initialValues={{ title: data.post.title, text: data.post.text }}
          onSubmit={async (values) => {
            await updatePost({ id: postId, ...values });
            router.back()
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <InputField name="title" placeholder="Title of your post" label="Title" />
              <Box mt={4}>
                <InputField name="text" placeholder="..." label="Body" textarea />
              </Box>
              <Button
                mt={2}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
                disabled={values.text === data.post?.text && values.title === data.post?.title}
              >Update Post</Button>
            </Form>
          )}
        </Formik>
      </Layout>
    </div>
  )
}

export default withUrqlClient(createUrqlClient)(EditPost);

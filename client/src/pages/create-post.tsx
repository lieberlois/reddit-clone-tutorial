import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import Layout from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost = () => {
  useIsAuth()
  const [, createPost] = useCreatePostMutation();
  const router = useRouter()

  return (
    <div>
      <Layout variant="small">
        <Formik
          initialValues={{ title: "", text: "" }}
          onSubmit={async (values) => {
            const { error } = await createPost(values);
            if (!error)
              router.push("/")
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="title" placeholder="Title of your post" label="Title" />
              <Box mt={4}>
                <InputField name="text" placeholder="..." label="Body" textarea />
              </Box>
              <Button mt={2} type="submit" colorScheme="teal" isLoading={isSubmitting}>Create Post</Button>
            </Form>
          )}
        </Formik>
      </Layout>
    </div>
  )
}

export default withUrqlClient(createUrqlClient)(CreatePost);

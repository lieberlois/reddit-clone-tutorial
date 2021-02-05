import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import Layout from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { useIsAuth } from '../utils/useIsAuth';
import { apolloWrapper } from '../utils/withApollo';

const CreatePost = () => {
  useIsAuth()
  const [createPost] = useCreatePostMutation();
  const router = useRouter()

  return (
    <div>
      <Layout variant="small">
        <Formik
          initialValues={{ title: "", text: "" }}
          onSubmit={async (values) => {
            const { errors } = await createPost({
              variables: values,
              update: (cache) => cache.evict({ fieldName: "posts" })
            });

            if (!errors)
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

export default apolloWrapper({ ssr: false })(CreatePost);;

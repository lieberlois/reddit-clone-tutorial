import { Text, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React, { useState } from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from "../generated/graphql"
import { apolloWrapper } from '../utils/withApollo';

const ForgotPassword = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false)
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: values });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) => complete ? <Text>If an account with the given e-mail exists, we have sent a link to your email!</Text> : (
          <Form>
            <InputField name="email" placeholder="E-Mail" label="E-Mail" />
            <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting}>Request Password</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default apolloWrapper({ ssr: false })(ForgotPassword);;

import { Text, Button, Link, Flex } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from "next/link"

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = useState("")

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({ newPassword: values.newPassword, token });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token)
            }
            setErrors(errorMap)
          } else if (response.data?.changePassword.user) {
            // pw change worked
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="newPassword" placeholder="Your new password" label="New password" type="password" />
            {tokenError && (
              <Flex>
                <Text mr={2} style={{ color: "red" }}>{tokenError}</Text>
                <NextLink href="/forgot-password">
                  <Link>Forgot password again?</Link>
                </NextLink>
              </Flex>
            )}
            <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting}>Change Password</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string
  }
}

export default withUrqlClient(createUrqlClient)(ChangePassword as any)

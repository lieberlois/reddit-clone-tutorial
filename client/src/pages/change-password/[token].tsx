import { Text, Button, Link, Flex } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { MeDocument, MeQuery, useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from "next/link"
import { apolloWrapper } from '../../utils/withApollo';

const ChangePassword = () => {
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = useState("")

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token: typeof router.query.token === "string" ? router.query.token : ""
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>(
                {
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.changePassword.user,
                  }
                }
              );
              cache.evict({ fieldName: "posts" });
            }
          });
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

export default apolloWrapper({ ssr: false })(ChangePassword);;

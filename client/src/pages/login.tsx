import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik"
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router"
import NextLink from "next/link"
import { apolloWrapper } from "../utils/withApollo";


const Login = ({ }) => {
  const router = useRouter();
  const [login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>(
                {
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.login.user,
                  }
                }
              );
              cache.evict({ fieldName: "posts" });
            }
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
            // registration worked
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="usernameOrEmail" placeholder="Username or Email" label="Username or Email" />
            <Box mt={4}>
              <InputField name="password" placeholder="Password" label="Password" type="password" />
            </Box>
            <Flex mt={2}>
              <NextLink href="/forgot-password">
                <Link ml={"auto"}>Forgot password?</Link>
              </NextLink>
            </Flex>
            <Button mt={2} type="submit" colorScheme="teal" isLoading={isSubmitting}>Login</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default apolloWrapper({ ssr: false })(Login);

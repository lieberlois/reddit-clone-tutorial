import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik"
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router"
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link"


const Login = ({ }) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
            // registration worked
            router.push("/");
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

export default withUrqlClient(createUrqlClient)(Login);

import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik"
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router"
import { apolloWrapper } from "../utils/withApollo";

interface RegisterProps {
}


const Register = ({ }: RegisterProps) => {
  const router = useRouter();
  const [register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>(
                {
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.register.user,
                  }
                }
              )
            }
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors))
          } else if (response.data?.register.user) {
            // registration worked
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="username" placeholder="Username" label="Username" />
            <Box mt={4}>
              <InputField name="email" placeholder="address@mail.com" label="E-mail" />
            </Box>
            <Box mt={4}>
              <InputField name="password" placeholder="Password" label="Password" type="password" />
            </Box>
            <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting}>Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper >
  )
}

export default apolloWrapper({ ssr: false })(Register);;

import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik"
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";

interface RegisterProps {

}

const Register = ({ }: RegisterProps) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={values => console.log(values)}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField name="username" placeholder="Username" label="Username" />
            <Box mt={4}>
              <InputField name="password" placeholder="Password" label="Password" type="password" />
            </Box>
            <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting}>Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Register;

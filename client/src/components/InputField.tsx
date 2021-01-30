import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'
import { useField } from 'formik'
import React from 'react'

// Take everything a normal HTML Element would take + a required name.
type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string;
};

// Take label and size off the props
export const InputField = ({ label, size: _, ...props }: InputFieldProps) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} placeholder={props.placeholder} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}

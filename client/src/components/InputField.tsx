import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react'
import { useField } from 'formik'
import React from 'react'

// Take everything a normal HTML Element would take + a required name.
type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  name: string
  label: string;
  textarea?: boolean;
};

// Take label and size off the props
export const InputField = ({ label, size: _, textarea = false, ...props }: InputFieldProps) => {
  const [field, { error }] = useField(props);
  const params = { ...field, ...props, id: field.name }

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      {!textarea ? <Input {...params} /> : <Textarea {...params} />}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}

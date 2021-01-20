import React, { useEffect, useRef, useState } from "react";

// https://medium.com/the-non-traditional-developer/how-to-use-the-forwarded-ref-in-react-1fb108f4e6af
const useForwardedRef = ref => {
  const innerRef = useRef(null);
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(innerRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      ref.current = innerRef.current;
    }
  });

  return innerRef;
};

const useFormInput = (_, valueProp, initialValue) => {
  const [value, setValue] = useState(
    valueProp !== undefined ? valueProp : initialValue
  );
  return [
    valueProp !== undefined ? valueProp : value,
    nextValue => {
      if (initialValue !== undefined) setValue(nextValue);
    }
  ];
};

const useFormField = ({ error, info }) => ({ error, info });

const FormContext = React.createContext({ useFormField, useFormInput });

export { FormContext, useForwardedRef };

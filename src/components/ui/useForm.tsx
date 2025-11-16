import { makeStyles } from "@mui/styles";
import { ReactNode, useEffect } from "react";
import {
  useForm,
  FormProvider,
  FieldValues,
  DefaultValues,
} from "react-hook-form";

type CommonFormProps<T extends FieldValues> = {
  onSubmit: (values: T, reset: () => void) => void;
  children: ReactNode;
  defaultValues?: DefaultValues<T> | (() => Promise<DefaultValues<T>>);
  resolver?: any;
  resetOnDefaultChange?: boolean;
};

const useStyles = makeStyles(() => ({
  root: {
    "& .MuiFormControl-root": {
      width: "100%",
      margin: "8px",
    },
  },
}));


const Form = <T extends FieldValues>({
  onSubmit,
  children,
  defaultValues,
  resolver,
  resetOnDefaultChange = true,
}: CommonFormProps<T>) => {
  const classes = useStyles();

  const initialDefaultValues = typeof defaultValues !== "function" && defaultValues
    ? defaultValues
    : {} as DefaultValues<T>;

  const methods = useForm<T>({

    defaultValues: initialDefaultValues,
    resolver,
  });

  useEffect(() => {
    let isMounted = true;
    const loadDefaults = async () => {
      if (typeof defaultValues === "function") {
        const values = await defaultValues();
        if (isMounted) methods.reset(values);
      }

    };
    loadDefaults();
    return () => {
      isMounted = false;
    };

  }, [methods, resetOnDefaultChange]);

  return (
    <FormProvider {...methods}>
      <form
        className={classes.root}
        onSubmit={methods.handleSubmit((data) =>
          onSubmit(data, methods.reset)
        )}
        autoComplete="off"
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;

import { makeStyles } from "@mui/styles";
import  { ReactNode, useEffect } from "react";
import {
  useForm,
  FormProvider,
  FieldValues,
  SubmitHandler,
  DefaultValues,
} from "react-hook-form";

type CommonFormProps<T extends FieldValues> = {
  onSubmit: SubmitHandler<T>;
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
   
 const methods = useForm<T>({ defaultValues: {} as DefaultValues<T>, resolver });
 useEffect(() => {
    let isMounted = true;
    const loadDefaults = async () => {
      if (typeof defaultValues === "function") {
        const values = await defaultValues();
        if (isMounted) methods.reset(values);
      } else if (defaultValues) {
        methods.reset(defaultValues);
      }
    };
    loadDefaults();
    return () => {
      isMounted = false;
    };
  }, [defaultValues, resetOnDefaultChange, methods]);
    return (
        <FormProvider {...methods}>
            <form 
                className={classes.root} 
                onSubmit={methods.handleSubmit(onSubmit)} 
                autoComplete="off"
            >
                {children}
            </form>
        </FormProvider>
    );
};

export default Form;
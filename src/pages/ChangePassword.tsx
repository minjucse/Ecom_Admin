import { Button} from '@mui/material';
import UseForm from '../components/ui/useForm';
import Controls from "../components/controls";
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { useChangePasswordMutation } from '../redux/features/admin/userManagement.api';
import type { TResponse } from '../types';
import { useAppDispatch } from '../redux/hooks';
import {
  authApi,
  useLogoutMutation,
} from "@/redux/features/auth/auth.api";
import { Navigate, useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [changePassword] = useChangePasswordMutation();
   const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
   
    const res = (await changePassword(data)) as TResponse<any>;
    console.log(res?.data?.success);
    if (res?.data?.success) {
      logout(undefined);
      dispatch(authApi.util.resetApiState());
      navigate('/login');
    }
  };

  return (
    <div></div>
    // <Row justify="center" align="middle" style={{ height: '100vh' }}>
    //   <PHForm onSubmit={onSubmit}>
    //     <PHInput type="text" name="oldPassword" label="Old Password" />
    //     <PHInput type="text" name="newPassword" label="New Password" />
    //     <Button htmlType="submit">Login</Button>
    //   </PHForm>
    // </Row>
  );
};

export default ChangePassword;
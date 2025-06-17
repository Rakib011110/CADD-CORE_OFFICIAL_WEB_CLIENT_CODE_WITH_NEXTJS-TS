import { clearUser, setIsLoading, setUser } from "@/redux/slice/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store/features/hoooks";

export const useUser = () => {
  const { user, isLoading } = useAppSelector((state: any) => state.auth);
  const dispatch = useAppDispatch();

  return {
    user,
    isLoading,
    setUser: (data: Parameters<typeof setUser>[0]) => dispatch(setUser(data)),
    clearUser: () => dispatch(clearUser()),
    setIsLoading: (val: boolean) => dispatch(setIsLoading(val)),
  };
};

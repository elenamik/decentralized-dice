import { useQuery } from "react-query";
import { UserResponse } from "types/user";

const useUser = (userId: number) => {
  const FETCH_USER_URL = "/api/users";

  const getUser = async (id: number) => {
    const response = await fetch(`${FETCH_USER_URL}/${id}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
    return response.json();
  };

  const { data, error, isLoading } = useQuery<UserResponse>(
    `user:${userId}`,
    () => getUser(userId)
  );
  return { data, error, isLoading };
};
export default useUser;

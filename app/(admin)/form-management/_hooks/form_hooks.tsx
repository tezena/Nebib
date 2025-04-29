import { Form, Data } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";

const getForms = async () => {
  const res = await betterFetch<Form[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/forms/get`
  );

  console.log("response: ", res);
  return res.data;
};

export const useGetForms = () => {
  return useQuery({
    queryKey: ["forms"],
    queryFn: () => getForms(),
  });
};

const addData = async function (data: { datas: JSON; formId: String }) {
  console.log(data);
  const { data: newUser, error } = await betterFetch<Data>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/submission`,

    {
      method: "POST",
      body: {
        data: data.datas,
        formId: data.formId,
      },
    }
  );

  if (newUser) {
    return newUser;
  }
  if (error) {
    throw new Error(error.message);
  }
};

export const useAddData = function () {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { datas: JSON; formId: string }) => addData(data),
    onSuccess: () => {
      console.log("invalidating");
      queryClient.invalidateQueries({ queryKey: ["datas"] });
    },
  });
};

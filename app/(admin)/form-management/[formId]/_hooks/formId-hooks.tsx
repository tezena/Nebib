import { Form } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";
import { link } from "fs";

const getForm = async (formId: string) => {
  const res = await betterFetch<Form[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/forms/${formId}`
  );

  console.log("response: ", res);
  return res.data;
};

export const useGetForm = (formId: string) => {
  return useQuery({
    queryKey: ["form", formId],
    queryFn: () => getForm(formId),
  });
};

export interface RenderedForm extends Form {
  fields: Array<{
    id: string;
    label: string;
    type: string;
    required: boolean;
    category?: string;
  }>;
}
const getRenderedForm = async (link: string) => {
  const res = await betterFetch<RenderedForm[]>(
    `http://localhost:3000/api/forms/link/${link}`
  );

  console.log("response: ", res);
  return res.data;
};

export const useGetRenderedForm = (link: string) => {
  return useQuery({
    queryKey: ["form", link],
    queryFn: () => getRenderedForm(link),
  });
};

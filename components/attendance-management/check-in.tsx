import { useState } from "react";
import { Data, Field, Form } from "@prisma/client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { JsonObject } from "type-fest";

export interface StudentsDatasProps {
  data: Form & {
    datas: Data[] | null | undefined;
    fields: Field[];
  };
}

export default function CheckIn({ data }: StudentsDatasProps) {
  const { datas = [], fields } = data;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDatas = datas?.filter((entry) => {
    if (!entry.data || typeof entry.data !== "object") return false;

    return Object.values(entry.data as JsonObject).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCheckIn = (studentId: string) => {
    // Replace this with real logic: API call or state update
    console.log("Checked in student:", studentId);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Input
        className="py-1 pl-3 pr-10 min-w-[270px] outline-none"
        type="text"
        placeholder="Search students to check in..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="w-full max-w-2xl space-y-4">
        {filteredDatas?.map((entry) => (
          <div key={entry.id} className="border p-4 rounded shadow space-y-2">
            {fields.map((field) => (
              <div key={field.id}>
                <strong>{field.label}:</strong>{" "}
                {String((entry.data as JsonObject)?.[field.id] ?? "N/A")}
              </div>
            ))}

            <Button
              onClick={() => handleCheckIn(entry.id)}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Check In
            </Button>

            <Button
              onClick={() => handleCheckIn(entry.id)}
              className="mt-2 ml-4 bg-red-600 hover:bg-green-700 text-white"
            >
              Remove Check In
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

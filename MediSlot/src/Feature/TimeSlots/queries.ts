import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../Service";

const QUERY_KEY = ["TimeSlots"];

export function useAppointmentQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      return await ApiService.get<Master.TimeSlot[]>("TimeSlots");
    },
  });
}

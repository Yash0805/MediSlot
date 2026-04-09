import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../Service";

const QUERY_KEY = ["Appointments"];

export function useAppointmentQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      return await ApiService.get<Master.Appointment[]>("Appointments");
    },
  });
}

export function useReportQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      return await ApiService.get<Master.Appointment[]>("Appointments/Report");
    },
  });
}

export function useNewAppointmentsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (Appointments: Master.AppointmentForm) =>
      await ApiService.post("Appointments", Appointments),
    onSuccess: (result) => {
      if (!result) {
        return;
      }
      const existing =
        queryClient.getQueryData<Master.Appointment[]>(QUERY_KEY);
      if (!existing) {
        return;
      }
      queryClient.setQueryData(QUERY_KEY, [...existing, result]);
    },
  });
}

export function useAppointmentsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) =>
      await ApiService.patch<Master.Appointment>("Appointments/" + id, {
        status: "Appeared",
      }),

    onSuccess: (result, id) => {
      if (!result) return;

      const existing =
        queryClient.getQueryData<Master.Appointment[]>(QUERY_KEY);

      if (!existing) return;

      const index = existing.findIndex((item) => item.id === id);

      if (index === -1) return;

      const first = existing.slice(0, index);
      const last = existing.slice(index + 1);

      const updated = [...first, result, ...last];

      queryClient.setQueryData(QUERY_KEY, updated);
    },
  });
}

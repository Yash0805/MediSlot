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

export function useReportQuery(
  date?: string,
  fromDate?: string,
  toDate?: string,
) {
  return useQuery<Master.ReportResponse>({
    queryKey: ["REPORT", date, fromDate, toDate],
    queryFn: async () => {
      let url = "Appointments/Report";
      if (date) {
        url += `?date=${date}`;
      } else if (fromDate && toDate) {
        url += `?fromdate=${fromDate}&todate=${toDate}`;
      }

      return await ApiService.get<Master.ReportResponse>(url);
    },
  });
}

export function useNewAppointmentsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (Appointments: Master.AppointmentForm) =>
      await ApiService.post("Appointments", Appointments),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (result: any) => {
      if (!result) {
        return;
      }
      if (result.code === 409) {
        alert("Already booked at this time.");
        return;
      }
      const existing =
        queryClient.getQueryData<Master.Appointment[]>(QUERY_KEY);
      if (!existing) {
        return;
      }
      queryClient.setQueryData(QUERY_KEY, [...existing, result]);
    },
    onError:(e) => {
      // 
      console.log(e);
    }
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

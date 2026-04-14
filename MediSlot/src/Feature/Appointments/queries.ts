import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../Service";

export const QUERY_KEY = ["Appointments"];

export function useAppointmentQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      return await ApiService.get<Master.Appointment[]>("Appointments");
    },
    refetchOnMount: true,
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

  return useMutation<Master.Appointment, Error, Master.AppointmentForm>({
    mutationFn: (appointment) =>
      ApiService.post<Master.Appointment>("Appointments", appointment),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY }); 
    },

    onError: (error) => {
      if (error.message === "409") {
        alert("Already booked at this time.");
      } else {
        console.error(error);
      }
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
      const existing =
        queryClient.getQueryData<Master.Appointment[]>(QUERY_KEY);

      if (!existing) return;

      const updated = existing.map((item) => (item.id === id ? result : item));

      queryClient.setQueryData(QUERY_KEY, updated);
    },
  });
}

export function useMarkNoShowAppointments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () =>
      await ApiService.patch<Master.Appointment[]>("Appointments/mark-noshow", {}),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY }); 
    },
  });
}
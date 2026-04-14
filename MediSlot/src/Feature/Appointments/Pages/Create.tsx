import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import TextBox from "../../../Shared/Component/Forms/TextBox";
import { Calendar } from "primereact/calendar";
import { useNewAppointmentsMutation } from "../queries";
import { useEffect, useState } from "react";
import { ApiService } from "../../../Service";

interface TimeSlot {
  id: number;
  timeSlot: string;
}

export default function Create() {
  const navigate = useNavigate();
  const { mutate, isPending } = useNewAppointmentsMutation();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<Master.AppointmentForm>({
    defaultValues: {
      name: "",
      phone: "",
      age: 0,
      description: "",
      appointmentDate: "",
      timeSlotId: 0,
    },
  });

  const selectedDate = watch("appointmentDate");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const onSubmit = (data: Master.AppointmentForm) => {
    mutate(
      {
        ...data,
        timeSlotId: Number(data.timeSlotId),
      },
      {
        onSuccess: () => {
          reset();
          navigate("/Appointments/list");
        },
        
      }
    );
  };

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate) return;

      try {
        setLoadingSlots(true);
        const data = await ApiService.get<TimeSlot[]>(
          `TimeSlots?date=${selectedDate}`
        );
        setTimeSlots(data);
      } catch {
        setTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate]);

  const filteredSlots = timeSlots.filter((t) => {
    if (!selectedDate) return true;

    const now = new Date();
    const selected = new Date(selectedDate);

    if (selected.toDateString() !== now.toDateString()) return true;

    const [hours, minutes] = t.timeSlot
      .split(":")
      .slice(0, 2)
      .map(Number);

    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0);

    return slotTime > now;
  });

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = Number(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  return (
    <div className="mt-10 px-6 text-white">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Book Appointment</h1>
        <button
          onClick={() => navigate("/Appointments/list")}
          className="text-white hover:underline text-sm"
        >
          ← Back to List
        </button>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-lg bg-sky-900 p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <TextBox
              label="Name"
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
            />

            <TextBox
              label="Phone"
              name="phone"
              control={control}
              rules={{ required: "Phone is required" }}
            />

            <TextBox
              label="Age"
              name="age"
              type="number"
              control={control}
              rules={{
                required: "Age is required",
                min: { value: 1, message: "Age must be at least 1" },
              }}
            />

            <TextBox
              label="Description"
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Appointment Date</label>

              <Controller
                name="appointmentDate"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      value={field.value ? new Date(field.value) : null}
                      onChange={(e) => {
                        if (!e.value) return field.onChange("");
                        const date = new Date(e.value);
                        const formatted =
                          date.toLocaleDateString("en-CA");
                        field.onChange(formatted);
                      }}
                      dateFormat="yy-mm-dd"
                      showIcon
                      minDate={today}
                      className="w-full"
                    />

                    {fieldState.error && (
                      <span className="text-red-400 text-sm">
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Time Slot</label>

              <Controller
                name="timeSlotId"
                control={control}
                rules={{
                  validate: (v) =>
                    v !== 0 || "Please select a time slot",
                }}
                render={({ field, fieldState }) => (
                  <>
                    <select
                      {...field}
                      value={field.value || 0}
                      disabled={isPending || loadingSlots || !selectedDate}
                      className="w-full px-3 py-2 rounded-lg bg-sky-800 border border-sky-600 text-white max-h-40 overflow-y-auto"
                    >
                      <option value={0}>
                        {!selectedDate
                          ? "Select date first"
                          : loadingSlots
                            ? "Loading..."
                            : filteredSlots.length === 0
                              ? "No slots available"
                              : "Select Time Slot"}
                      </option>

                      {filteredSlots.map((t) => (
                        <option key={t.id} value={t.id}>
                          {formatTime(t.timeSlot)}
                        </option>
                      ))}
                    </select>

                    {fieldState.error && (
                      <span className="text-red-400 text-sm">
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Booking..." : "Book Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
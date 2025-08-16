import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { useAuthContext } from 'src/auth/hooks';

import { ICalendarEvent } from 'src/types/calendar';
import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const URL = endpoints.calendar;

const options = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetEvents() {
  const { user } = useAuthContext();

  const { data, isLoading, error, isValidating } = useSWR(
    URL + '?farmCode=' + user?.farmCode,
    fetcher,
    options
  );
  const memoizedValue = useMemo(() => {
    const events = data?.events.map((event: ICalendarEvent) => ({
      ...event,
      textColor: event.color,
      farmCode: user?.farmCode,
    }));
    return {
      events: (events as ICalendarEvent[]) || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.events.length,
    };
  }, [data?.events, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createEvent(eventData: ICalendarEvent) {
  const res = await axios.post(endpoints.appointment.bookAppointment, {
    supplyDayId: eventData.id,
    farmCode: eventData.farmCode,
    trucksNumber: eventData.trucksNumber,
  });
  const data = res.data;
  // eventData.title = 'موعد: ' + eventData.title;
// mutate(
//   URL,
//   (currentData: any) => {
//     const events: ICalendarEvent[] = [...currentData.events, eventData];

//     return {
//       ...currentData,
//       events,
//     };
//   },
//   false
// );

  return {
    isSuccess: data.isSuccess,
    title: data.isSuccess ? data.result : data.errorMessages[0],
  };
}

// ----------------------------------------------------------------------

export async function updateEvent(eventData: Partial<ICalendarEvent>) {
  /**
   * Work on server
   */
  // const data = { eventData };
  // await axios.put(endpoints.calendar, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const events: ICalendarEvent[] = currentData.events.map((event: ICalendarEvent) =>
        event.id === eventData.id ? { ...event, ...eventData } : event
      );

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId: string) {
  /**
   * Work on server
   */
  // const data = { eventId };
  // await axios.patch(endpoints.calendar, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const events: ICalendarEvent[] = currentData.events.filter(
        (event: ICalendarEvent) => event.id !== eventId
      );

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}

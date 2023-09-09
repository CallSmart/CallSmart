"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import Sidebar from "@/components/sidebar";
import ProductNavBar from "@/components/ProductNavBar";
import {
  Card,
  Text,
  Metric,
  BarChart,
  Select,
  SelectItem,
} from "@tremor/react";
import { Badge, BadgeDelta } from "@tremor/react";
import TicketProp from "@/components/TicketProp";
import {
  Title,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableFoot,
  TableFooterCell,
} from "@tremor/react";

import {
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
} from "@tremor/react";

import {
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  subMonths,
  subYears,
} from "date-fns";

export default function AnalyticsPage() {
  interface TicketType {
    id: number;
    new_client: boolean;
    urgent: boolean;
    type: string;
    name: string;
    number: string;
    time: string;
    stage: number;
  }

  const router = useRouter();
  const [chart1Format, setChart1Format] = useState("false");
  const [chart2Format, setChart2Format] = useState("false");

  const [timeRange, setTimeRange] = useState("Day");
  const [compareSelect, setCompareSelect] = useState("This");
  const [compareCustomSelect, setCompareCustomSelect] = useState<
    DateRangePickerValue | undefined
  >();
  const [withSelect, setWithSelect] = useState("Last");
  const [withCustomSelect, setWithCustomSelect] =
    useState<DateRangePickerValue>();

  const [compareTickets, setCompareTickets] = useState<TicketType[]>([]);
  const [withTickets, setWithTickets] = useState<TicketType[]>([]);

  const [compareStartDate, setCompareStartDate] = useState<string>();
  const [compareEndDate, setCompareEndDate] = useState<string>();
  const [withStartDate, setWithStartDate] = useState<string>();
  const [withEndDate, setWithEndDate] = useState<string>();

  const timeLabels = [
    "Today",
    "Yesterday",
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    "This Year",
    "Last Year",
  ];

  const ticketTypes = ["Question", "Book", "Cancel", "Reschedule"];
  const clientTypes = ["New", "Urgent", "Existing Client", "Non Urgent"];
  const detailCategories = [
    "Missed Calls",
    "Tickets Created",
    "Tickets Completed",
  ];

  const [ticketsCreatedData, setTicketsCreatedData] = useState<any>();
  const [ticketDetailData, setTicketDetailData] = useState<any>();
  const [callDetailData, setCallDetailData] = useState<any>();

  const percentageFormatter = (value1: number, value2: number | null) => {
    if (value2 === 0 || value2 === null) {
      const roundedPercentage = Math.trunc(Math.round(value1 * 100));
      if (roundedPercentage == Infinity || Number.isNaN(roundedPercentage)) {
        return "0%";
      }

      return `${roundedPercentage}%`;
    } else {
      const percentageChange = ((value1 - value2) / value2) * 100;

      const roundedPercentage = Math.trunc(
        Math.round(percentageChange * 100) / 100
      );
      if (roundedPercentage == Infinity || NaN) {
        return "0%";
      }

      return `${roundedPercentage}%`;
    }
  };

  const dateWordFormatter = (selected: string): string => {
    if (timeRange == "Day") {
      if (selected == "This") {
        return "Today";
      } else if (selected == "Last") {
        return "Yesterday";
      } else {
        return selected;
      }
    } else if (timeRange == "Week") {
      if (selected == "This") {
        return "This Week";
      } else if (selected == "Last") {
        return "Last Week";
      } else {
        return selected;
      }
    } else if (timeRange == "Month") {
      if (selected == "This") {
        return "This Month";
      } else if (selected == "Last") {
        return "Last Month";
      } else {
        return selected;
      }
    } else if (timeRange == "Year") {
      if (selected == "This") {
        return "This Year";
      } else if (selected == "Last") {
        return "Last Year";
      } else {
        return selected;
      }
    } else {
      return selected;
    }
  };

  const formattingDates = (date: string) => {
    switch (dateWordFormatter(date)) {
      case "Today":
        return { start: startOfDay(new Date()), end: endOfDay(new Date()) };
      case "Yesterday":
        return {
          start: startOfDay(subDays(new Date(), 1)),
          end: endOfDay(subDays(new Date(), 1)),
        };
      case "This Week":
        return { start: startOfWeek(new Date()), end: endOfWeek(new Date()) };
      case "Last Week":
        return {
          start: startOfWeek(subDays(new Date(), 7)),
          end: endOfWeek(subDays(new Date(), 7)),
        };
      case "This Month":
        return { start: startOfMonth(new Date()), end: endOfMonth(new Date()) };
      case "Last Month":
        return {
          start: startOfMonth(subMonths(new Date(), 1)),
          end: endOfMonth(subMonths(new Date(), 1)),
        };
      case "This Year":
        return {
          start: startOfYear(new Date()),
          end: endOfYear(new Date()),
        };
      case "Last Year":
        return {
          start: startOfYear(subYears(new Date(), 1)),
          end: endOfYear(subYears(new Date(), 1)),
        };
      default:
        return { start: startOfDay(new Date()), end: endOfDay(new Date()) };
    }
  };

  function formatDateToCustomFormat(isoDate: string | undefined): string {
    // console.log("Custom format date!!");

    const date = new Date(isoDate || "");

    // Extract date components
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(date.getUTCMilliseconds())
      .padStart(6, "0")
      .substr(0, 6); // taking up to 6 digits

    // Concatenate into custom format
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+00`;
  }

  function displayCustomDateFormatter(customDate: any): string {
    function formatDate(date: Date): string {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const day = date.getDate();
      const monthIndex = date.getMonth();

      let suffix = "th";
      if (day === 1 || day === 21 || day === 31) {
        suffix = "st";
      } else if (day === 2 || day === 22) {
        suffix = "nd";
      } else if (day === 3 || day === 23) {
        suffix = "rd";
      }

      return `${monthNames[monthIndex]} ${day}${suffix}`;
    }

    if (customDate?.to) {
      return (
        formatDate(new Date(customDate?.from)) +
        " - " +
        formatDate(new Date(customDate?.to))
      );
    } else {
      return formatDate(new Date(customDate?.from));
    }
  }

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push("/signin"); // Redirect to sign-in if no session found
    }
  }, []);

  useEffect(() => {
    setTicketsCreatedData(null);
    setTicketDetailData(null);
    setCallDetailData(null);
    settingDateRange();
  }, [
    compareSelect,
    withSelect,
    timeRange,
    withCustomSelect,
    compareCustomSelect,
  ]);

  useEffect(() => {
    setCompareTickets([]);
    setWithTickets([]);
    setTicketsCreatedData([]);
    setTicketDetailData([]);
  }, [compareSelect, withSelect, timeRange]);

  useEffect(() => {
    setCompareCustomSelect(undefined);
    setWithCustomSelect(undefined);
    setCompareSelect("This");
    setWithSelect("Last");
  }, [timeRange]);

  useEffect(() => {
    if (compareStartDate && compareEndDate) {
      fetchCompareTickets();
    }
  }, [compareStartDate, compareEndDate]);

  useEffect(() => {
    setWithTickets([]);
    if (withStartDate && withEndDate) {
      fetchWithTickets();
    }
  }, [withStartDate, withEndDate]);

  useEffect(() => {
    if (withTickets.length > 0 || compareTickets.length > 0) {
      populateCreatedTicketsData();
      populateTicketDetailsData();
      populateCallDetailsData();
    }
  }, [withTickets, compareTickets]);

  useEffect(() => {
    console.log("Call Detail Data: ", callDetailData);
  }),
    [callDetailData];

  const settingDateRange = async () => {
    if (withCustomSelect || compareCustomSelect) {
      console.log("Custom Date Time!!");

      setCompareStartDate(
        formatDateToCustomFormat(compareCustomSelect?.from?.toISOString())
      );
      if (compareCustomSelect?.to) {
        setCompareEndDate(
          formatDateToCustomFormat(
            new Date(endOfDay(compareCustomSelect?.to))?.toISOString()
          )
        );
      } else {
        setCompareEndDate(
          formatDateToCustomFormat(
            new Date(addDays(compareCustomSelect?.from || 0, 1))?.toISOString()
          )
        );
      }

      setWithStartDate(
        formatDateToCustomFormat(withCustomSelect?.from?.toISOString())
      );
      if (withCustomSelect?.to) {
        setWithEndDate(new Date(endOfDay(withCustomSelect?.to))?.toISOString());
      } else {
        setWithEndDate(
          formatDateToCustomFormat(
            new Date(addDays(withCustomSelect?.from || 0, 1))?.toISOString()
          )
        );
      }
    } else {
      const compareDates = formattingDates(compareSelect);
      setCompareStartDate(
        formatDateToCustomFormat(compareDates["start"].toISOString())
      );
      setCompareEndDate(
        formatDateToCustomFormat(compareDates["end"].toISOString())
      );

      const withDates = formattingDates(withSelect);
      setWithStartDate(
        formatDateToCustomFormat(withDates["start"].toISOString())
      );
      setWithEndDate(formatDateToCustomFormat(withDates["end"].toISOString()));
    }
  };

  const fetchCompareTickets = async () => {
    // console.log("fetchCompareTickets");

    const user = await supabase.auth.getUser();
    const id = user?.data?.user?.id;

    const { data: userRoleData, error: userRoleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", id);

    if (userRoleError) {
      console.log("Error fetching user role");
      return;
    }

    const userRole = userRoleData[0].role;

    let clinics: { [key: string]: any }[] | null;

    if (userRole == "Owner") {
      const { data, error } = await supabase
        .from("owner_clinics")
        .select("clinic_id")
        .eq("owner", id);
      // console.log("Tickets path for Owner");
      clinics = data;
    } else if (userRole == "Manager") {
      const { data, error } = await supabase
        .from("managers")
        .select("clinic_id")
        .eq("user_id", id);
      clinics = data;
    } else {
      console.log("Tickets path for else");
      clinics = null;
    }

    const clinicIds = clinics?.map((clinic) => clinic.clinic_id);
    if (!clinicIds) {
      return;
    } else {
      // console.log(String(clinicIds));
    }

    const { data: tickets, error: ticketsError } = await supabase
      .from("tickets")
      .select("*")
      .in("clinic", clinicIds)
      .filter("time", "gte", compareStartDate)
      .filter("time", "lte", compareEndDate);
    if (ticketsError) {
      console.error("Error fetching tickets:", ticketsError);
      return;
    }

    console.log("Got compare tickets: ", tickets);

    setCompareTickets(tickets);
  };

  const fetchWithTickets = async () => {
    // console.log("fetchWithTickets");

    const user = await supabase.auth.getUser();
    const id = user?.data?.user?.id;

    const { data: userRoleData, error: userRoleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", id);

    if (userRoleError) {
      console.log("Error fetching user role");
      return;
    }

    const userRole = userRoleData[0].role;

    let clinics: { [key: string]: any }[] | null;

    if (userRole == "Owner") {
      const { data, error } = await supabase
        .from("owner_clinics")
        .select("clinic_id")
        .eq("owner", id);
      // console.log("Tickets path for Owner");
      clinics = data;
    } else if (userRole == "Manager") {
      const { data, error } = await supabase
        .from("managers")
        .select("clinic_id")
        .eq("user_id", id);
      clinics = data;
    } else {
      console.log("Tickets path for else");
      clinics = null;
    }

    const clinicIds = clinics?.map((clinic) => clinic.clinic_id);
    if (!clinicIds) {
      return;
    } else {
      // console.log(String(clinicIds));
    }

    const { data: tickets, error: ticketsError } = await supabase
      .from("tickets")
      .select("*")
      .in("clinic", clinicIds)
      .filter("time", "gte", withStartDate)
      .filter("time", "lte", withEndDate);

    if (ticketsError) {
      console.error("Error fetching tickets:", ticketsError);
      return;
    }
    console.log("Got with tickets: ", tickets);

    setWithTickets(tickets);
  };

  const createdDictValueFinder = async (key: string, type: string) => {
    if (key == displayCustomDateFormatter(compareCustomSelect)) {
      return compareTickets.filter(
        (ticket) => ticket["type"] === type.toLowerCase()
      ).length;
    }
    if (key == displayCustomDateFormatter(withCustomSelect)) {
      return withTickets.filter(
        (ticket) => ticket["type"] === type.toLowerCase()
      ).length;
    }
    const source =
      dateWordFormatter(compareSelect) === key ? compareTickets : withTickets;
    return source.filter((ticket) => ticket["type"] === type.toLowerCase())
      .length;
  };

  const populateCreatedTicketsData = async () => {
    // console.log("populateCreatedTicketsData");
    if (!compareCustomSelect && !withCustomSelect) {
      // console.log("regular route for pop created");
      setTicketsCreatedData(
        await Promise.all(
          ticketTypes.map(async (type) => {
            const obj: any = { Type: type };
            for (const label of timeLabels) {
              obj[label] = await createdDictValueFinder(label, type);
            }
            return obj;
          })
        )
      );
      return ticketsCreatedData;
    } else {
      // console.log("special route for pop created");
      setTicketsCreatedData(
        await Promise.all(
          ticketTypes.map(async (type) => {
            const obj: any = { Type: type };

            obj[displayCustomDateFormatter(compareCustomSelect)] =
              await createdDictValueFinder(
                displayCustomDateFormatter(compareCustomSelect),
                type
              );
            obj[displayCustomDateFormatter(withCustomSelect)] =
              await createdDictValueFinder(
                displayCustomDateFormatter(withCustomSelect),
                type
              );

            return obj;
          })
        )
      );
      return ticketsCreatedData;
    }
  };

  const detailDictValueFinder = async (key: string, type: string) => {
    if (
      key == displayCustomDateFormatter(compareCustomSelect) ||
      key == displayCustomDateFormatter(withCustomSelect)
    ) {
      const source =
        displayCustomDateFormatter(compareCustomSelect) == key
          ? compareTickets
          : withTickets;
      if (type === "Urgent") {
        return source.filter((ticket) => ticket["urgent"] == true).length;
      } else if (type === "Non Urgent") {
        return source.filter((ticket) => ticket["urgent"] == false).length;
      } else if (type === "New") {
        return source.filter((ticket) => ticket["new_client"] == true).length;
      } else {
        return source.filter((ticket) => ticket["new_client"] == false).length;
      }
    }

    const source =
      dateWordFormatter(compareSelect) === key ? compareTickets : withTickets;
    if (type === "Urgent") {
      return source.filter((ticket) => ticket["urgent"] == true).length;
    } else if (type === "Non Urgent") {
      return source.filter((ticket) => ticket["urgent"] == false).length;
    } else if (type === "New") {
      return source.filter((ticket) => ticket["new_client"] == true).length;
    } else {
      return source.filter((ticket) => ticket["new_client"] == false).length;
    }
  };

  const populateTicketDetailsData = async () => {
    if (!compareCustomSelect && !withCustomSelect) {
      setTicketDetailData(
        await Promise.all(
          clientTypes.map(async (type) => {
            const obj: any = { Type: type };
            for (const label of timeLabels) {
              obj[label] = await detailDictValueFinder(label, type);
            }
            return obj;
          })
        )
      );
    } else {
      setTicketDetailData(
        await Promise.all(
          clientTypes.map(async (type) => {
            const obj: any = { Type: type };

            obj[displayCustomDateFormatter(compareCustomSelect)] =
              await detailDictValueFinder(
                displayCustomDateFormatter(compareCustomSelect),
                type
              );
            obj[displayCustomDateFormatter(withCustomSelect)] =
              await detailDictValueFinder(
                displayCustomDateFormatter(withCustomSelect),
                type
              );

            return obj;
          })
        )
      );
    }
  };

  const callDictValueFinder = async (key: string, type: string) => {
    if (
      key == displayCustomDateFormatter(compareCustomSelect) ||
      key == displayCustomDateFormatter(withCustomSelect)
    ) {
      const source =
        displayCustomDateFormatter(compareCustomSelect) == key
          ? compareTickets
          : withTickets;
      if (type === "Call Missed") {
        return 0;
      } else if (type === "Tickets Created") {
        return source.length;
      } else if (type === "Tickets Completed") {
        return source.filter((ticket) => ticket["stage"] == 3).length;
      } else {
        return 0;
      }
    }

    const source =
      dateWordFormatter(compareSelect) === key ? compareTickets : withTickets;
    if (type === "Call Missed") {
      return 0;
    } else if (type === "Tickets Created") {
      return source.length;
    } else if (type === "Tickets Completed") {
      return source.filter((ticket) => ticket["stage"] == 3).length;
    } else {
      return 0;
    }
  };

  const populateCallDetailsData = async () => {
    console.log("populateCallDetailsData");
    if (!compareCustomSelect && !withCustomSelect) {
      setCallDetailData(
        await Promise.all(
          detailCategories.map(async (type) => {
            const obj: any = { Type: type };
            for (const label of timeLabels) {
              obj[label] = await callDictValueFinder(label, type);
            }
            return obj;
          })
        )
      );
    } else {
      setCallDetailData(
        await Promise.all(
          detailCategories.map(async (type) => {
            const obj: any = { Type: type };

            obj[displayCustomDateFormatter(compareCustomSelect)] =
              await callDictValueFinder(
                displayCustomDateFormatter(compareCustomSelect),
                type
              );
            obj[displayCustomDateFormatter(withCustomSelect)] =
              await callDictValueFinder(
                displayCustomDateFormatter(withCustomSelect),
                type
              );
            console.log("CD: ", obj);

            return obj;
          })
        )
      );
    }
  };

  useEffect(() => {
    console.log(ticketDetailData);
  }, [populateTicketDetailsData]);

  return (
    <ProductNavBar>
      <div className="flex flex-col gap-4 w-full h-fit max-w-[1180px]">
        <div className="flex flex-row gap-4">
          <div>
            <Text>Time Range</Text>
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
              className="w-fit"
            >
              <SelectItem value={"Day"}>Day</SelectItem>
              <SelectItem value={"Week"}>Week</SelectItem>
              <SelectItem value={"Month"}>Month</SelectItem>
              <SelectItem value={"Year"}>Year</SelectItem>
              <SelectItem value={"Custom"}>Custom</SelectItem>
            </Select>
          </div>
          <div>
            <Text>Compare</Text>
            {timeRange === "Day" ? (
              <Select
                value={compareSelect}
                onValueChange={setCompareSelect}
                className="w-fit"
              >
                <SelectItem value={"This"}>Today</SelectItem>
                <SelectItem value={"Last"}>Yesterday</SelectItem>
              </Select>
            ) : timeRange === "Week" ? (
              <Select
                value={compareSelect}
                onValueChange={setCompareSelect}
                className="w-fit"
              >
                <SelectItem value={"This"}>This Week</SelectItem>
                <SelectItem value={"Last"}>Last Week</SelectItem>
              </Select>
            ) : timeRange === "Month" ? (
              <Select
                value={compareSelect}
                onValueChange={setCompareSelect}
                className="w-fit"
              >
                <SelectItem value={"This"}>This Month</SelectItem>
                <SelectItem value={"Last"}>Last Month</SelectItem>
              </Select>
            ) : timeRange === "Year" ? (
              <Select
                value={compareSelect}
                onValueChange={setCompareSelect}
                className="w-fit"
              >
                <SelectItem value={"This"}>This Year</SelectItem>
                <SelectItem value={"Last"}>Last Year</SelectItem>
              </Select>
            ) : (
              <DateRangePicker
                value={compareCustomSelect}
                onValueChange={setCompareCustomSelect}
              />
            )}
          </div>
          <div>
            <Text>With</Text>
            {timeRange === "Day" ? (
              <Select
                value={withSelect}
                onValueChange={setWithSelect}
                className="w-fit"
              >
                <SelectItem value={"This"}>Today</SelectItem>
                <SelectItem value={"Last"}>Yesterday</SelectItem>
              </Select>
            ) : timeRange === "Week" ? (
              <Select
                value={withSelect}
                onValueChange={setWithSelect}
                className="w-fit"
              >
                <SelectItem value={"This"}>This Week</SelectItem>
                <SelectItem value={"Last"}>Last Week</SelectItem>
              </Select>
            ) : timeRange === "Month" ? (
              <Select
                value={withSelect}
                onValueChange={setWithSelect}
                className="w-fit"
              >
                <SelectItem value={"This"}>This Month</SelectItem>
                <SelectItem value={"Last"}>Last Month</SelectItem>
              </Select>
            ) : timeRange === "Year" ? (
              <Select
                value={withSelect}
                onValueChange={setWithSelect}
                className="w-fit"
              >
                <SelectItem value={"This"}>This Year</SelectItem>
                <SelectItem value={"Last"}>Last Year</SelectItem>
              </Select>
            ) : (
              <DateRangePicker
                value={withCustomSelect}
                onValueChange={setWithCustomSelect}
              />
            )}
          </div>
        </div>
        <div className="flex flex-row xl:flex-nowrap flex-wrap gap-4">
          <div className="flex flex-col gap-4 w-full xl:w-1/2">
            <Card
              decoration="top"
              className="flex flex-col gap-4 w-fit min-h-1/2 border-prim-blue w-full"
            >
              <div className="flex flex-row justify-between items-center">
                <Title>Tickets Created: Metrics </Title>
                <Text>Sum per category for the tickets created</Text>
              </div>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Call Type</TableHeaderCell>
                    <TableHeaderCell>
                      {compareCustomSelect
                        ? displayCustomDateFormatter(compareCustomSelect)
                        : dateWordFormatter(compareSelect)}
                    </TableHeaderCell>
                    <TableHeaderCell />
                    <TableHeaderCell>
                      {withCustomSelect
                        ? displayCustomDateFormatter(withCustomSelect)
                        : dateWordFormatter(withSelect)}
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ticketsCreatedData?.map((key: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TicketProp
                          type={key["Type"].toLowerCase()}
                          urgent={null}
                          new_client={null}
                          closeable={false}
                          onClose={() => null}
                        />
                      </TableCell>
                      <TableCell>
                        {compareCustomSelect
                          ? key[displayCustomDateFormatter(compareCustomSelect)]
                          : key[dateWordFormatter(compareSelect)]}
                      </TableCell>
                      <TableCell>
                        {!compareCustomSelect || !withCustomSelect ? (
                          <BadgeDelta
                            deltaType={
                              key[dateWordFormatter(compareSelect)] >
                              key[dateWordFormatter(withSelect)]
                                ? "increase"
                                : "decrease"
                            }
                          >
                            {percentageFormatter(
                              key[dateWordFormatter(compareSelect)],
                              key[dateWordFormatter(withSelect)]
                            )}
                          </BadgeDelta>
                        ) : (
                          <BadgeDelta
                            deltaType={
                              key[
                                displayCustomDateFormatter(compareCustomSelect)
                              ] >
                              key[displayCustomDateFormatter(withCustomSelect)]
                                ? "increase"
                                : "decrease"
                            }
                          >
                            {percentageFormatter(
                              key[
                                displayCustomDateFormatter(compareCustomSelect)
                              ],
                              key[displayCustomDateFormatter(withCustomSelect)]
                            )}
                          </BadgeDelta>
                        )}
                      </TableCell>
                      <TableCell>
                        {withCustomSelect
                          ? key[displayCustomDateFormatter(withCustomSelect)]
                          : key[dateWordFormatter(withSelect)]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <Card decoration="bottom" className="border-prim-blue">
              <div className="flex flex-row justify-between items-center">
                <Title>Tickets Created: Bar Chart</Title>
                <Select
                  value={chart1Format}
                  className="w-fit"
                  onValueChange={setChart1Format}
                >
                  <SelectItem value="false">Count</SelectItem>
                  <SelectItem value="true">Relative</SelectItem>
                </Select>
              </div>
              <BarChart
                data={ticketsCreatedData}
                className="mt-6"
                index="Type"
                categories={
                  withCustomSelect || compareCustomSelect
                    ? [
                        displayCustomDateFormatter(compareCustomSelect),
                        displayCustomDateFormatter(withCustomSelect),
                      ]
                    : [
                        dateWordFormatter(compareSelect),
                        dateWordFormatter(withSelect),
                      ]
                }
                relative={chart1Format == "true"}
                colors={["blue"]}
                yAxisWidth={48}
              />
            </Card>
          </div>
          <div className="flex flex-col gap-4 w-full xl:w-1/2">
            <Card
              decoration="top"
              className="flex flex-col gap-4 w-fit min-h-1/2 border-prim-blue w-full"
            >
              <div className="flex flex-row justify-between items-center">
                <Title>Tickets Details: Metrics </Title>
                <Text>Client type for tickets created</Text>
              </div>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Call Detail</TableHeaderCell>
                    <TableHeaderCell>
                      {compareCustomSelect
                        ? displayCustomDateFormatter(compareCustomSelect)
                        : dateWordFormatter(compareSelect)}
                    </TableHeaderCell>
                    <TableHeaderCell />
                    <TableHeaderCell>
                      {withCustomSelect
                        ? displayCustomDateFormatter(withCustomSelect)
                        : dateWordFormatter(withSelect)}
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ticketDetailData?.map((key: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TicketProp
                          type={key["Type"].toLowerCase()}
                          urgent={key["Type"] == "Urgent"}
                          new_client={key["Type"] == "New"}
                          closeable={false}
                          onClose={() => null}
                        />
                      </TableCell>
                      <TableCell>
                        {compareCustomSelect
                          ? key[displayCustomDateFormatter(compareCustomSelect)]
                          : key[dateWordFormatter(compareSelect)]}
                      </TableCell>
                      <TableCell>
                        {!compareCustomSelect || !withCustomSelect ? (
                          <BadgeDelta
                            deltaType={
                              key[dateWordFormatter(compareSelect)] >
                              key[dateWordFormatter(withSelect)]
                                ? "increase"
                                : "decrease"
                            }
                          >
                            {percentageFormatter(
                              key[dateWordFormatter(compareSelect)],
                              key[dateWordFormatter(withSelect)]
                            )}
                          </BadgeDelta>
                        ) : (
                          <BadgeDelta
                            deltaType={
                              key[
                                displayCustomDateFormatter(compareCustomSelect)
                              ] >
                              key[displayCustomDateFormatter(withCustomSelect)]
                                ? "increase"
                                : "decrease"
                            }
                          >
                            {percentageFormatter(
                              key[
                                displayCustomDateFormatter(compareCustomSelect)
                              ],
                              key[displayCustomDateFormatter(withCustomSelect)]
                            )}
                          </BadgeDelta>
                        )}
                      </TableCell>
                      <TableCell>
                        {withCustomSelect
                          ? key[displayCustomDateFormatter(withCustomSelect)]
                          : key[dateWordFormatter(withSelect)]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <Card decoration="bottom" className="border-prim-blue">
              <div className="flex flex-row justify-between items-center">
                <Title>Ticket Details: Bar Chart</Title>
                <Select
                  value={chart2Format}
                  className="w-fit"
                  onValueChange={setChart2Format}
                >
                  <SelectItem value="false">Count</SelectItem>
                  <SelectItem value="true">Relative</SelectItem>
                </Select>
              </div>
              <BarChart
                data={ticketDetailData}
                className="mt-6"
                index="Type"
                categories={
                  withCustomSelect || compareCustomSelect
                    ? [
                        displayCustomDateFormatter(compareCustomSelect),
                        displayCustomDateFormatter(withCustomSelect),
                      ]
                    : [
                        dateWordFormatter(compareSelect),
                        dateWordFormatter(withSelect),
                      ]
                }
                colors={["blue"]}
                relative={chart2Format == "true"}
                yAxisWidth={48}
              />
            </Card>
          </div>
        </div>
        <Card decoration="top" className="border-prim-blue">
          <Title>Call Details</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>
                  {compareCustomSelect
                    ? displayCustomDateFormatter(compareCustomSelect)
                    : dateWordFormatter(compareSelect)}
                </TableHeaderCell>
                <TableHeaderCell />
                <TableHeaderCell>
                  {withCustomSelect
                    ? displayCustomDateFormatter(withCustomSelect)
                    : dateWordFormatter(withSelect)}
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {callDetailData?.map((key: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <TicketProp
                      type={key["Type"]}
                      urgent={null}
                      new_client={null}
                      closeable={false}
                      onClose={() => null}
                    />
                  </TableCell>
                  <TableCell>
                    {compareCustomSelect
                      ? key[displayCustomDateFormatter(compareCustomSelect)]
                      : key[dateWordFormatter(compareSelect)]}
                  </TableCell>
                  <TableCell>
                    {!compareCustomSelect || !withCustomSelect ? (
                      <BadgeDelta
                        deltaType={
                          key[dateWordFormatter(compareSelect)] >
                          key[dateWordFormatter(withSelect)]
                            ? "increase"
                            : "decrease"
                        }
                        isIncreasePositive={
                          key[dateWordFormatter(compareSelect)] ===
                          "Calls Missed"
                            ? false
                            : true
                        }
                      >
                        {percentageFormatter(
                          key[dateWordFormatter(compareSelect)],
                          key[dateWordFormatter(withSelect)]
                        )}
                      </BadgeDelta>
                    ) : (
                      <BadgeDelta
                        deltaType={
                          key[displayCustomDateFormatter(compareCustomSelect)] >
                          key[displayCustomDateFormatter(withCustomSelect)]
                            ? "increase"
                            : "decrease"
                        }
                        isIncreasePositive={
                          key[
                            displayCustomDateFormatter(compareCustomSelect)
                          ] === "Calls Missed"
                            ? false
                            : true
                        }
                      >
                        {percentageFormatter(
                          key[displayCustomDateFormatter(compareCustomSelect)],
                          key[displayCustomDateFormatter(withCustomSelect)]
                        )}
                      </BadgeDelta>
                    )}
                  </TableCell>
                  <TableCell>
                    {withCustomSelect
                      ? key[displayCustomDateFormatter(withCustomSelect)]
                      : key[dateWordFormatter(withSelect)]}
                  </TableCell>
                </TableRow>
              ))}
              {callDetailData ? (
                <TableRow>
                  <TableCell>Call to Ticket Conversation</TableCell>
                  <TableCell>
                    {compareCustomSelect
                      ? percentageFormatter(
                          callDetailData[0][
                            displayCustomDateFormatter(compareCustomSelect)
                          ] /
                            callDetailData[1][
                              displayCustomDateFormatter(compareCustomSelect)
                            ],
                          null
                        )
                      : percentageFormatter(
                          callDetailData[0][dateWordFormatter(compareSelect)] /
                            callDetailData[1][dateWordFormatter(compareSelect)],
                          null
                        )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    {compareCustomSelect
                      ? percentageFormatter(
                          callDetailData[0][
                            displayCustomDateFormatter(withCustomSelect)
                          ] /
                            callDetailData[1][
                              displayCustomDateFormatter(withCustomSelect)
                            ],
                          null
                        )
                      : percentageFormatter(
                          callDetailData[0][dateWordFormatter(withSelect)] /
                            callDetailData[1][dateWordFormatter(withSelect)],
                          null
                        )}
                  </TableCell>
                </TableRow>
              ) : null}
              {callDetailData ? (
                <TableRow>
                  <TableCell>Ticket Completion Rate</TableCell>
                  <TableCell>
                    {compareCustomSelect
                      ? percentageFormatter(
                          callDetailData[2][
                            displayCustomDateFormatter(compareCustomSelect)
                          ] /
                            callDetailData[1][
                              displayCustomDateFormatter(compareCustomSelect)
                            ],
                          null
                        )
                      : percentageFormatter(
                          callDetailData[2][dateWordFormatter(compareSelect)] /
                            callDetailData[1][dateWordFormatter(compareSelect)],
                          null
                        )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    {compareCustomSelect
                      ? percentageFormatter(
                          callDetailData[2][
                            displayCustomDateFormatter(withCustomSelect)
                          ] /
                            callDetailData[1][
                              displayCustomDateFormatter(withCustomSelect)
                            ],
                          null
                        )
                      : percentageFormatter(
                          callDetailData[2][dateWordFormatter(withSelect)] /
                            callDetailData[1][dateWordFormatter(withSelect)],
                          null
                        )}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </Card>
      </div>
    </ProductNavBar>
  );
}

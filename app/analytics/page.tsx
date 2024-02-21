"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import Sidebar from "@/components/sidebar";
import ProductNavBar from "@/components/ProductNavBar";
import {
  Card,
  Text,
  BarChart,
  Select,
  SelectItem,
  MultiSelect,
  MultiSelectItem,
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
} from "@tremor/react";
import { DateRangePicker, DateRangePickerValue } from "@tremor/react";
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
  set,
} from "date-fns";

import {
  displayCustomDateFormatter,
  percentageFormatter,
  convertISOToTimestampTZ,
  dateWordFormatter,
  formattingDates,
} from "@/lib/anlayticutils";

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
    information_recieved: boolean;
  }

  const router = useRouter();
  const [chart1Format, setChart1Format] = useState("false");
  const [chart2Format, setChart2Format] = useState("false");

  const [timeRange, setTimeRange] = useState("Day");
  const [compareCustomSelect, setCompareCustomSelect] = useState<
    DateRangePickerValue | undefined
  >(undefined);
  const [withCustomSelect, setWithCustomSelect] = useState<
    DateRangePickerValue | undefined
  >(undefined);

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

  const [allClinicIDs, setAllClinicIDs] = useState<any[]>([]);
  const [activeClinicIDs, setActiveClinicIDs] = useState<any[]>([]);

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
  }, [timeRange, withCustomSelect, compareCustomSelect]);

  useEffect(() => {
    setCompareTickets([]);
    setWithTickets([]);
    setTicketsCreatedData([]);
    setTicketDetailData([]);
  }, [timeRange, activeClinicIDs]);

  useEffect(() => {
    if (compareStartDate && compareEndDate && allClinicIDs) {
      fetchCompareTickets(allClinicIDs);
    }
  }, [compareStartDate, compareEndDate]);

  useEffect(() => {
    if (withStartDate && withEndDate && allClinicIDs) {
      fetchWithTickets(allClinicIDs);
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
    fetchAllClinicIDs();
  }, []);

  /**
   * Fetches all clinic IDs that correspond to the user
   *
   * @returns a list of clinic IDs
   */
  const fetchAllClinicIDs = async () => {
    console.log("fetchAllClinicIDs");
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

    const getClinicData = async (IDs: any) => {
      console.log(IDs);
      IDs = IDs.map((id: any) => id.clinic);
      const { data, error } = await supabase
        .from("clinics")
        .select("name, id")
        .in("id", IDs);
      return data;
    };

    if (userRole == "Owner") {
      const { data, error } = await supabase
        .from("owner_clinics")
        .select("clinic")
        .eq("owner", id);
      if (data) {
        clinics = await getClinicData(data);
      } else {
        clinics = null;
      }
    } else if (userRole == "Manager") {
      const { data, error } = await supabase
        .from("manager_clinics")
        .select("clinic")
        .eq("manager", id);
      if (data) {
        clinics = await getClinicData(data);
      } else {
        clinics = null;
      }
    } else {
      clinics = null;
    }

    if (!clinics) {
      return;
    } else {
      setAllClinicIDs(clinics);
      setActiveClinicIDs(clinics);
    }
  };

  useEffect(() => {
    if (activeClinicIDs && activeClinicIDs.length > 0) {
      fetchCompareTickets(activeClinicIDs);
      fetchWithTickets(activeClinicIDs);
    }
  }, [activeClinicIDs]);

  const fetchCompareTickets = async (clinics: any[]) => {
    console.log("fetchCompareTickets");
    const IDs = clinics.map((clinic) => String(clinic?.id));

    const { data: tickets, error: ticketsError } = await supabase
      .from("tickets")
      .select("*")
      .in("clinic", IDs)
      .eq("information_recieved", true)
      .filter("time", "gte", compareStartDate)
      .filter("time", "lte", compareEndDate);
    if (ticketsError) {
      console.error("Error fetching compare tickets:", ticketsError);
      return;
    }

    // console.log("Got compare tickets: ", tickets);

    setCompareTickets(tickets);
  };

  const fetchWithTickets = async (clinics: any[]) => {
    console.log("fetchWithTickets");
    const IDs = clinics.map((clinic) => String(clinic?.id));

    const { data: tickets, error: ticketsError } = await supabase
      .from("tickets")
      .select("*")
      .in("clinic", IDs)
      .eq("information_recieved", true)
      .filter("time", "gte", withStartDate)
      .filter("time", "lte", withEndDate);

    if (ticketsError) {
      console.error("Error fetching with tickets:", ticketsError);
      return;
    }
    // console.log("Got with tickets: ", tickets);

    setWithTickets(tickets);
  };

  /**
   * Sets the start and end date for the currently selected date range
   */
  const settingDateRange = async () => {
    console.log("settingDateRange");
    if (withCustomSelect || compareCustomSelect) {
      console.log(compareCustomSelect, withCustomSelect);
      setCompareStartDate(convertISOToTimestampTZ(compareCustomSelect?.from));
      if (compareCustomSelect?.to) {
        setCompareEndDate(
          convertISOToTimestampTZ(new Date(endOfDay(compareCustomSelect?.to)))
        );
      } else {
        setCompareEndDate(
          convertISOToTimestampTZ(
            new Date(addDays(compareCustomSelect?.from || 0, 1))
          )
        );
      }

      setWithStartDate(convertISOToTimestampTZ(withCustomSelect?.from));
      if (withCustomSelect?.to) {
        setWithEndDate(
          convertISOToTimestampTZ(new Date(endOfDay(withCustomSelect?.to)))
        );
      } else {
        setWithEndDate(
          convertISOToTimestampTZ(
            new Date(addDays(withCustomSelect?.from || 0, 1))
          )
        );
      }
    } else {
      const compareDates = formattingDates("This", timeRange);
      setCompareStartDate(convertISOToTimestampTZ(compareDates["start"]));
      setCompareEndDate(convertISOToTimestampTZ(compareDates["end"]));

      const withDates = formattingDates("Last", timeRange);
      setWithStartDate(convertISOToTimestampTZ(withDates["start"]));
      setWithEndDate(convertISOToTimestampTZ(withDates["end"]));
    }
  };

  const createdDictValueFinder = async (key: string, type: string) => {
    console.log("createdDictValueFinder");
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
      dateWordFormatter("This", timeRange) === key
        ? compareTickets
        : withTickets;
    return source.filter((ticket) => ticket["type"] === type.toLowerCase())
      .length;
  };

  const populateCreatedTicketsData = async () => {
    console.log("populateCreatedTicketsData");
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
    console.log("detailDictValueFinder");
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
      dateWordFormatter("This", timeRange) === key
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
  };

  const populateTicketDetailsData = async () => {
    console.log("populateTicketDetailsData");
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
    console.log("callDictValueFinder");
    if (
      key == displayCustomDateFormatter(compareCustomSelect) ||
      key == displayCustomDateFormatter(withCustomSelect)
    ) {
      const source =
        displayCustomDateFormatter(compareCustomSelect) == key
          ? compareTickets
          : withTickets;
      if (type === "Missed Calls") {
        // console.log("Calls Missed Length:", source.length);
        return source.length;
      } else if (type === "Tickets Created") {
        return source.filter((ticket) => ticket["information_recieved"] == true)
          .length;
      } else if (type === "Tickets Completed") {
        return source.filter((ticket) => ticket["stage"] == 3).length;
      } else {
        return 0;
      }
    }

    console.log(compareTickets);

    const source =
      dateWordFormatter("This", timeRange) === key
        ? compareTickets
        : withTickets;
    if (type === "Missed Calls") {
      // console.log("here 1");
      return source.length;
    } else if (type === "Tickets Created") {
      return source.filter((ticket) => ticket["information_recieved"] == true)
        .length;
    } else if (type === "Tickets Completed") {
      return source.filter((ticket) => ticket["stage"] == 3).length;
    } else {
      return 0;
    }
  };

  const populateCallDetailsData = async () => {
    console.log("populateCallDetailsData");
    if (!compareCustomSelect && !withCustomSelect) {
      // console.log("here");
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
            // console.log("CD: ", obj);

            return obj;
          })
        )
      );
    }
  };

  return (
    <ProductNavBar>
      <div className="flex flex-col gap-4 w-full h-fit max-w-[1180px]">
        <div className="flex flex-row gap-4">
          <div>
            <Text>Clinics</Text>
            <MultiSelect
              defaultValue={allClinicIDs}
              value={activeClinicIDs}
              onValueChange={setActiveClinicIDs}
              placeholder="Select Clinics"
            >
              {allClinicIDs.map((clinic, key) => (
                <MultiSelectItem
                  key={key}
                  value={clinic}
                  className="multiselectitem"
                >
                  {clinic.name}
                </MultiSelectItem>
              ))}
            </MultiSelect>
          </div>
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
          {timeRange == "Custom" ? (
            <div>
              <Text>Compare</Text>
              <DateRangePicker
                value={compareCustomSelect}
                onValueChange={setCompareCustomSelect}
              />
            </div>
          ) : null}
          {timeRange == "Custom" ? (
            <div>
              <Text>With</Text>
              <DateRangePicker
                value={withCustomSelect}
                onValueChange={setWithCustomSelect}
              />
            </div>
          ) : null}
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
                        : dateWordFormatter("This", timeRange)}
                    </TableHeaderCell>
                    <TableHeaderCell />
                    <TableHeaderCell>
                      {withCustomSelect
                        ? displayCustomDateFormatter(withCustomSelect)
                        : dateWordFormatter("Last", timeRange)}
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
                          : key[dateWordFormatter("This", timeRange)]}
                      </TableCell>
                      <TableCell>
                        {!compareCustomSelect || !withCustomSelect ? (
                          <BadgeDelta
                            deltaType={
                              key[dateWordFormatter("This", timeRange)] >
                              key[dateWordFormatter("Last", timeRange)]
                                ? "increase"
                                : "decrease"
                            }
                          >
                            {percentageFormatter(
                              key[dateWordFormatter("This", timeRange)],
                              key[dateWordFormatter("Last", timeRange)]
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
                          : key[dateWordFormatter("Last", timeRange)]}
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
                        dateWordFormatter("This", timeRange),
                        dateWordFormatter("Last", timeRange),
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
                        : dateWordFormatter("This", timeRange)}
                    </TableHeaderCell>
                    <TableHeaderCell />
                    <TableHeaderCell>
                      {withCustomSelect
                        ? displayCustomDateFormatter(withCustomSelect)
                        : dateWordFormatter("Last", timeRange)}
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
                          : key[dateWordFormatter("This", timeRange)]}
                      </TableCell>
                      <TableCell>
                        {!compareCustomSelect || !withCustomSelect ? (
                          <BadgeDelta
                            deltaType={
                              key[dateWordFormatter("This", timeRange)] >
                              key[dateWordFormatter("Last", timeRange)]
                                ? "increase"
                                : "decrease"
                            }
                          >
                            {percentageFormatter(
                              key[dateWordFormatter("This", timeRange)],
                              key[dateWordFormatter("Last", timeRange)]
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
                          : key[dateWordFormatter("Last", timeRange)]}
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
                        dateWordFormatter("This", timeRange),
                        dateWordFormatter("Last", timeRange),
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
                    : dateWordFormatter("This", timeRange)}
                </TableHeaderCell>
                <TableHeaderCell />
                <TableHeaderCell>
                  {withCustomSelect
                    ? displayCustomDateFormatter(withCustomSelect)
                    : dateWordFormatter("Last", timeRange)}
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
                      : key[dateWordFormatter("This", timeRange)]}
                  </TableCell>
                  <TableCell>
                    {!compareCustomSelect || !withCustomSelect ? (
                      <BadgeDelta
                        deltaType={
                          key[dateWordFormatter("This", timeRange)] >
                          key[dateWordFormatter("Last", timeRange)]
                            ? "increase"
                            : "decrease"
                        }
                        isIncreasePositive={
                          key[dateWordFormatter("This", timeRange)] ===
                          "Calls Missed"
                            ? false
                            : true
                        }
                      >
                        {percentageFormatter(
                          key[dateWordFormatter("This", timeRange)],
                          key[dateWordFormatter("Last", timeRange)]
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
                      : key[dateWordFormatter("Last", timeRange)]}
                  </TableCell>
                </TableRow>
              ))}
              {callDetailData ? (
                <TableRow>
                  <TableCell>Call to Ticket Conversation</TableCell>
                  <TableCell>
                    {compareCustomSelect
                      ? percentageFormatter(
                          callDetailData[1][
                            displayCustomDateFormatter(compareCustomSelect)
                          ] /
                            callDetailData[0][
                              displayCustomDateFormatter(compareCustomSelect)
                            ],
                          null
                        )
                      : percentageFormatter(
                          callDetailData[1][
                            dateWordFormatter("This", timeRange)
                          ] /
                            callDetailData[0][
                              dateWordFormatter("This", timeRange)
                            ],
                          null
                        )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    {compareCustomSelect
                      ? percentageFormatter(
                          callDetailData[1][
                            displayCustomDateFormatter(withCustomSelect)
                          ] /
                            callDetailData[0][
                              displayCustomDateFormatter(withCustomSelect)
                            ],
                          null
                        )
                      : percentageFormatter(
                          callDetailData[1][
                            dateWordFormatter("Last", timeRange)
                          ] /
                            callDetailData[0][
                              dateWordFormatter("Last", timeRange)
                            ],
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
                          callDetailData[2][
                            dateWordFormatter("This", timeRange)
                          ] /
                            callDetailData[1][
                              dateWordFormatter("This", timeRange)
                            ],
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
                          callDetailData[2][
                            dateWordFormatter("Last", timeRange)
                          ] /
                            callDetailData[1][
                              dateWordFormatter("Last", timeRange)
                            ],
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

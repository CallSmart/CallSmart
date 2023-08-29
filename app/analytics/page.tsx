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

export default function AnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push("/signin"); // Redirect to sign-in if no session found
    }
  }, []);

  const percentageFormatter = (value1: number, value2: number | null) => {
    if (value2 === null) {
      const roundedPercentage = Math.trunc(Math.round(value1 * 100));
      return `${roundedPercentage}%`;
    } else {
      const percentageChange = ((value1 - value2) / value2) * 100;

      const roundedPercentage = Math.trunc(
        Math.round(percentageChange * 100) / 100
      );

      return `${roundedPercentage}%`;
    }
  };

  const ticketsCreatedData = [
    {
      Type: "Question",
      Today: 21,
      Yesterday: 15,
    },
    {
      Type: "Book",
      Today: 13,
      Yesterday: 14,
    },
    {
      Type: "Cancel",
      Today: 20,
      Yesterday: 12,
    },
    {
      Type: "Reschedule",
      Today: 4,
      Yesterday: 12,
    },
  ];

  const ticketDetailsData = [
    {
      Type: "New",
      Today: 25,
      Yesterday: 13,
    },
    {
      Type: "Urgent",
      Today: 21,
      Yesterday: 15,
    },
    {
      Type: "Existing Client",
      Today: 29,
      Yesterday: 15,
    },
    {
      Type: "Non Urgent",
      Today: 12,
      Yesterday: 12,
    },
  ];

  const callDetailsData = [
    {
      Type: "Calls Missed",
      Today: 25,
      Yesterday: 17,
    },
    {
      Type: "Tickets Created",
      Today: 21,
      Yesterday: 15,
    },
    {
      Type: "Tickets Completed",
      Today: 29,
      Yesterday: 15,
    },
  ];

  const chartOptions = ["relative", "non-relative"];
  const [chart1Format, setChart1Format] = useState("false");
  const [chart2Format, setChart2Format] = useState("false");

  const [timeRange, setTimeRange] = useState("Day");

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
            </Select>
          </div>
          <div>
            <Text>Compare</Text>
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
              className="w-fit"
            >
              <SelectItem value={"This"}>This Week</SelectItem>
              <SelectItem value={"Last"}>Last Week</SelectItem>
              <SelectItem value={"Pick"}>Pick Date</SelectItem>
            </Select>
          </div>
          <div>
            <Text>With</Text>
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
              className="w-fit"
            >
              <SelectItem value={"This"}>This Week</SelectItem>
              <SelectItem value={"Last"}>Last Week</SelectItem>
              <SelectItem value={"Pick"}>Pick Date</SelectItem>
            </Select>
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
                    <TableHeaderCell>Today</TableHeaderCell>
                    <TableHeaderCell />
                    <TableHeaderCell>Yesterday</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ticketsCreatedData.map((key) => (
                    <TableRow>
                      <TableCell>
                        <TicketProp
                          type={key["Type"].toLowerCase()}
                          closeable={false}
                          onClose={() => null}
                        />
                      </TableCell>
                      <TableCell>{key["Today"]}</TableCell>
                      <TableCell>
                        <BadgeDelta
                          deltaType={
                            key["Today"] > key["Yesterday"]
                              ? "increase"
                              : "decrease"
                          }
                          // isIncreasePositive={true}
                        >
                          {percentageFormatter(key["Today"], key["Yesterday"])}
                        </BadgeDelta>
                      </TableCell>
                      <TableCell>{key["Yesterday"]}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell>
                      {ticketsCreatedData.reduce(
                        (acc, obj) => acc + obj.Today,
                        0
                      )}
                    </TableCell>
                    <TableCell>
                      <BadgeDelta
                        deltaType={
                          ticketsCreatedData.reduce(
                            (acc, obj) => acc + obj.Today,
                            0
                          ) >
                          ticketsCreatedData.reduce(
                            (acc, obj) => acc + obj.Yesterday,
                            0
                          )
                            ? "increase"
                            : "decrease"
                        }
                      >
                        {percentageFormatter(
                          ticketsCreatedData.reduce(
                            (acc, obj) => acc + obj.Today,
                            0
                          ),
                          ticketsCreatedData.reduce(
                            (acc, obj) => acc + obj.Yesterday,
                            0
                          )
                        )}
                      </BadgeDelta>
                    </TableCell>
                    <TableCell>
                      {ticketsCreatedData.reduce(
                        (acc, obj) => acc + obj.Yesterday,
                        0
                      )}
                    </TableCell>
                  </TableRow>
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
                categories={["Today", "Yesterday"]}
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
                    <TableHeaderCell>Today</TableHeaderCell>
                    <TableHeaderCell />
                    <TableHeaderCell>Yesterday</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ticketDetailsData.map((key) => (
                    <TableRow>
                      <TableCell>
                        <TicketProp
                          type={key["Type"].toLowerCase()}
                          closeable={false}
                          onClose={() => null}
                        />
                      </TableCell>
                      <TableCell>{key["Today"]}</TableCell>
                      <TableCell>
                        <BadgeDelta
                          deltaType={
                            key["Today"] > key["Yesterday"]
                              ? "increase"
                              : "decrease"
                          }
                          // isIncreasePositive={true}
                        >
                          {percentageFormatter(key["Today"], key["Yesterday"])}
                        </BadgeDelta>
                      </TableCell>
                      <TableCell>{key["Yesterday"]}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell>
                      {ticketDetailsData.reduce(
                        (acc, obj) => acc + obj.Today,
                        0
                      )}
                    </TableCell>
                    <TableCell>
                      <BadgeDelta
                        deltaType={
                          ticketDetailsData.reduce(
                            (acc, obj) => acc + obj.Today,
                            0
                          ) >
                          ticketDetailsData.reduce(
                            (acc, obj) => acc + obj.Yesterday,
                            0
                          )
                            ? "increase"
                            : "decrease"
                        }
                      >
                        {percentageFormatter(
                          ticketDetailsData.reduce(
                            (acc, obj) => acc + obj.Today,
                            0
                          ),
                          ticketDetailsData.reduce(
                            (acc, obj) => acc + obj.Yesterday,
                            0
                          )
                        )}
                      </BadgeDelta>
                    </TableCell>
                    <TableCell>
                      {ticketDetailsData.reduce(
                        (acc, obj) => acc + obj.Yesterday,
                        0
                      )}
                    </TableCell>
                  </TableRow>
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
                data={ticketDetailsData}
                className="mt-6"
                index="Type"
                categories={["Today", "Yesterday"]}
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
                <TableHeaderCell>Today</TableHeaderCell>
                <TableHeaderCell />
                <TableHeaderCell>Yesterday</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {callDetailsData.map((key) => (
                <TableRow>
                  <TableCell>
                    <TicketProp
                      type={key["Type"].toLowerCase()}
                      closeable={false}
                      onClose={() => null}
                    />
                  </TableCell>
                  <TableCell>{key["Today"]}</TableCell>
                  <TableCell>
                    <BadgeDelta
                      deltaType={
                        key["Today"] > key["Yesterday"]
                          ? "increase"
                          : "decrease"
                      }
                      isIncreasePositive={
                        key["Type"] === "Calls Missed" ? false : true
                      }
                    >
                      {percentageFormatter(key["Today"], key["Yesterday"])}
                    </BadgeDelta>
                  </TableCell>
                  <TableCell>{key["Yesterday"]}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Call to Ticket Conversation</TableCell>
                <TableCell>
                  {percentageFormatter(
                    callDetailsData[1]["Today"] / callDetailsData[0]["Today"],
                    null
                  )}
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  {percentageFormatter(
                    callDetailsData[1]["Yesterday"] /
                      callDetailsData[0]["Yesterday"],
                    null
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ticket Completion Rate</TableCell>
                <TableCell>
                  {percentageFormatter(
                    callDetailsData[1]["Today"] / callDetailsData[2]["Today"],
                    null
                  )}
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  {percentageFormatter(
                    callDetailsData[1]["Yesterday"] /
                      callDetailsData[2]["Yesterday"],
                    null
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </ProductNavBar>
  );
}

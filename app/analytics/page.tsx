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

  const chartdata = [
    {
      name: "Question",
      Today: 2488,
      Yesterday: 2345,
    },
    {
      name: "Book",
      Today: 1445,
      Yesterday: 1254,
    },
    {
      name: "Cancel",
      Today: 423,
      Yesterday: 532,
    },
    {
      name: "Reschedule",
      Today: 12,
      Yesterday: 52,
    },
  ];

  const chartOptions = ["relative", "non-relative"];
  const [chart1Format, setChart1Format] = useState("false");
  const [chart2Format, setChart2Format] = useState("false");

  return (
    <ProductNavBar>
      <div className="flex flex-row xl:flex-nowrap flex-wrap gap-4 w-full h-full">
        <div className="flex flex-col gap-4 w-full xl:w-1/2">
          <Card
            decoration="top"
            className="flex flex-col gap-4 w-fit min-h-1/2 px-12 border-prim-blue w-full"
          >
            <Title>Calls Missed: Metrics</Title>
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
                <TableRow>
                  <TableCell>
                    <TicketProp
                      type="question"
                      closeable={false}
                      onClose={() => null}
                    />
                  </TableCell>
                  <TableCell>21</TableCell>
                  <TableCell>
                    <BadgeDelta>12%</BadgeDelta>
                  </TableCell>
                  <TableCell>15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <TicketProp
                      type="book"
                      closeable={false}
                      onClose={() => null}
                    />
                  </TableCell>
                  <TableCell>21</TableCell>
                  <TableCell>
                    <BadgeDelta>12%</BadgeDelta>
                  </TableCell>
                  <TableCell>15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <TicketProp
                      type="cancel"
                      closeable={false}
                      onClose={() => null}
                    />
                  </TableCell>
                  <TableCell>21</TableCell>
                  <TableCell>
                    <BadgeDelta>12%</BadgeDelta>
                  </TableCell>
                  <TableCell>15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <TicketProp
                      type="reschedule"
                      closeable={false}
                      onClose={() => null}
                    />
                  </TableCell>
                  <TableCell>21</TableCell>
                  <TableCell>
                    <BadgeDelta>12%</BadgeDelta>
                  </TableCell>
                  <TableCell>15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell>21</TableCell>
                  <TableCell>
                    <BadgeDelta>12%</BadgeDelta>
                  </TableCell>
                  <TableCell>15</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
          <Card decoration="bottom" className="border-prim-blue">
            <div className="flex flex-row justify-between items-center">
              <Title>Calls Missed: Bar Chart</Title>
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
              data={chartdata}
              className="mt-6"
              index="name"
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
            className="flex flex-col gap-4 w-fit min-h-1/2 px-12 border-prim-blue w-full"
          >
            <Title>Call Details: Metrics</Title>
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
                <TableRow>
                  <TableCell>
                    <TicketProp
                      type="new"
                      closeable={false}
                      onClose={() => null}
                    />
                  </TableCell>
                  <TableCell>21</TableCell>
                  <TableCell>
                    <BadgeDelta>12%</BadgeDelta>
                  </TableCell>
                  <TableCell>15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <TicketProp
                      type="urgent"
                      closeable={false}
                      onClose={() => null}
                    />
                  </TableCell>
                  <TableCell>21</TableCell>
                  <TableCell>
                    <BadgeDelta>12%</BadgeDelta>
                  </TableCell>
                  <TableCell>15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Non-New</TableCell>
                  <TableCell>21</TableCell>
                  <TableCell>
                    <BadgeDelta>12%</BadgeDelta>
                  </TableCell>
                  <TableCell>15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Non-Urgent</TableCell>
                  <TableCell>21</TableCell>
                  <TableCell>
                    <BadgeDelta>12%</BadgeDelta>
                  </TableCell>
                  <TableCell>15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell>21</TableCell>
                  <TableCell>
                    <BadgeDelta>12%</BadgeDelta>
                  </TableCell>
                  <TableCell>15</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
          <Card decoration="bottom" className="border-prim-blue">
            <div className="flex flex-row justify-between items-center">
              <Title>Call Details: Bar Chart</Title>
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
              data={chartdata}
              className="mt-6"
              index="name"
              categories={["Today", "Yesterday"]}
              colors={["blue"]}
              relative={chart2Format == "true"}
              yAxisWidth={48}
            />
          </Card>
        </div>
      </div>
    </ProductNavBar>
  );
}

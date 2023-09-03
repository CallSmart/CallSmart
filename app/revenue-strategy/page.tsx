import HomeNavBar from "@/components/HomeNavBar";
import { Card } from "@tremor/react";

export default function Home() {
  return (
    <HomeNavBar>
      <div className="flex flex-col items-center gap-16 w-[90%] md:w-4/5 max-w-[1280px]">
        <div className="flex flex-col items-center gap-4 w-full">
          <h1 className="text-center">
            Supercharge Your Dental Clinic Revenue
          </h1>
          <h3 className="text-center text-2xl font-semibold w-2/3 ">
            At CallSmart, we're all about turning missed opportunities into real
            revenue for your dental clinic. Let's break down exactly how our
            solution can boost your earnings!
          </h3>
          <Card decoration="top" className="landing-card">
            <h3 className="text-prim-blue text-center">
              🔍 Understanding the Missed Revenue Impact:{" "}
            </h3>
            <ul className="list-disc text-left">
              <li>Average Value of a New Patient: $500</li>
              <li>Percentage of Missed Calls: 20%</li>
              <li>Average Monthly Missed Calls: 100</li>
            </ul>
            <h3 className="text-center text-2xl font-semibold">
              Here's where the revenue magic happens...
            </h3>
          </Card>
        </div>
        <div className="flex flex-col items-center gap-4 w-full">
          <h1 className="text-center text-3xl font-semibold">
            📈 How CallSmart Drives Revenue:
          </h1>
          <Card decoration="top" className="landing-card">
            <h3 className="text-prim-blue text-center">Immediate Engagement</h3>
            All 100 missed calls are engaged via CallSmart. 40% of these engaged
            leads convert to appointments. Additional Revenue from Appointments:
            40 appointments x $500 = $20,000
          </Card>
          <Card decoration="top" className="landing-card">
            <h3 className="text-prim-blue text-center">Upsells and Services</h3>
            25% of appointments lead to additional services. Additional Revenue
            from Upsells: 40 appointments x 25% x $250 = $2,500
          </Card>
          <Card decoration="top" className="landing-card">
            <h3 className="text-prim-blue text-center">
              Increased Patient Retention
            </h3>
            10% increase in patient retention due to improved engagement.
            Increased Revenue from Retention: 10% x Average Monthly Revenue = $X
            (Your clinic's average monthly revenue increase)
          </Card>
          <Card decoration="top" className="landing-card">
            <h3 className="text-prim-blue text-center">
              Total Extra Revenue Potential
            </h3>
            $20,000 (Appointments) + $2,500 (Upsells) + $X (Increased Retention)
            = $22 500+ Imagine unlocking an additional $22 500+ in revenue each
            month – that's what CallSmart can bring to your dental clinic.
          </Card>
        </div>
        <div className="flex flex-col items-center gap-4 w-full">
          <h1 className="text-center text-3xl font-semibold">
            Ready to Transform Missed Calls into Revenue?
          </h1>
          <a
            className="w-fit px-4 py-2 bg-prim-blue hover:bg-prim-blue/50 active:bg-prim-blue/75 rounded-xl text-white transition-all duration-200"
            href="/signup"
          >
            Get Started with CallSmart
          </a>
          Don't let missed calls be missed revenue. Embrace CallSmart today and
          watch your dental clinic's revenue soar.
        </div>
      </div>
    </HomeNavBar>
  );
}

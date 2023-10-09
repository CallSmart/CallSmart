import HomeNavBar from "@/components/HomeNavBar";
import { Card } from "@tremor/react";
import Image from "next/image";
import * as Img from "../images";

export default function Home() {
  return (
    <HomeNavBar>
      <div className="flex flex-col items-center gap-4 w-[90%] md:w-4/5 text-[16px] max-w-[1280px]">
        <h1 className="text-center text-6xl md:text-6xl">CallSmart</h1>
        <h3 className="text-center text-4xl font-semibold w-full md:w-2/3">
          Your Dental Clinics Missed Call Solution
        </h3>
        <Card className="w-full md:w-2/3 text-center flex flex-col items-center">
          Our specialized software, designed exclusively for dental practices,
          transforms missed calls into chair-time. Seamlessly integrating with
          your Voice over IP system, CallSmart ensures that no call goes
          unnoticed, maximizing the potential of every interaction.
          <br />
          <br />
          <em className="font-semibold text-sec-blue">
            Voice Over IP Providers we work with:
          </em>
          <Image src={Img.GoToLogo} alt="GoTo VoIP" height="200" />
        </Card>
      </div>
      <div className="flex flex-col items-center gap-6 w-4/5 max-w-[1280px]">
        <h1 className="text-center text-4xl font-semibold">
          Why Choose CallSmart?
        </h1>
        <div className="flex flex-row flex-wrap justify-center gap-4 w-full">
          <Card decoration="top" className="landing-card">
            <h3 className="text-prim-blue text-center">
              🦷 Effortless Missed Call Recovery
            </h3>
            Our cutting-edge technology ensures that no call goes unnoticed.
            With CallSmart, missed calls turn into instant opportunities as we
            engage your customers through text conversations.
          </Card>
          <Card decoration="top" className="landing-card">
            <h3 className="text-prim-blue text-center">
              📞 Integrated VoIP Compatibility
            </h3>
            Seamlessly connect CallSmart with your existing Voice over IP
            infrastructure. No disruptions, no hassle – just enhanced
            communication and improved patient engagement.
          </Card>
          <Card decoration="top" className="landing-card">
            <h3 className="text-prim-blue text-center">
              📱 Interactive Text Conversations: Say goodbye to voicemails!
            </h3>
            CallSmart initiates automated text conversations with your missed
            callers. Engage with your patients like never before and capture
            their needs promptly.
          </Card>
          <Card decoration="top" className="landing-card">
            <h3 className="text-prim-blue text-center">
              📊 Insightful Dashboard
            </h3>
            Empower your dental administrators with a comprehensive dashboard
            that compiles essential patient information gathered from text
            conversations. Stay informed, make informed decisions, and provide
            top-notch service.
          </Card>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6 w-4/5 max-w-[1280px]">
        <h1 className="text-center text-4xl font-semibold">
          Boost Revenue With CallSmart
        </h1>
        <div className="flex flex-row flex-wrap justify-center gap-4 w-full">
          <Card decoration="top" className="landing-card">
            <h3 className="text-prim-blue text-center">
              📈 Maximise Appointment Booking
            </h3>
            Convert missed calls into scheduled appointments. CallSmart ensures
            that potential patients are guided seamlessly into your clinic's
            calendar, minimising the chances of missed opportunities.
          </Card>
          <Card decoration="top" className="landing-card">
            <h3 className="text-prim-blue text-center">
              🔍 Actionable Customer Insights
            </h3>
            Uncover valuable insights from text conversations. Understand
            patient needs, preferences, and concerns, allowing you to tailor
            your services and exceed expectations.
          </Card>
          <Card decoration="top" className="landing-card">
            <h3 className="text-prim-blue text-center">
              👥 Enhanced Patient Engagement
            </h3>
            Strengthen patient relationships by demonstrating your commitment to
            their care. With CallSmart, your patients will feel valued and
            heard, fostering loyalty and positive word-of-mouth.
          </Card>
          <Card decoration="top" className="landing-card">
            <h3 className="text-prim-blue text-center">
              📉 Reduce Missed Revenue
            </h3>
            Every missed call is a potential lost revenue. CallSmart's
            comprehensive solution tackles this head-on, transforming missed
            calls into a steady stream of income that would have otherwise
            slipped through the cracks.
          </Card>
          <Card
            decoration="bottom"
            className="lg:w-4/5 flex flex-col gap-3 text-center items-center "
          >
            <h3 className="text-prim-blue text-center">
              Join the CallSmart revolution today and revolutionize the way you
              connect with your patients.
            </h3>
            Reclaim missed opportunities, strengthen patient relationships, and
            watch your revenue soar. Don't let missed calls translate to missed
            revenue any longer! Ready to experience the future of dental clinic
            communication?
            <a
              className="w-fit px-4 py-2 bg-prim-blue hover:bg-prim-blue/50 active:bg-prim-blue/75 rounded-xl text-white transition-all duration-200"
              href="/signup"
            >
              Get started with CallSmart now!
            </a>
          </Card>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6 w-4/5 max-w-[1280px]">
        <h1 className="text-center text-4xl font-semibold">Your Investment</h1>
        <h3 className="text-sec-blue text-center">$249.99/month</h3>
        <a
          className="w-fit px-4 py-2 bg-prim-blue hover:bg-prim-blue/50 active:bg-prim-blue/75 rounded-xl text-white transition-all duration-200"
          href="/signup"
        >
          See Details on Pricing Page
        </a>
        <div className="flex flex-row flex-wrap justify-center gap-4 w-full">
          <Card
            decoration="top"
            className="lg:w-4/5 flex flex-col gap-3 text-center items-center "
          >
            <h3 className="text-prim-blue text-center">
              Still curious about how CallSmart generates revenue?
            </h3>
            Check out our insightful guide that outlines the direct impact of
            missed calls on your clinic's bottom line. Discover how CallSmart
            turns this into a revenue-generating asset for your practice.
            <a
              className="w-fit px-4 py-2 bg-prim-blue hover:bg-prim-blue/50 active:bg-prim-blue/75 rounded-xl text-white transition-all duration-200"
              href="/revenue-strategy"
            >
              Learn About Our Revenue Strategy
            </a>
          </Card>
        </div>
      </div>
    </HomeNavBar>
  );
}

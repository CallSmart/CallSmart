export default function Home() {
  return (
    <div className="flex flex-col text-[#2e3541]">
      <div className="flex flex-col md:flex-row w-[100dvw] py-8 px-48 justify-center md:justify-between ">
        <a className="h-fit w-fit self-center font-bold text-2xl" href="/">
          CallSmart
        </a>
        <div className="flex gap-8 text-lg items-center">
          <a className="" href="">
            Pricing
          </a>
          <a className="" href="">
            FAQ
          </a>
          <a className="" href="">
            Contact
          </a>
          <a
            className="px-4 py-2 bg-dblue hover:bg-[#585A66] active:bg-[#454855] rounded-lg text-white"
            href="/signin"
          >
            Sign In
          </a>
          <a className="" href="/signup">
            Sign Up
          </a>
        </div>
      </div>
      <div className="flex flex-col pt-12 items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-center text-8xl w-2/3 font-bold text-[#0066CC]">
            All-In-One Solution for Missed Calls!
          </h1>
          <h3 className="text-center text-4xl font-semibold">
            Product One-Liner Here
          </h3>
        </div>
      </div>
    </div>
  );
}

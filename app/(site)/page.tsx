import HomeNavBar from "@/components/HomeNavBar";

export default function Home() {
  return (
    <div className="flex flex-col text-sec-blue">
      <HomeNavBar>
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-center w-2/3">
            All-In-One Solution for Missed Calls!
          </h1>
          <h3 className="text-center text-4xl font-semibold">
            Product One-Liner Here
          </h3>
        </div>
      </HomeNavBar>
    </div>
  );
}

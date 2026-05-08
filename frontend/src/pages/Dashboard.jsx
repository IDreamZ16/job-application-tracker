import { useQuery } from "@tanstack/react-query";
import { Mic, PartyPopper } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { getJobs } from "../services/jobsService";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import StatsStrip from "../components/dashboard/StatsStrip";
import PipelineSection from "../components/dashboard/PipelineSection";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  const interviewing = jobs.filter((j) => j.status === "interviewing");
  const offers = jobs.filter((j) => j.status === "offer");

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100">
          Welcome,{" "}
          <span className="text-amber-400">{user?.name?.split(" ")[0]}</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Your job applications at a glance.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stats summary */}
          <StatsStrip jobs={jobs} />

          {/* Active pipeline */}
          <div className="grid gap-4 lg:grid-cols-2">
            <PipelineSection
              icon={Mic}
              title="Interviewing"
              dotClass="bg-amber-400"
              jobs={interviewing}
              emptyMessage="No active interviews — apply to more jobs to fill your tracker."
            />
            <PipelineSection
              icon={PartyPopper}
              title="Offers"
              dotClass="bg-emerald-400"
              jobs={offers}
              emptyMessage="No offers yet — keep at it."
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

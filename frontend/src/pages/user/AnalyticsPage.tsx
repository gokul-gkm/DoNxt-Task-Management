import { useState, useEffect, type FC } from "react";
import { gsap } from "gsap";
import { taskService } from "../../services/api/task.api";
import { ChartLineIcon, TaskListIcon, CheckCircleIcon, WarningIcon, ClockIcon, SpinnerIcon } from "../../components/ui/icons";
import { StatCard } from "../../components/ui/StatCard";
import { TaskActivityChart, type ChartDataPoint } from "../../components/ui/TaskActivityChart";
import { TasksByStatusChart, type StatusBarData } from "../../components/ui/TasksByStatusChart";
import { ProjectPerformanceList, type ProjectStat } from "../../components/ui/ProjectPerformanceList";

interface AnalyticsOverview {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
}

const AnalyticsPage: FC = () => {
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [projectStats, setProjectStats] = useState<ProjectStat[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await taskService.getAnalytics(days);
        if (isMounted && res?.data) {
          setOverview(res.data.overview);
          const formattedData = res.data.chartData.map((d: any) => {
            const dateObj = new Date(d.date);
            return {
              ...d,
              displayDate: dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
            };
          });
          setChartData(formattedData);
          setProjectStats(res.data.projectStats || []);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, [days]);

  useEffect(() => {
    if (!loading && overview) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".stat-card", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
      });

      tl.fromTo(
        ".chart-container",
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.1, stagger: 0.1 },
        "-=0.4"
      );
    }
  }, [loading, overview]);

  const FilterButton: FC<{ value: number; label: string }> = ({ value, label }) => (
    <button
      onClick={() => setDays(value)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
        days === value
          ? "bg-indigo-600 text-white shadow-sm"
          : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {label}
    </button>
  );

  if (loading && !overview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <SpinnerIcon className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const statusBarData: StatusBarData[] = [
    { label: "Todo", value: overview?.todo || 0, color: "bg-gray-400" },
    { label: "In Progress", value: overview?.inProgress || 0, color: "bg-indigo-500" },
    { label: "Done", value: overview?.completed || 0, color: "bg-green-500" },
    { label: "Overdue", value: overview?.overdue || 0, color: "bg-red-400" },
  ];
  const maxBarValue = Math.max(...statusBarData.map((d) => d.value), 1);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8 pb-10">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ChartLineIcon className="text-indigo-600 w-7 h-7" />
            Productivity Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your task completion and overall progress.
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 border border-gray-100 bg-gray-50 rounded-xl overflow-x-auto self-start sm:self-auto shadow-inner">
          <FilterButton value={7} label="Last 7 Days" />
          <FilterButton value={30} label="Last 30 Days" />
          <FilterButton value={90} label="Last 90 Days" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Tasks"
          value={overview?.total || 0}
          icon={<TaskListIcon className="text-indigo-600 w-6 h-6" />}
          iconBg="bg-indigo-50 border border-indigo-100"
          textColor="text-gray-900"
          delay={0}
        />
        <StatCard
          title="Completed"
          value={overview?.completed || 0}
          icon={<CheckCircleIcon className="text-emerald-600 w-6 h-6" />}
          iconBg="bg-emerald-50 border border-emerald-100"
          textColor="text-emerald-600"
          delay={0.1}
        />
        <StatCard
          title="In Progress"
          value={(overview?.inProgress || 0) + (overview?.todo || 0)}
          icon={<ClockIcon className="text-amber-600 w-6 h-6" />}
          iconBg="bg-amber-50 border border-amber-100"
          textColor="text-amber-600"
          delay={0.2}
        />
        <StatCard
          title="Overdue"
          value={overview?.overdue || 0}
          icon={<WarningIcon className="text-red-600 w-6 h-6" />}
          iconBg="bg-red-50 border border-red-100"
          textColor="text-red-600"
          delay={0.3}
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskActivityChart chartData={chartData} days={days} loading={loading} />
        <TasksByStatusChart data={statusBarData} maxBarValue={maxBarValue} />
      </div>

      <ProjectPerformanceList projectStats={projectStats} />
    </div>
  );
};

export default AnalyticsPage;
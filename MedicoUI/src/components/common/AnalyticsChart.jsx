import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { cn } from "../../lib/utils";

const CHART_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899"];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
            {payload.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="font-bold text-gray-700">{entry.name}:</span>
                    <span className="font-black text-gray-900">{entry.value.toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
};

export default function AnalyticsChart({
    type = "area",
    data = [],
    dataKeys = [],
    title,
    subtitle,
    height = 320,
    className,
    showLegend = false,
    showGrid = true,
    colors = CHART_COLORS,
    stacked = false,
}) {
    const renderChart = () => {
        switch (type) {
            case "bar":
                return (
                    <BarChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />}
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }} />
                        <Tooltip content={<CustomTooltip />} />
                        {showLegend && <Legend />}
                        {dataKeys.map((key, i) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                fill={colors[i % colors.length]}
                                radius={[8, 8, 0, 0]}
                                stackId={stacked ? "stack" : undefined}
                                maxBarSize={40}
                            />
                        ))}
                    </BarChart>
                );

            case "line":
                return (
                    <LineChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />}
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }} />
                        <Tooltip content={<CustomTooltip />} />
                        {showLegend && <Legend />}
                        {dataKeys.map((key, i) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={colors[i % colors.length]}
                                strokeWidth={3}
                                dot={{ r: 4, fill: colors[i % colors.length], strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        ))}
                    </LineChart>
                );

            case "area":
                return (
                    <AreaChart data={data}>
                        <defs>
                            {dataKeys.map((key, i) => (
                                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />}
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }} />
                        <Tooltip content={<CustomTooltip />} />
                        {showLegend && <Legend />}
                        {dataKeys.map((key, i) => (
                            <Area
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={colors[i % colors.length]}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill={`url(#gradient-${key})`}
                                stackId={stacked ? "stack" : undefined}
                            />
                        ))}
                    </AreaChart>
                );

            case "pie":
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey={dataKeys[0] || "value"}
                            nameKey="name"
                        >
                            {data.map((_, i) => (
                                <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        {showLegend && <Legend />}
                    </PieChart>
                );

            default:
                return null;
        }
    };

    return (
        <div className={cn("bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm", className)}>
            {(title || subtitle) && (
                <div className="mb-6">
                    {title && <h3 className="text-lg font-black text-[#06402B] tracking-tight">{title}</h3>}
                    {subtitle && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{subtitle}</p>}
                </div>
            )}
            <div style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
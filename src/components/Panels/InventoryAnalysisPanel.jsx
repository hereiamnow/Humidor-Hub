/**
 *
 * @file InventoryAnalysisPanel.jsx
 * @path src/components/Panels/InventoryAnalysisPanel.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 3, 2025
 *
 * Inventory Analysis Panel Component
 *
 * Displays interactive charts and statistics for the user's cigar collection, including top brands, countries, and strength profiles. Supports toggling between bar and pie charts, and provides a visual overview of inventory distribution.
 *
 * @param {Object} props - Component props
 * @param {Array} props.cigars - Array of cigar objects
 * @param {boolean} props.isCollapsed - Whether the panel is collapsed
 * @param {Function} props.onToggle - Callback to toggle collapse state
 *
 */
import React, { useState, useMemo } from 'react';
import { BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from '../UI/ChartCard';
import CollapsiblePanel from '../UI/CollapsiblePanel';

const InventoryAnalysisPanel = ({ cigars }) => {
    const [chartViews, setChartViews] = useState({ brands: 'bar', countries: 'bar', strength: 'bar' });

    const {
        topBrandsData,
        topCountriesData,
        strengthDistributionData,
        totalBrandQuantity,
        totalCountryQuantity,
        totalStrengthQuantity,
    } = useMemo(() => {
        const processChartData = (data, groupBy) => {
            const groupedData = data.reduce((acc, cigar) => {
                const groupKey = cigar[groupBy] || 'Unknown';
                acc[groupKey] = (acc[groupKey] || 0) + cigar.quantity;
                return acc;
            }, {});

            return Object.keys(groupedData)
                .map(name => ({ name, quantity: groupedData[name] }))
                .sort((a, b) => b.quantity - a.quantity);
        };

        const topBrands = processChartData(cigars, 'brand').slice(0, 5);
        const topCountries = processChartData(cigars, 'country').slice(0, 5);
        const strengthDistribution = processChartData(cigars, 'strength');

        const totalBrandQty = topBrands.reduce((sum, item) => sum + item.quantity, 0);
        const totalCountryQty = topCountries.reduce((sum, item) => sum + item.quantity, 0);
        const totalStrengthQty = strengthDistribution.reduce((sum, item) => sum + item.quantity, 0);

        return {
            topBrandsData: topBrands,
            topCountriesData: topCountries,
            strengthDistributionData: strengthDistribution,
            totalBrandQuantity: totalBrandQty,
            totalCountryQuantity: totalCountryQty,
            totalStrengthQuantity: totalStrengthQty,
        };
    }, [cigars]);

    const handleChartViewToggle = (chartName) => {
        setChartViews(prev => ({
            ...prev,
            [chartName]: prev[chartName] === 'bar' ? 'pie' : 'bar'
        }));
    };

    const PIE_COLORS = ['#f59e0b', '#3b82f6', '#84cc16', '#ef4444', '#a855f7'];

    // Custom label renderer for Pie Charts
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, ...props }) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 15; // Position label outside the pie
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text {...props} x={x} y={y} fill="hsl(var(--bc) / var(--tw-text-opacity, 1))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Formatter for the legend to show percentages
    const legendFormatter = (value, entry, total) => {
        const { quantity } = entry.payload;
        const percent = total > 0 ? ((quantity / total) * 100).toFixed(0) : 0;
        return `${value} (${percent}%)`;
    };

    return (
        <CollapsiblePanel title="Inventory Analysis" icon={BarChart2}>
            <div className="mt-4">
                <ChartCard
                    title="Top 5 Brands"
                    action={
                        <button
                            onClick={() => handleChartViewToggle('brands')}
                            className="btn btn-ghost btn-circle btn-sm"
                        >
                            {chartViews.brands === 'bar' ? <PieChartIcon className="w-5 h-5" /> : <BarChart2 className="w-5 h-5" />}
                        </button>
                    }
                >
                    {chartViews.brands === 'bar' ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topBrandsData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'hsl(var(--bc))' }} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'hsl(var(--b3))' }} contentStyle={{ backgroundColor: 'hsl(var(--b1))', border: '1px solid hsl(var(--b3))' }} />
                                <Bar dataKey="quantity" fill="hsl(var(--p))" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={topBrandsData}
                                    dataKey="quantity"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    paddingAngle={3}
                                    innerRadius={60}
                                    outerRadius={80}
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                >
                                    {topBrandsData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--b1))', border: '1px solid hsl(var(--b3))' }} />
                                <Legend formatter={(value, entry) => legendFormatter(value, entry, totalBrandQuantity)} wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                <ChartCard
                    title="Top 5 Countries"
                    action={
                        <button
                            onClick={() => handleChartViewToggle('countries')}
                            className="btn btn-ghost btn-circle btn-sm"
                        >
                            {chartViews.countries === 'bar' ? <PieChartIcon className="w-5 h-5" /> : <BarChart2 className="w-5 h-5" />}
                        </button>
                    }
                >
                    {chartViews.countries === 'bar' ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topCountriesData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'hsl(var(--bc))' }} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'hsl(var(--b3))' }} contentStyle={{ backgroundColor: 'hsl(var(--b1))', border: '1px solid hsl(var(--b3))' }} />
                                <Bar dataKey="quantity" fill="hsl(var(--s))" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={topCountriesData}
                                    dataKey="quantity"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    paddingAngle={3}
                                    innerRadius={60}
                                    outerRadius={80}
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                >
                                    {topCountriesData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--b1))', border: '1px solid hsl(var(--b3))' }} />
                                <Legend formatter={(value, entry) => legendFormatter(value, entry, totalCountryQuantity)} wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                <ChartCard
                    title="Flavor Profile"
                    action={
                        <button
                            onClick={() => handleChartViewToggle('strength')}
                            className="btn btn-ghost btn-circle btn-sm"
                        >
                            {chartViews.strength === 'bar' ? <PieChartIcon className="w-5 h-5" /> : <BarChart2 className="w-5 h-5" />}
                        </button>
                    }
                >
                    {chartViews.strength === 'bar' ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={strengthDistributionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--bc))' }} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={60} />
                                <YAxis tick={{ fill: 'hsl(var(--bc))' }} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'hsl(var(--b3))' }} contentStyle={{ backgroundColor: 'hsl(var(--b1))', border: '1px solid hsl(var(--b3))' }} />
                                <Bar dataKey="quantity" fill="hsl(var(--a))" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={strengthDistributionData}
                                    dataKey="quantity"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    paddingAngle={2}
                                    innerRadius={60}
                                    outerRadius={80}
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                >
                                    {strengthDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--b1))', border: '1px solid hsl(var(--b3))' }} />
                                <Legend formatter={(value, entry) => legendFormatter(value, entry, totalStrengthQuantity)} wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>
            </div>
        </CollapsiblePanel>
    );
};

export default InventoryAnalysisPanel;
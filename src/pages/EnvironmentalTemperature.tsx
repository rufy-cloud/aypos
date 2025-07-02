// NOTE: This page requires the following dependencies:
// @mui/material @mui/icons-material @emotion/react @emotion/styled react-plotly.js plotly.js
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import Plot from 'react-plotly.js';
import type { PlotData, Layout, Config } from 'plotly.js';

// Extend the Window interface to include Google Charts
declare global {
  interface Window {
    google?: {
      charts?: any;
    };
  }
}

// Define the structure of our data
interface ChartData {
  power: string;
  flag: string;
  env_temp_cur: string;
  now_timestamp: string;
  future_timestamp: string;
  env_temp_min: string;
  power_future_min: string;
}

// Helper for dynamic status badge
function getStatus(flag: string) {
  if (!flag) return { text: 'Unknown', color: 'bg-gray-400' };
  const lower = flag.toLowerCase();
  if (lower.includes('fine') || lower.includes('ok') || lower.includes('optimal')) return { text: 'it is fine', color: 'bg-orange-500' };
  if (lower.includes('warning')) return { text: 'warning', color: 'bg-yellow-500' };
  if (lower.includes('critical') || lower.includes('fail')) return { text: 'critical', color: 'bg-red-600' };
  return { text: flag, color: 'bg-gray-400' };
}

const EnvironmentalTemperature = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [powerZoom, setPowerZoom] = useState<{xRange?: [number, number]; yRange?: [number, number]}>({});
  const [tempZoom, setTempZoom] = useState<{xRange?: [number, number]; yRange?: [number, number]}>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const updateIntervalMs = 5000;

  const fetchData = useCallback(async (showLoadingIndicator = false) => {
    try {
      if (showLoadingIndicator) setRefreshing(true);
      const response = await fetch('http://141.196.166.241:8003/prom/get_chart_data/temperature/20');
      const result = await response.json();
      if (result.data && result.data.length > 0) {
        const sortedData = [...result.data].sort((a, b) => new Date(b.now_timestamp).getTime() - new Date(a.now_timestamp).getTime());
        const validData = sortedData.filter((item: any) =>
          item.now_timestamp &&
          item.future_timestamp &&
          item.power &&
          item.power_future_min &&
          item.env_temp_cur &&
          item.env_temp_min
        );
        const last20Data = validData.slice(-20).sort((a, b) => new Date(a.now_timestamp).getTime() - new Date(b.now_timestamp).getTime());
        setData(last20Data);
      } else {
        setData([]);
      }
      setError(null);
    } catch (err: any) {
      setError('Error fetching data');
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
    intervalRef.current = setInterval(() => {
      fetchData(false);
    }, updateIntervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  // Prepare Plotly data and layouts
  const preparePlotlyData = () => {
    if (!data || data.length === 0) return { powerData: [], tempData: [], ranges: { power: { min: 0, max: 0 }, temp: { min: 0, max: 0 } } };
    const currentTimestamps = data.map(item => new Date(item.now_timestamp));
    const futureTimestamps = data.map(item => new Date(item.future_timestamp));
    const currentPower = data.map(item => parseFloat(item.power));
    const predictedPower = data.map(item => parseFloat(item.power_future_min));
    const currentTemp = data.map(item => parseFloat(item.env_temp_cur));
    const predictedTemp = data.map(item => parseFloat(item.env_temp_min));
    const powerMin = Math.min(...currentPower, ...predictedPower);
    const powerMax = Math.max(...currentPower, ...predictedPower);
    const tempMin = Math.min(...currentTemp, ...predictedTemp);
    const tempMax = Math.max(...currentTemp, ...predictedTemp);
    const powerData: Partial<PlotData>[] = [
      {
        x: currentTimestamps,
        y: currentPower,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Current Power',
        line: { color: '#22314d', width: 2 },
        marker: { size: 6 }
      },
      {
        x: futureTimestamps,
        y: predictedPower,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Predicted Power',
        line: { color: '#10B981', width: 2, dash: 'dash' },
        marker: { size: 6 }
      }
    ];
    const tempData: Partial<PlotData>[] = [
      {
        x: currentTimestamps,
        y: currentTemp,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Current Temperature',
        line: { color: '#22314d', width: 2 },
        marker: { size: 6 }
      },
      {
        x: futureTimestamps,
        y: predictedTemp,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Predicted Temperature',
        line: { color: '#10B981', width: 2, dash: 'dash' },
        marker: { size: 6 }
      }
    ];
    return { 
      powerData, 
      tempData,
      ranges: {
        power: { min: powerMin, max: powerMax },
        temp: { min: tempMin, max: tempMax }
      }
    };
  };
  const { powerData, tempData, ranges } = preparePlotlyData();

  // Common layout settings for both charts
  const commonLayoutSettings: Partial<Layout> = {
    showlegend: true,
    legend: {
      orientation: 'h',
      y: -0.2,
      x: 0.5,
      xanchor: 'center',
      yanchor: 'top',
      font: {
        size: 12,
        family: 'Montserrat, sans-serif',
        color: '#22314d'
      },
      bgcolor: 'rgba(255, 255, 255, 0)',
      bordercolor: 'rgba(255, 255, 255, 0)'
    },
    margin: { t: 60, b: 100, l: 60, r: 60 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'closest',
    xaxis: {
      type: 'date',
      gridcolor: '#ebe9f1',
      tickfont: { size: 12, color: '#22314d' },
      showgrid: true,
      rangeslider: { visible: true }
    }
  };

  const handlePowerZoom = (event: any) => {
    if (event['xaxis.range[0]']) {
      setPowerZoom({
        xRange: [new Date(event['xaxis.range[0]']).getTime(), new Date(event['xaxis.range[1]']).getTime()],
        yRange: [event['yaxis.range[0]'], event['yaxis.range[1]']]
      });
    }
  };

  const handleTempZoom = (event: any) => {
    if (event['xaxis.range[0]']) {
      setTempZoom({
        xRange: [new Date(event['xaxis.range[0]']).getTime(), new Date(event['xaxis.range[1]']).getTime()],
        yRange: [event['yaxis.range[0]'], event['yaxis.range[1]']]
      });
    }
  };

  const powerLayout: Partial<Layout> = {
    ...commonLayoutSettings,
    yaxis: {
      title: 'Power (W)',
      gridcolor: '#ebe9f1',
      tickfont: { size: 12, color: '#22314d' },
      titlefont: { size: 14, color: '#22314d' },
      showgrid: true,
      rangemode: 'tozero',
      fixedrange: false,
      range: powerZoom.yRange || (ranges ? [ranges.power.min * 0.9, ranges.power.max * 1.1] : undefined)
    },
    xaxis: {
      ...commonLayoutSettings.xaxis,
      range: powerZoom.xRange ? [new Date(powerZoom.xRange[0]), new Date(powerZoom.xRange[1])] : undefined
    }
  };

  const tempLayout: Partial<Layout> = {
    ...commonLayoutSettings,
    yaxis: {
      title: 'Temperature (°C)',
      gridcolor: '#ebe9f1',
      tickfont: { size: 12, color: '#22314d' },
      titlefont: { size: 14, color: '#22314d' },
      showgrid: true,
      rangemode: 'tozero',
      fixedrange: false,
      range: tempZoom.yRange || (ranges ? [ranges.temp.min * 0.9, ranges.temp.max * 1.1] : undefined)
    },
    xaxis: {
      ...commonLayoutSettings.xaxis,
      range: tempZoom.xRange ? [new Date(tempZoom.xRange[0]), new Date(tempZoom.xRange[1])] : undefined
    }
  };

  const plotConfig: Partial<Config> = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'] as ('lasso2d' | 'select2d')[],
    toImageButtonOptions: {
      format: 'png' as const,
      filename: 'temperature_monitoring',
      height: 1000,
      width: 1500,
      scale: 2
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 bg-[#f8f8f8] overflow-auto">
            {/* Header */}
            <div className="bg-white border-b border-[#ebe9f1] px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#22314d] font-montserrat text-center w-full">
                  Environmental Temperature & Power Monitoring (Last 20 Records)
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-8 top-6 text-[#22314d] hover:text-[#028a4a]"
                  aria-label="Refresh"
                  onClick={() => fetchData(true)}
                  disabled={refreshing}
                >
                  <RefreshCw className={refreshing ? "h-5 w-5 animate-spin" : "h-5 w-5"} />
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 max-w-6xl mx-auto">
              {/* Temperature Change Decision Card */}
              <div className="mb-6">
                <Card className="shadow-sm border-[#ebe9f1]">
                  <div className="flex items-center justify-between px-6 py-4">
                    <span className="text-lg font-semibold text-[#22314d] font-montserrat">
                      Temperature Change Decision
                    </span>
                    <div className="flex gap-3">
                      <Button className="bg-[#22314d] hover:bg-[#028a4a] text-white font-montserrat px-6">
                        <span className="mr-2">✔</span>Approve
                      </Button>
                      <Button className="bg-[#22314d] hover:bg-red-600 text-white font-montserrat px-6">
                        <span className="mr-2">✖</span>Decline
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Two Cards Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Power Consumption Card with Plotly and dynamic badge */}
                <Card className="shadow-sm border-[#ebe9f1] min-h-[220px] flex flex-col justify-between">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-[#22314d] font-montserrat">
                      Power Consumption
                    </CardTitle>
                    {data.length > 0 && (
                      (() => {
                        const { text, color } = getStatus(data[data.length - 1].flag);
                        return (
                          <span className={`text-white font-semibold rounded-full px-4 py-1 text-sm ${color}`}>{text}</span>
                        );
                      })()
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col items-center justify-center">
                    {loading ? (
                      <span className="text-[#5e6e7b] text-base font-montserrat text-center">Loading...</span>
                    ) : error ? (
                      <span className="text-red-600 text-base font-montserrat text-center">{error}</span>
                    ) : data.length > 0 ? (
                      <div className="w-full h-[350px]">
                        <Plot
                          data={powerData}
                          layout={powerLayout}
                          config={plotConfig}
                          style={{ width: '100%', height: '100%' }}
                          onRelayout={handlePowerZoom}
                        />
                      </div>
                    ) : (
                      <span className="text-[#5e6e7b] text-base font-montserrat text-center">No power data available</span>
                    )}
                  </CardContent>
                </Card>
                {/* Environmental Temperature Card with Plotly and dynamic badge */}
                <Card className="shadow-sm border-[#ebe9f1] min-h-[220px] flex flex-col justify-between">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-[#22314d] font-montserrat">
                      Environmental Temperature
                    </CardTitle>
                    {data.length > 0 && (
                      (() => {
                        const { text, color } = getStatus(data[data.length - 1].flag);
                        return (
                          <span className={`text-white font-semibold rounded-full px-4 py-1 text-sm ${color}`}>{text}</span>
                        );
                      })()
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col items-center justify-center">
                    {loading ? (
                      <span className="text-[#5e6e7b] text-base font-montserrat text-center">Loading...</span>
                    ) : error ? (
                      <span className="text-red-600 text-base font-montserrat text-center">{error}</span>
                    ) : data.length > 0 ? (
                      <div className="w-full h-[350px]">
                        <Plot
                          data={tempData}
                          layout={tempLayout}
                          config={plotConfig}
                          style={{ width: '100%', height: '100%' }}
                          onRelayout={handleTempZoom}
                        />
                      </div>
                    ) : (
                      <span className="text-[#5e6e7b] text-base font-montserrat text-center">No temperature data available</span>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default EnvironmentalTemperature;

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Power, Server, Monitor, ChevronDown, Info } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { fetchMigrationAdvice, fetchGainBefore, fetchGainAfter, approveMigration, declineMigration } from '../lib/utils';
import Plot from 'react-plotly.js';

const gainBeforeLabels: Record<string, { label: string, tooltip: string }> = {
  prop_gain: { label: 'Proposed Gain', tooltip: 'Expected gain before migration' },
  prop_power: { label: 'Proposed Power', tooltip: 'Proposed power usage before migration (W)' },
  cur_power: { label: 'Current Power', tooltip: 'Current power usage before migration (W)' },
};
const gainAfterLabels: Record<string, { label: string, tooltip: string }> = {
  past_power: { label: 'Past Power', tooltip: 'Power usage before migration (W)' },
  cur_power: { label: 'Current Power', tooltip: 'Current power usage after migration (W)' },
  prop_power: { label: 'Proposed Power', tooltip: 'Proposed power usage after migration (W)' },
  prop_ratio: { label: 'Proposed Ratio', tooltip: 'Proposed power ratio after migration' },
  actual_ratio: { label: 'Actual Ratio', tooltip: 'Actual power ratio after migration' },
  val_ratio: { label: 'Validation Ratio', tooltip: 'Validation ratio after migration' },
  val_difference: { label: 'Validation Difference', tooltip: 'Difference in validation ratio after migration' },
};

const MigrationAdvice = () => {
  const [migration, setMigration] = useState<any>(null);
  const [gainBefore, setGainBefore] = useState<any>(null);
  const [gainAfter, setGainAfter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetchMigrationAdvice(),
      fetchGainBefore(),
      fetchGainAfter()
    ])
      .then(([migration, gainBefore, gainAfter]) => {
        setMigration(migration);
        setGainBefore(gainBefore);
        setGainAfter(gainAfter);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Chart data for gain values
  const gainBeforeChart = gainBefore ? [{
    x: Object.keys(gainBefore),
    y: Object.values(gainBefore),
    type: 'bar',
    marker: { color: '#10B981' },
  }] : [];
  const gainAfterChart = gainAfter ? [{
    x: Object.keys(gainAfter),
    y: Object.values(gainAfter),
    type: 'bar',
    marker: { color: '#3B82F6' },
  }] : [];

  const handleApprove = async () => {
    try {
      setActionMsg('Approving migration...');
      await approveMigration();
      setActionMsg('Migration approved!');
      fetchAll();
    } catch (err: any) {
      setActionMsg('Failed to approve migration.');
    } finally {
      setTimeout(() => setActionMsg(null), 2000);
    }
  };
  const handleDecline = async () => {
    try {
      setActionMsg('Declining migration...');
      await declineMigration();
      setActionMsg('Migration declined!');
      fetchAll();
    } catch (err: any) {
      setActionMsg('Failed to decline migration.');
    } finally {
      setTimeout(() => setActionMsg(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 bg-[#f8f8f8] overflow-auto p-6">
            {/* Top Summary Card */}
            <div className="max-w-6xl mx-auto">
              <Card className="mb-6 rounded-xl shadow-md px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Server className="h-7 w-7 text-[#22314d]" />
                  <div>
                    <div className="text-xs text-[#6e6b7b] font-montserrat">Compute Nodes</div>
                    <div className="text-xl font-bold text-[#22314d]">0/0</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Monitor className="h-7 w-7 text-[#22314d]" />
                  <div>
                    <div className="text-xs text-[#6e6b7b] font-montserrat">Virtual Machines</div>
                    <div className="text-xl font-bold text-[#22314d]">
                      <span className="text-[#028a4a]">{migration ? Object.keys(migration).length : 0} active</span> / {migration ? Object.keys(migration).length : 0} total
                    </div>
                  </div>
                </div>
              </Card>

              {/* Main Content Area */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Gain Before Migration */}
                <Card className="rounded-xl shadow-md px-6 py-4 col-span-1 md:col-span-2 relative min-h-[260px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-[#22314d] font-montserrat">
                      Gain Before Migration
                    </span>
                    <Button variant="ghost" size="icon" className="text-[#22314d] hover:text-[#028a4a]" aria-label="Refresh" onClick={fetchAll}>
                      <RefreshCw className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1">
                      {loading ? (
                        <span className="text-[#5e6e7b] text-base font-montserrat text-center">Loading...</span>
                      ) : error ? (
                        <span className="text-red-600 text-base font-montserrat text-center">{error}</span>
                      ) : gainBefore ? (
                        <div className="space-y-2">
                          {Object.entries(gainBeforeLabels).map(([key, { label, tooltip }]) => (
                            <div key={key} className="flex items-center gap-2 text-[#22314d] text-sm font-montserrat">
                              <span>{label}:</span>
                              <span className="font-semibold">{gainBefore[key] !== undefined ? Number(gainBefore[key]).toFixed(2) : '--'}</span>
                              <span className="relative group cursor-pointer">
                                <Info className="h-4 w-4 text-[#6e6b7b]" />
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#22314d] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">{tooltip}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[#5e6e7b] text-base font-montserrat text-center">No data</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-[180px]">
                      {gainBefore && (
                        <Plot
                          data={gainBeforeChart}
                          layout={{
                            autosize: true,
                            height: 120,
                            margin: { t: 20, b: 30, l: 30, r: 10 },
                            xaxis: { title: '', tickfont: { size: 10 } },
                            yaxis: { title: '', tickfont: { size: 10 } },
                            showlegend: false,
                            plot_bgcolor: 'rgba(0,0,0,0)',
                            paper_bgcolor: 'rgba(0,0,0,0)',
                          }}
                          config={{ displayModeBar: false }}
                          style={{ width: '100%', height: '120px' }}
                        />
                      )}
                    </div>
                  </div>
                </Card>
                {/* Migration Advice */}
                <Card className="rounded-xl shadow-md px-6 py-4 flex flex-col justify-between min-h-[260px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-[#22314d] font-montserrat flex items-center">
                      Migration Advice
                      <span className="ml-2 bg-[#28c76f]/20 text-[#28c76f] text-xs font-semibold px-3 py-1 rounded-full">Auto Mode</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <ChevronDown className="h-5 w-5 text-[#22314d] cursor-pointer" />
                      <Button variant="ghost" size="icon" className="text-[#22314d] hover:text-[#028a4a]" aria-label="Refresh" onClick={fetchAll}>
                        <RefreshCw className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center w-full">
                    {loading ? (
                      <span className="text-[#5e6e7b] text-base font-montserrat text-center">Loading...</span>
                    ) : error ? (
                      <span className="text-red-600 text-base font-montserrat text-center">{error}</span>
                    ) : migration ? (
                      <table className="min-w-full text-sm text-[#22314d] font-montserrat">
                        <thead>
                          <tr>
                            <th className="px-2 py-1">VM Name</th>
                            <th className="px-2 py-1">Current PM</th>
                            <th className="px-2 py-1">Proposed PM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(migration).map(([vm, info]: any) => (
                            <tr key={vm}>
                              <td className="px-2 py-1">{vm}</td>
                              <td className="px-2 py-1">{info.current_pm}</td>
                              <td className="px-2 py-1">{info.proposed_pm}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <span className="text-[#5e6e7b] text-base font-montserrat text-center">No migration advice available at this time</span>
                    )}
                  </div>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                <Button className="bg-[#22314d] hover:bg-[#1a2533] text-white font-montserrat px-8 py-3 text-lg rounded-lg" onClick={handleDecline}>
                  Decline Migration
                </Button>
                <Button className="bg-[#28c76f] hover:bg-[#028a4a] text-white font-montserrat px-8 py-3 text-lg rounded-lg flex items-center gap-2" onClick={handleApprove}>
                  <Power className="h-5 w-5" /> Approve Migration
                </Button>
                {actionMsg && <span className="text-green-600 font-semibold ml-4">{actionMsg}</span>}
              </div>

              {/* Gain After Migration */}
              <Card className="rounded-xl shadow-md px-6 py-6 mb-8">
                <h2 className="text-xl font-bold text-[#22314d] font-montserrat mb-2">Gain After Migration</h2>
                <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex-1">
                    {loading ? (
                      <span className="text-[#5e6e7b] text-base font-montserrat text-center">Loading...</span>
                    ) : error ? (
                      <span className="text-red-600 text-base font-montserrat text-center">{error}</span>
                    ) : gainAfter ? (
                      <div className="space-y-2">
                        {Object.entries(gainAfterLabels).map(([key, { label, tooltip }]) => (
                          <div key={key} className="flex items-center gap-2 text-[#22314d] text-sm font-montserrat">
                            <span>{label}:</span>
                            <span className="font-semibold">{gainAfter[key] !== undefined ? Number(gainAfter[key]).toFixed(2) : '--'}</span>
                            <span className="relative group cursor-pointer">
                              <Info className="h-4 w-4 text-[#6e6b7b]" />
                              <span className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#22314d] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">{tooltip}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#5e6e7b] text-base font-montserrat text-center">No data</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    {gainAfter && (
                      <Plot
                        data={gainAfterChart}
                        layout={{
                          autosize: true,
                          height: 120,
                          margin: { t: 20, b: 30, l: 30, r: 10 },
                          xaxis: { title: '', tickfont: { size: 10 } },
                          yaxis: { title: '', tickfont: { size: 10 } },
                          showlegend: false,
                          plot_bgcolor: 'rgba(0,0,0,0)',
                          paper_bgcolor: 'rgba(0,0,0,0)',
                        }}
                        config={{ displayModeBar: false }}
                        style={{ width: '100%', height: '120px' }}
                      />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MigrationAdvice;

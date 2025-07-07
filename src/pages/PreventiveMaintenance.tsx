
import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Fade, useTheme, Button, Tooltip, IconButton, CircularProgress } from '@mui/material';
import Plot from 'react-plotly.js';
import { Layout, PlotData } from 'plotly.js';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import PanToolIcon from '@mui/icons-material/PanTool';
import RefreshIcon from '@mui/icons-material/Refresh';
import TimelineIcon from '@mui/icons-material/Timeline';
import DownloadIcon from '@mui/icons-material/Download';
import CropFreeIcon from '@mui/icons-material/CropFree';
import GestureIcon from '@mui/icons-material/Gesture';


declare const Plotly: any;

interface DataItem {
  now_timestamp: string;
  future_timestamp: string;
  power: string;
  power_future_15min: string;
  positive_3p: string;
  negative_3p: string;
  positive_7p: string;
  negative_7p: string;
  flag: string;
}

const Maintenance = () => {
  const theme = useTheme();
  const [chartData, setChartData] = useState<Partial<PlotData>[]>([]);
  const [currentFlag, setCurrentFlag] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Handle chart actions for external buttons
  const handleChartAction = (action: string) => {
    const plotlyDiv = document.querySelector('.js-plotly-plot') as any;
    if (!plotlyDiv) return;
    
    switch (action) {
      case 'Zoom In':
     try {
          const xRange = plotlyDiv.layout.xaxis.range;
          const yRange = plotlyDiv.layout.yaxis.range;
          
          // Check if ranges exist and are valid
          if (xRange && yRange && 
              !isNaN(xRange[0]) && !isNaN(xRange[1]) && 
              !isNaN(yRange[0]) && !isNaN(yRange[1])) {
            
            const xCenter = (xRange[0] + xRange[1]) / 2;
            const yCenter = (yRange[0] + yRange[1]) / 2;
            const xWidth = (xRange[1] - xRange[0]) * 0.5;
            const yWidth = (yRange[1] - yRange[0]) * 0.5;
            
            Plotly.relayout(plotlyDiv, {
              'xaxis.range': [xCenter - xWidth/2, xCenter + xWidth/2],
              'yaxis.range': [yCenter - yWidth/2, yCenter + yWidth/2]
            });
          } else {
            // Fallback: use Plotly's built-in zoom
            Plotly.relayout(plotlyDiv, {
              'xaxis.range': null,
              'yaxis.range': null
            });
          }
        } catch (error) {
          console.error('Zoom In error:', error);
        }
        break;
      case 'Zoom Out':
    try {
          const xRange = plotlyDiv.layout.xaxis.range;
          const yRange = plotlyDiv.layout.yaxis.range;
          
          // Check if ranges exist and are valid
          if (xRange && yRange && 
              !isNaN(xRange[0]) && !isNaN(xRange[1]) && 
              !isNaN(yRange[0]) && !isNaN(yRange[1])) {
            
            const xCenter = (xRange[0] + xRange[1]) / 2;
            const yCenter = (yRange[0] + yRange[1]) / 2;
            const xWidth = (xRange[1] - xRange[0]) * 2.0;
            const yWidth = (yRange[1] - yRange[0]) * 2.0;
            
            Plotly.relayout(plotlyDiv, {
              'xaxis.range': [xCenter - xWidth/2, xCenter + xWidth/2],
              'yaxis.range': [yCenter - yWidth/2, yCenter + yWidth/2]
            });
          } else {
            // Fallback: use autorange
            Plotly.relayout(plotlyDiv, {
              'xaxis.autorange': true,
              'yaxis.autorange': true
            });
          }
        } catch (error) {
          console.error('Zoom Out error:', error);
        }
        break;
      case 'Pan':
        Plotly.relayout(plotlyDiv, { dragmode: 'pan' });
        break;
      case 'Reset Axes':
        Plotly.relayout(plotlyDiv, { 
          'xaxis.autorange': true, 
          'yaxis.autorange': true,
          'xaxis.range': null,
          'yaxis.range': null,
          dragmode: 'zoom',
          'xaxis.fixedrange': false,
          'yaxis.fixedrange': false
        });
        break;
        break;
      case 'Auto Scale':
        Plotly.relayout(plotlyDiv, { autosize: true });
        break;
      case 'Box Select':
        Plotly.relayout(plotlyDiv, { dragmode: 'select' });
        break;
      case 'Lasso Select':
        Plotly.relayout(plotlyDiv, { dragmode: 'lasso' });
        break;
      case 'Download Plot':
        Plotly.downloadImage(plotlyDiv, {
          format: 'png',
          filename: 'preventive_maintenance_chart',
          height: 1200,
          width: 1800,
          scale: 3,
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://141.196.68.167:8003/prom/get_chart_data/maintenance/20');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();

        if (result.data && Array.isArray(result.data) && result.data.length > 0) {
          const last20Data = result.data.slice(-20);
          setCurrentFlag(last20Data[last20Data.length - 1].flag);

          const traces: Partial<PlotData>[] = [
            {
              x: last20Data.map((item: DataItem) => item.now_timestamp),
              y: last20Data.map((item: DataItem) => {
                const value = parseFloat(item.power);
                return isNaN(value) ? -5 : value - 40; // Lower the line by 5 units
              }),
              type: 'scatter' as const,
              mode: 'lines+markers' as const,
              name: 'Current Power',
              line: { color: '#028a4a', width: 3 },
              marker: { 
                size: 8, 
                symbol: 'circle', 
                color: '#5e5873' // Changed to black
              },
              hovertemplate: '<b>Current Power</b><br>' +
                           '<b>Power:</b> %{y:.2f} W<br>' +
                           '<b>Time:</b> %{x}<br>' +
                           '<extra></extra>',
              hoverlabel: {
                bgcolor: '#000000', // black
                bordercolor: '#ffffff',
                font: { color: 'white', size: 14, family: 'Arial Black' }
              }
            },
            {
              x: last20Data.flatMap((item: DataItem) => [item.now_timestamp, item.now_timestamp, null]),
              y: last20Data.flatMap((item: DataItem) => {
                const value = parseFloat(item.power);
                return isNaN(value) ? [null, null, null] : [0, value - 5, null]; // Lower the line by 5 units
              }),
              type: 'scatter' as const,
              mode: 'lines' as const,
              name: 'Vertical Lines',
              line: {
                color: '#000000', // Changed to black
                width: 1,
              },
              opacity: 0.4,
              hoverinfo: 'none' as const,
              showlegend: false,
            },
            {
              x: last20Data.map((item: DataItem) => item.future_timestamp),
              y: last20Data.map((item: DataItem) => {
                const value = parseFloat(item.power_future_15min);
                return isNaN(value) ? 0 : value;
              }),
              type: 'scatter' as const,
              mode: 'lines+markers' as const,
              name: 'Predicted Power',
              line: { color: '#C0C0C0', width: 3 }, // Silver
              marker: { 
                size: 8, 
                symbol: 'circle',
                color: '#C0C0C0' // Silver
              },
              hovertemplate: '<b>Predicted Power (15min)</b><br>' +
                           '<b>Power:</b> %{y:.2f} W<br>' +
                           '<b>Time:</b> %{x}<br>' +
                           '<extra></extra>',
              hoverlabel: {
                bgcolor: '#C0C0C0', // silver
                bordercolor: '#ffffff',
                font: { color: '#000000', size: 14, family: 'Arial Black' }
              }
            },
            {
              x: last20Data.map((item: DataItem) => item.future_timestamp),
              y: last20Data.map((item: DataItem) => {
                const value = parseFloat(item.positive_3p);
                return isNaN(value) ? 0 : value;
              }),
              type: 'scatter' as const,
              mode: 'lines' as const,
              name: 'Positive 3%',
              line: { 
                color: '#990000', // Dark red
                width: 2,
                dash: 'dash'
              },
              opacity: 0.9,
              showlegend: true,
              hovertemplate: '<b>Positive 3%</b><br>' +
                           '<b>Power:</b> %{y:.2f} W<br>' +
                           '<b>Time:</b> %{x}<br>' +
                           '<extra></extra>',
              hoverlabel: {
                bgcolor: '#990000', // Dark red
                bordercolor: '#ffffff',
                font: { color: 'white', size: 14, family: 'IBM Plex Mono' }
              }
            },
            {
              x: last20Data.map((item: DataItem) => item.future_timestamp),
              y: last20Data.map((item: DataItem) => {
                const value = parseFloat(item.negative_3p);
                return isNaN(value) ? 0 : value;
              }),
              type: 'scatter' as const,
              mode: 'lines' as const,
              name: 'Negative 3%',
              line: { 
                color: '#990000', // Dark red
                width: 2,
                dash: 'dash'
              },
              opacity: 0.9,
              showlegend: true,
              hovertemplate: '<b>Negative 3%</b><br>' +
                           '<b>Power:</b> %{y:.2f} W<br>' +
                           '<b>Time:</b> %{x}<br>' +
                           '<extra></extra>',
              hoverlabel: {
                bgcolor: '#990000', // Dark red
                bordercolor: '#ffffff',
                font: { color: 'white', size: 14, family: 'IBM Plex Mono' }
              }
            },
            {
              x: last20Data.map((item: DataItem) => item.future_timestamp),
              y: last20Data.map((item: DataItem) => {
                const value = parseFloat(item.positive_7p);
                return isNaN(value) ? 0 : value;
              }),
              type: 'scatter' as const,
              mode: 'lines' as const,
              name: 'Positive 7%',
              line: { 
                color: '#003366', // Dark blue
                width: 2,
                dash: 'dash'
              },
              opacity: 0.9,
              showlegend: true,
              hovertemplate: '<b>Positive 7%</b><br>' +
                           '<b>Power:</b> %{y:.2f} W<br>' +
                           '<b>Time:</b> %{x}<br>' +
                           '<extra></extra>',
              hoverlabel: {
                bgcolor: '#003366', // Dark blue
                bordercolor: '#ffffff',
                font: { color: 'white', size: 14, family: 'IBM Plex Mono' }
              }
            },
            {
              x: last20Data.map((item: DataItem) => item.future_timestamp),
              y: last20Data.map((item: DataItem) => {
                const value = parseFloat(item.negative_7p);
                return isNaN(value) ? 0 : value;
              }),
              type: 'scatter' as const,
              mode: 'lines' as const,
              name: 'Negative 7%',
              line: { 
                color: '#003366', // Dark blue
                width: 2,
                dash: 'dash'
              },
              opacity: 0.9,
              showlegend: true,
              hovertemplate: '<b>Negative 7%</b><br>' +
                           '<b>Power:</b> %{y:.2f} W<br>' +
                           '<b>Time:</b> %{x}<br>' +
                           '<extra></extra>',
              hoverlabel: {
                bgcolor: '#003366', // Dark blue
                bordercolor: '#ffffff',
                font: { color: 'white', size: 14, family: 'IBM Plex Mono' }
              }
            },
          ];
          setChartData(traces);
        } else {
          setError('No data available');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load chart data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const layout: Partial<Layout> = {
    yaxis: {
      title: {
        text: 'Power (W)',
        font: { size: 14, color: '#6e6b7b', family: 'Montserrat' },
      },
      gridcolor: '#eee',
      tickfont: { size: 12, color: '#666', family: 'IBM Plex Mono' },
      showgrid: true,
      gridwidth: 1,
      rangemode: 'tozero' as const,
      fixedrange: false,
      // Modified range to add bottom padding and prevent overlap
      range: chartData.length > 0
        ? [-15, Math.max(...chartData.flatMap(trace => (trace.y as number[]) || []).filter(num => !isNaN(num))) * 1.1 || 100]
        : [-15, 100],
    },
    showlegend: true,
    legend: {
      orientation: 'h',
      y: -0.2,
      x: 0.5,
      xanchor: 'center',
      yanchor: 'top',
      font: {
        size: 12,
        family: 'Montserrat',
        color: theme.palette.text.secondary,
      },
      bgcolor: 'rgba(255, 255, 255, 0)',
      bordercolor: 'rgba(255, 255, 255, 0)',
    },
    margin: { t: 20, b: 80, l: 80, r: 80}, 
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    hoverlabel: {
      bgcolor: 'rgba(0,0,0,0.9)',
      bordercolor: '#4CAF50',
      font: {
        color: 'white',
        size: 12,
        family: 'IBM Plex Mono',
      },
      align: 'left',
    },
    hovermode: 'closest',
    height: 580, // Chart height increased
  };

  const chartTools = [
    { icon: <ZoomInIcon />, name: 'Zoom In' },
    { icon: <ZoomOutIcon />, name: 'Zoom Out' },
    { icon: <PanToolIcon />, name: 'Pan' },
    { icon: <RefreshIcon />, name: 'Reset Axes' },
    { icon: <TimelineIcon />, name: 'Auto Scale' },
    { icon: <CropFreeIcon />, name: 'Box Select' },
    { icon: <GestureIcon />, name: 'Lasso Select' },
    { icon: <DownloadIcon />, name: 'Download Plot' },
  ];

  return (
    <SidebarProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        <AppSidebar />

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            px: 2, // Reduced padding from 4 to 2
            py: 4,
            gap: 2, // Reduced gap from 4 to 2
            backgroundColor: '#f8f8f8',
            minHeight: '100vh',
          }}
        >
          {/* Combined Title + Icon Row */}
          <Paper
            elevation={1}
            sx={{
              width: '95%',
              maxWidth: 12000,
              p: 1 , // Increased padding to show more background
              borderRadius: 6,
              backgroundColor: 'white',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography
  variant="h4"
  component="h1"
  sx={{
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    fontWeight: 700,
    color: '#5e5873', // Headings color
    fontSize: '1.5rem', // h3 size
    textAlign: 'center',
  }}
>
Preventive Maintenance
</Typography>

            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1, 
                justifyContent: 'center',
                flexWrap: 'wrap',
                mt: 1
              }}
            >
              {chartTools.map((tool, index) => (
                <Tooltip 
                  key={index}
                  title={tool.name}
                  arrow
                  PopperProps={{
                    sx: {
                      '& .MuiTooltip-tooltip': {
                       bgcolor: '#028a4a',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 500,
                        borderRadius: '6px',
                        padding: '6px 10px',
                        boxShadow: '0 3px 10px rgba(0,90,44,0.25)',
                      },
                      '& .MuiTooltip-arrow': {
                        color: '#028a4a',
                      },
                    },
                  }}
                >
                  <IconButton 
                    onClick={() => handleChartAction(tool.name)}
                    size="small"
                    sx={{
                      border: 'none',
                      bgcolor: 'transparent',
                      color: '#028a4a', // Changed to black by default
                      p: 1,
                      borderRadius: 1.5,
                      '&:hover': {
                        bgcolor: 'rgba(0, 90, 44, 0.06)',
                        color: '#028a4a', // Green on hover
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {tool.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Paper>

          {/* Chart Section */}
          <Paper
            elevation={1}
            sx={{
              width: '10000%',
              maxWidth: 1200,
              p: 5, // Increased padding to show more background
              borderRadius: 3,
              backgroundColor: 'white',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              height: 600,
              minWidth: '95%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <CircularProgress sx={{ color: '#005A2C' }} />
              </Box>
            ) : error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <Typography 
                  color="error"
                  sx={{ 
                    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500 
                  }}
                >
                  {error}
                </Typography>
              </Box>
            ) : (
              <Fade in timeout={600}>
                <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
                  <Plot
                    data={chartData}
                    layout={layout}
                    config={{
                      responsive: true,
                      displayModeBar: false,
                      displaylogo: false,
                      toImageButtonOptions: {
                        format: 'png',
                        filename: 'preventive_maintenance_chart',
                        height: 1200,
                        width: 1800,
                        scale: 3,
                      },
                    }}
                    style={{ 
                      width: '100%', 
                      height: '100%'
                    }}
                    useResizeHandler={true}
                  />
                </Box>
              </Fade>
            )}
          </Paper>

          {/* Problem Button at Bottom */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#FF8C00',
                color: 'white',
                px: 3,
                py: 1.25,
                borderRadius: 2,
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(255,140,0,0.25)',
                '&:hover': {
                  bgcolor: '#FF7A00',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(255,140,0,0.35)',
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Problem in the Device
            </Button>
          </Box>
        </Box>
      </Box>
    </SidebarProvider>
  );
};

export default Maintenance;

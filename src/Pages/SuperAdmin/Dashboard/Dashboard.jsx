/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { Building2, Database, Search } from 'lucide-react';
import { PieController } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import config from '../../../utils/config';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title,
    PieController, // Register the PieController
    ChartDataLabels // Register the datalabels plugin
  );

function Dashboard() {
  const [heiData, setHeiData] = useState([]);
  const [totalHeis, setTotalHeis] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchHeiData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Adjust if you store token differently
        const response = await fetch(`${config.API_URL}/heis`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch HEI data');
        }
        const data = await response.json();
        setHeiData(data);
        setTotalHeis(data.length);
        setLoading(false);
      } catch {
        setError('Failed to fetch HEI data');
        setLoading(false);
      }
    };

    fetchHeiData();
  }, []);

  // Process data for chart
  const processChartData = () => {
    const typeCounts = heiData.reduce((acc, hei) => {
      acc[hei.type] = (acc[hei.type] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(typeCounts),
      data: Object.values(typeCounts),
      percentages: Object.values(typeCounts).map(count => ((count / totalHeis) * 100).toFixed(1))
    };
  };

  // Create/Update Chart
  useEffect(() => {
    if (!loading && heiData.length > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const chartData = processChartData();

      // Colors for each HEI type
      const colors = {
        'SUC': '#3B82F6',
        'LUC': '#10B981',
        'Private': '#F59E0B'
      };

      const backgroundColors = chartData.labels.map(label => colors[label]);
      const borderColors = chartData.labels.map(label => colors[label]);

      chartInstanceRef.current = new ChartJS(ctx, {
        type: 'pie',
        data: {
          labels: chartData.labels,
          datasets: [{
            data: chartData.data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 2,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed;
                  const percentage = chartData.percentages[context.dataIndex];
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            },
            datalabels: {
              color: '#fff',
              font: {
                weight: 'bold',
                size: 16
              },
              formatter: function(value) {
                return value;
              },
              display: true
            }
          },
          animation: {
            animateRotate: true,
            animateScale: true
          }
        },
        plugins: [ChartDataLabels]
      });
    }

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [heiData, loading, totalHeis]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HEI data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Database className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const chartData = processChartData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              HEI Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Higher Education Institutions Overview
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total HEIs</p>
                <p className="text-2xl font-bold text-gray-900">{totalHeis}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">SUC</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">State Universities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {heiData.filter(hei => hei.type === 'SUC').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">LUC</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Local Universities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {heiData.filter(hei => hei.type === 'LUC').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-sm">PVT</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Private Universities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {heiData.filter(hei => hei.type === 'Private').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              HEI Distribution by Type
            </h2>
            <div className="h-80 flex items-center justify-center">
              <div className="w-full h-full relative">
                <canvas ref={chartRef} className="w-full h-full"></canvas>
              </div>
            </div>
          </div>

          {/* Statistics Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Detailed Statistics
            </h2>
            <div className="overflow-x-auto w-full">
              <div className="space-y-4 min-w-[340px]">
                {chartData.labels.map((type, index) => (
                  <div key={type + '-' + index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg min-w-[320px]">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{
                          backgroundColor: type === 'SUC' ? '#3B82F6' :
                                          type === 'LUC' ? '#10B981' : '#F59E0B'
                        }}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {type === 'SUC' ? 'State Universities & Colleges' :
                           type === 'LUC' ? 'Local Universities & Colleges' :
                           'Private Institutions'}
                        </p>
                        <p className="text-sm text-gray-500">{type}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-bold text-gray-900">{chartData.data[index]}</p>
                      <p className="text-sm text-gray-500">{chartData.percentages[index]}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* HEI List */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            HEI Institutions
          </h2>
          <div className="overflow-x-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-[340px]">
              {heiData.map((hei) => (
                <div key={hei.uiid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg min-w-[320px]">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{hei.name}</h3>
                    <p className="text-xs text-gray-500">uiid: {hei.uiid}</p>
                  </div>
                  <div className="ml-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      hei.type === 'SUC' ? 'bg-blue-100 text-blue-800' :
                      hei.type === 'LUC' ? 'bg-green-100 text-green-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {hei.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-900">
                API Integration Ready
              </h3>
              <p className="mt-2 text-blue-700">
                This dashboard is ready to connect to your Laravel HEI API. Replace the mock data
                with actual API calls to <code className="bg-blue-100 px-2 py-1 rounded">/api/heis</code>
                to display real-time data from your database.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

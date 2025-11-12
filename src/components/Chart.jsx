import Chart from 'react-apexcharts'

export default function ApexChart({ options = {}, series = [], type = 'area', height = 350 }) {
  const defaultOptions = {
    chart: {
      height: height,
      type: type,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      categories: options?.xaxis?.categories || [],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    ...options,
  }

  return (
    <Chart
      options={defaultOptions}
      series={series}
      type={type}
      height={height}
    />
  )
}


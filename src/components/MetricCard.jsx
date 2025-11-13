export default function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex justify-between items-center transition-all text-gray-800 hover:bg-primary hover:text-white hover:scale-105 hover:shadow-md">
      <div>
        <div className="text-3xl font-semibold">{value}</div>
        <div className="text-base opacity-90">{title}</div>
      </div>
      <div className="text-5xl ">
        <ion-icon name={icon}></ion-icon>
      </div>
    </div>
  )
}


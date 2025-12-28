import { useAppSelector } from '../store/hooks';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function Dashboard() {
  const { items: products } = useAppSelector(state => state.products);
  const { items: orders } = useAppSelector(state => state.orders);

  // Summary Metrics
  const totalRevenue = orders
    .filter(o => o.status === 'Completed')
    .reduce((acc, curr) => acc + curr.total, 0);

  const activeProducts = products.filter(p => p.status === 'Active').length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  // Chart Data: Orders per day (Simple grouping by date string)
  const ordersByDate = orders.reduce((acc: any, order) => {
    const date = order.date.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  
  const lineChartData = Object.keys(ordersByDate).map(date => ({
    date,
    count: ordersByDate[date]
  })).slice(-7); // Last 7 entries

  // Chart Data: Status Distribution
  const statusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'Pending').length },
    { name: 'Completed', value: orders.filter(o => o.status === 'Completed').length },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-gray-500">Total Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-gray-500">Active Products</p>
          <p className="text-2xl font-bold">{activeProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-gray-500">Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm h-80">
          <h3 className="mb-4 font-semibold">Orders (Last Days)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lineChartData}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm h-80">
          <h3 className="mb-4 font-semibold">Order Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';

interface Order {
  id: string;
  total: number;
  status: string;
  customer_email: string;
}

interface SalesAnalyticsProps {
  orders: Order[];
}

export const SalesAnalytics = ({ orders }: SalesAnalyticsProps) => {
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const uniqueCustomers = new Set(orders.map(order => order.customer_email)).size;

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: 'Total sales revenue',
      color: 'text-primary',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingBag,
      description: 'All time orders',
      color: 'text-accent',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders.toString(),
      icon: TrendingUp,
      description: 'Awaiting processing',
      color: 'text-yellow-600',
    },
    {
      title: 'Customers',
      value: uniqueCustomers.toString(),
      icon: Users,
      description: 'Unique customers',
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

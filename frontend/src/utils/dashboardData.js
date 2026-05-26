const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Map dashboard.php JSON to Dashboard.jsx chart/stat shape */
export function mapDashboardResponse(payload) {
  const raw = payload?.data ?? payload ?? {};
  const summary = raw.summary ?? {};
  const milk = raw.milk_production ?? [];
  const breeds = raw.breed_distribution ?? [];
  const finance = raw.finance ?? [];
  const quick = raw.quick_actions ?? {};

  const milkChart = milk.map((row) => {
    const d = row.milk_date;
    let day = d;
    if (d) {
      const dt = new Date(`${String(d).slice(0, 10)}T12:00:00`);
      if (!Number.isNaN(dt.getTime())) {
        day = DAY_NAMES[dt.getDay()] ?? String(d).slice(5);
      }
    }
    return {
      day,
      date: d,
      total: Number(row.total) || 0,
      morning: Number(row.am ?? row.morning) || 0,
      evening: Number(row.pm ?? row.evening) || 0,
    };
  });

  let milkChange = 0;
  if (milkChart.length >= 2) {
    const last = milkChart[milkChart.length - 1].total;
    const prev = milkChart[milkChart.length - 2].total;
    if (prev > 0) {
      milkChange = +(((last - prev) / prev) * 100).toFixed(1);
    }
  }

  return {
    totalAnimals: Number(summary.total_animals) || 0,
    todaysMilk: Number(summary.today_milk) || 0,
    monthRevenue: Number(summary.month_revenue) || 0,
    feedStock: Number(summary.feed_stock) || 0,
    milkChange,
    upcomingVaccinations: Number(quick.vaccinations_due) || 0,
    pendingNotifications: Number(quick.notifications) || 0,
    healthChecks: Number(quick.health_checks) || 0,
    milkChart,
    breedDistribution: breeds.map((b) => ({
      breed: b.breed ?? 'Unknown',
      count: Number(b.total ?? b.count) || 0,
    })),
    monthlyFinance: finance.map((f) => ({
      month: f.month_name ?? f.month ?? '',
      revenue: Number(f.revenue) || 0,
      expenses: Number(f.expenses) || 0,
    })),
  };
}

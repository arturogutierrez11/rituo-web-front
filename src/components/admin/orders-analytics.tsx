"use client";

import Chart from "chart.js/auto";
import type { ChartConfiguration } from "chart.js";
import { useEffect, useMemo, useRef, useState } from "react";

import { formatCurrency } from "@/lib/format-currency";
import type { Order, OrderStatusValue, ShippingStatusValue } from "@/types/order";

interface OrdersAnalyticsProps {
  orders: Order[];
}

type RangeDays = 7 | 30 | 90 | 0;

const RANGES: { label: string; value: RangeDays }[] = [
  { label: "7 días", value: 7 },
  { label: "30 días", value: 30 },
  { label: "90 días", value: 90 },
  { label: "Todo", value: 0 },
];

const TIME_ZONE = "America/Argentina/Buenos_Aires";
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_DAYS = 366;

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  weekday: "short",
});
const compactCurrency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  notation: "compact",
  maximumFractionDigits: 1,
});

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const WEEKDAY_INDEX: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

const COLORS = {
  ink: "#f0f3fa",
  accent: "#9cb2c6",
  green: "#8cd296",
  yellow: "#e0c070",
  red: "#e08a8a",
  gray: "#5d6f86",
  blue: "#7da2d6",
  violet: "#a592d6",
};

const PAYMENT_STATUS: Record<OrderStatusValue, { label: string; color: string }> = {
  approved: { label: "Aprobadas", color: COLORS.green },
  pending: { label: "Pendientes", color: COLORS.yellow },
  rejected: { label: "Rechazadas", color: COLORS.red },
  cancelled: { label: "Canceladas", color: COLORS.gray },
  payment_init_failed: { label: "Falló el pago", color: "#b86a6a" },
};

const SHIPPING_STATUS: Record<ShippingStatusValue, { label: string; color: string }> = {
  pending_dispatch: { label: "Por despachar", color: COLORS.yellow },
  dispatched: { label: "Despachada", color: COLORS.blue },
  shipped: { label: "Enviada", color: COLORS.violet },
  delivered: { label: "Entregada", color: COLORS.green },
  cancelled: { label: "Cancelada", color: COLORS.gray },
};

const CHANNELS: Record<Order["salesChannel"], { label: string; color: string }> = {
  mercadopago: { label: "Mercado Pago", color: COLORS.blue },
  bank_transfer: { label: "Transferencia", color: COLORS.green },
  manual: { label: "Venta manual", color: COLORS.violet },
};

let defaultsApplied = false;

function applyChartDefaults() {
  if (defaultsApplied) return;
  defaultsApplied = true;
  Chart.defaults.color = COLORS.accent;
  Chart.defaults.font.family = "inherit";
  Chart.defaults.font.size = 12;
  Chart.defaults.borderColor = "rgba(156, 178, 198, 0.12)";
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.boxWidth = 8;
  Chart.defaults.plugins.tooltip.backgroundColor = "rgba(5, 10, 24, 0.96)";
  Chart.defaults.plugins.tooltip.borderColor = "rgba(156, 178, 198, 0.3)";
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.titleColor = COLORS.ink;
  Chart.defaults.plugins.tooltip.bodyColor = COLORS.ink;
}

function dayKey(ms: number): string {
  return dayFormatter.format(new Date(ms));
}

function dayLabel(key: string): string {
  const [, month, day] = key.split("-");
  return `${Number(day)} ${MONTHS[Number(month) - 1]}`;
}

function pct(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

function countBy<T>(items: T[], keyOf: (item: T) => string): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = keyOf(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function topEntries(record: Record<string, number>, limit: number): [string, number][] {
  return Object.entries(record)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function computeAnalytics(orders: Order[], range: RangeDays) {
  const now = Date.now();
  const oldest = orders.reduce(
    (min, order) => Math.min(min, Date.parse(order.createdAt) || now),
    now,
  );
  const span =
    range === 0
      ? Math.min(MAX_DAYS, Math.max(1, Math.ceil((now - oldest) / DAY_MS) + 1))
      : range;

  const dayKeys: string[] = [];
  for (let i = span - 1; i >= 0; i -= 1) {
    dayKeys.push(dayKey(now - i * DAY_MS));
  }
  const dayIndex = new Map(dayKeys.map((key, index) => [key, index]));
  const previousKeys = new Set<string>();
  if (range !== 0) {
    for (let i = span; i < span * 2; i += 1) {
      previousKeys.add(dayKey(now - i * DAY_MS));
    }
  }

  const inRange: Order[] = [];
  const inPrevious: Order[] = [];
  for (const order of orders) {
    const key = dayKey(Date.parse(order.createdAt));
    if (dayIndex.has(key)) inRange.push(order);
    else if (previousKeys.has(key)) inPrevious.push(order);
  }

  const approved = inRange.filter((order) => order.status === "approved");
  const previousApproved = inPrevious.filter((order) => order.status === "approved");

  const revenue = approved.reduce((sum, order) => sum + order.total, 0);
  const previousRevenue = previousApproved.reduce((sum, order) => sum + order.total, 0);

  const ordersPerDay = dayKeys.map(() => 0);
  const revenuePerDay = dayKeys.map(() => 0);
  for (const order of approved) {
    const index = dayIndex.get(dayKey(Date.parse(order.createdAt)));
    if (index === undefined) continue;
    ordersPerDay[index] += 1;
    revenuePerDay[index] += order.total;
  }

  const weekdayAll = WEEKDAYS.map(() => 0);
  const weekdayApproved = WEEKDAYS.map(() => 0);
  for (const order of inRange) {
    const index = WEEKDAY_INDEX[weekdayFormatter.format(new Date(order.createdAt))];
    if (index === undefined) continue;
    weekdayAll[index] += 1;
    if (order.status === "approved") weekdayApproved[index] += 1;
  }

  const byPayment = countBy(inRange, (order) => order.status);
  const byShipping = countBy(approved, (order) => order.shippingStatus);
  const byChannel = countBy(approved, (order) => order.salesChannel);
  const byProvince = topEntries(
    countBy(approved, (order) => order.shippingProvince?.trim() || "Sin dato"),
    8,
  );
  const unitsByProduct: Record<string, number> = {};
  for (const order of approved) {
    unitsByProduct[order.productName] =
      (unitsByProduct[order.productName] ?? 0) + order.quantity;
  }
  const byProduct = topEntries(unitsByProduct, 8);

  return {
    dayLabels: dayKeys.map(dayLabel),
    ordersPerDay,
    revenuePerDay,
    weekdayAll,
    weekdayApproved,
    byPayment,
    byShipping,
    byChannel,
    byProvince,
    byProduct,
    totals: {
      orders: inRange.length,
      approved: approved.length,
      revenue,
      average: approved.length ? revenue / approved.length : 0,
      approvalRate: inRange.length ? (approved.length / inRange.length) * 100 : 0,
      units: approved.reduce((sum, order) => sum + order.quantity, 0),
      toDispatch: byShipping.pending_dispatch ?? 0,
      ordersDelta: range === 0 ? null : pct(inRange.length, inPrevious.length),
      revenueDelta: range === 0 ? null : pct(revenue, previousRevenue),
    },
  };
}

function ChartCanvas({
  config,
  label,
  height = 300,
}: {
  config: ChartConfiguration;
  label: string;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    applyChartDefaults();
    const chart = new Chart(canvasRef.current, config);
    return () => chart.destroy();
  }, [config]);

  return (
    <div className="analytics-chart" style={{ height }}>
      <canvas aria-label={label} ref={canvasRef} role="img" />
    </div>
  );
}

function Delta({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined) return null;
  const rounded = Math.round(value);
  const className =
    rounded > 0 ? "analytics-delta is-up" : rounded < 0 ? "analytics-delta is-down" : "analytics-delta";
  return (
    <small className={className}>
      {rounded > 0 ? "▲" : rounded < 0 ? "▼" : "•"} {Math.abs(rounded)}% vs. período anterior
    </small>
  );
}

function KpiCard({
  label,
  value,
  detail,
  delta,
}: {
  label: string;
  value: string | number;
  detail?: string;
  delta?: number | null;
}) {
  return (
    <article className="admin-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
      <Delta value={delta} />
    </article>
  );
}

function ChartCard({
  title,
  kicker,
  wide = false,
  children,
}: {
  title: string;
  kicker: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`admin-card analytics-card${wide ? " analytics-card--wide" : ""}`}>
      <div className="analytics-card__head">
        <span>{kicker}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

const doughnutOptions = {
  maintainAspectRatio: false,
  cutout: "62%",
  plugins: { legend: { position: "bottom" as const } },
};

const horizontalBarOptions = {
  indexAxis: "y" as const,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { beginAtZero: true, ticks: { precision: 0 } },
    y: { grid: { display: false } },
  },
};

export function OrdersAnalytics({ orders }: OrdersAnalyticsProps) {
  const [range, setRange] = useState<RangeDays>(30);
  const data = useMemo(() => computeAnalytics(orders, range), [orders, range]);
  const currency = orders[0]?.currency ?? "ARS";

  const salesConfig = useMemo<ChartConfiguration>(
    () => ({
      type: "bar",
      data: {
        labels: data.dayLabels,
        datasets: [
          {
            type: "line",
            label: "Ingresos",
            data: data.revenuePerDay,
            borderColor: COLORS.ink,
            backgroundColor: "rgba(240, 243, 250, 0.08)",
            fill: true,
            cubicInterpolationMode: "monotone",
            pointRadius: data.dayLabels.length > 45 ? 0 : 3,
            yAxisID: "yRevenue",
            order: 1,
          },
          {
            type: "bar",
            label: "Órdenes aprobadas",
            data: data.ordersPerDay,
            backgroundColor: "rgba(156, 178, 198, 0.55)",
            borderRadius: 6,
            maxBarThickness: 28,
            yAxisID: "yOrders",
            order: 2,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) =>
                context.dataset.label === "Ingresos"
                  ? `Ingresos: ${formatCurrency(Number(context.parsed.y), currency)}`
                  : `${context.dataset.label}: ${context.parsed.y}`,
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 12, maxRotation: 0 } },
          yOrders: {
            position: "left",
            beginAtZero: true,
            ticks: { precision: 0 },
            title: { display: true, text: "Órdenes" },
          },
          yRevenue: {
            position: "right",
            beginAtZero: true,
            grid: { drawOnChartArea: false },
            ticks: { callback: (value) => compactCurrency.format(Number(value)) },
            title: { display: true, text: "Ingresos" },
          },
        },
      },
    }),
    [data, currency],
  );

  const radarConfig = useMemo<ChartConfiguration>(
    () => ({
      type: "radar",
      data: {
        labels: WEEKDAYS,
        datasets: [
          {
            label: "Todas las órdenes",
            data: data.weekdayAll,
            borderColor: COLORS.accent,
            backgroundColor: "rgba(156, 178, 198, 0.18)",
            pointBackgroundColor: COLORS.accent,
            borderWidth: 2,
          },
          {
            label: "Aprobadas",
            data: data.weekdayApproved,
            borderColor: COLORS.green,
            backgroundColor: "rgba(140, 210, 150, 0.2)",
            pointBackgroundColor: COLORS.green,
            borderWidth: 2,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
        scales: {
          r: {
            beginAtZero: true,
            ticks: { precision: 0, backdropColor: "transparent" },
            angleLines: { color: "rgba(156, 178, 198, 0.14)" },
            grid: { color: "rgba(156, 178, 198, 0.14)" },
            pointLabels: { color: COLORS.ink, font: { size: 12, weight: 700 } },
          },
        },
      },
    }),
    [data],
  );

  const paymentConfig = useMemo<ChartConfiguration>(() => {
    const keys = Object.keys(data.byPayment) as OrderStatusValue[];
    return {
      type: "doughnut",
      data: {
        labels: keys.map((key) => PAYMENT_STATUS[key]?.label ?? key),
        datasets: [
          {
            data: keys.map((key) => data.byPayment[key]),
            backgroundColor: keys.map((key) => PAYMENT_STATUS[key]?.color ?? COLORS.gray),
            borderColor: "rgba(9, 15, 34, 0.9)",
            borderWidth: 3,
          },
        ],
      },
      options: doughnutOptions,
    };
  }, [data]);

  const shippingConfig = useMemo<ChartConfiguration>(() => {
    const keys = Object.keys(data.byShipping) as ShippingStatusValue[];
    return {
      type: "doughnut",
      data: {
        labels: keys.map((key) => SHIPPING_STATUS[key]?.label ?? key),
        datasets: [
          {
            data: keys.map((key) => data.byShipping[key]),
            backgroundColor: keys.map((key) => SHIPPING_STATUS[key]?.color ?? COLORS.gray),
            borderColor: "rgba(9, 15, 34, 0.9)",
            borderWidth: 3,
          },
        ],
      },
      options: doughnutOptions,
    };
  }, [data]);

  const channelConfig = useMemo<ChartConfiguration>(() => {
    const keys = Object.keys(data.byChannel) as Order["salesChannel"][];
    return {
      type: "bar",
      data: {
        labels: keys.map((key) => CHANNELS[key]?.label ?? key),
        datasets: [
          {
            label: "Órdenes aprobadas",
            data: keys.map((key) => data.byChannel[key]),
            backgroundColor: keys.map((key) => CHANNELS[key]?.color ?? COLORS.gray),
            borderRadius: 8,
            maxBarThickness: 64,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    };
  }, [data]);

  const provinceConfig = useMemo<ChartConfiguration>(
    () => ({
      type: "bar",
      data: {
        labels: data.byProvince.map(([name]) => name),
        datasets: [
          {
            label: "Órdenes aprobadas",
            data: data.byProvince.map(([, count]) => count),
            backgroundColor: "rgba(156, 178, 198, 0.65)",
            borderRadius: 6,
            maxBarThickness: 22,
          },
        ],
      },
      options: horizontalBarOptions,
    }),
    [data],
  );

  const productConfig = useMemo<ChartConfiguration>(
    () => ({
      type: "bar",
      data: {
        labels: data.byProduct.map(([name]) => name),
        datasets: [
          {
            label: "Unidades vendidas",
            data: data.byProduct.map(([, count]) => count),
            backgroundColor: "rgba(125, 162, 214, 0.7)",
            borderRadius: 6,
            maxBarThickness: 22,
          },
        ],
      },
      options: horizontalBarOptions,
    }),
    [data],
  );

  const hasData = data.totals.orders > 0;

  return (
    <>
      <div className="analytics-range" role="group" aria-label="Período">
        {RANGES.map((option) => (
          <button
            className={`orders-chip${range === option.value ? " is-active" : ""}`}
            key={option.value}
            onClick={() => setRange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="analytics-kpis" aria-label="Indicadores">
        <KpiCard
          delta={data.totals.revenueDelta}
          detail="Órdenes aprobadas"
          label="Ingresos"
          value={formatCurrency(data.totals.revenue, currency)}
        />
        <KpiCard
          delta={data.totals.ordersDelta}
          detail={`${data.totals.approved} aprobadas`}
          label="Órdenes"
          value={data.totals.orders}
        />
        <KpiCard
          detail="Por orden aprobada"
          label="Ticket promedio"
          value={formatCurrency(data.totals.average, currency)}
        />
        <KpiCard
          detail="Aprobadas sobre el total"
          label="Aprobación"
          value={`${Math.round(data.totals.approvalRate)}%`}
        />
        <KpiCard detail="En órdenes aprobadas" label="Unidades" value={data.totals.units} />
        <KpiCard
          detail="Aprobadas sin despachar"
          label="Por despachar"
          value={data.totals.toDispatch}
        />
      </div>

      {!hasData ? (
        <section className="admin-card">
          <div className="admin-empty">
            <strong>No hay órdenes en este período.</strong>
            <p>Probá con un rango más largo para ver la analítica.</p>
          </div>
        </section>
      ) : (
        <div className="analytics-grid">
          <ChartCard kicker="Evolución" title="Ventas por día" wide>
            <ChartCanvas
              config={salesConfig}
              height={340}
              label="Ingresos y órdenes aprobadas por día"
            />
          </ChartCard>

          <ChartCard kicker="Cuándo se compra" title="Órdenes por día de la semana">
            <ChartCanvas config={radarConfig} label="Órdenes por día de la semana" />
          </ChartCard>

          <ChartCard kicker="Pagos" title="Estado de las órdenes">
            <ChartCanvas config={paymentConfig} label="Órdenes por estado de pago" />
          </ChartCard>

          <ChartCard kicker="Logística" title="Estado de envío">
            <ChartCanvas config={shippingConfig} label="Órdenes aprobadas por estado de envío" />
          </ChartCard>

          <ChartCard kicker="Cobro" title="Canal de venta">
            <ChartCanvas config={channelConfig} label="Órdenes aprobadas por canal de venta" />
          </ChartCard>

          <ChartCard kicker="Dónde se vende" title="Provincias con más órdenes">
            <ChartCanvas config={provinceConfig} label="Órdenes aprobadas por provincia" />
          </ChartCard>

          <ChartCard kicker="Qué se vende" title="Productos más vendidos">
            <ChartCanvas config={productConfig} label="Unidades vendidas por producto" />
          </ChartCard>
        </div>
      )}
    </>
  );
}

"use client";

import { Download } from "lucide-react";
import { Notice, Panel, btnDark, btnGhost } from "@/components/admin/ui";

const datasets = [
  {
    type: "users",
    title: "Users",
    description: "Every account on the platform, including deleted and suspended profiles.",
    columns: "Name, Email, Role, Status, Phone, Registered At, Deleted",
  },
  {
    type: "messes",
    title: "Listings",
    description: "All mess listings with their owner and moderation status.",
    columns: "Name, Owner Email, City, Area, Pincode, Starting Price, Food Type, Status, Created At",
  },
  {
    type: "reviews",
    title: "Reviews",
    description: "Every rating and comment left against a listing.",
    columns: "Mess, Reviewer Email, Rating, Comment, Created At",
  },
  {
    type: "support",
    title: "Support tickets",
    description: "All support tickets with their category, priority and status.",
    columns: "Ticket Number, Subject, Category, Priority, Status, Created By Email, Created At",
  },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Export any dataset as a CSV file. Each download streams straight from the database.
      </p>

      <Notice tone="info">
        Exports are limited to the most recent 5000 rows and are generated live from the database.
      </Notice>

      <div className="grid gap-4 sm:grid-cols-2">
        {datasets.map((dataset) => (
          <Panel key={dataset.type} title={dataset.title} description={dataset.description}>
            <p className="text-xs leading-relaxed text-zinc-500">
              <span className="font-semibold uppercase tracking-wide text-zinc-600">Columns: </span>
              {dataset.columns}
            </p>
            <a href={`/api/admin/reports?type=${dataset.type}`} download className={`${btnDark} mt-4`}>
              <Download size={15} />
              Download CSV
            </a>
          </Panel>
        ))}
      </div>

      <Panel title="Download all" description="Grab every dataset in one place.">
        <div className="flex flex-wrap gap-2">
          {datasets.map((dataset) => (
            <a
              key={dataset.type}
              href={`/api/admin/reports?type=${dataset.type}`}
              download
              className={btnGhost}
            >
              <Download size={15} />
              {dataset.title}
            </a>
          ))}
        </div>
      </Panel>
    </div>
  );
}

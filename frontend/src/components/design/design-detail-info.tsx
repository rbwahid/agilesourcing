'use client';

import { format } from 'date-fns';
import {
  Tag,
  Calendar,
  Clock,
  Users,
  FileType,
  HardDrive,
  Sun,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Design } from '@/types/design';

interface DesignDetailInfoProps {
  design: Design;
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-medium text-charcoal">
          {value}
        </p>
      </div>
    </div>
  );
}

export function DesignDetailInfo({ design }: DesignDetailInfoProps) {
  const createdDate = format(new Date(design.created_at), 'MMM d, yyyy');
  const updatedDate = format(new Date(design.updated_at), 'MMM d, yyyy');

  return (
    <Card className="border-0 shadow-lg shadow-gray-200/50">
      <CardHeader className="border-b bg-gradient-to-r from-agile-teal/5 to-mint-accent/5 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <svg
            className="h-5 w-5 text-agile-teal"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Design Details
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-gray-100 p-0">
        <div className="px-6">
          <InfoRow
            icon={<Tag className="h-4 w-4" />}
            label="Category"
            value={design.category_label}
          />
        </div>

        {design.season_label && (
          <div className="px-6">
            <InfoRow
              icon={<Sun className="h-4 w-4" />}
              label="Season"
              value={design.season_label}
            />
          </div>
        )}

        {design.target_demographic && (
          <div className="px-6">
            <InfoRow
              icon={<Users className="h-4 w-4" />}
              label="Target Demographic"
              value={design.target_demographic}
            />
          </div>
        )}

        <div className="px-6">
          <InfoRow
            icon={<FileType className="h-4 w-4" />}
            label="File Type"
            value={design.file_type.split('/')[1].toUpperCase()}
          />
        </div>

        <div className="px-6">
          <InfoRow
            icon={<HardDrive className="h-4 w-4" />}
            label="File Size"
            value={design.file_size_formatted}
          />
        </div>

        <div className="px-6">
          <InfoRow
            icon={<Calendar className="h-4 w-4" />}
            label="Created"
            value={createdDate}
          />
        </div>

        <div className="px-6">
          <InfoRow
            icon={<Clock className="h-4 w-4" />}
            label="Last Updated"
            value={updatedDate}
          />
        </div>
      </CardContent>
    </Card>
  );
}

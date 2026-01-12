'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DesignGrid } from '@/components/design/design-grid';
import { DesignFilters } from '@/components/design/design-filters';
import { DesignStatsCards } from '@/components/design/design-stats';
import {
  useDesigns,
  useDesignStats,
  useDeleteDesign,
} from '@/lib/hooks/use-designs';
import type { DesignStatus, DesignCategory, DesignFilters as Filters } from '@/types/design';

export default function DesignsPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: designsData, isLoading: isLoadingDesigns } = useDesigns(filters);
  const { data: stats, isLoading: isLoadingStats } = useDesignStats();
  const deleteDesign = useDeleteDesign();

  const handleStatusChange = (status: DesignStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleCategoryChange = (category: DesignCategory | undefined) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteDesign.mutate(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-agile-teal to-mint-accent shadow-lg shadow-agile-teal/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
                My Designs
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Manage and track your fashion design portfolio
              </p>
            </div>
          </div>

          <Link href="/designs/new">
            <Button
              size="lg"
              className="group gap-2 bg-agile-teal px-6 font-semibold text-white shadow-lg shadow-agile-teal/25 transition-all duration-300 hover:bg-agile-teal/90 hover:shadow-xl hover:shadow-agile-teal/30"
            >
              <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              Upload Design
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <DesignStatsCards stats={stats} isLoading={isLoadingStats} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <DesignFilters
            status={filters.status}
            category={filters.category}
            search={filters.search}
            onStatusChange={handleStatusChange}
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
          />
        </div>

        {/* Design Grid */}
        <DesignGrid
          designs={designsData?.data}
          isLoading={isLoadingDesigns}
          onDelete={handleDeleteClick}
        />

        {/* Pagination (if needed) */}
        {designsData && designsData.meta.last_page > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: designsData.meta.last_page }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={page === designsData.meta.current_page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters((prev) => ({ ...prev, page }))}
                  className={
                    page === designsData.meta.current_page
                      ? 'bg-agile-teal hover:bg-agile-teal/90'
                      : ''
                  }
                >
                  {page}
                </Button>
              )
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Design</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this design? This action cannot be
              undone and will permanently remove the design and all its
              variations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

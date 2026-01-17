'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  MoreVertical,
  Pencil,
  Trash2,
  Archive,
  CheckCircle,
  FileText,
  Loader2,
  ZoomIn,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Skeleton } from '@/components/ui/skeleton';
import { DesignStatusBadge } from '@/components/design/design-status-badge';
import { DesignDetailInfo } from '@/components/design/design-detail-info';
import { DesignAIAnalysis } from '@/components/design/design-ai-analysis';
import { DesignVariationsGrid } from '@/components/design/design-variations-grid';
import { useDesignPolling } from '@/lib/hooks/use-design-polling';
import {
  useDeleteDesign,
  useUpdateDesignStatus,
  useTriggerAnalysis,
  useGenerateVariations,
  useRegenerateVariations,
} from '@/lib/hooks/use-designs';
import type { DesignStatus } from '@/types/design';

interface DesignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DesignDetailPage({ params }: DesignDetailPageProps) {
  const { id } = use(params);
  const designId = parseInt(id, 10);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);

  // Use polling hook for real-time status updates during AI processing
  const {
    data: design,
    isLoading,
    isError,
  } = useDesignPolling(designId, {
    enabled: true,
    onAnalysisComplete: () => {
      toast.success('AI analysis complete!', {
        description: 'Check out the insights for your design.',
      });
    },
    onAnalysisFailed: () => {
      toast.error('AI analysis failed', {
        description: 'You can retry the analysis.',
      });
    },
  });

  // Mutations
  const { mutate: deleteDesign, isPending: isDeleting } = useDeleteDesign();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateDesignStatus(designId);
  const { mutate: triggerAnalysis, isPending: isRetryingAnalysis } = useTriggerAnalysis(designId);
  const { mutate: generateVariations, isPending: isGeneratingVariations } = useGenerateVariations(designId);
  const { mutate: regenerateVariations, isPending: isRegeneratingVariations } = useRegenerateVariations(designId);

  const handleStatusChange = (status: DesignStatus) => {
    updateStatus(status);
  };

  const handleDelete = () => {
    deleteDesign(designId);
    setShowDeleteDialog(false);
  };

  const handleRetryAnalysis = () => {
    triggerAnalysis();
  };

  const handleGenerateVariations = () => {
    generateVariations(3);
  };

  const handleRegenerateVariations = () => {
    regenerateVariations(3);
  };

  if (isLoading) {
    return <DesignDetailSkeleton />;
  }

  if (isError || !design) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-charcoal">
            Design not found
          </h2>
          <p className="mt-2 text-gray-500">
            The design you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            access to it.
          </p>
          <Link href="/designs">
            <Button className="mt-4 bg-agile-teal hover:bg-agile-teal/90">
              Back to Designs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPdf = design.file_type === 'application/pdf';
  const canGenerateVariations = design.ai_analysis_status === 'completed';
  const variations = design.variations || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/designs">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 gap-2 text-gray-600 hover:text-charcoal"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Designs
            </Button>
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
                  {design.title}
                </h1>
                <DesignStatusBadge status={design.status} />
              </div>
              {design.description && (
                <p className="mt-2 max-w-2xl text-gray-500">
                  {design.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {isUpdatingStatus ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Change Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleStatusChange('draft')}
                    disabled={design.status === 'draft'}
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Move to Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange('active')}
                    disabled={design.status === 'active'}
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Set as Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange('archived')}
                    disabled={design.status === 'archived'}
                    className="gap-2"
                  >
                    <Archive className="h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/designs/${design.id}/edit`} className="gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit Design
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Design
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Main Image */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden border-0 shadow-lg shadow-gray-200/50">
              <div className="relative aspect-[4/5] bg-gray-100">
                {isPdf ? (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <FileText className="h-24 w-24 text-gray-300" />
                    <span className="mt-4 text-lg font-medium text-gray-500">
                      PDF Document
                    </span>
                    <a
                      href={design.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4"
                    >
                      <Button variant="outline" className="gap-2">
                        <ZoomIn className="h-4 w-4" />
                        Open PDF
                      </Button>
                    </a>
                  </div>
                ) : (
                  <>
                    <Image
                      src={design.file_url}
                      alt={design.title}
                      fill
                      unoptimized
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-4 right-4 gap-2 bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white"
                      onClick={() => setShowImageZoom(true)}
                    >
                      <ZoomIn className="h-4 w-4" />
                      Zoom
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-2">
            {/* Design Info */}
            <DesignDetailInfo design={design} />

            {/* AI Analysis */}
            <DesignAIAnalysis
              status={design.ai_analysis_status}
              result={design.ai_analysis_result}
              trendScore={design.trend_score}
              onRetryAnalysis={handleRetryAnalysis}
              isRetrying={isRetryingAnalysis}
            />
          </div>
        </div>

        {/* Variations Section - Full Width */}
        <div className="mt-8">
          <DesignVariationsGrid
            design={design}
            variations={variations}
            onGenerateVariations={handleGenerateVariations}
            onRegenerateVariations={handleRegenerateVariations}
            isGenerating={isGeneratingVariations || isRegeneratingVariations}
            canGenerate={canGenerateVariations}
          />
        </div>
      </div>

      {/* Image Zoom Modal */}
      {showImageZoom && !isPdf && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setShowImageZoom(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-white hover:bg-white/10"
            onClick={() => setShowImageZoom(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="relative h-[90vh] w-[90vw]">
            <Image
              src={design.file_url}
              alt={design.title}
              fill
              unoptimized
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Design</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{design.title}&rdquo;? This
              action cannot be undone and will permanently remove the design and
              all its variations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DesignDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-4 h-9 w-32" />
        <Skeleton className="mb-2 h-10 w-64" />
        <Skeleton className="mb-8 h-5 w-96" />

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Skeleton className="aspect-[4/5] w-full rounded-xl" />
          </div>
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-80 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>

        <Skeleton className="mt-8 h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
